import { useFirestore } from './useFirestore';
import { useFirestoreCollection } from './useFirestoreCollection';

interface ProductionOrder {
  id?: string;
  orderNumber: string;
  status: 'pending' | 'in-progress' | 'completed';
  workerId: string;
  workerName: string;
  quantity: number;
  beltType: string;
  startDate: any;
  completionDate?: any;
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
}

export function useProductionOrders() {
  const { data, loading, error } = useFirestoreCollection<ProductionOrder>('productionOrders');
  const { add, update, remove } = useFirestore<ProductionOrder>('productionOrders');

  return {
    productionOrders: data,
    loading,
    error,
    addProductionOrder: add,
    updateProductionOrder: update,
    deleteProductionOrder: remove
  };
}
