import React, { useState, useMemo } from "react";
import { db } from "../../firebase/firebaseConfig.ts";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import CancelButton from "../ui/CancelButton.tsx";

// 1. Update the type to allow an empty string for quantity
type OrderItem = {
  finishedGoodId: string;
  quantity: number | ''; // Can be a number or an empty string
};

export default function AddSalesOrderForm({ onClose }: { onClose: () => void }) {
  const { data: customers, loading: loadingCust } = useFirestoreCollection("customers");
  const { data: finishedGoods, loading: loadingFg } = useFirestoreCollection("finishedGoods");
  
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<OrderItem[]>([{ finishedGoodId: "", quantity: 1 }]);

  const totalAmount = useMemo(() => {
    return items.reduce((total, item) => {
      const product = finishedGoods.find((fg: any) => fg.id === item.finishedGoodId);
      const price = product?.pricePerUnit || 0;
      // 2. Safely convert quantity to a number for calculation
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  }, [items, finishedGoods]);

  // 3. Simplify the handler to accept the raw string from the input
  const handleItemChange = (index: number, field: keyof OrderItem, value: string) => {
    const newItems = [...items];
    if (field === 'quantity') {
      // Allow empty string, otherwise convert to number
      newItems[index] = { ...newItems[index], quantity: value === '' ? '' : parseInt(value, 10) };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { finishedGoodId: "", quantity: 1 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || items.some(i => !i.finishedGoodId || i.quantity === '')) {
        alert("Please select a customer and ensure all items have a product and quantity.");
        return;
    }

    await addDoc(collection(db, "salesOrders"), {
      customerId,
      // 4. Ensure quantity is a number before saving to the database
      items: items.map(item => ({
        ...item,
        quantity: Number(item.quantity) || 0,
      })),
      totalAmount,
      status: "Open",
      history: [],
      createdAt: serverTimestamp(),
    });
    onClose();
  };

  if (loadingCust || loadingFg) {
    return <div className="p-4 text-center">Loading options...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">Create Sales Order</h2>
      
      <select value={customerId} onChange={e => setCustomerId(e.target.value)} className="border rounded w-full px-3 py-2" required>
        <option value="" disabled>Select Customer</option>
        {customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-2 p-2 border rounded">
            <select value={item.finishedGoodId} onChange={e => handleItemChange(idx, "finishedGoodId", e.target.value)} className="border rounded w-full px-3 py-2" required>
              <option value="" disabled>Select Product</option>
              {finishedGoods.map((fg: any) => <option key={fg.id} value={fg.id}>{fg.name} (₹{fg.pricePerUnit})</option>)}
            </select>
            {/* The value can now correctly be an empty string, allowing the user to type freely */}
            <input type="number" value={item.quantity} onChange={e => handleItemChange(idx, "quantity", e.target.value)} className="border rounded px-3 py-2 w-24" min="1" required />
            {items.length > 1 && (
              <button type="button" onClick={() => removeItem(idx)} className="bg-red-500 text-white rounded px-2 py-1 text-xs">Remove</button>
            )}
          </div>
        ))}
      </div>

      <button type="button" onClick={addItem} className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors">+ Add Item</button>

      <div className="text-right font-bold text-lg pt-2">
        Total: ₹{totalAmount.toFixed(2)}
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <CancelButton onClick={onClose} />
        <button type="submit" className="bg-primary-600 text-grey px-4 py-2 rounded">Save Order</button>
      </div>
    </form>
  );
}