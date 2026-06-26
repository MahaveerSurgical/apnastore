import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Loading } from '../../../components/ui/Loading';
import { useReadyBelts } from '../../../hooks/domain/useReadyBelts';

type ReadyBelt = {
  id: string;
  type: string;
  size: string;
  currentStock?: number;
  minQuantity?: number;
  price?: number;
  notes?: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const compareSizes = (left: string, right: string) => {
  const leftNumber = parseFloat(left);
  const rightNumber = parseFloat(right);

  if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber) && leftNumber !== rightNumber) {
    return leftNumber - rightNumber;
  }

  return left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' });
};

export default function ReadyBeltDetail() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { readyBelts: belts, loading, error } = useReadyBelts();

  const typeName = decodeURIComponent(type || '');

  const selectedBelts = useMemo(() => {
    return belts
      .filter((belt: ReadyBelt) => slugify(belt.type || 'Untitled') === typeName)
      .sort((left: ReadyBelt, right: ReadyBelt) => compareSizes(left.size || '', right.size || ''));
  }, [belts, typeName]);

  const displayTitle = selectedBelts[0]?.type || typeName || 'Ready Belts';

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/inventory/ready-belts')}
        className="mb-4 text-sm font-medium text-primary-700 hover:text-primary-800"
      >
        ← Back 
      </button>

      <h2 className="text-2xl font-bold mb-1">{displayTitle}</h2>
      {/* <p className="text-gray-600 mb-4">Size-wise belt list sorted from smaller to larger sizes.</p> */}

      {loading && <Loading message="Loading belt details..." />}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && selectedBelts.length === 0 && (
        <div className="text-gray-500">No belts found for this type.</div>
      )}

      <div className="space-y-3">
        {selectedBelts.map((belt: ReadyBelt) => (
          (() => {
            const isLowStock =
              belt.minQuantity !== undefined && (belt.currentStock || 0) <= belt.minQuantity;

            return (
          <Card
            key={belt.id}
            className={isLowStock ? 'bg-yellow-50 border-yellow-200' : ''}
          >
            <div className="flex items-start justify-between gap-4">
              <span className="text-lg font-semibold text-primary-800 break-words">
                {belt.size}
              </span>
              <div className="shrink-0 text-right">
                <p className={`text-sm font-medium ${isLowStock ? 'text-yellow-800' : 'text-gray-700'}`}>
                  {belt.currentStock || 0}/{belt.minQuantity || 0}
                </p>
                <p className={`mt-1 text-xs ${isLowStock ? 'text-yellow-700' : 'text-gray-500'}`}>₹{belt.price || 0}</p>
              </div>
            </div>
            {belt.notes && <p>Notes: {belt.notes}</p>}
          </Card>
            );
          })()
        ))}
      </div>
    </div>
  );
}