import { useFirestore } from './useFirestore';
import { useFirestoreCollection } from './useFirestoreCollection';

interface SalesOrder {
  id?: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  status: 'pending' | 'completed';
  items: Array<{
    beltType: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  deliveryDate?: any;
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
}

export function useSalesOrders() {
  const { data, loading, error } = useFirestoreCollection<SalesOrder>('salesOrders');
  const { add, update, remove } = useFirestore<SalesOrder>('salesOrders');

  return {
    salesOrders: data,
    loading,
    error,
    addSalesOrder: add,
    updateSalesOrder: update,
    deleteSalesOrder: remove
  };
}
