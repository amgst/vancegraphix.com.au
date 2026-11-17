# Firebase CRM

Sign in with the existing Firebase admin account and open `/admin/crm` (CRM in the sidebar).

The CRM stores records in `crm_contacts` and provides contact editing, deal stages, AUD values, follow-up dates, notes, search and stage/due-date filters. Dashboard totals use all contacts, independent of filters. Won and Lost deals do not count as open pipeline or due follow-ups.

Use **Import inquiries & messages** to copy existing `project_inquiries` and `contact_messages` into the CRM. Importing is manual: repeat it to bring in new submissions. Each source document becomes one lead; a person with multiple submissions can have multiple leads. Repeating an import skips existing records and preserves edits. Deleting an imported CRM record allows it to be imported again. Source messages and inquiries are never modified. If an import fails partway through, retry it safely.

## Deployment

Deploy the frontend through the site's normal deployment process. Deploy Firestore rules with `firebase deploy --only firestore:rules` using an authorized Firebase CLI account. `firebase.json` now points to `firestore.rules`.

Customer and CRM collections require Firebase authentication, matching the existing admin route. This is not a role-based authorization system: any authenticated account can access CRM records. Public website content is readable without login. Visitors can create new contact, inquiry, career and order submissions but cannot read or change stored submissions. These revised rules have been deployed to the migration destination `vgp-web`; the source project retains its original rules.

## Smoke check

After deploying rules, verify an unauthenticated Firestore client cannot read or write `crm_contacts`. Sign in, add a contact, refresh, edit its stage/value/notes, and verify persistence. Set an open deal's follow-up to today and check the due filter; mark it Won and check the totals. Run import twice and check that the second run adds zero records when there are no new submissions. Verify delete removes only the CRM record.

The subsequent Firebase migration deployed the revised destination rules. See `FIREBASE_MIGRATION.md` for migration status and pending setup.
