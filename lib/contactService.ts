import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
    doc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';

export const CONTACT_MESSAGES_COLLECTION = 'contact_messages';

export interface ContactMessageData {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    service: string;
    message: string;
    status: 'new' | 'read' | 'replied';
    createdAt?: any;
}

export const submitContactMessage = async (data: Omit<ContactMessageData, 'status' | 'createdAt'>): Promise<string> => {
    const colRef = collection(db, CONTACT_MESSAGES_COLLECTION);
    const docRef = await addDoc(colRef, {
        ...data,
        status: 'new',
        createdAt: serverTimestamp()
    });
    return docRef.id;
};

export const getContactMessages = async (): Promise<ContactMessageData[]> => {
    const colRef = collection(db, CONTACT_MESSAGES_COLLECTION);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as ContactMessageData));
};

export const updateContactMessageStatus = async (id: string, status: ContactMessageData['status']): Promise<void> => {
    const docRef = doc(db, CONTACT_MESSAGES_COLLECTION, id);
    await updateDoc(docRef, { status });
};

export const deleteContactMessage = async (id: string): Promise<void> => {
    const docRef = doc(db, CONTACT_MESSAGES_COLLECTION, id);
    await deleteDoc(docRef);
}
