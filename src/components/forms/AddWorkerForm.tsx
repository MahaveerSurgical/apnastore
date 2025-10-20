import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig.ts";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import CancelButton from "../ui/CancelButton.tsx";
import PrimaryButton from "../ui/PrimaryButton.tsx";

export default function AddWorkerForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "Contract",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

    try {
      const docRef = await addDoc(collection(db, "workers"), {
        ...form,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "workers", docRef.id), {
        uid: docRef.id,
      });

      onClose();
    } catch (error) {
      console.error("Error adding worker:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Add Worker</h2>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="border rounded w-full px-3 py-2"
        required
      />
      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        className="border rounded w-full px-3 py-2"
      />
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="border rounded w-full px-3 py-2"
      >
        <option value="Contract">Contract</option>
        <option value="Admin">Admin</option>
      </select>

      <div className="flex justify-end gap-3 pt-2">
        <CancelButton onClick={onClose} />
        <PrimaryButton type="submit" variant="primary">Save</PrimaryButton>
      </div>
    </form>
  );
}