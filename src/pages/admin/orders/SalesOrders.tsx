import { useFirestoreCollection } from '../../../hooks/useFirestoreCollection';
import { db } from '../../../firebase/firebaseConfig';
import { Card } from '../../../components/ui/Card';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';

export default function SalesOrders() {
  const { data: orders, loading: loadingOrders, error: errorOrders } = useFirestoreCollection('salesOrders');
  const { data: finishedGoods,  loading: loadingFg, error: errorFg } = useFirestoreCollection('finishedGoods');
  const { data: customers, loading: loadingCustomers, error: errorCustomers } = useFirestoreCollection('customers');

  const handleDeliver = async (order: any) => {
    const orderRef = doc(db, 'salesOrders', order.id);

    try {
      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(orderRef);
        if (!snapshot.exists()) throw 'Order does not exist!';
        const data = snapshot.data();

        // Decrease stock of finishedGoods
        for (let item of data.items) {
          const fgRef = doc(db, 'finishedGoods', item.finishedGoodId);
          const fgSnap = await transaction.get(fgRef);
          if (!fgSnap.exists()) continue;
          const fgData = fgSnap.data();
          transaction.update(fgRef, {
            currentStock: (fgData.currentStock || 0) - item.quantity
          });
        }

        // Update customer pending amount
        const customerRef = doc(db, 'customers', data.customerId);
        const customerSnap = await transaction.get(customerRef);
        if (customerSnap.exists()) {
          const custData = customerSnap.data();
          transaction.update(customerRef, {
            pendingAmount: (custData.pendingAmount || 0) + data.totalAmount
          });
        }

        // Update order status
        transaction.update(orderRef, { status: 'Delivered', updatedAt: serverTimestamp() });
      });
    } catch (err) {
      console.error('Transaction failed: ', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sales Orders</h2>
      {(loadingOrders || loadingFg || loadingCustomers) && <div className="text-gray-500">Loading...</div>}
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
              <p>Total: ₹{o.totalAmount}</p>
              <p>Status: {o.status}</p>
              {o.status === 'Open' && (
                <button
                  onClick={() => handleDeliver(o)}
                  className="bg-primary-500 text-grey px-3 py-1 rounded mt-2"
                >
                  Deliver
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}