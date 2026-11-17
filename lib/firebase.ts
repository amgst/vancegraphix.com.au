import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate config
if (!firebaseConfig.apiKey) {
    console.error("Firebase API Key is missing!");
    console.warn("1. If developing locally: Ensure VITE_FIREBASE_API_KEY is in your .env file.");
    console.warn("2. If on Vercel: Ensure variables have the 'VITE_' prefix (e.g., VITE_FIREBASE_API_KEY).");
    console.warn("3. If using Vercel CLI locally: Run 'vercel env pull' to sync variables.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
