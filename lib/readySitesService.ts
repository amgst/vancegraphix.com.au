import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ReadySite } from '../data/readySitesData';
import { normalizeReadySiteImage } from './readySiteImage';

const READY_SITES_COLLECTION = 'readySites';

const normalizeReadySite = <T extends Partial<ReadySite>>(readySite: T): T => {
    const payload = { ...readySite } as T;

    if (Object.prototype.hasOwnProperty.call(payload, 'image')) {
        payload.image = normalizeReadySiteImage(payload.image) as T['image'];
    }

    return payload;
};

export const getReadySites = async (includeUnpublished = false): Promise<ReadySite[]> => {
    const readySitesCol = collection(db, READY_SITES_COLLECTION);
    const q = query(readySitesCol, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    const readySites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReadySite));

    if (includeUnpublished) {
        return readySites;
    }

    return readySites.filter(site => site.published !== false);
};

export const addReadySite = async (readySite: Omit<ReadySite, 'id'>): Promise<ReadySite> => {
    const readySitesCol = collection(db, READY_SITES_COLLECTION);
    const payload = normalizeReadySite({
        ...readySite,
        published: readySite.published ?? true
    });
    const docRef = await addDoc(readySitesCol, payload);
    return { id: docRef.id, ...payload };
};

export const updateReadySite = async (id: string, readySite: Partial<ReadySite>) => {
    const readySiteRef = doc(db, READY_SITES_COLLECTION, id);
    await updateDoc(readySiteRef, normalizeReadySite(readySite));
};

export const deleteReadySite = async (id: string) => {
    const readySiteRef = doc(db, READY_SITES_COLLECTION, id);
    await deleteDoc(readySiteRef);
};


