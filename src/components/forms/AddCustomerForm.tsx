import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig.ts";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import CancelButton from "../ui/CancelButton.tsx";
export default function AddCustomerForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return; // Basic validation

    await addDoc(collection(db, "customers"), {
      ...form,
      pendingAmount: 0,
      createdAt: serverTimestamp(),
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Add Customer</h2>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border rounded w-full px-3 py-2" required />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border rounded w-full px-3 py-2" required />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="border rounded w-full px-3 py-2" />
      <textarea name="notes" placeholder="Notes (e.g., special instructions, GSTIN)" value={form.notes} onChange={handleChange} className="border rounded w-full px-3 py-2" rows={3} />
      
      {/* 2. Add action buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <CancelButton onClick={onClose} />
        <button type="submit" className="bg-primary-600 text-grey px-4 py-2 rounded">Save</button>
      </div>
    </form>
  );
}