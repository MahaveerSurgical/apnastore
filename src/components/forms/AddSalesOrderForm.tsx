import React, { useState, useMemo } from "react";
import { useSalesOrders } from "../../hooks/useSalesOrders";
import { useCustomers } from "../../hooks/useCustomers";
import { useReadyBelts } from "../../hooks/useReadyBelts";
import CancelButton from "../ui/CancelButton.tsx";
import PrimaryButton from "../ui/PrimaryButton.tsx";
import SearchableDropdown from "../ui/SearchableDropdown";

type OrderItem = {
  beltType: string;
  quantity: number | '';
  price: number;
};

export default function AddSalesOrderForm({ onClose }: { onClose: () => void }) {
  const { addSalesOrder } = useSalesOrders();
  const { customers, loading: loadingCust } = useCustomers();
  const { readyBelts, loading: loadingFg } = useReadyBelts();
  
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<OrderItem[]>([{ beltType: "", quantity: 1, price: 0 }]);


  const totalAmount = useMemo(() => {
    return items.reduce((total, item) => {
      const belt = readyBelts.find(b => b.id === item.beltType);
      const price = belt?.price || 0;
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  }, [items, readyBelts]);

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

  const addItem = () => setItems([...items, { beltType: "", quantity: 1, price: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || items.some(i => !i.beltType || i.quantity === '')) {
        alert("Please select a customer and ensure all items have a belt type and quantity.");
        return;
    }

    const selectedCustomer = customers.find(c => c.id === customerId);
    if (!selectedCustomer) {
        alert("Invalid customer selection");
        return;
    }

    try {
      await addSalesOrder({
        orderNumber: `SO-${Date.now()}`,
        customerId,
        customerName: selectedCustomer.name,
        items: items.map(item => ({
          ...item,
          quantity: Number(item.quantity) || 0,
        })),
        status: 'pending',
        totalAmount,
        paidAmount: 0,
        dueAmount: totalAmount,
        deliveryDate: new Date()
      });
      onClose();
    } catch (error) {
      console.error('Failed to create sales order:', error);
      alert('Failed to create sales order');
    }
  };

  if (loadingCust || loadingFg) {
    return <div className="p-4 text-center">Loading options...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">Create Sales Order</h2>
      
      <div className="space-y-2">
        <SearchableDropdown
          options={customers.filter(c => c.id).map(c => ({ id: c.id!, label: c.name }))}
          value={customerId}
          onChange={setCustomerId}
          placeholder="Select Customer"
          required
        />
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col space-y-2 p-2 border rounded">
            <div className="flex-1">
              <SearchableDropdown
                options={readyBelts.filter(belt => belt.id).map(belt => ({ 
                  id: belt.id!, 
                  label: `${belt.type} - ${belt.size} (₹${belt.price})`
                }))}
                value={item.beltType}
                onChange={(value) => handleItemChange(idx, "beltType", value)}
                placeholder="Select Belt Type"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                value={item.quantity} 
                onChange={e => handleItemChange(idx, "quantity", e.target.value)} 
                className="border rounded px-3 py-2 w-24" 
                min="1" 
                required 
                placeholder="Qty"
              />
              {items.length > 1 && (
                <PrimaryButton 
                  onClick={() => removeItem(idx)} 
                  variant="danger" 
                  className="p-0 text-xs w-auto h-auto leading-none"
                >
                  Remove
                </PrimaryButton>
              )}
            </div>
          </div>
        ))}
      </div>

      <PrimaryButton variant="success" onClick={addItem} children="+ Add Item"/>

      <div className="text-right font-bold text-lg pt-2">
        Total: ₹{totalAmount.toFixed(2)}
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <CancelButton onClick={onClose} />
        <PrimaryButton type="submit" variant="primary">Save</PrimaryButton>
      </div>
    </form>
  );
}