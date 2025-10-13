import { useFirestoreCollection } from '../../../hooks/useFirestoreCollection';
import { db } from '../../../firebase/firebaseConfig';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { Card } from '../../../components/ui/Card';

export default function ProductionOrders() {
  const { data: productionOrders, loading: loadingOrders, error: errorOrders } = useFirestoreCollection('productionOrders');
  const { data: finishedGoods, loading: loadingFg, error: errorFg } = useFirestoreCollection('finishedGoods');
  const { data: rawMaterials, loading: loadingRm, error: errorRm } = useFirestoreCollection('rawMaterials');
  const { data: workers, loading: loadingWorkers, error: errorWorkers } = useFirestoreCollection('workers');

  const handleReceive = async (order: any) => {
    try {
      await runTransaction(db, async (transaction) => {
        const orderRef = doc(db, 'productionOrders', order.id);
        transaction.update(orderRef, { status: 'Received', completedAt: serverTimestamp() });

        const finishedGoodRef = doc(db, 'finishedGoods', order.finishedGoodId);
        const fgSnap = finishedGoods.find((fg: any) => fg.id === order.finishedGoodId);
        if (!fgSnap) throw new Error('Finished good not found');

        // Decrease raw materials based on BOM
        for (const [rmId, qtyNeeded] of Object.entries(fgSnap.bom as Record<string, number>)) {
          const rmRef = doc(db, 'rawMaterials', rmId);
          const rmSnap = rawMaterials.find((rm: any) => rm.id === rmId);
          if (!rmSnap) throw new Error('Raw material not found');
          const newStock = rmSnap.currentStock - qtyNeeded * order.quantity;
          if (newStock < 0) throw new Error('Insufficient raw material stock');
          transaction.update(rmRef, { currentStock: newStock });
        }

        // Increase finished good stock
        transaction.update(finishedGoodRef, { currentStock: (fgSnap.currentStock || 0) + order.quantity });

        // Update worker ledger
        const workerRef = doc(db, 'workers', order.assignedWorkerId);
        const workerSnap = workers.find((w: any) => w.id === order.assignedWorkerId);
        if (workerSnap) {
          const payout = (fgSnap.pricePerUnit || 0) * order.quantity * 0.5; // example payout logic
          transaction.update(workerRef, { pendingAmount: (workerSnap.pendingAmount || 0) + payout });
        }
      });
      alert('Order received successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to receive order');
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {(loadingOrders || loadingFg || loadingRm || loadingWorkers) && <div className="text-gray-500">Loading...</div>}
      {(errorOrders || errorFg || errorRm || errorWorkers) && (
        <div className="text-red-600">{errorOrders || errorFg || errorRm || errorWorkers}</div>
      )}
      {!loadingOrders && !errorOrders && productionOrders.length === 0 && (
        <div className="text-gray-500">No production orders yet.</div>
      )}
      {productionOrders.map((order: any) => {
        const worker = workers.find((w: any) => w.id === order.assignedWorkerId);
        const fg = finishedGoods.find((f: any) => f.id === order.finishedGoodId);
        return (
          <Card key={order.id} title={`Order #${order.id}`}>
            <p>Finished Good: {fg?.name}</p>
            <p>Quantity: {order.quantity}</p>
            <p>Assigned Worker: {worker?.name}</p>
            <p>Status: {order.status}</p>
            {order.status === 'Completed' && (
              <button
                className="mt-2 px-4 py-1 bg-green-500 text-white rounded"
                onClick={() => handleReceive(order)}
              >
                Receive
              </button>
            )}
          </Card>
        );
      })}
    </div>
  );
}