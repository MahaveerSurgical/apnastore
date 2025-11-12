import { useFirestore } from '../firestore/useFirestore';
import { useFirestoreCollection } from '../firestore/useFirestoreCollection';

interface RawMaterial {
  id?: string;
  name: string;
  currentStock: number;
  unit: string;
  reoderPoint: number;
  supplier?: string;
  price?: number;
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
}

export function useRawMaterials() {
  const { data, loading, error } = useFirestoreCollection<RawMaterial>('rawMaterials');
  const { add, update, remove } = useFirestore<RawMaterial>('rawMaterials');

  return {
    rawMaterials: data,
    loading,
    error,
    addRawMaterial: add,
    updateRawMaterial: update,
    deleteRawMaterial: remove
  };
}
