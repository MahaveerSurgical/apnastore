import React, { useState } from "react";

import CancelButton from "../ui/CancelButton.tsx";
import PrimaryButton from "../ui/PrimaryButton.tsx";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function AddWorkerForm({ onClose }: { onClose: () => void }) {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "Contract",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: form.name });

      // Create worker document with auth UID
      await setDoc(doc(db, 'workers', user.uid), {
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
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Add Worker</h2>
      {error && <div className="text-red-500">{error}</div>}
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="border rounded w-full px-3 py-2"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border rounded w-full px-3 py-2"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
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
        <option value="Delivery">Delivery</option>
      </select>

      <div className="flex justify-end gap-3 pt-2">
        <CancelButton onClick={onClose} disabled={loading} />
        <PrimaryButton type="submit" variant="primary" disabled={loading}>
          {loading ? 'Creating Account...' : 'Save'}
        </PrimaryButton>
      </div>
    </form>
  );
}