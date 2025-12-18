import { useSalesOrders } from '../../../hooks/domain/useSalesOrders';
import { useCustomers } from '../../../hooks/domain/useCustomers';
import { Card } from '../../../components/ui/Card';
import { Loading } from '../../../components/ui/Loading';
import PrimaryButton from '../../../components/ui/PrimaryButton';


export default function SalesOrders() {
  const { salesOrders: orders,loading: loadingOrders,error: errorOrders,deleteSalesOrder,deliverSalesOrder} = useSalesOrders();
  const { customers, loading: loadingCustomers, error: errorCustomers } = useCustomers();

const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this sales order?')) {
      try {
        await deleteSalesOrder(id);
      } catch (err) {
        console.error('Error deleting sales order:', err);
        alert('Failed to delete sales order');
      }
    }
  };

  const handleDeliver = async (order: any) => {
    try {
      await deliverSalesOrder(order);
      alert(`Order #${order.orderNumber} delivered successfully!`);
    } catch (err) {
      console.error('Failed to deliver order:', err);
      alert('Failed to deliver order');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sales Orders</h2>
      {(loadingOrders || loadingCustomers) && (
      <Loading 
      message={
      loadingOrders ? "Loading orders..." : 
      "Loading customers..."
      } 
    />
  )}
      {(errorOrders || errorCustomers) && (
        <div className="text-red-600">{errorOrders || errorCustomers}</div>
      )}
      {!loadingOrders && !errorOrders && orders.length === 0 && (
        <div className="text-gray-500">No sales orders yet.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((o: any) => {
          const customer = customers.find((c: any) => c.id === o.customerId);
          return (
            <Card key={o.id} title={`Order #${o.orderNumber}`}>
              <div>
                <p>Customer: {customer?.name}</p>
                <div>
                  <p>Items:</p>
                  {o.items.map((item: any, index: number) => {
                    return (
                      <span key={index} className="block ml-2">
                        • {item.type} ({item.size}) — {item.quantity}
                      </span>
                    );
                  })}
                </div>
                <p>Total: ₹{o.totalAmount}</p>
                <p>Status: {o.status}</p>
                <div className="flex gap-2 mt-4">
                  {o.status !== 'delivered' && (
                    <PrimaryButton
                      onClick={() => handleDeliver(o)}
                      variant="success"
                    >
                      Deliver
                    </PrimaryButton>
                  )}
                  <PrimaryButton
                    onClick={() => handleDelete(o.id)}
                    variant="danger"
                  >
                    Delete
                  </PrimaryButton>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}