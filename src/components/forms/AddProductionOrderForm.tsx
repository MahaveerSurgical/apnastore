import React, { useState } from "react";
import { useProductionOrders } from "../../hooks/domain/useProductionOrders.ts";
import { useWorkers } from "../../hooks/domain/useWorkers.ts";
import { useReadyBelts } from "../../hooks/domain/useReadyBelts.ts";
import CancelButton from "../ui/CancelButton.tsx";
import PrimaryButton from "../ui/PrimaryButton.tsx";

export default function AddProductionOrderForm({ onClose }: { onClose: () => void }) {
  const { addProductionOrder } = useProductionOrders();
  const { readyBelts, loading: loadingFg } = useReadyBelts();
  const { workers, loading: loadingWorkers } = useWorkers();

  interface ProductionOrderForm {
    readyBeltsId: string;
    workerId: string;
    quantity: number | '';
    pricePerUnit: number | '';
  }

  const [form, setForm] = useState<ProductionOrderForm>({
    readyBeltsId: "",
    workerId: "",
    quantity: 1,
    pricePerUnit: 0,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.readyBeltsId || !form.workerId || form.quantity === '' || form.pricePerUnit === '') {
      alert("Please fill out all fields and enter valid quantity and price.");
      return;
    }

    const selectedWorker = workers.find(w => w.id === form.workerId || w.uid === form.workerId);
    const selectedBelt = readyBelts.find(b => b.id === form.readyBeltsId);

    if (!selectedWorker || !selectedBelt || !selectedBelt.id) {
      alert("Invalid worker or belt selection");
      return;
    }

    // Ensure we have a valid worker ID
    const workerId = selectedWorker.uid || selectedWorker.id;
    if (!workerId) {
      alert("Invalid worker ID");
      return;
    }

    const quantity = Number(form.quantity) || 0;
    const pricePerUnit = Number(form.pricePerUnit) || 0;

    try {
      await addProductionOrder({
        orderNumber: `PO-${Date.now()}`,
        workerId,
        workerName: selectedWorker.name,
        beltType: selectedBelt.type,
        readyBeltsId: selectedBelt.id,
        quantity,
        status: 'pending',
        startDate: new Date(),
        notes: '',
        pricePerUnit,
        totalAmount: quantity * pricePerUnit,
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
      <select name="readyBeltsId" value={form.readyBeltsId} onChange={handleChange} className="border rounded w-full px-3 py-2" required>
        <option value="" disabled>Select Belt Type</option>
        {readyBelts.map(belt => (
          <option key={belt.id} value={belt.id}>
            {belt.type} - {belt.size}
          </option>
        ))}
      </select>
      <select name="workerId" value={form.workerId} onChange={handleChange} className="border rounded w-full px-3 py-2" required>
        <option value="" disabled>Select Contract Worker</option>
        {contractWorkers.map(w => <option key={w.id} value={w.id || w.uid}>{w.name}</option>)}
      </select>
      <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} className="border rounded w-full px-3 py-2" min="1" required />
      <input name="pricePerUnit" type="number" placeholder="Price Per Unit" value={form.pricePerUnit} onChange={handleChange} className="border rounded w-full px-3 py-2" min="1" required />
      
      {form.quantity && form.pricePerUnit && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-700">Total Amount: ₹{Number(form.quantity) * Number(form.pricePerUnit)}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <CancelButton onClick={onClose} />
        <PrimaryButton type="submit" variant="primary">Save</PrimaryButton>
      </div>
    </form>
  );
}