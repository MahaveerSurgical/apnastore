import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig.ts";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import CancelButton from "../ui/CancelButton.tsx";
import PrimaryButton from "../ui/PrimaryButton.tsx";

export default function AddRawMaterialForm({ onClose }: { onClose: () => void }) {
  // 1. State can now hold numbers or empty strings for number fields
  const [form, setForm] = useState({
    name: "",
    unit: "kg",
    currentStock: 0 as number | '',
    reorderPoint: 10 as number | '',
  });

  // 2. Updated handler for both text and number inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setForm({ ...form, [name]: value === '' ? '' : parseInt(value, 10) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "rawMaterials"), {
      ...form,
      // 3. Convert back to number on save for data integrity
      currentStock: Number(form.currentStock) || 0,
      reorderPoint: Number(form.reorderPoint) || 0,
      createdAt: serverTimestamp()
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Add Raw Material</h2>
      <input name="name" placeholder="Material Name" value={form.name} onChange={handleChange} className="border rounded w-full px-3 py-2" required />
      <select name="unit" value={form.unit} onChange={handleChange} className="border rounded w-full px-3 py-2">
        <option value="kg">kg</option>
        <option value="meters">meters</option>
        <option value="pieces">pieces</option>
      </select>
      <input name="currentStock" type="number" placeholder="Current Stock" value={form.currentStock} onChange={handleChange} className="border rounded w-full px-3 py-2" />
      <input name="reorderPoint" type="number" placeholder="Reorder Point" value={form.reorderPoint} onChange={handleChange} className="border rounded w-full px-3 py-2" />
      
      <div className="flex justify-end gap-3 pt-2">
        <CancelButton onClick={onClose} />
        <PrimaryButton type="submit" variant="primary">Save</PrimaryButton>
      </div>
    </form>
  );
}