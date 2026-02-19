import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Tool } from '../data/toolsData';

const TOOLS_COLLECTION = 'tools';

export const getTools = async (): Promise<Tool[]> => {
    const toolsCol = collection(db, TOOLS_COLLECTION);
    const q = query(toolsCol); // You can add orderBy here if needed, e.g., orderBy('name')
    const toolSnapshot = await getDocs(q);
    return toolSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tool));
};

export const addTool = async (tool: Omit<Tool, 'id'>): Promise<Tool> => {
    const toolsCol = collection(db, TOOLS_COLLECTION);
    const docRef = await addDoc(toolsCol, tool);
    return { id: docRef.id, ...tool };
};

export const updateTool = async (id: string, tool: Partial<Tool>) => {
    const toolRef = doc(db, TOOLS_COLLECTION, id);
    await updateDoc(toolRef, tool);
};

export const deleteTool = async (id: string) => {
    const toolRef = doc(db, TOOLS_COLLECTION, id);
    await deleteDoc(toolRef);
};
