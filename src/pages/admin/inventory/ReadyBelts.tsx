import { useReadyBelts } from '../../../hooks/domain/useReadyBelts';
import { Card } from '../../../components/ui/Card';
import { Loading } from '../../../components/ui/Loading';
import PrimaryButton from '../../../components/ui/PrimaryButton';

export default function ReadyBelts() {
  const { readyBelts: belts, loading: loadingBelts, error: errorBelts, deleteReadyBelt } = useReadyBelts();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this ready belt?')) {
      try {
        await deleteReadyBelt(id);
      } catch (err) {
        console.error('Error deleting ready belt:', err);
        alert('Failed to delete ready belt');
      }
    }
  };


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Ready Belts</h2>
      {(loadingBelts ) && <Loading message="Loading inventory..." />}
      {(errorBelts ) && (
        <div className="text-red-600">{errorBelts }</div>
      )}
      {!loadingBelts && !errorBelts && belts.length === 0 && (
        <div className="text-gray-500">No finished goods yet. Use the + button to add one.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {belts.map((b: any) => (
          <Card key={b.id} title={b.name}>
            <p>Name:{b.type}</p>
            <p>Stock: {b.quantity}</p>
            <p>Price: ₹{b.price}</p>
            <p>BOM:</p>
            <ul className="list-disc list-inside mb-4">
             {Object.entries(b.billOfMaterials || {}).map(([rmId, item]: [string, any]) => (
                <li key={rmId}>
                  {item.materialName} ({item.unit}) — {item.quantity}
                </li>
            ))}
            </ul>
            <div className="mt-4">
              <PrimaryButton
                variant="danger"
                onClick={() => handleDelete(b.id)}
              >
                Delete
              </PrimaryButton>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}