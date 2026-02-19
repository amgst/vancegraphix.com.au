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

export const ORDERS_COLLECTION = 'store_orders';

export type OrderStatus = 'new' | 'processing' | 'completed' | 'cancelled';

export interface OrderItem {
    productId: string;
    name: string;
    sku?: string;
    price: number;
    quantity: number;
}

export interface OrderData {
    id?: string;
    customerName: string;
    email: string;
    phone?: string;
    notes?: string;
    items: OrderItem[];
    status: OrderStatus;
    createdAt?: any;
}

export const submitOrder = async (
    data: Omit<OrderData, 'status' | 'createdAt' | 'id'>
): Promise<string> => {
    const colRef = collection(db, ORDERS_COLLECTION);
    const docRef = await addDoc(colRef, {
        ...data,
        status: 'new',
        createdAt: serverTimestamp()
    });
    return docRef.id;
};

export const getOrders = async (): Promise<OrderData[]> => {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Omit<OrderData, 'id'>) }));
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<void> => {
    const ref = doc(db, ORDERS_COLLECTION, id);
    await updateDoc(ref, { status });
};

