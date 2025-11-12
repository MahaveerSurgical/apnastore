import React, { useState } from "react";
import { useRawMaterials } from "../../hooks/domain/useRawMaterials.ts";
import CancelButton from "../ui/CancelButton.tsx";
import PrimaryButton from "../ui/PrimaryButton.tsx";

export default function AddRawMaterialForm({ onClose }: { onClose: () => void }) {
  const { addRawMaterial } = useRawMaterials();
  
  const [form, setForm] = useState({
    name: "",
    unit: "kg",
    currentStock: 0 as number | '',
    reorderPoint: 10 as number | '',
    supplier: "",
    pricerm: 0 as number | '',
    notes: ""
  });

  // 2. Updated handler for both text and number inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setForm({ ...form, [name]: value === '' ? '' : parseInt(value, 10) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

    try {
      await addRawMaterial({
        ...form,
        currentStock: Number(form.currentStock) || 0,
        reoderPoint: Number(form.reorderPoint) || 0,
        price: Number(form.pricerm) || 0
      });
      onClose();
    } catch (error) {
      console.error('Failed to add raw material:', error);
      alert('Failed to add raw material');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Add Raw Material</h2>
      <input name="name" placeholder="Material Name" value={form.name} onChange={handleChange} className="border rounded w-full px-3 py-2" required />
      <select name="unit" value={form.unit} onChange={handleChange} className="border rounded w-full px-3 py-2">
        <option value="kg">Kilograms (kg)</option>
        <option value="pcs">Pieces (pcs)</option>
        <option value="m">Meters (m)</option>
      </select>
      <input name="currentStock" type="number" placeholder="Current Quantity" value={form.currentStock} onChange={handleChange} className="border rounded w-full px-3 py-2" />
      <input name="reorderPoint" type="number" placeholder="Minimum Quantity" value={form.reorderPoint} onChange={handleChange} className="border rounded w-full px-3 py-2" />
      <input name="supplier" placeholder="Supplier Name" value={form.supplier} onChange={handleChange} className="border rounded w-full px-3 py-2" />
      <input name="pricerm" type="number" placeholder="Price per Unit" value={form.pricerm} onChange={handleChange} className="border rounded w-full px-3 py-2" />
      <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} className="border rounded w-full px-3 py-2" rows={3} />
      
      <div className="flex justify-end gap-3 pt-2">
        <CancelButton onClick={onClose} />
        <PrimaryButton type="submit" variant="primary">Save</PrimaryButton>
      </div>
    </form>
  );
}