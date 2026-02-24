import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    image?: string;
    content: string;
    rating: number; // 1–5
    order?: number;
}

const COLLECTION = 'testimonials';

export const getTestimonials = async (): Promise<Testimonial[]> => {
    const colRef = collection(db, COLLECTION);
    try {
        const q = query(colRef, orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
    } catch {
        // Fallback: fetch without ordering (index may not exist yet) and sort client-side
        const snapshot = await getDocs(colRef);
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
        return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
};

export const addTestimonial = async (item: Omit<Testimonial, 'id'>): Promise<Testimonial> => {
    const colRef = collection(db, COLLECTION);
    const docRef = await addDoc(colRef, item);
    return { id: docRef.id, ...item };
};

export const updateTestimonial = async (id: string, item: Partial<Testimonial>): Promise<void> => {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, item);
};

export const deleteTestimonial = async (id: string): Promise<void> => {
    const docRef = doc(db, COLLECTION, id);
    await deleteDoc(docRef);
};
