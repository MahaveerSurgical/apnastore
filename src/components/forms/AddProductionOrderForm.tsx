import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig.ts";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import CancelButton from "../ui/CancelButton.tsx";
import PrimaryButton from "../ui/PrimaryButton.tsx";

export default function AddProductionOrderForm({ onClose }: { onClose: () => void }) {
  const { data: finishedGoods, loading: loadingFg } = useFirestoreCollection("finishedGoods");
  const { data: workers, loading: loadingWorkers } = useFirestoreCollection("workers");

  const [form, setForm] = useState({
    finishedGoodId: "",
    assignedWorkerId: "",
    quantity: 1 as number | '',
  });
  
  const contractWorkers = workers.filter((worker: any) => worker.role === 'Contract');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setForm({ ...form, [name]: value === '' ? '' : parseInt(value, 10) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // The fix is here: Changed React.Event to React.FormEvent
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.finishedGoodId || !form.assignedWorkerId || form.quantity === '') {
      alert("Please fill out all fields and enter a valid quantity.");
      return;
    }

    await addDoc(collection(db, "productionOrders"), {
      ...form,
      quantity: Number(form.quantity) || 0,
      status: "Pending",
      createdAt: serverTimestamp(),
    });
    onClose();
  };

  if (loadingFg || loadingWorkers) {
    return <div className="p-4 text-center">Loading options...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Create Production Order</h2>
      <select name="finishedGoodId" value={form.finishedGoodId} onChange={handleChange} className="border rounded w-full px-3 py-2" required>
        <option value="" disabled>Select Finished Good</option>
        {finishedGoods.map(fg => <option key={fg.id} value={fg.id}>{fg.name}</option>)}
      </select>
      <select name="assignedWorkerId" value={form.assignedWorkerId} onChange={handleChange} className="border rounded w-full px-3 py-2" required>
        <option value="" disabled>Select Contract Worker</option>
        {contractWorkers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
      </select>
      <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} className="border rounded w-full px-3 py-2" min="1" required />
      
      <div className="flex justify-end gap-3 pt-2">
        <CancelButton onClick={onClose} />
        <PrimaryButton type="submit" variant="primary">Save</PrimaryButton>
      </div>
    </form>
  );
}