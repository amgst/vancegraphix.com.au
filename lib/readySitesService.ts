import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ReadySite } from '../data/readySitesData';

const READY_SITES_COLLECTION = 'readySites';

export const getReadySites = async (): Promise<ReadySite[]> => {
    const readySitesCol = collection(db, READY_SITES_COLLECTION);
    const q = query(readySitesCol, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReadySite));
};

export const addReadySite = async (readySite: Omit<ReadySite, 'id'>): Promise<ReadySite> => {
    const readySitesCol = collection(db, READY_SITES_COLLECTION);
    const docRef = await addDoc(readySitesCol, readySite);
    return { id: docRef.id, ...readySite };
};

export const updateReadySite = async (id: string, readySite: Partial<ReadySite>) => {
    const readySiteRef = doc(db, READY_SITES_COLLECTION, id);
    await updateDoc(readySiteRef, readySite);
};

export const deleteReadySite = async (id: string) => {
    const readySiteRef = doc(db, READY_SITES_COLLECTION, id);
    await deleteDoc(readySiteRef);
};


