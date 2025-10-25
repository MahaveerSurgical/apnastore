import { useState } from 'react';
import { useCustomers } from '../../hooks/useCustomers';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';
import { useNavigate } from 'react-router-dom';

export default function Customers() {
  const { customers, loading, error } = useCustomers();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customers</h2>
      <div className="mb-4">
        <input
          placeholder="Search by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md border p-2 rounded"
        />
      </div>
      {loading && <Loading />}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && customers.length === 0 && (
        <div className="text-gray-500">No customers yet. Use the + button to add one.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers
          .filter((c: any) => c.name?.toLowerCase().includes(query.toLowerCase()))
          .map((c: any) => (
          <Card
            key={c.id}
            title={c.name}
            onClick={() => navigate(`/customers/${c.id}`)}
            className="cursor-pointer"
          >
            <p>Phone: {c.phone}</p>
            <p>Pending: ₹{c.pendingAmount}</p>
            <>Notes: {c.notes}</>
          </Card>
        ))}
      </div>

    </div>
  );
}