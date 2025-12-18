import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import FormLayout from "../layout/FormLayout.tsx";

export default function AddWorkerForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "Contract",
  });
  const [, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("All required fields must be filled");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: form.name });

      await setDoc(doc(db, "workers", user.uid), {
        uid: user.uid,
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        designation: form.role,
        salary: 0,
        joiningDate: serverTimestamp(),
        createdAt: serverTimestamp(),
      });

      onClose();
    } catch (err: any) {
      console.error("Error adding worker:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout title="Add Worker" onClose={onClose} onSave={handleSave}>
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
            Worker Information
          </h3>
          <hr className="mt-1 border-gray-200" />
        </div>

        {error && (
          <div className="text-red-500 text-sm font-medium bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}

        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter full name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Role */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="Contract">Contract</option>
            <option value="Admin">Admin</option>
            <option value="Delivery">Delivery</option>
          </select>
        </div>
      </form>
    </FormLayout>
  );
}