# Firebase migration: wbify-869a4 → vgp-web

Status: all 141 Firestore documents were copied and verified. All 3 Authentication users were imported and verified with stable UIDs and preserved password hashes. A refreshed inventory found 141 documents and 3 users in both projects. Local `.env`, `.env.local` and `.firebaserc` now target `vgp-web`; production build passed and contains the new project rather than the old project. The live deployment has not been switched: no Vance Graphix project is available in the currently signed-in Vercel account/team.

## Access checks

- Both projects are accessible using the approved Firebase account.
- Source inventory: 141 Firestore documents in 15 top-level collections, 56 Storage objects, 3 Authentication users, no Realtime Database instances, no custom composite indexes.
- Destination Firestore was empty before copying. Destination Authentication is initialized with Email/Password enabled. The Storage bucket does not exist and will not be created, per user instruction.
- Source and target Cloud Functions APIs are disabled; no deployed Functions were available through that API.
- Local private backups of Firestore, deployed rules and indexes are under `.firebase-migration/`, excluded from Git. These contain customer data and must not be published.
- Revised Firestore rules have been deployed to `vgp-web`. Anonymous portfolio read returned 200, while contact-message and CRM-lead reads returned 403. Public writes to arbitrary collections are not allowed.

The user explicitly declined Firebase Storage and paid billing. The 56 source Storage objects were not copied or deleted. No Firestore document fields referenced the source Firebase bucket or Firebase download URLs. The app no longer initializes Firebase Storage or uses its upload SDK; the legacy upload helper now delegates to the site's existing Vercel Blob image endpoint. That endpoint retains its existing hosting/configuration requirements. No new paid storage service or billing plan was enabled.

Local environment backups are in `.firebase-migration/env-before-cutover` and `.firebase-migration/env.local-before-cutover`. User export is also in that ignored private directory. Do not publish these files.

Live deployment remaining: apply the staged VITE_FIREBASE variables from `.env.firebase-target.example` to the actual hosting project, rebuild/redeploy, and verify admin sign-in and public submissions. The current Vercel login only exposes the Wbify team and does not list this site's project. TypeScript still reports pre-existing Navbar, blogService and missing axios errors; production build succeeds.

The helper `scripts/firebase-migrate.cjs` supports `--snapshot`, `--extras`, `--copy-firestore`, `--copy-users`, and `--copy-storage`. It reads the approved account from the locally installed Firebase CLI and keeps credentials in memory. Firestore copying refuses conflicting destination data and is resumable for matching documents. Refresh the source snapshot before final cutover to account for new live submissions; preserve the original backup first.

## Cutover reference

1. Inventory source and target Firestore databases/collections/subcollections, Storage objects, Authentication users/providers, indexes, rules, Functions, triggers, and runtime configuration. Check target data for conflicts before copying.
2. Arrange a brief write freeze for final export/copy and verification. Preserve the source for rollback.
3. Copy all Firestore documents, preserving IDs, data types and nested collections. Managed export/import requires billing on both projects. Verify counts and document contents.
4. Firebase Storage is excluded by user decision. Preserve source objects; do not enable billing or provision target Storage. Existing external GitHub/Blob image URLs stay unchanged.
5. Migrate Authentication users with stable UIDs. Preserving existing passwords requires the source password hash configuration. Configure enabled sign-in providers and authorized domains in the destination, then verify admin login.
6. Deploy and verify rules/indexes and required Functions. Transfer secrets through secure local configuration, without printing them. Check triggers for duplicate notifications during copying.
7. Apply the six staged VITE_FIREBASE variables to local and deployment environments. Update `.firebaserc` only after verification. Rebuild and deploy the frontend; verify public pages, submissions, uploads, login, CRM and orders against the destination.
8. Resume writes only after cutover checks pass. If rollback is needed after new writes, reconcile target-only records before reverting the app.

References: https://firebase.google.com/docs/firestore/manage-data/move-data and https://firebase.google.com/docs/cli/auth
