import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { db, runTransaction, doc } from '../../firebase/firebaseConfig';
import { serverTimestamp } from '../../firebase/firebaseConfig';
import { useAuthContext } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';
import { format } from 'date-fns';

export default function WorkerDashboard() {
  const { worker } = useAuthContext();
  const { data: productionOrders, loading, error } = useFirestoreCollection('productionOrders');

  const assignedOrders = productionOrders.filter(
    (o: any) => o.assignedWorkerId === worker?.uid && o.status === 'In Progress'
  );

  const handleComplete = async (order: any) => {
    try {
      const orderRef = doc(db, 'productionOrders', order.id);
      await runTransaction(db, async (transaction) => {
        transaction.update(orderRef, { status: 'Completed', completedAt: serverTimestamp() });
      });
      alert('Order marked as Completed!');
    } catch (err) {
      console.error(err);
      alert('Failed to update order');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Assigned Work</h2>
      {loading && <Loading />}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && assignedOrders.length === 0 && (
        <div className="text-gray-500">No assigned orders yet.</div>
      )}
      {assignedOrders.map((o: any) => (
        <Card key={o.id}>
          <div className="flex justify-between items-center">
            <div>
              <p><strong>Order ID:</strong> {o.id}</p>
              <p><strong>Quantity:</strong> {o.quantity}</p>
              <p><strong>Created At:</strong> {format(o.createdAt?.toDate(), 'dd MMM yyyy')}</p>
            </div>
            <button
              className="bg-primary-600 text-white px-3 py-1 rounded"
              onClick={() => handleComplete(o)}
            >
              Mark Completed
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}