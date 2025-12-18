import { useProductionOrders } from '../../../hooks/domain/useProductionOrders';
import { Card } from '../../../components/ui/Card';
import { Loading } from '../../../components/ui/Loading';
import { useReadyBelts } from '../../../hooks/domain/useReadyBelts';
import { useRawMaterials } from '../../../hooks/domain/useRawMaterials';
import { useWorkers } from '../../../hooks/domain/useWorkers';
import PrimaryButton from '../../../components/ui/PrimaryButton';

export default function ProductionOrders() {
  const { 
    productionOrders, 
    loading: loadingOrders, 
    error: errorOrders, 
    deleteProductionOrder,
    receiveOrder 
  } = useProductionOrders();
  const { readyBelts, loading: loadingRb, error: errorRb } = useReadyBelts();
  const { rawMaterials, loading: loadingRm, error: errorRm } = useRawMaterials();
  const { workers, loading: loadingWorkers, error: errorWorkers } = useWorkers();

  const handleReceive = async (order: any) => {
    try {
      const readyBelt = readyBelts.find((rb: any) => rb.id === order.readyBeltsId);
      const worker = workers.find((w: any) => w.id === order.workerId || w.uid === order.workerId);
      
      await receiveOrder(order, readyBelt, rawMaterials, worker);
      alert('Order received successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to receive order');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this production order?')) {
      try {
        await deleteProductionOrder(id);
      } catch (err) {
        console.error('Error deleting production order:', err);
        alert('Failed to delete production order');
      }
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {(loadingOrders || loadingRb || loadingRm || loadingWorkers) && (<Loading 
      message={
      loadingOrders ? "Loading orders..." : 
      loadingRb ? "Loading finished goods..." :
      loadingRm ? "Loading raw materials..." :
      loadingWorkers ? "Loading workers..." :
      "Loading customers..."
      } 
    />
  )}
      {(errorOrders || errorRb || errorRm || errorWorkers) && (
        <div className="text-red-600">{errorOrders || errorRb || errorRm || errorWorkers}</div>
      )}
      {!loadingOrders && !errorOrders && productionOrders.length === 0 && (
        <div className="text-gray-500">No production orders yet.</div>
      )}
      {productionOrders.map((order: any) => {
        const worker = workers.find((w: any) => w.id === order.workerId || w.uid === order.workerId);
        const rb = readyBelts.find((f: any) =>
          f.id === order.readyBeltsId ||
          f.type === order.beltType ||
          f.name === order.beltType
        );

        return (
          <Card key={order.id} title={`Order #${order.id}`}>
            <p>Finished Good: {rb?.type || 'N/A'}</p>
            <p>Quantity: {order.quantity}</p>
            <p>Assigned Worker: {worker?.name || order.workerName || 'Unknown'}</p>
            <p>Status: {order.status}</p>
            <div className="flex gap-2 mt-4">
              {order.status === 'completed' && (
                <PrimaryButton
                  onClick={() => handleReceive(order)}
                  variant="success"
                >
                  Receive
                </PrimaryButton>
              )}
              <PrimaryButton
                onClick={() => handleDelete(order.id)}
                variant="danger"
              >
                Delete
              </PrimaryButton>
            </div>
          </Card>
        );
      })}
    </div>
  );
}