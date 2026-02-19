import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from './firebase';

export const SERVICES_COLLECTION = 'service_categories';

export interface ServicePricing {
    basic: string;
    standard: string;
    premium: string;
}

export interface ServiceItem {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    features: string[];
    pricing?: ServicePricing;
    deliveryTime?: string;
    galleryFolderId?: string;
}

export interface ServiceCategory {
    id: string;
    title: string;
    description: string;
    iconName: string; // Stored as string in DB, mapped to icon in UI
    services: ServiceItem[];
}

export const getServiceCategories = async (): Promise<ServiceCategory[]> => {
    const q = query(collection(db, SERVICES_COLLECTION)); // You might want to add orderBy here if you have a sort field
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceCategory));
};

export const addServiceCategory = async (category: Omit<ServiceCategory, 'id'>): Promise<ServiceCategory> => {
    const colRef = collection(db, SERVICES_COLLECTION);
    const docRef = await addDoc(colRef, category);
    return { id: docRef.id, ...category };
};

export const updateServiceCategory = async (id: string, category: Partial<ServiceCategory>): Promise<void> => {
    const docRef = doc(db, SERVICES_COLLECTION, id);
    await updateDoc(docRef, category);
};

export const deleteServiceCategory = async (id: string): Promise<void> => {
    const docRef = doc(db, SERVICES_COLLECTION, id);
    await deleteDoc(docRef);
};
