import React, { useState } from "react";
import { useRawMaterials } from "../../hooks/useRawMaterials";
import CancelButton from "../ui/CancelButton.tsx";

export default function AddRawMaterialForm({ onClose }: { onClose: () => void }) {
  const { addRawMaterial } = useRawMaterials();
  
  const [form, setForm] = useState({
    name: "",
    type: "",
    unit: "kg",
    quantity: 0 as number | '',
    minQuantity: 10 as number | '',
    supplier: "",
    price: 0 as number | '',
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
    if (!form.name || !form.type) return;

    try {
      await addRawMaterial({
        ...form,
        quantity: Number(form.quantity) || 0,
        minQuantity: Number(form.minQuantity) || 0,
        price: Number(form.price) || 0
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
      <input name="type" placeholder="Material Type" value={form.type} onChange={handleChange} className="border rounded w-full px-3 py-2" required />
      <select name="unit" value={form.unit} onChange={handleChange} className="border rounded w-full px-3 py-2">
        <option value="kg">Kilograms (kg)</option>
        <option value="pcs">Pieces (pcs)</option>
        <option value="m">Meters (m)</option>
      </select>
      <input name="quantity" type="number" placeholder="Current Quantity" value={form.quantity} onChange={handleChange} className="border rounded w-full px-3 py-2" />
      <input name="minQuantity" type="number" placeholder="Minimum Quantity" value={form.minQuantity} onChange={handleChange} className="border rounded w-full px-3 py-2" />
      <input name="supplier" placeholder="Supplier Name" value={form.supplier} onChange={handleChange} className="border rounded w-full px-3 py-2" />
      <input name="price" type="number" placeholder="Price per Unit" value={form.price} onChange={handleChange} className="border rounded w-full px-3 py-2" />
      <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} className="border rounded w-full px-3 py-2" rows={3} />
      
      <div className="flex justify-end gap-3 pt-2">
        <CancelButton onClick={onClose} />
        <button type="submit" className="bg-primary-600 text-grey px-4 py-2 rounded">Save</button>
      </div>
    </form>
  );
}