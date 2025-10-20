import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
//   QueryConstraint 
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

interface FirestoreDocument {
  id?: string;
  createdAt?: any;
  updatedAt?: any;
}

export function useFirestore<T extends FirestoreDocument>(collectionName: string) {
  const add = async (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      return await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error(`Error adding document to ${collectionName}:`, err);
      throw err;
    }
  };

  const update = async (id: string, data: Partial<T>) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error(`Error updating document in ${collectionName}:`, err);
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error(`Error deleting document from ${collectionName}:`, err);
      throw err;
    }
  };

  return {
    add,
    update,
    remove
  };
}