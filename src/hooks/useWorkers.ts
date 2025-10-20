import { useFirestore } from './useFirestore';
import { useFirestoreCollection } from './useFirestoreCollection';

interface Worker {
  id?: string;
  name: string;
  phone: string;
  address?: string;
  designation: string;
  salary: number;
  joiningDate: any;
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
    deleteWorker: remove
  };
}
