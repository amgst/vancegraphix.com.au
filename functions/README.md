# Firebase Cloud Functions for Push Notifications

This directory contains the backend code required to send Push Notifications when the app is closed.

## Prerequisites
1. You must be on the **Firebase Blaze Plan** (Pay as you go) to use Cloud Functions (sending external network requests requires it, though Firestore triggers might work on Spark for internal Google services, FCM usually counts as external or requires Blaze).
2. You need `firebase-tools` installed globally: `npm install -g firebase-tools`

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

3. **Deploy Functions**:
   ```bash
   cd functions
   npm install
   cd ..
   firebase deploy --only functions
   ```

## How it works
- When a new document is created in `inquiries` or `contact_messages` collection in Firestore:
  - The Cloud Function triggers.
  - It reads all tokens from `admin_fcm_tokens` collection.
  - It uses Firebase Cloud Messaging (FCM) to send a push notification to those tokens.
  - This works even if the admin's PWA is closed on their mobile device.
