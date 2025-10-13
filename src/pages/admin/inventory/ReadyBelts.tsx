// import { useState } from 'react';
import { useFirestoreCollection } from '../../../hooks/useFirestoreCollection';
import { Card } from '../../../components/ui/Card';
// import { Modal } from '../../../components/ui/Modal';
// import { db } from '../../../firebase/firebaseConfig';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ReadyBelts() {
  const { data: belts, loading: loadingBelts, error: errorBelts } = useFirestoreCollection('finishedGoods');
  const { data: rawMaterials, loading: loadingRM, error: errorRM } = useFirestoreCollection('rawMaterials');

  // const [isOpen, setIsOpen] = useState(false);
  // const [name, setName] = useState('');
  // const [stock, setStock] = useState(0);
  // const [price, setPrice] = useState(0);
  // const [bom, setBom] = useState<{ [key: string]: number }>({});

  // const handleAdd = async () => {
  //   await addDoc(collection(db, 'finishedGoods'), {
  //     name,
  //     currentStock: stock,
  //     pricePerUnit: price,
  //     bom,
  //     createdAt: serverTimestamp()
  //   });
  //   setIsOpen(false);
  //   setBom({});
  // };

  // const updateBom = (id: string, value: number) => {
  //   setBom({ ...bom, [id]: value });
  // };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Ready Belts</h2>
      {(loadingBelts || loadingRM) && <div className="text-gray-500">Loading...</div>}
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

      {/* <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 bg-primary-500 text-red rounded-full w-14 h-14 text-3xl">+</button> */}

      {/* <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Ready Belt">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded mb-2"/>
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(parseInt(e.target.value))} className="w-full border p-2 rounded mb-2"/>
        <input type="number" placeholder="Price Per Unit" value={price} onChange={(e) => setPrice(parseInt(e.target.value))} className="w-full border p-2 rounded mb-2"/>
        
        <h3 className="font-semibold mt-2">Bill of Materials (BOM)</h3>
        {rawMaterials.map((rm: any) => (
          <div key={rm.id} className="flex items-center gap-2 mb-1">
            <span>{rm.name} ({rm.unit})</span>
            <input
              type="number"
              placeholder="Qty"
              value={bom[rm.id] || ''}
              onChange={(e) => updateBom(rm.id, parseInt(e.target.value))}
              className="border p-1 rounded w-20"
            />
          </div>
        ))}

        <button onClick={handleAdd} className="bg-primary-500 text-grey px-4 py-2 rounded mt-2">Add</button>
      </Modal> */}
    </div>
  );
}