import { db } from './firebase';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp,
    getDoc
} from 'firebase/firestore';
import { Product } from '../data/productsData';

const PRODUCTS_COLLECTION = 'products';
const normalizeProductImage = (image: unknown): string =>
    typeof image === 'string' ? image.trim() : '';

export const getProducts = async (): Promise<Product[]> => {
    const col = collection(db, PRODUCTS_COLLECTION);
    const q = query(col, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Product, 'id'>) }));
};

export const getProductById = async (id: string): Promise<Product | null> => {
    const ref = doc(db, PRODUCTS_COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<Product, 'id'>) };
};

export const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const col = collection(db, PRODUCTS_COLLECTION);
    const payload = {
        ...product,
        image: normalizeProductImage(product.image),
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(col, {
        ...payload
    });
    return { id: docRef.id, ...payload };
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<void> => {
    const ref = doc(db, PRODUCTS_COLLECTION, id);
    const payload: Partial<Product> = { ...product };
    if (Object.prototype.hasOwnProperty.call(product, 'image')) {
        payload.image = normalizeProductImage(product.image);
    }
    await updateDoc(ref, payload);
};

export const deleteProduct = async (id: string): Promise<void> => {
    const ref = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(ref);
};
