import React, { useState } from "react";
import { useReadyBelts } from "../../hooks/useReadyBelts";
import CancelButton from "../ui/CancelButton";
import PrimaryButton from "../ui/PrimaryButton.tsx";

export default function AddReadyBeltForm({ onClose }: { onClose: () => void }) {
  const { addReadyBelt } = useReadyBelts();

  const [form, setForm] = useState({
    type: "",
    size: "",
    quantity: 0 as number | '',
    minQuantity: 10 as number | '',
    price: 0 as number | '',
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setForm({ ...form, [name]: value === '' ? '' : parseInt(value, 10) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.size) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await addReadyBelt({
        ...form,
        quantity: Number(form.quantity) || 0,
        minQuantity: Number(form.minQuantity) || 0,
        price: Number(form.price) || 0
      });
      onClose();
    } catch (error) {
      console.error('Failed to add ready belt:', error);
      alert('Failed to add ready belt');
    }
  };



  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Add Ready Belt</h2>
      <input name="type" placeholder="Belt Type" value={form.type} onChange={handleChange} className="border rounded w-full px-3 py-2" required />
      <input name="size" placeholder="Belt Size" value={form.size} onChange={handleChange} className="border rounded w-full px-3 py-2" required />
      <input name="quantity" type="number" placeholder="Initial Quantity" value={form.quantity} onChange={handleChange} className="border rounded w-full px-3 py-2" />
      <input name="minQuantity" type="number" placeholder="Minimum Quantity" value={form.minQuantity} onChange={handleChange} className="border rounded w-full px-3 py-2" />
      <input name="price" type="number" placeholder="Price Per Unit" value={form.price} onChange={handleChange} className="border rounded w-full px-3 py-2" />
      <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} className="border rounded w-full px-3 py-2" rows={3} />
      
      <div className="flex justify-end gap-3 pt-2">
        <CancelButton onClick={onClose} />
        <button type="submit" className="bg-primary-600 text-grey px-4 py-2 rounded">Save</button>
      </div>
    </form>
  );

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Add Ready Belt</h2>
      <input 
        name="type" 
        placeholder="Belt Type" 
        value={form.type} 
        onChange={handleChange} 
        className="border rounded w-full px-3 py-2" 
        required 
      />
      <input 
        name="size" 
        placeholder="Belt Size" 
        value={form.size} 
        onChange={handleChange} 
        className="border rounded w-full px-3 py-2" 
        required 
      />
      <input 
        name="quantity" 
        type="number" 
        placeholder="Initial Quantity" 
        value={form.quantity} 
        onChange={handleChange} 
        className="border rounded w-full px-3 py-2" 
      />
      <input 
        name="minQuantity" 
        type="number" 
        placeholder="Minimum Quantity" 
        value={form.minQuantity} 
        onChange={handleChange} 
        className="border rounded w-full px-3 py-2" 
      />
      <input 
        name="price" 
        type="number" 
        placeholder="Price Per Unit" 
        value={form.price} 
        onChange={handleChange} 
        className="border rounded w-full px-3 py-2" 
      />
      <textarea 
        name="notes" 
        placeholder="Notes" 
        value={form.notes} 
        onChange={handleChange} 
        className="border rounded w-full px-3 py-2" 
        rows={3} 
      />
      
      <hr className="my-4" />
            <div className="flex justify-end gap-3 pt-2">
        <CancelButton onClick={onClose} />
        <PrimaryButton type="submit" variant="primary">Save</PrimaryButton>
      </div>
    </form>
  );
}