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

export const APPLICATIONS_COLLECTION = 'job_applications';

export interface JobApplication {
  id?: string;
  fullName: string;
  email: string;
  role: string;
  experienceYears?: string;
  skills?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  coverLetter: string;
  status: 'new' | 'reviewed' | 'rejected' | 'hired';
  createdAt?: any;
}

export const submitJobApplication = async (data: Omit<JobApplication, 'status' | 'createdAt' | 'id'>): Promise<string> => {
  const colRef = collection(db, APPLICATIONS_COLLECTION);
  const docRef = await addDoc(colRef, {
    ...data,
    status: 'new',
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const getJobApplications = async (): Promise<JobApplication[]> => {
  const q = query(collection(db, APPLICATIONS_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApplication));
};

export const updateJobApplicationStatus = async (id: string, status: JobApplication['status']): Promise<void> => {
  const docRef = doc(db, APPLICATIONS_COLLECTION, id);
  await updateDoc(docRef, { status });
};

