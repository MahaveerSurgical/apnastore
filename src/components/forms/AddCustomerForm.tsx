import React, { useState } from "react";
import { useCustomers } from "../../hooks/domain/useCustomers";
import FormLayout from "../layout/FormLayout";

export default function AddCustomerForm({ onClose }: { onClose: () => void }) {
  const { addCustomer } = useCustomers();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.name || !form.phone) return;

    await addCustomer({
      ...form,
      pendingAmount: 0,
    });
    onClose();
  };

  return (
    <FormLayout
      title="Add Customer"
      onClose={onClose}
      onSave={handleSave}
    >
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }} className="space-y-5">
        {/* Section Title */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Customer Information
          </h3>
          <hr className="mt-1 border-gray-200" />
        </div>

        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Customer Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter customer name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            type="tel"
            inputMode="numeric"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Address */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Address</label>
          <input
            name="address"
            placeholder="Enter address"
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Notes / GSTIN
          </label>
          <textarea
            name="notes"
            placeholder="Enter notes or GSTIN"
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