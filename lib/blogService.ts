import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    where,
    limit,
    getDoc
} from 'firebase/firestore';
import { db } from './firebase';

export const BLOG_COLLECTION = 'blog_posts';

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    date: string;
    author: string;
    tags: string[];
    image?: string;
    imageAlt?: string;
    published: boolean; // Added for draft support
}

export const getBlogPosts = async (publishedOnly = true): Promise<BlogPost[]> => {
    const colRef = collection(db, BLOG_COLLECTION);
    let q;
    
    if (publishedOnly) {
        // Use where and orderBy - Firestore may require a composite index
        // If index doesn't exist, it will show an error in console with link to create it
        q = query(colRef, where('published', '==', true), orderBy('date', 'desc'));
    } else {
        q = query(colRef, orderBy('date', 'desc'));
    }

    try {
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
    } catch (error: any) {
        // If composite index error, try without orderBy first, then sort in memory
        if (error.code === 'failed-precondition' && publishedOnly) {
            console.warn('Firestore composite index may be needed. Fetching all and filtering in memory...');
            const allPosts = await getDocs(query(colRef));
            const posts = allPosts.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
            const published = posts.filter(post => post.published === true);
            return published.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        throw error;
    }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    const colRef = collection(db, BLOG_COLLECTION);
    const q = query(colRef, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as BlogPost;
};

export const addBlogPost = async (post: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
    const colRef = collection(db, BLOG_COLLECTION);
    const docRef = await addDoc(colRef, post);
    return { id: docRef.id, ...post };
};

export const updateBlogPost = async (id: string, post: Partial<BlogPost>): Promise<void> => {
    const docRef = doc(db, BLOG_COLLECTION, id);
    await updateDoc(docRef, post);
};

export const deleteBlogPost = async (id: string): Promise<void> => {
    const docRef = doc(db, BLOG_COLLECTION, id);
    await deleteDoc(docRef);
};
