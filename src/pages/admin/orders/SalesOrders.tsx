import { useFirestoreCollection } from '../../../hooks/useFirestoreCollection';
import { db } from '../../../firebase/firebaseConfig';
import { Card } from '../../../components/ui/Card';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { Loading } from '../../../components/ui/Loading';
import PrimaryButton from '../../../components/ui/PrimaryButton';

export default function SalesOrders() {
  const { data: orders, loading: loadingOrders, error: errorOrders } = useFirestoreCollection('salesOrders');
  const { data: finishedGoods, loading: loadingFg, error: errorFg } = useFirestoreCollection('finishedGoods');
  const { data: customers, loading: loadingCustomers, error: errorCustomers } = useFirestoreCollection('customers');

const handleDeliver = async (order: any) => {
  const orderRef = doc(db, 'salesOrders', order.id);

  try {
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(orderRef);
      if (!snapshot.exists()) throw new Error('Order does not exist!');
      const data = snapshot.data();

      // ✅ Step 1: Read everything first
      const fgRefs = data.items.map((item: any) => doc(db, 'finishedGoods', item.finishedGoodId));
      const fgSnaps = await Promise.all(fgRefs.map((ref: any) => transaction.get(ref)));

      const customerRef = doc(db, 'customers', data.customerId);
      const customerSnap = await transaction.get(customerRef);

      // ✅ Step 2: Now perform all writes
      fgSnaps.forEach((fgSnap, idx) => {
        if (!fgSnap.exists()) return;
        const fgData = fgSnap.data();
        const item = data.items[idx];
        transaction.update(fgRefs[idx], {
          currentStock: (fgData.currentStock || 0) - item.quantity,
        });
      });

      if (customerSnap.exists()) {
        const custData = customerSnap.data();
        transaction.update(customerRef, {
          pendingAmount: (custData.pendingAmount || 0) + data.totalAmount,
        });
      }

      transaction.update(orderRef, { status: 'Delivered', updatedAt: serverTimestamp() });
    });
  } catch (err) {
    console.error('Transaction failed: ', err);
  }
};

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sales Orders</h2>
      {(loadingOrders || loadingFg || loadingCustomers) && (
      <Loading 
      message={
      loadingOrders ? "Loading orders..." : 
      loadingFg ? "Loading finished goods..." : 
      "Loading customers..."
      } 
    />
  )}
      {(errorOrders || errorFg || errorCustomers) && (
        <div className="text-red-600">{errorOrders || errorFg || errorCustomers}</div>
      )}
      {!loadingOrders && !errorOrders && orders.length === 0 && (
        <div className="text-gray-500">No sales orders yet.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((o: any) => {
          const customer = customers.find((c: any) => c.id === o.customerId);
          return (
            <Card key={o.id} title={`Order #${o.id}`}>
            <p>Customer: {customer?.name}</p>

            <p>
            Items:
            {o.items.map((item: any, idx: number) => {
            // Find the finished good from your already-loaded finishedGoods collection
            const fg = finishedGoods.find((f: any) => f.id === item.finishedGoodId);
            return (
            <span key={idx} className="block ml-2">
            • {fg ? fg.name : item.finishedGoodId} — {item.quantity}
            </span>
             );
             })}
             </p>

            <p>Total: ₹{o.totalAmount}</p>
            <p>Status: {o.status}</p>
  
             {o.status === 'Open' && (
              <PrimaryButton
              variant="success"
              onClick={() => handleDeliver(o)}
                >
                Deliver
                </PrimaryButton>
              )}
              </Card>
          );
        })}
      </div>
    </div>
  );
}