// Migration helper: credentials stay in memory; reports contain counts only.
const fs = require('node:fs');
const path = require('node:path');
const auth = require(path.join(process.env.APPDATA, 'npm/node_modules/firebase-tools/lib/auth.js'));
const source = 'wbify-869a4', target = 'vgp-web';
let token;
async function request(url, body, method) {
  const response = await fetch(url, { signal:AbortSignal.timeout(30000), method: method || (body ? 'POST' : 'GET'), headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const data = await response.json();
  if (!response.ok) throw new Error(`${response.status} ${url.split('?')[0]}: ${data.error?.message || 'Request failed'}`);
  return data;
}
async function inventory(project) {
  const result = { project };
  const endpoints = {
    databases: `https://firestore.googleapis.com/v1/projects/${project}/databases`,
    buckets: `https://storage.googleapis.com/storage/v1/b?project=${project}`,
    auth: `https://identitytoolkit.googleapis.com/admin/v2/projects/${project}/config`,
    functions: `https://cloudfunctions.googleapis.com/v1/projects/${project}/locations/-/functions`,
  };
  for (const [key, url] of Object.entries(endpoints)) {
    try {
      const data = await request(url);
      result[key] = key === 'auth' ? { emailEnabled: data.signIn?.email?.enabled, authorizedDomains: data.authorizedDomains } : key === 'buckets' ? (data.items || []).map(x => ({ name:x.name, location:x.location })) : key === 'databases' ? (data.databases || []).map(x => ({ name:x.name, locationId:x.locationId, type:x.type })) : (data.functions || []).map(x => ({ name:x.name, runtime:x.runtime, eventTrigger:x.eventTrigger }));
    } catch (e) { result[key] = { error:e.message }; }
  }
  return result;
}
async function documents(project) {
  const all = [];
  async function walk(parent) {
    let pageToken;
    do {
      const collections = await request(`https://firestore.googleapis.com/v1/${parent}:listCollectionIds`, { pageSize:1000, ...(pageToken ? {pageToken} : {}) });
      for (const id of collections.collectionIds || []) {
        let next;
        do {
          const page = await request(`https://firestore.googleapis.com/v1/${parent}/${id}?pageSize=1000&showMissing=true${next ? `&pageToken=${encodeURIComponent(next)}` : ''}`);
          const docs=page.documents || [];
          for(let i=0;i<docs.length;i+=10) await Promise.all(docs.slice(i,i+10).map(async document=>{
            if(document.createTime)all.push(document);
            await walk(document.name);
          }));
          next = page.nextPageToken;
        } while (next);
      }
      pageToken = collections.nextPageToken;
    } while (pageToken);
  }
  await walk(`projects/${project}/databases/(default)/documents`);
  return all;
}
async function snapshot(project) {
  const docs = await documents(project);
  const counts = {};
  for (const d of docs) { const c=d.name.split('/documents/')[1].split('/')[0]; counts[c]=(counts[c]||0)+1; }
  fs.mkdirSync('.firebase-migration', { recursive:true });
  fs.writeFileSync(`.firebase-migration/${project}-firestore.json`, JSON.stringify(docs));
  console.log(JSON.stringify({project, documents:docs.length, collections:counts}));
  const objects = await request(`https://storage.googleapis.com/storage/v1/b/${project}.firebasestorage.app/o?maxResults=1000` ).catch(e=>({error:e.message}));
  console.log(JSON.stringify({project, storageObjects:objects.items?.length, storageHasMore:!!objects.nextPageToken, storageError:objects.error}));
  const admin = require('../functions/node_modules/firebase-admin');
  const app = admin.initializeApp({projectId:project, credential:{getAccessToken:async()=>({access_token:token, expires_in:1800})}}, project);
  try { let count=0, next; do {const page=await app.auth().listUsers(1000,next); count+=page.users.length; next=page.pageToken;}while(next); console.log(JSON.stringify({project,authUsers:count})); }
  catch(e){console.log(JSON.stringify({project,authError:e.message}));}
}
function remap(value) {
  if (Array.isArray(value)) return value.map(remap);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, remap(v)]));
  if (typeof value === 'string') return value.replaceAll(`projects/${source}/databases/`, `projects/${target}/databases/`)
    .replaceAll(`${source}.firebasestorage.app`, `${target}.firebasestorage.app`);
  return value;
}
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k,stable(value[k])]));
  return value;
}
async function copyFirestore() {
  const sourceDocs = JSON.parse(fs.readFileSync(`.firebase-migration/${source}-firestore.json`));
  const existing = new Map((await documents(target)).map(d=>[d.name,d]));
  let copied=0, skipped=0;
  for (const item of sourceDocs) {
    const name=remap(item.name), fields=remap(item.fields || {});
    if (existing.has(name)) {
      if (JSON.stringify(stable(existing.get(name).fields || {})) !== JSON.stringify(stable(fields))) throw new Error('Destination conflict: aborting without overwriting existing documents.');
      skipped++; continue;
    }
    await request(`https://firestore.googleapis.com/v1/projects/${target}/databases/(default)/documents:commit`, {writes:[{update:{name,fields},currentDocument:{exists:false}}]});
    copied++;
    if(copied%25===0)console.log(`Copied ${copied} documents`);
  }
  // Verify each destination document directly, avoiding another subcollection inventory.
  for (const item of sourceDocs) {
    const actual=await request(`https://firestore.googleapis.com/v1/${remap(item.name)}`);
    if (JSON.stringify(stable(actual.fields || {})) !== JSON.stringify(stable(remap(item.fields || {})))) throw new Error('Document verification failed.');
  }
  console.log(JSON.stringify({copied,skipped,verified:sourceDocs.length}));
}
async function copyUsers() {
  const admin=require('../functions/node_modules/firebase-admin');
  const credential={getAccessToken:async()=>({access_token:token,expires_in:1800})};
  const src=admin.initializeApp({projectId:source,credential},'auth-source').auth();
  const dst=admin.initializeApp({projectId:target,credential},'auth-target').auth();
  const existing=await dst.listUsers(1);
  if(existing.users.length) throw new Error('Destination Auth already contains users; review conflicts before importing.');
  const config=await request(`https://identitytoolkit.googleapis.com/admin/v2/projects/${source}/config`);
  let next, users=[];
  do { const page=await src.listUsers(1000,next);users.push(...page.users);next=page.pageToken; } while(next);
  fs.writeFileSync(`.firebase-migration/${source}-auth.json`,JSON.stringify(users.map(u=>u.toJSON())));
  const h=config.signIn.hashConfig;
  const records=users.map(u=>({uid:u.uid,email:u.email,emailVerified:u.emailVerified,displayName:u.displayName,phoneNumber:u.phoneNumber,photoURL:u.photoURL,disabled:u.disabled,customClaims:u.customClaims,providerData:u.providerData,
    metadata:{creationTime:u.metadata.creationTime,lastSignInTime:u.metadata.lastSignInTime},
    ...(u.passwordHash?{passwordHash:Buffer.from(u.passwordHash,'base64'),passwordSalt:Buffer.from(u.passwordSalt||'','base64')}:{})}));
  if(records.length) {
    const result=await dst.importUsers(records,{hash:{algorithm:'SCRYPT',key:Buffer.from(h.signerKey,'base64'),saltSeparator:Buffer.from(h.saltSeparator,'base64'),rounds:h.rounds,memoryCost:h.memoryCost}});
    if(result.failureCount)throw new Error(`Auth import failed for ${result.failureCount} users: ${result.errors.map(x=>x.error.code).join(', ')}`);
  }
  for(const old of users) {const user=await dst.getUser(old.uid);if(user.email!==old.email||user.disabled!==old.disabled)throw new Error('Auth verification failed');}
  const current=await request(`https://identitytoolkit.googleapis.com/admin/v2/projects/${target}/config`);
  const domains=[...new Set([...(current.authorizedDomains||[]),'localhost',`${target}.firebaseapp.com`,`${target}.web.app`,'vancegraphix.com','www.vancegraphix.com','vancegraphix.com.au','www.vancegraphix.com.au'])];
  await request(`https://identitytoolkit.googleapis.com/admin/v2/projects/${target}/config?updateMask=signIn.email,authorizedDomains`,{signIn:{email:{enabled:true,passwordRequired:true}},authorizedDomains:domains},'PATCH');
  console.log(JSON.stringify({authImported:users.length,authVerified:users.length,passwordHashesPreserved:true}));
}
async function verifyUsers() {
  const admin=require('../functions/node_modules/firebase-admin');
  const credential={getAccessToken:async()=>({access_token:token,expires_in:1800})};
  const [a,b]=await Promise.all([source,target].map(async project=>{
    const api=admin.initializeApp({projectId:project,credential},`verify-${project}`).auth();
    let users=[],next;do{const page=await api.listUsers(1000,next);users.push(...page.users);next=page.pageToken;}while(next);return users;
  }));
  if(a.length!==b.length)throw new Error('Authentication user counts differ.');
  for(const user of a) {
    const dest=b.find(u=>u.uid===user.uid);
    if(!dest||dest.email!==user.email||dest.passwordHash!==user.passwordHash||dest.passwordSalt!==user.passwordSalt||dest.disabled!==user.disabled)throw new Error('Authentication user/hash verification failed.');
  }
  console.log(JSON.stringify({authVerified:a.length,passwordHashesMatch:true}));
}
async function copyStorage() {
  const src=`${source}.firebasestorage.app`, dst=`${target}.firebasestorage.app`;
  await request(`https://storage.googleapis.com/storage/v1/b/${dst}`);
  let next,copied=0;
  do {
    const page=await request(`https://storage.googleapis.com/storage/v1/b/${src}/o?maxResults=1000${next?`&pageToken=${encodeURIComponent(next)}`:''}`);
    for(const file of page.items||[]) {
      const object=encodeURIComponent(file.name);
      const existing=await request(`https://storage.googleapis.com/storage/v1/b/${dst}/o/${object}`).catch(e=>{if(e.message.startsWith('404 '))return null;throw e;});
      if(existing) {if(existing.md5Hash!==file.md5Hash||existing.size!==file.size)throw new Error('Storage destination conflict; refusing overwrite.');}
      else {
        let rewriteToken;
        do {
          const result=await request(`https://storage.googleapis.com/storage/v1/b/${src}/o/${object}/rewriteTo/b/${dst}/o/${object}?ifGenerationMatch=0&sourceGeneration=${file.generation}${rewriteToken?`&rewriteToken=${encodeURIComponent(rewriteToken)}`:''}`,{});
          rewriteToken=result.done?undefined:result.rewriteToken;
        }while(rewriteToken);
      }
      const actual=await request(`https://storage.googleapis.com/storage/v1/b/${dst}/o/${object}`);
      if(actual.md5Hash!==file.md5Hash||actual.size!==file.size||JSON.stringify(stable(actual.metadata||{}))!==JSON.stringify(stable(file.metadata||{})))throw new Error('Storage verification failed');
      copied++;if(copied%10===0)console.log(`Verified ${copied} Storage objects`);
    }
    next=page.nextPageToken;
  }while(next);
  console.log(JSON.stringify({storageVerified:copied}));
}
async function extras() {
  for(const project of [source,target]) {
    const base=`https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/collectionGroups/-`;
    const indexes=await request(`${base}/indexes`);
    fs.writeFileSync(`.firebase-migration/${project}-indexes.json`,JSON.stringify(indexes));
    console.log(JSON.stringify({project,compositeIndexes:indexes.indexes?.length||0}));
    try {const db=await request(`https://firebasedatabase.googleapis.com/v1beta/projects/${project}/locations/-/instances`);console.log(JSON.stringify({project,realtimeDatabases:(db.instances||[]).map(i=>i.name)}));}catch(e){console.log(JSON.stringify({project,realtimeError:e.message}));}
    for(const service of ['cloud.firestore',`firebase.storage/${project}.firebasestorage.app`]) {
      try {
        const release=await request(`https://firebaserules.googleapis.com/v1/projects/${project}/releases/${service}`);
        const rules=await request(`https://firebaserules.googleapis.com/v1/${release.rulesetName}`);
        fs.writeFileSync(`.firebase-migration/${project}-${service.startsWith('cloud')?'firestore':'storage'}-rules.json`,JSON.stringify(rules));
        console.log(JSON.stringify({project,rules:service,saved:true}));
      }catch(e){console.log(JSON.stringify({project,rules:service,error:e.message}));}
    }
  }
}
async function main() {
  const account = auth.getAllAccounts().find(a => a.user.email === 'amgst99@gmail.com');
  if (!account) throw new Error('Sign in to Firebase as amgst99@gmail.com first.');
  token = (await auth.getAccessToken(account.tokens.refresh_token, ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/firebase'])).access_token;
  if (process.argv.includes('--verify-users')) { await verifyUsers(); }
  else if (process.argv.includes('--extras')) { await extras(); }
  else if (process.argv.includes('--copy-users')) { await copyUsers(); }
  else if (process.argv.includes('--copy-storage')) { await copyStorage(); }
  else if (process.argv.includes('--copy-firestore')) { await copyFirestore(); }
  else if (process.argv.includes('--setup-target')) {
    for (const [name,url,body] of [
      ['Authentication',`https://identitytoolkit.googleapis.com/v2/projects/${target}/identityPlatform:initializeAuth`,{}],
      ['Storage',`https://firebasestorage.googleapis.com/v1alpha/projects/${target}/defaultBucket`,{location:'US-CENTRAL1'}]
    ]) { try { await request(url,body); console.log(`${name}: initialized`); } catch(e) { console.log(`${name}: ${e.message}`); } }
  }
  else if (process.argv.includes('--snapshot')) { await snapshot(source); await snapshot(target); }
  else { console.log(JSON.stringify(await inventory(source), null, 2)); console.log(JSON.stringify(await inventory(target), null, 2)); }
}
main().catch(e => { console.error(e.message); process.exitCode = 1; });
