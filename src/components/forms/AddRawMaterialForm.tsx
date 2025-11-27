import React, { useState } from "react";
import { useRawMaterials } from "../../hooks/domain/useRawMaterials.ts";
import FormLayout from "../layout/FormLayout.tsx";

export default function AddRawMaterialForm({ onClose }: { onClose: () => void }) {
  const { addRawMaterial } = useRawMaterials();

  const [form, setForm] = useState({
    name: "",
    unit: "kg",
    currentStock: 0 as number | "",
    reorderPoint: 0 as number | "",
    supplier: "",
    pricerm: 0 as number | "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setForm({ ...form, [name]: value === "" ? "" : parseFloat(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!form.name) return;

    try {
      await addRawMaterial({
        ...form,
        currentStock: Number(form.currentStock) || 0,
        reorderPoint: Number(form.reorderPoint) || 0,
        price: Number(form.pricerm) || 0,
      });
      onClose();
    } catch (error) {
      console.error("Failed to add raw material:", error);
      alert("Failed to add raw material");
    }
  };

  return (
    <FormLayout title="Add Raw Material" onClose={onClose} onSave={handleSave}>
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
            Material Information
          </h3>
          <hr className="mt-1 border-gray-200" />
        </div>

        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Material Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            placeholder="Enter material name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Unit */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Unit</label>
          <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="kg">Kilograms (kg)</option>
            <option value="pcs">Pieces (pcs)</option>
            <option value="m">Meters (m)</option>
          </select>
        </div>

        {/* Quantity and Reorder Point */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Current Quantity</label>
            <input
              name="currentStock"
              type="number"
              placeholder="Enter current stock"
              value={form.currentStock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              min="0"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Minimum Quantity</label>
            <input
              name="reorderPoint"
              type="number"
              placeholder="Enter minimum stock"
              value={form.reorderPoint}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              min="0"
            />
          </div>
        </div>

        {/* Supplier */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Supplier Name</label>
          <input
            name="supplier"
            placeholder="Enter supplier name"
            value={form.supplier}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Price per Unit */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Price per Unit</label>
          <input
            name="pricerm"
            type="number"
            step="0.01"
            placeholder="Enter price per unit"
            value={form.pricerm}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            min="0"
          />
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            placeholder="Enter notes or remarks"
            value={form.notes}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            rows={3}
          />
        </div>
      </form>
    </FormLayout>
  );
}