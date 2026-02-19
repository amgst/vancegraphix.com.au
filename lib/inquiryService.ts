import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

export const INQUIRIES_COLLECTION = 'project_inquiries';

export interface InquiryData {
    id?: string;
    name: string;
    email: string;
    phone: string;
    serviceType: string;
    // Shopify specific
    shopifyProductType?: string;
    shopifyHasProducts?: string;
    shopifyBudget?: string;
    // Web Dev specific
    webDevType?: string;
    webDevPages?: string;
    webDevFeatures?: string[];
    // Graphics specific
    graphicsType?: string;
    graphicsBrandExists?: string;
    graphicsUsage?: string;
    // Common
    timeline: string;
    additionalInfo: string;
    status: 'new' | 'contacted' | 'closed';
    createdAt?: any;
}

export const submitInquiry = async (data: Omit<InquiryData, 'status' | 'createdAt' | 'id'>): Promise<string> => {
    const colRef = collection(db, INQUIRIES_COLLECTION);
    const docRef = await addDoc(colRef, {
        ...data,
        status: 'new',
        createdAt: serverTimestamp()
    });
    return docRef.id;
};

export const getInquiries = async (): Promise<InquiryData[]> => {
    const q = query(collection(db, INQUIRIES_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InquiryData));
};

export const updateInquiryStatus = async (id: string, status: InquiryData['status']): Promise<void> => {
    const docRef = doc(db, INQUIRIES_COLLECTION, id);
    await updateDoc(docRef, { status });
};
