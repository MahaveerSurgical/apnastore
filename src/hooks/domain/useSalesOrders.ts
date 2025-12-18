import { useFirestore } from '../firestore/useFirestore';
import { useFirestoreCollection } from '../firestore/useFirestoreCollection';
import { useFirestoreTransaction } from '../firestore/useFirestoreTransaction';
import { doc, serverTimestamp } from 'firebase/firestore';

interface SalesOrder {
  id?: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  status: 'pending' | 'completed';
  items: Array<{
    readyBeltsId: string;
    type: string;
    size: string;
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
  const { run: runTransaction } = useFirestoreTransaction();


  const deliverSalesOrder = async (order: SalesOrder) => {
    if (!order.id) throw new Error("Order must have an ID");

    await runTransaction(async (transaction, db) => {
      if (!order.id) throw new Error("Order must have a valid ID");
      const orderRef = doc(db, 'salesOrders', order.id);
      const orderSnap = await transaction.get(orderRef);

      if (!orderSnap.exists()) throw new Error('Order does not exist!');
      const data = orderSnap.data() as SalesOrder;

      // Step 1: Read all references
      
      const rbRefs = data.items
        .filter((item) => !!item.readyBeltsId)
        .map((item) => doc(db, 'readyBelts', item.readyBeltsId!));
      const rbSnaps = await Promise.all(rbRefs.map((ref) => transaction.get(ref)));

      const customerRef = doc(db, 'customers', data.customerId);
      const customerSnap = await transaction.get(customerRef);

      // Step 2: Perform updates
      rbSnaps.forEach((rbSnap, idx) => {
        if (!rbSnap.exists()) return;
        const rbData = rbSnap.data();
        const item = data.items[idx];
        transaction.update(rbRefs[idx], {
          currentStock: (rbData.currentStock || 0) - item.quantity,
        });
      });

      if (customerSnap.exists()) {
        const custData = customerSnap.data();
        transaction.update(customerRef, {
          pendingAmount: (custData.pendingAmount || 0) + data.totalAmount,
        });
      }

      transaction.update(orderRef, {
        status: 'delivered',
        updatedAt: serverTimestamp(),
      });
    });
  };

  return {
    salesOrders: data,
    loading,
    error,
    addSalesOrder: add,
    updateSalesOrder: update,
    deleteSalesOrder: remove,
    deliverSalesOrder,
  };
}
