import { useFirestore } from '../firestore/useFirestore';
import { useFirestoreCollection } from '../firestore/useFirestoreCollection';

interface Worker {
  id?: string;
  uid: string;  // Making uid required as it's the auth ID
  name: string;
  phone?: string;
  email: string;  
  role: 'Admin' | 'Contract' | 'Pending' | 'Delivery' | 'Rejected';
  askedRole?: 'Admin' | 'Contract' | 'Delivery';
  address?: string;
  designation?: string;
  salary?: number;
  pendingAmount?: number;
  joiningDate?: any;
  createdAt?: any;
  updatedAt?: any;
}

export function useWorkers() {
  const { data, loading, error } = useFirestoreCollection<Worker>('workers');
  const { add, update, remove } = useFirestore<Worker>('workers');

  return {
    workers: data,
    loading,
    error,
    addWorker: add,
    updateWorker: update,
    deleteWorker: remove,
  };
}
