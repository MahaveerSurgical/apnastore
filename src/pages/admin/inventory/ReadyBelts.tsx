// import { useState } from 'react';
import { useFirestoreCollection } from '../../../hooks/useFirestoreCollection';
import { Card } from '../../../components/ui/Card';
import { Loading } from '../../../components/ui/Loading';

export default function ReadyBelts() {
  const { data: belts, loading: loadingBelts, error: errorBelts } = useFirestoreCollection('finishedGoods');
  const { data: rawMaterials, loading: loadingRM, error: errorRM } = useFirestoreCollection('rawMaterials');


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Ready Belts</h2>
      {(loadingBelts || loadingRM) && <Loading message="Loading inventory..." />}
      {(errorBelts || errorRM) && (
        <div className="text-red-600">{errorBelts || errorRM}</div>
      )}
      {!loadingBelts && !errorBelts && belts.length === 0 && (
        <div className="text-gray-500">No finished goods yet. Use the + button to add one.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {belts.map((b: any) => (
          <Card key={b.id} title={b.name}>
            <p>Stock: {b.currentStock}</p>
            <p>Price: ₹{b.pricePerUnit}</p>
            <p>BOM:</p>
            <ul className="list-disc list-inside">
              {Object.entries(b.bom || {}).map(([rmId, qty]) => {
                const rm = rawMaterials.find((r: any) => r.id === rmId);
                return <li key={rmId}>{rm?.name || rmId}: {qty}</li>;
              })}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}