import React, { useState } from "react";
import { useProductionOrders } from "../../hooks/domain/useProductionOrders.ts";
import { useWorkers } from "../../hooks/domain/useWorkers.ts";
import { useReadyBelts } from "../../hooks/domain/useReadyBelts.ts";
import FormLayout from "../layout/FormLayout.tsx";

export default function AddProductionOrderForm({ onClose }: { onClose: () => void }) {
  const { addProductionOrder } = useProductionOrders();
  const { readyBelts, loading: loadingFg } = useReadyBelts();
  const { workers, loading: loadingWorkers } = useWorkers();

  interface ProductionOrderForm {
    readyBeltsId: string;
    workerId: string;
    quantity: number | "";
    pricePerUnit: number | "";
  }

  const [form, setForm] = useState<ProductionOrderForm>({
    readyBeltsId: "",
    workerId: "",
    quantity: 1,
    pricePerUnit: 0,
  });

  const contractWorkers = workers.filter((worker: any) => worker.role === "Contract");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setForm({ ...form, [name]: value === "" ? "" : parseInt(value, 10) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!form.readyBeltsId || !form.workerId || form.quantity === "" || form.pricePerUnit === "") {
      alert("Please fill out all fields and enter valid quantity and price.");
      return;
    }

    const selectedWorker = workers.find((w) => w.id === form.workerId || w.uid === form.workerId);
    const selectedBelt = readyBelts.find((b) => b.id === form.readyBeltsId);

    if (!selectedWorker || !selectedBelt || !selectedBelt.id) {
      alert("Invalid worker or belt selection");
      return;
    }

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
        status: "pending",
        startDate: new Date(),
        notes: "",
        pricePerUnit,
        totalAmount: quantity * pricePerUnit,
      });
      onClose();
    } catch (error) {
      console.error("Failed to create production order:", error);
      alert("Failed to create production order");
    }
  };

  if (loadingFg || loadingWorkers) {
    return <div className="p-4 text-center">Loading options...</div>;
  }

  return (
    <FormLayout title="Add Production Order" onClose={onClose} onSave={handleSave}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-5"
      >
        {/* Section Title */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Order Details
          </h3>
          <hr className="mt-1 border-gray-200" />
        </div>

        {/* Belt Type */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Belt Type <span className="text-red-500">*</span>
          </label>
          <select
            name="readyBeltsId"
            value={form.readyBeltsId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="" disabled>
              Select Belt Type
            </option>
            {readyBelts.map((belt) => (
              <option key={belt.id} value={belt.id}>
                {belt.type} - {belt.size}
              </option>
            ))}
          </select>
        </div>

        {/* Worker */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Contract Worker <span className="text-red-500">*</span>
          </label>
          <select
            name="workerId"
            value={form.workerId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="" disabled>
              Select Contract Worker
            </option>
            {contractWorkers.map((w) => (
              <option key={w.id} value={w.id || w.uid}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity + Price */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              name="quantity"
              type="number"
              placeholder="Enter quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              min="1"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Price per Unit <span className="text-red-500">*</span>
            </label>
            <input
              name="pricePerUnit"
              type="number"
              placeholder="Enter price"
              value={form.pricePerUnit}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              min="1"
              required
            />
          </div>
        </div>

        {/* Total */}
        {form.quantity && form.pricePerUnit ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-700 text-center">
            <p className="font-medium text-gray-800">
              Total Amount: ₹{Number(form.quantity) * Number(form.pricePerUnit)}
            </p>
          </div>
        ) : null}
      </form>
    </FormLayout>
  );
}