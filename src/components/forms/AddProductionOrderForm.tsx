import React, { useState } from "react";
import { useProductionOrders } from "../../hooks/useProductionOrders";
import { useWorkers } from "../../hooks/useWorkers";
import { useReadyBelts } from "../../hooks/useReadyBelts";
import CancelButton from "../ui/CancelButton.tsx";

export default function AddProductionOrderForm({ onClose }: { onClose: () => void }) {
  const { addProductionOrder } = useProductionOrders();
  const { readyBelts, loading: loadingFg } = useReadyBelts();
  const { workers, loading: loadingWorkers } = useWorkers();

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

    const selectedWorker = workers.find(w => w.id === form.assignedWorkerId);
    const selectedBelt = readyBelts.find(b => b.id === form.finishedGoodId);

    if (!selectedWorker || !selectedBelt) {
      alert("Invalid worker or belt selection");
      return;
    }

    try {
      await addProductionOrder({
        orderNumber: `PO-${Date.now()}`,
        workerId: form.assignedWorkerId,
        workerName: selectedWorker.name,
        beltType: selectedBelt.type,
        quantity: Number(form.quantity) || 0,
        status: 'pending',
        startDate: new Date(),
        notes: ''
      });
      onClose();
    } catch (error) {
      console.error('Failed to create production order:', error);
      alert('Failed to create production order');
    }
  };

  if (loadingFg || loadingWorkers) {
    return <div className="p-4 text-center">Loading options...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Create Production Order</h2>
      <select name="finishedGoodId" value={form.finishedGoodId} onChange={handleChange} className="border rounded w-full px-3 py-2" required>
        <option value="" disabled>Select Belt Type</option>
        {readyBelts.map(belt => (
          <option key={belt.id} value={belt.id}>
            {belt.type} - {belt.size}
          </option>
        ))}
      </select>
      <select name="assignedWorkerId" value={form.assignedWorkerId} onChange={handleChange} className="border rounded w-full px-3 py-2" required>
        <option value="" disabled>Select Contract Worker</option>
        {contractWorkers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
      </select>
      <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} className="border rounded w-full px-3 py-2" min="1" required />
      
      <div className="flex justify-end gap-3 pt-2">
        <CancelButton onClick={onClose} />
        <button type="submit" className="bg-primary-600 text-grey px-4 py-2 rounded">Create Order</button>
      </div>
    </form>
  );
}