import { useFirestore } from './useFirestore';
import { useFirestoreCollection } from './useFirestoreCollection';

interface RawMaterial {
  id?: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  minQuantity?: number;
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
