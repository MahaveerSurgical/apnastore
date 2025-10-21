import { useFirestore } from './useFirestore';
import { useFirestoreCollection } from './useFirestoreCollection';

interface BillOfMaterials {
  [materialId: string]: {
    quantity: number;
    materialName: string;
    unit: string;
  };
}

interface ReadyBelt {
  id?: string;
  type: string;
  size: string;
  quantity: number;
  minQuantity?: number;
  price?: number;
  notes?: string;
  billOfMaterials: BillOfMaterials;
  createdAt?: any;
  updatedAt?: any;
}

export function useReadyBelts() {
  const { data, loading, error } = useFirestoreCollection<ReadyBelt>('readyBelts');
  const { add, update, remove } = useFirestore<ReadyBelt>('readyBelts');

  return {
    readyBelts: data,
    loading,
    error,
    addReadyBelt: add,
    updateReadyBelt: update,
    deleteReadyBelt: remove
  };
}
