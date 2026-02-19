import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const portfolios = [
    // Shopify
    {
        title: "Modern Fashion Store",
        category: "Shopify",
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
        description: "A high-converting Shopify store for a premium fashion brand with custom liquid sections and speed optimization.",
        link: "https://shopify.com"
    },
    {
        title: "Eco-Friendly Home Decor",
        category: "Shopify",
        imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop",
        description: "Sustainably focused Shopify store with complex product filtering and loyalty program integration.",
        link: "https://shopify.com"
    },
    // React
    {
        title: "SaaS Analytics Dashboard",
        category: "React",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        description: "A complex React dashboard with real-time data visualization using Recharts and Tailwind CSS.",
        link: "https://react.dev"
    },
    {
        title: "Real Estate Marketplace",
        category: "React",
        imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop",
        description: "Dynamic property listing platform built with React, featuring advanced search and map integration.",
        link: "https://react.dev"
    },
    // WordPress
    {
        title: "Corporate Legal Firm",
        category: "WordPress",
        imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop",
        description: "Professional WordPress site for a law firm with custom post types for case studies and team members.",
        link: "https://wordpress.org"
    },
    {
        title: "Lifestyle Travel Blog",
        category: "WordPress",
        imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop",
        description: "Highly optimized WordPress blog with custom theme development and SEO best practices.",
        link: "https://wordpress.org"
    }
];

async function seed() {
    console.log("Starting seed...");
    const colRef = collection(db, 'portfolios');
    for (const item of portfolios) {
        try {
            await addDoc(colRef, {
                ...item,
                createdAt: serverTimestamp()
            });
            console.log(`Added: ${item.title}`);
        } catch (e) {
            console.error(`Error adding ${item.title}: `, e);
        }
    }
    console.log("Seed finished!");
    process.exit(0);
}

seed();
