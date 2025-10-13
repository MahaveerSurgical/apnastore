import { useState } from 'react';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { Card } from '../../components/ui/Card';

export default function Workers() {
  const { data: workers } = useFirestoreCollection('workers');
  const [filter, setFilter] = useState<'Admin' | 'Contract' | 'All'>('All');

  const filteredWorkers =
    filter === 'All' ? workers : workers.filter((w: any) => w.role === filter);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Workers</h2>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter('All')} className="bg-primary-500 text-grey px-3 py-1 rounded">All</button>
        <button onClick={() => setFilter('Admin')} className="bg-primary-500 text-grey px-3 py-1 rounded">Admin</button>
        <button onClick={() => setFilter('Contract')} className="bg-primary-500 text-grey px-3 py-1 rounded">Contract</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkers.map((w: any) => (
          <Card key={w.id} title={w.name}>
            <p>Role: {w.role}</p>
            <p>Phone: {w.phone}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}