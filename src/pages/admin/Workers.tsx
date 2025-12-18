import { doc, updateDoc, deleteField } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useState } from 'react';
import { useFirestoreCollection } from '../../hooks/firestore//useFirestoreCollection';
import { Card } from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';

async function handleApproval(id: string, askedRole: string) {
  const ref = doc(db, "workers", id);
  await updateDoc(ref, {
    role: askedRole,
    askedRole: deleteField(),
    updatedAt: new Date(),
  });
}

async function handleRejection(id: string) {
// Delete worker document
// async function handleDelete(id: string) {
//   const ref = doc(db, "workers", id);
//   await deleteDoc(ref);
// }
  const ref = doc(db, "workers", id);
  await updateDoc(ref, {
    role: "Rejected", 
    updatedAt: new Date(),
  });
}

export default function Workers() {
  const { data: workers } = useFirestoreCollection('workers');
  const [filter, setFilter] = useState<'Admin' | 'Contract' | 'Pending'|'Delivery' |'Rejected'|'All'>('All');

  // Delete worker document
  async function handleDelete(id: string) {
    const ref = doc(db, "workers", id);
    await deleteDoc(ref);
  }

  const filteredWorkers =
    filter === 'All'
      ? workers.filter((w: any) => w.role !== 'Rejected') 
      : workers.filter((w: any) => w.role === filter);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Workers</h2>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter('All')} className="bg-primary-500 text-grey px-3 py-1 rounded">All</button>
        <button onClick={() => setFilter('Admin')} className="bg-primary-500 text-grey px-3 py-1 rounded">Admin</button>
        <button onClick={() => setFilter('Contract')} className="bg-primary-500 text-grey px-3 py-1 rounded">Contract</button>
        <button onClick={() => setFilter('Pending')} className="bg-primary-500 text-grey px-3 py-1 rounded">Pending</button>
        <button onClick={() => setFilter('Delivery')} className="bg-primary-500 text-grey px-3 py-1 rounded">Delivery</button>
        <button onClick={() => setFilter('Rejected')} className="bg-primary-500 text-grey px-3 py-1 rounded">Rejected</button>
            </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkers.map((w: any) => (
          <Card key={w.id} title={w.name}>
            <p>Role: {w.role}</p>
            <p>Phone: {w.phone}</p>
            <p>Email: {w.email}</p>
            {(w.role === 'Pending') ? (
              <>
              <p>Requested Role: {w.askedRole}</p>
                <PrimaryButton
                  variant="warning"
                  onClick={() => handleApproval(w.id, w.askedRole)}
                >
                  Approve
                </PrimaryButton>

                <PrimaryButton
                  variant="danger"
                  onClick={() => handleRejection(w.id)}
                >
                  Reject
                </PrimaryButton>
              </>             
            ) : null}
            <PrimaryButton
              variant="danger"
              onClick={() => handleDelete(w.id)}
            >
              Delete
            </PrimaryButton>
          </Card>
        ))}
      </div>
    </div>
  );
}