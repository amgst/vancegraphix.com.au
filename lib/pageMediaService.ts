import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export type PageMediaRecord = Record<string, string>;

const PAGE_MEDIA_COLLECTION = 'page_media';

export const getPageMedia = async (pageId: string): Promise<PageMediaRecord> => {
  const ref = doc(db, PAGE_MEDIA_COLLECTION, pageId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return {};
  const data = snap.data() as PageMediaRecord;
  return data || {};
};

export const setPageMedia = async (pageId: string, data: PageMediaRecord): Promise<void> => {
  const ref = doc(db, PAGE_MEDIA_COLLECTION, pageId);
  await setDoc(ref, data, { merge: true });
};

export const updatePageMedia = async (pageId: string, data: Partial<PageMediaRecord>): Promise<void> => {
  const ref = doc(db, PAGE_MEDIA_COLLECTION, pageId);
  await updateDoc(ref, data);
};

