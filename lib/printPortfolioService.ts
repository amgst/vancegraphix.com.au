import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

export interface PrintPortfolioCategory {
    id: string;
    title: string;
    description?: string;
    folderId: string;
    folderUrl?: string;
    coverImageUrl?: string;
    order?: number;
    isPublic?: boolean;
}

const PRINT_PORTFOLIO_COLLECTION = 'print_portfolios';

export const getPrintPortfolios = async (): Promise<PrintPortfolioCategory[]> => {
    const colRef = collection(db, PRINT_PORTFOLIO_COLLECTION);
    const q = query(colRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as PrintPortfolioCategory));
};

export const addPrintPortfolio = async (item: Omit<PrintPortfolioCategory, 'id'>): Promise<PrintPortfolioCategory> => {
    const colRef = collection(db, PRINT_PORTFOLIO_COLLECTION);
    const docRef = await addDoc(colRef, item);
    return { id: docRef.id, ...item };
};

export const updatePrintPortfolio = async (id: string, item: Partial<PrintPortfolioCategory>) => {
    const docRef = doc(db, PRINT_PORTFOLIO_COLLECTION, id);
    await updateDoc(docRef, item);
};

export const deletePrintPortfolio = async (id: string) => {
    const docRef = doc(db, PRINT_PORTFOLIO_COLLECTION, id);
    await deleteDoc(docRef);
};

