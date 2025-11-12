import { useFirestore } from '../firestore/useFirestore';
import { useFirestoreCollection } from '../firestore/useFirestoreCollection';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

interface ProductionOrder {
  id?: string;
  orderNumber: string;
  status: 'pending' | 'in-progress' | 'completed' | 'received';
  workerId: string;
  workerName: string;
  quantity: number;
  beltType: string;
  readyBeltsId: string;
  startDate: any;
  completionDate?: any;
  notes?: string;
  pricePerUnit: number;
  totalAmount?: number;
  createdAt?: any;
  updatedAt?: any;
}

export function useProductionOrders() {
  const { data, loading, error } = useFirestoreCollection<ProductionOrder>('productionOrders');
  const { add, update, remove } = useFirestore<ProductionOrder>('productionOrders');

  const receiveOrder = async (
    order: ProductionOrder,
    readyBelt: any,
    rawMaterials: any[],
    worker: any
  ) => {
    try {
      await runTransaction(db, async (transaction) => {
        const orderRef = doc(db, 'productionOrders', order.id!);
        transaction.update(orderRef, { 
          status: 'received',
          completionDate: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        const readyBeltsRef = doc(db, 'readyBelts', order.readyBeltsId);
        if (!readyBelt) throw new Error('Finished good not found');

        // Decrease raw materials based on BOM
        for (const [rmId, qtyNeeded] of Object.entries(readyBelt.bom as Record<string, number>)) {
          const rmRef = doc(db, 'rawMaterials', rmId);
          const rmSnap = rawMaterials.find((rm: any) => rm.id === rmId);
          if (!rmSnap) throw new Error('Raw material not found');
          const newStock = rmSnap.currentStock - qtyNeeded * order.quantity;
          if (newStock < 0) throw new Error('Insufficient raw material stock');
          transaction.update(rmRef, { currentStock: newStock });
        }

        // Increase finished good stock
        transaction.update(readyBeltsRef, { 
          currentStock: (readyBelt.currentStock || 0) + order.quantity 
        });

        // Update worker ledger
        if (worker) {
          const workerRef = doc(db, 'workers', order.workerId);
          const payout = (readyBelt.pricePerUnit || 0) * order.quantity;
          transaction.update(workerRef, { 
            pendingAmount: (worker.pendingAmount || 0) + payout 
          });
        }
      });
    } catch (err) {
      console.error('Error receiving production order:', err);
      throw err;
    }
  };

  return {
    productionOrders: data,
    loading,
    error,
    addProductionOrder: add,
    updateProductionOrder: update,
    deleteProductionOrder: remove,
    receiveOrder
  };
}
