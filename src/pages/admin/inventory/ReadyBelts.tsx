import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReadyBelts } from '../../../hooks/domain/useReadyBelts';
import { Card } from '../../../components/ui/Card';
import { Loading } from '../../../components/ui/Loading';

type ReadyBelt = {
  id: string;
  type: string;
  size: string;
  currentStock?: number;
  price?: number;
  notes?: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function ReadyBelts() {
  const navigate = useNavigate();
  const { readyBelts: belts, loading: loadingBelts, error: errorBelts } = useReadyBelts();

  const groupedBelts = useMemo(() => {
    const groups = new Map<string, ReadyBelt[]>();

    belts.forEach((belt: ReadyBelt) => {
      const key = belt.type || 'Untitled';
      const currentGroup = groups.get(key) || [];
      currentGroup.push(belt);
      groups.set(key, currentGroup);
    });

    return Array.from(groups.entries()).map(([type, items]) => ({
      type,
      slug: slugify(type),
      items,
      totalStock: items.reduce((sum, item) => sum + (item.currentStock || 0), 0),
    })).sort((left, right) => left.type.localeCompare(right.type, undefined, { numeric: true, sensitivity: 'base' }));
  }, [belts]);


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
      <div className="space-y-3">
        {groupedBelts.map((group) => (
          <Card
            key={group.slug}
            onClick={() => navigate(`/inventory/ready-belts/${encodeURIComponent(group.slug)}`)}
            className="cursor-pointer transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-lg font-semibold text-primary-800 break-words">
                {group.type}
              </span>
              <span className="shrink-0 text-sm font-medium text-gray-700">
                {group.totalStock}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}