import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { CRMContact, ContactInput, importLeads, removeContact, saveContact, stages, watchContacts } from '../../lib/crmService';

const blank: ContactInput = { name: '', email: '', phone: '', company: '', service: '', stage: 'New', value: 0, followUp: '', notes: '', source: 'Manual' };
const fieldClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900';
const today = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };

export default function CRM() {
    const [contacts, setContacts] = useState<CRMContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [search, setSearch] = useState('');
    const [stage, setStage] = useState('All');
    const [dueOnly, setDueOnly] = useState(false);
    const [editing, setEditing] = useState<string | null>(null);
    const [form, setForm] = useState<ContactInput | null>(null);
    const [busy, setBusy] = useState(false);
    useEffect(() => watchContacts(items => { setContacts(items); setLoading(false); }, () => {
        setError('Could not load CRM. Check your connection and Firestore permissions.'); setLoading(false);
    }), []);
    const open = (contact?: CRMContact) => {
        setEditing(contact?.id || null);
        if (contact) { const { id, ...data } = contact; setForm(data); } else setForm({ ...blank });
        setError(''); setNotice('');
    };
    const act = async (task: () => Promise<void>) => {
        setBusy(true); setError(''); setNotice('');
        try { await task(); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save changes. Please try again.'); }
        finally { setBusy(false); }
    };
    const active = contacts.filter(c => !['Won', 'Lost'].includes(c.stage));
    const isDue = (c: CRMContact) => c.followUp && c.followUp <= today() && !['Won', 'Lost'].includes(c.stage);
    const visible = contacts.filter(c => (stage === 'All' || c.stage === stage) && (!dueOnly || isDue(c)) &&
        [c.name, c.email, c.company, c.service, c.phone].join(' ').toLowerCase().includes(search.toLowerCase()));
    return <AdminLayout>
        <div className="flex flex-wrap justify-between gap-4 mb-6">
            <div><h1 className="text-3xl font-bold text-slate-900">Customer relationships</h1><p className="text-slate-500 mt-1">Manage leads, deals and your next conversation. Deal values are in AUD.</p></div>
            <div className="flex gap-2 items-start">
                <button disabled={busy || loading} onClick={() => act(async () => { const count = await importLeads(); setNotice(`Imported ${count} new leads. Existing CRM records were preserved.`); })} className="border rounded-lg px-4 py-2 bg-white disabled:opacity-50">Import inquiries & messages</button>
                <button disabled={busy} onClick={() => open()} className="bg-blue-600 text-white rounded-lg px-4 py-2">Add contact</button>
            </div>
        </div>
        {error && <p role="alert" className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">{error}</p>}
        {notice && <p role="status" className="bg-green-50 text-green-800 p-4 rounded-lg mb-4">{notice}</p>}
        <div className="grid sm:grid-cols-4 gap-4 mb-6">
            {[['Contacts', contacts.length], ['Open pipeline (AUD)', active.reduce((sum, c) => sum + c.value, 0).toLocaleString()], ['Won (AUD)', contacts.filter(c => c.stage === 'Won').reduce((sum, c) => sum + c.value, 0).toLocaleString()], ['Follow-ups due', contacts.filter(isDue).length]].map(([label, value]) => <div key={label} className="bg-white border rounded-xl p-5"><p className="text-slate-500 text-sm">{label}</p><p className="text-2xl font-bold mt-2">{loading ? '—' : value}</p></div>)}
        </div>
        {form && <form onSubmit={e => { e.preventDefault(); act(async () => { await saveContact(form, editing || undefined); setForm(null); setNotice('Contact saved.'); }); }} className="bg-white border rounded-xl p-5 mb-6">
            <h2 className="font-bold text-xl mb-4">{editing ? 'Edit contact' : 'New contact'}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(['name', 'email', 'phone', 'company', 'service', 'followUp', 'value'] as const).map(key => <label key={key} className="text-sm font-medium">{({ name: 'Name *', email: 'Email', phone: 'Phone', company: 'Company', service: 'Service / deal', followUp: 'Follow-up date', value: 'Deal value (AUD)' })[key]}
                    <input className={`${fieldClass} mt-1`} required={key === 'name'} maxLength={key === 'name' ? 200 : undefined} type={key === 'email' ? 'email' : key === 'followUp' ? 'date' : key === 'value' ? 'number' : key === 'phone' ? 'tel' : 'text'} min={key === 'value' ? 0 : undefined} step={key === 'value' ? '0.01' : undefined} value={form[key]} onChange={e => setForm({ ...form, [key]: key === 'value' ? Number(e.target.value) : e.target.value })} />
                </label>)}
                <label className="text-sm font-medium">Stage<select className={`${fieldClass} mt-1`} value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value as ContactInput['stage'] })}>{stages.map(s => <option key={s}>{s}</option>)}</select></label>
                <label className="text-sm font-medium sm:col-span-2">Notes<textarea rows={4} className={`${fieldClass} mt-1`} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></label>
            </div>
            <div className="flex gap-3 mt-4"><button disabled={busy} className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">{busy ? 'Saving…' : 'Save contact'}</button><button type="button" disabled={busy} onClick={() => setForm(null)} className="px-4 py-2 border rounded-lg">Cancel</button></div>
        </form>}
        <div className="flex flex-wrap gap-4 mb-4 items-center">
            <label className="flex-1 min-w-48"><span className="sr-only">Search contacts</span><input className={fieldClass} placeholder="Search name, email, company or service…" value={search} onChange={e => setSearch(e.target.value)} /></label>
            <label><span className="sr-only">Filter stage</span><select className={fieldClass} value={stage} onChange={e => setStage(e.target.value)}>{['All', ...stages].map(s => <option key={s}>{s}</option>)}</select></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={dueOnly} onChange={e => setDueOnly(e.target.checked)} />Follow-ups due</label>
        </div>
        <div className="bg-white border rounded-xl overflow-x-auto">
            {loading ? <p role="status" className="p-8 text-slate-500">Loading contacts…</p> : !visible.length ? <p className="p-8 text-slate-500">{contacts.length ? 'No contacts match these filters.' : 'No contacts yet. Add a contact or import your existing inquiries and messages.'}</p> : <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500"><tr>{['Contact', 'Deal', 'Stage', 'Follow-up', 'Actions'].map(title => <th key={title} className="p-4">{title}</th>)}</tr></thead>
                <tbody>{visible.map(c => <tr key={c.id} className="border-t">
                    <td className="p-4"><p className="font-semibold">{c.name}</p><p className="text-slate-500">{c.company}</p>{c.email && <a className="text-blue-600 block" href={`mailto:${c.email}`}>{c.email}</a>}{c.phone && <p>{c.phone}</p>}</td>
                    <td className="p-4"><p>{c.service || '—'}</p><p className="font-medium">AUD {c.value.toLocaleString()}</p><p className="text-xs text-slate-500">{c.source}</p></td>
                    <td className="p-4"><span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full whitespace-nowrap">{c.stage}</span></td>
                    <td className={`p-4 whitespace-nowrap ${isDue(c) ? 'text-red-600 font-semibold' : ''}`}>{c.followUp || 'Not scheduled'}{isDue(c) && <p className="text-xs">Due</p>}</td>
                    <td className="p-4"><div className="flex gap-3"><button disabled={busy} onClick={() => open(c)} className="text-blue-600" aria-label={`Edit ${c.name}`}>Edit</button><button disabled={busy} onClick={() => { if (window.confirm(`Delete ${c.name} from the CRM?`)) act(async () => { await removeContact(c.id); if (editing === c.id) setForm(null); setNotice('Contact deleted.'); }); }} className="text-red-600" aria-label={`Delete ${c.name}`}>Delete</button></div></td>
                </tr>)}</tbody>
            </table>}
        </div>
    </AdminLayout>;
}
