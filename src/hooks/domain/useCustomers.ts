import { useFirestore } from '../firestore/useFirestore';
import { useFirestoreCollection } from '../firestore/useFirestoreCollection';

interface Customer {
  id?: string;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  pendingAmount: number;
  createdAt?: any;
  updatedAt?: any;
}

export function useCustomers() {
  const { data, loading, error } = useFirestoreCollection<Customer>('customers');
  const { add, update, remove } = useFirestore<Customer>('customers');

  return {
    customers: data,
    loading,
    error,
    addCustomer: add,
    updateCustomer: update,
    deleteCustomer: remove
  };
}