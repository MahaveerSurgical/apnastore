import { useFirestoreCollection } from '../../hooks/firestore/useFirestoreCollection';
import { Card } from '../../components/ui/Card';

export default function Dashboard() {
  const { data: salesOrders } = useFirestoreCollection('salesOrders');
  const { data: customers } = useFirestoreCollection('customers');
  const { data: rawMaterials } = useFirestoreCollection('rawMaterials');
  const { data: workers } = useFirestoreCollection('workers');
  const { data: finishedGoods } = useFirestoreCollection('finishedGoods');

  const openSalesOrders = salesOrders.filter((o: any) => o.status === 'Open');
  const totalPendingPayments = customers.reduce((sum: number, c: any) => sum + (c.pendingAmount || 0), 0);
  const lowStockMaterials = rawMaterials.filter((rm: any) => rm.currentStock <= rm.reorderPoint);
  const totalPayoutsDue = workers.reduce((sum: number, w: any) => sum + (w.pendingAmount || 0), 0);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card title="Open Sales Orders">
        <p>Count: {openSalesOrders.length}</p>
        <p>Total Value: ₹{openSalesOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)}</p>
      </Card>

      <Card title="Total Pending Payments">
        <p>₹{totalPendingPayments}</p>
      </Card>

      <Card title="Low Stock Raw Materials">
        <ul>
          {lowStockMaterials.map((rm: any) => (
            <li key={rm.id}>{rm.name} - {rm.currentStock} {rm.unit}</li>
          ))}
        </ul>
      </Card>

      <Card title="Total Payouts Due">
        <p>₹{totalPayoutsDue}</p>
      </Card>

      <Card title="Inventory of Ready Belts">
        <ul>
          {finishedGoods.map((fg: any) => (
            <li key={fg.id}>{fg.name} - {fg.currentStock} units</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}