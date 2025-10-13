import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig.ts";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import CancelButton from "../ui/CancelButton";

export default function AddFinishedGoodForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    pricePerUnit: 0 as number | '',
    currentStock: 0 as number | '',
  });

  const [bom, setBom] = useState<{ [key: string]: number | '' }>({});
  const { data: rawMaterials, loading, error } = useFirestoreCollection("rawMaterials");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setForm({ ...form, [name]: value === '' ? '' : parseInt(value, 10) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleBomChange = (materialId: string, quantity: string) => {
    setBom(prevBom => ({
      ...prevBom,
      [materialId]: quantity === '' ? '' : parseInt(quantity, 10),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

    // Convert all BOM quantities back to numbers
    const numericBom = Object.entries(bom).reduce((acc, [key, value]) => {
      acc[key] = Number(value) || 0;
      return acc;
    }, {} as { [key: string]: number });

    await addDoc(collection(db, "finishedGoods"), {
      name: form.name,
      pricePerUnit: Number(form.pricePerUnit) || 0,
      currentStock: Number(form.currentStock) || 0,
      bom: numericBom,
      createdAt: serverTimestamp(),
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Add Finished Good</h2>
      <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} className="border rounded w-full px-3 py-2" required />
      <input name="currentStock" type="number" placeholder="Initial Stock" value={form.currentStock} onChange={handleChange} className="border rounded w-full px-3 py-2" />
      <input name="pricePerUnit" type="number" placeholder="Price Per Unit" value={form.pricePerUnit} onChange={handleChange} className="border rounded w-full px-3 py-2" />
      
      <hr className="my-4" />
      <h3 className="font-semibold text-lg">Bill of Materials</h3>
      {loading && <p className="text-gray-500">Loading raw materials...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {rawMaterials.map((material: any) => (
          <div key={material.id} className="grid grid-cols-3 items-center gap-3">
            <label className="col-span-2 text-gray-700">{material.name} ({material.unit})</label>
            <input
              type="number"
              placeholder="Qty"
              value={bom[material.id] || ""}
              onChange={(e) => handleBomChange(material.id, e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        ))}
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <CancelButton onClick={onClose} />
        <button type="submit" className="bg-primary-600 text-grey px-4 py-2 rounded">Save</button>
      </div>
    </form>
  );
}