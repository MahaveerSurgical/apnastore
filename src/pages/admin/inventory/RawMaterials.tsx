// import { useState } from 'react';
import { useFirestoreCollection } from '../../../hooks/useFirestoreCollection';
import { Card } from '../../../components/ui/Card';
// import { Modal } from '../../../components/ui/Modal';
// import { db } from '../../../firebase/firebaseConfig';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function RawMaterials() {
  const { data: rawMaterials, loading, error } = useFirestoreCollection('rawMaterials');
  // const [isOpen, setIsOpen] = useState(false);
  // const [name, setName] = useState('');
  // const [stock, setStock] = useState(0);
  // const [unit, setUnit] = useState('');
  // const [reorder, setReorder] = useState(0);

  // const handleAdd = async () => {
  //   await addDoc(collection(db, 'rawMaterials'), {
  //     name,
  //     currentStock: stock,
  //     unit,
  //     reorderPoint: reorder,
  //     createdAt: serverTimestamp()
  //   });
  //   setIsOpen(false);
  // };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Raw Materials</h2>
      {loading && <div className="text-gray-500">Loading...</div>}
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

      {/* <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 bg-primary-500 text-grey rounded-full w-14 h-14 text-3xl">+</button> */}

      {/* <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Raw Material">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded mb-2"/>
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(parseInt(e.target.value))} className="w-full border p-2 rounded mb-2"/>
        <input placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full border p-2 rounded mb-2"/>
        <input type="number" placeholder="Reorder Point" value={reorder} onChange={(e) => setReorder(parseInt(e.target.value))} className="w-full border p-2 rounded mb-2"/>
        <button onClick={handleAdd} className="bg-primary-500 text-grey px-4 py-2 rounded">Add</button>
      </Modal> */}
    </div>
  );
}