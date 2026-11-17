import { collection, doc, onSnapshot, orderBy, query, runTransaction, serverTimestamp, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { getInquiries } from './inquiryService';
import { getContactMessages } from './contactService';

export const CRM_COLLECTION = 'crm_contacts';
export const stages = ['New', 'Contacted', 'Proposal', 'Won', 'Lost'] as const;
export interface CRMContact {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    service: string;
    stage: typeof stages[number];
    value: number;
    followUp: string;
    notes: string;
    source: string;
}
export type ContactInput = Omit<CRMContact, 'id'>;
export const watchContacts = (next: (contacts: CRMContact[]) => void, error: (error: Error) => void) =>
    onSnapshot(query(collection(db, CRM_COLLECTION), orderBy('createdAt', 'desc')), snapshot =>
        next(snapshot.docs.map(item => ({ ...item.data(), id: item.id } as CRMContact))), error);

export async function saveContact(data: ContactInput, id?: string) {
    if (!data.name.trim() || !Number.isFinite(data.value) || data.value < 0 || !stages.includes(data.stage)) {
        throw new Error('Enter a name and a valid, non-negative deal value.');
    }
    const ref = id ? doc(db, CRM_COLLECTION, id) : doc(collection(db, CRM_COLLECTION));
    await setDoc(ref, { ...data, name: data.name.trim(), email: data.email.trim().toLowerCase(),
        updatedAt: serverTimestamp(), ...(!id ? { createdAt: serverTimestamp() } : {}) }, { merge: true });
}
export const removeContact = (id: string) => deleteDoc(doc(db, CRM_COLLECTION, id));

// Source document IDs make imports repeatable without overwriting CRM edits.
export async function importLeads() {
    const [inquiries, messages] = await Promise.all([getInquiries(), getContactMessages()]);
    const leads = [
        ...inquiries.map(item => ({ id: `inquiry_${item.id}`, name: item.name, email: item.email,
            phone: item.phone || '', service: item.serviceType, notes: item.additionalInfo || '',
            stage: item.status === 'contacted' ? 'Contacted' : 'New', source: 'Project inquiry' })),
        ...messages.map(item => ({ id: `message_${item.id}`, name: `${item.firstName} ${item.lastName}`.trim(),
            email: item.email, phone: '', service: item.service, notes: item.message,
            stage: item.status === 'replied' ? 'Contacted' : 'New', source: 'Contact form' }))
    ];
    let imported = 0;
    for (const { id, ...lead } of leads) {
        const added = await runTransaction(db, async transaction => {
            const ref = doc(db, CRM_COLLECTION, id);
            if ((await transaction.get(ref)).exists()) return false;
            transaction.set(ref, { ...lead, company: '', value: 0, followUp: '',
                createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
            return true;
        });
        if (added) imported++;
    }
    return imported;
}
