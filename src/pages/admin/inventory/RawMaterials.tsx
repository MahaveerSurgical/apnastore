// import { useState } from 'react';
import { useFirestoreCollection } from '../../../hooks/useFirestoreCollection';
import { Card } from '../../../components/ui/Card';
import { Loading } from '../../../components/ui/Loading';

export default function RawMaterials() {
  const { data: rawMaterials, loading, error } = useFirestoreCollection('rawMaterials');

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Raw Materials</h2>
      {loading && <Loading />}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && rawMaterials.length === 0 && (
        <div className="text-gray-500">No raw materials yet. Use the + button to add one.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rawMaterials.map((rm: any) => (
          <Card key={rm.id} title={rm.name}>
            <p>Stock: {rm.currentStock} {rm.unit}</p>
            <p>Reorder Point: {rm.reorderPoint}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}