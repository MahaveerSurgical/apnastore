import { createContext, useEffect, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

type UserRole = 'Admin' | 'Contract';

interface WorkerDoc {
  uid: string;
  name: string;
  role: UserRole;
  phone?: string;
}

interface AuthContextValue {
  user: any | null;
  worker: WorkerDoc | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [worker, setWorker] = useState<WorkerDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeWorker: (() => void) | null = null;

    console.log('[AuthContext] Setting up auth listener');
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      console.log('[AuthContext] Auth state changed:', { 
        uid: u?.uid,
        email: u?.email,
        isAnonymous: u?.isAnonymous 
      });
      
      setUser(u);
      // Reset worker and loading when auth changes
      if (unsubscribeWorker) {
        console.log('[AuthContext] Cleaning up previous worker listener');
        unsubscribeWorker();
        unsubscribeWorker = null;
      }

      if (u) {
        console.log('[AuthContext] User authenticated, setting up worker listener');
        setLoading(true);
        setWorker(null);
        const workerDocRef = doc(db, 'workers', u.uid);
        unsubscribeWorker = onSnapshot(
          workerDocRef,
          (snap) => {
            console.log('[AuthContext] Worker doc updated:', {
              exists: snap.exists(),
              data: snap.exists() ? snap.data() : null
            });
            if (snap.exists()) {
              setWorker(snap.data() as WorkerDoc);
            } else {
              setWorker(null);
            }
            setLoading(false);
          },
          (err) => {
            console.error('[AuthContext] Worker profile listener error:', err);
            setWorker(null);
            setLoading(false);
          }
        );
      } else {
        console.log('[AuthContext] No user, clearing worker state');
        setWorker(null);
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribeWorker) unsubscribeWorker();
      unsubscribeAuth();
    };
  }, []);

  return <AuthContext.Provider value={{ user, worker, loading }}>{children}</AuthContext.Provider>;
};