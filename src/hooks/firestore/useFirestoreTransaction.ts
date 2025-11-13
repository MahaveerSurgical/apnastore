// src/hooks/firestore/useFirestoreTransaction.ts
import { runTransaction, Firestore, Transaction } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

/**
 * Provides a consistent interface for Firestore transactions.
 */
export function useFirestoreTransaction() {
  const run = async (
    task: (transaction: Transaction, db: Firestore) => Promise<void>
  ) => {
    try {
      await runTransaction(db, async (transaction) => {
        await task(transaction, db);
      });
      console.log("✅ Firestore transaction committed successfully.");
    } catch (error) {
      console.error("❌ Firestore transaction failed:", error);
      throw error;
    }
  };

  return { run };
}