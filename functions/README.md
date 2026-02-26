# Firebase Cloud Functions for Email Notifications

This directory contains Cloud Functions that send email notifications for new `inquiries` and `contact_messages` using Resend.

## Prerequisites
1. You must be on the **Firebase Blaze Plan** (Pay as you go) to use Cloud Functions (external API requests require Blaze).
2. You need `firebase-tools` installed globally: `npm install -g firebase-tools`
3. You need a Resend account and verified sending domain/email.

## Setup Instructions

1. **Login to Firebase**:
   ```bash
   firebase login
   ```

2. **Initialize Functions** (if not already initialized in project root):
   ```bash
   firebase init functions
   ```
   - Select `Use an existing project` -> `wbify-869a4`
   - Select `JavaScript`
   - If asked to overwrite `package.json` or `index.js`, say **NO** (N).
   - Select `Install dependencies` -> Yes.

3. **Set environment variables** (in `functions/.env` for local/dev):
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL` (must be verified in Resend)
   - `EMAIL_FROM_NAME`
   - `ADMIN_EMAIL`

   Or set runtime config for deployed functions:
   ```bash
   firebase functions:config:set resend.api_key="re_xxx" resend.from_email="no-reply@yourdomain.com" email.from_name="Vance Graphix & Print" notifications.admin_email="admin@yourdomain.com.au"
   ```

4. **Deploy Functions**:
   ```bash
   cd functions
   npm install
   cd ..
   firebase deploy --only functions
   ```

## How it works
- When a new document is created in `inquiries` or `contact_messages` collection in Firestore:
  - The Cloud Function triggers.
  - It sends an email to `ADMIN_EMAIL` via the Resend API.
  - The sender is `EMAIL_FROM_NAME <RESEND_FROM_EMAIL>`.
  - `reply_to` is set to the form submitter's email.
