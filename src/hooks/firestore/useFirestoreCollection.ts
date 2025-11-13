// src/hooks/useFirestoreCollection.ts
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, QueryConstraint } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

/**
 * Hook to fetch and listen to a Firestore collection
 * @param colName - name of Firestore collection
 * @param constraints - optional Firestore query constraints
 */
export function useFirestoreCollection<T = any>(
  colName: string,
  constraints: QueryConstraint[] = [],
  options: { orderByField?: string | null } = { orderByField: 'createdAt' }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const colRef = collection(db, colName);
    const builtQuery = options.orderByField
      ? query(colRef, ...constraints, orderBy(options.orderByField as string, 'desc'))
      : query(colRef, ...constraints);

    const unsubscribe = onSnapshot(
      builtQuery as any,
      (snapshot: any) => {
        setData(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as T[]);
        setLoading(false);
      },
      (err: any) => {
        console.error('Firestore listener error:', err);
        setError(err?.message || 'Listener error');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [colName, JSON.stringify(constraints), options.orderByField]); // track changes

  return { data, loading, error };
}