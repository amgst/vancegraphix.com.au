import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export interface SiteSettings {
    siteName: string;
    adminEmail: string;
    logoUrl?: string;
    faviconUrl?: string;
    socialUrls?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
    };
}

const SETTINGS_COLLECTION = 'settings';
const GENERAL_SETTINGS_DOC = 'general';
const DEFAULT_LOGO_URL = 'https://nbyomoqura0jkgxd.public.blob.vercel-storage.com/vgp%20logo%20horizontal.png';

export const getSiteSettings = async (): Promise<SiteSettings> => {
    const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as SiteSettings;
    } else {
        // Return default settings if not found
        return {
            siteName: 'Vance Graphix & Print (VGP)',
            adminEmail: 'ahmed@vancegraphix.com.au',
            logoUrl: DEFAULT_LOGO_URL
        };
    }
};

export const updateSiteSettings = async (settings: Partial<SiteSettings>): Promise<void> => {
    const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
    
    // Check if doc exists first
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        await updateDoc(docRef, settings);
    } else {
        // Create if doesn't exist (merging with defaults)
        await setDoc(docRef, {
            siteName: 'Vance Graphix & Print (VGP)',
            adminEmail: 'ahmed@vancegraphix.com.au',
            logoUrl: DEFAULT_LOGO_URL,
            ...settings
        });
    }
};

export const subscribeToSiteSettings = (callback: (settings: SiteSettings) => void) => {
    const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
    return onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data() as SiteSettings);
        } else {
            callback({
                siteName: 'Vance Graphix & Print (VGP)',
                adminEmail: 'ahmed@vancegraphix.com.au',
                logoUrl: DEFAULT_LOGO_URL
            });
        }
    });
};
