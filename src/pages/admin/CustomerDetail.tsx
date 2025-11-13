import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestoreCollection } from '../../hooks/firestore/useFirestoreCollection';
import { db } from '../../firebase/firebaseConfig';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Card } from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';
 

export default function CustomerDetail() {
  const { id } = useParams();
  const { data: customers, loading: loadingCustomers, error: errorCustomers } = useFirestoreCollection('customers');
  const { data: salesOrders, loading: loadingOrders, error: errorOrders } = useFirestoreCollection('salesOrders');
  const customer = customers.find((c: any) => c.id === id);
  const customerOrders = useMemo(() => salesOrders.filter((o: any) => o.customerId === id), [salesOrders, id]);

  const [payment, setPayment] = useState(0);
  const [tab, setTab] = useState<'pending' | 'previous' | 'payments'>('pending');

  const handleAddPayment = async () => {
    if (!customer) return;
    const customerRef = doc(db, 'customers', customer.id);
    await updateDoc(customerRef, {
      pendingAmount: (customer.pendingAmount || 0) - payment,
      updatedAt: serverTimestamp()
    });
    setPayment(0);
  };

  const pendingOrders = customerOrders.filter((o: any) => o.status !== 'Delivered' && o.status !== 'Paid');
  const previousOrders = customerOrders.filter((o: any) => o.status === 'Delivered' || o.status === 'Paid');

  return (
    <div className="p-6">
      {loadingCustomers && <div className="text-gray-500">Loading...</div>}
      {errorCustomers && <div className="text-red-600">{errorCustomers}</div>}
      {!customer && !loadingCustomers && <div className="text-gray-500">Customer not found.</div>}

      {customer && (
        <>
          <h2 className="text-2xl font-bold mb-1">{customer.name}</h2>
          <p>Phone: {customer.phone}</p>
          <p>Address: {customer.address}</p>
          <p>Pending Amount: ₹{customer.pendingAmount}</p>

          <div className="mt-6 border-b mb-4 flex gap-4">
            <button className={`pb-2 ${tab === 'pending' ? 'border-b-2 border-primary-600 font-semibold' : ''}`} onClick={() => setTab('pending')}>Pending Orders</button>
            <button className={`pb-2 ${tab === 'previous' ? 'border-b-2 border-primary-600 font-semibold' : ''}`} onClick={() => setTab('previous')}>Previous Orders</button>
            <button className={`pb-2 ${tab === 'payments' ? 'border-b-2 border-primary-600 font-semibold' : ''}`} onClick={() => setTab('payments')}>Payment Dues</button>
          </div>

          {tab !== 'payments' && loadingOrders && <div className="text-gray-500">Loading orders...</div>}
          {tab !== 'payments' && errorOrders && <div className="text-red-600">{errorOrders}</div>}

          {tab === 'pending' && (
            <div className="space-y-2">
              {pendingOrders.map((o: any) => (
                <Card key={o.id}>
                  <p>Order ID: {o.id}</p>
                  <p>Total: ₹{o.totalAmount}</p>
                  <p>Status: {o.status}</p>
                </Card>
              ))}
              {pendingOrders.length === 0 && <div className="text-gray-500">No pending orders.</div>}
            </div>
          )}

          {tab === 'previous' && (
            <div className="space-y-2">
              {previousOrders.map((o: any) => (
                <Card key={o.id}>
                  <p>Order ID: {o.id}</p>
                  <p>Total: ₹{o.totalAmount}</p>
                  <p>Status: {o.status}</p>
                </Card>
              ))}
              {previousOrders.length === 0 && <div className="text-gray-500">No previous orders.</div>}
            </div>
          )}

          {tab === 'payments' && (
            <div className="mt-2">
              <h3 className="text-xl font-semibold mb-2">Add Payment</h3>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={payment}
                  onChange={(e) => setPayment(parseInt(e.target.value))}
                  className="border p-2 rounded"
                />
        <PrimaryButton
        onClick={handleAddPayment}variant="primary"
        >
        Add
        </PrimaryButton>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}