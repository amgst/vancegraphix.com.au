import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { normalizeWebPortfolioImage } from './webPortfolioImage';

export interface PortfolioItem {
    id: string;
    title: string;
    category: 'Shopify' | 'React' | 'WordPress' | 'Other';
    imageUrl: string;
    description?: string;
    link?: string;
    technologies?: string[];
    isFeatured?: boolean;
    order?: number;
    performanceScore?: number;
    seoScore?: number;
    accessibilityScore?: number;
    bestPracticesScore?: number;
    lastChecked?: string;
    isConcept?: boolean;
    isPublic?: boolean;
    // Internal Registry Fields
    hostingProvider?: string;
    domainRegistrar?: string;
    domainExpiry?: string;
    internalNotes?: string;
}

const PORTFOLIO_COLLECTION = 'portfolios';

const normalizePortfolioItem = <T extends Partial<PortfolioItem>>(item: T): T => {
    const payload = { ...item } as T;

    if (Object.prototype.hasOwnProperty.call(payload, 'imageUrl')) {
        payload.imageUrl = normalizeWebPortfolioImage(payload.imageUrl) as T['imageUrl'];
    }

    return payload;
};

export const getPortfolios = async (): Promise<PortfolioItem[]> => {
    const colRef = collection(db, PORTFOLIO_COLLECTION);
    const q = query(colRef);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        // Normalize technologies to always be an array (older docs may store it as a string)
        if (data.technologies && !Array.isArray(data.technologies)) {
            data.technologies = [data.technologies].filter(Boolean);
        } else if (!data.technologies) {
            data.technologies = [];
        }
        return { id: doc.id, ...data } as PortfolioItem;
    });
};

export const addPortfolio = async (item: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem> => {
    const colRef = collection(db, PORTFOLIO_COLLECTION);
    const payload = normalizePortfolioItem(item);
    const docRef = await addDoc(colRef, payload);
    return { id: docRef.id, ...payload };
};

export const updatePortfolio = async (id: string, item: Partial<PortfolioItem>) => {
    const docRef = doc(db, PORTFOLIO_COLLECTION, id);
    await updateDoc(docRef, normalizePortfolioItem(item));
};

export const deletePortfolio = async (id: string) => {
    const docRef = doc(db, PORTFOLIO_COLLECTION, id);
    await deleteDoc(docRef);
};
