import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

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

export const getPortfolios = async (): Promise<PortfolioItem[]> => {
    const colRef = collection(db, PORTFOLIO_COLLECTION);
    const q = query(colRef);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
};

export const addPortfolio = async (item: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem> => {
    const colRef = collection(db, PORTFOLIO_COLLECTION);
    const docRef = await addDoc(colRef, item);
    return { id: docRef.id, ...item };
};

export const updatePortfolio = async (id: string, item: Partial<PortfolioItem>) => {
    const docRef = doc(db, PORTFOLIO_COLLECTION, id);
    await updateDoc(docRef, item);
};

export const deletePortfolio = async (id: string) => {
    const docRef = doc(db, PORTFOLIO_COLLECTION, id);
    await deleteDoc(docRef);
};
