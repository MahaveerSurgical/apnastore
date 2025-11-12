import React, { useState, useMemo } from "react";
import { useSalesOrders } from "../../hooks/domain/useSalesOrders.ts";
import { useCustomers } from "../../hooks/domain/useCustomers.ts";
import { useReadyBelts } from "../../hooks/domain/useReadyBelts.ts";
import CancelButton from "../ui/CancelButton.tsx";
import PrimaryButton from "../ui/PrimaryButton.tsx";
import SearchableDropdown from "../ui/SearchableDropdown";

type OrderItem = {
  readyBeltsId: string;
  type: string;
  size: string;
  quantity: number | '';
  price: number;
};

export default function AddSalesOrderForm({ onClose }: { onClose: () => void }) {
  const { addSalesOrder } = useSalesOrders();
  const { customers, loading: loadingCust } = useCustomers();
  const { readyBelts, loading: loadingRb } = useReadyBelts();
  
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<OrderItem[]>([{readyBeltsId: "", type: "",size:"", quantity: 1, price: 0 }]);


  const totalAmount = useMemo(() => {
    return items.reduce((total, item) => {
      const belt = readyBelts.find(b => b.id === item.readyBeltsId);
      const price = belt?.price || 0;
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  }, [items, readyBelts]);

  // Handle item changes - when belt is selected, extract type, size, and price from readyBelt
  const handleItemChange = (index: number, field: keyof OrderItem, value: string) => {
    const newItems = [...items];
    if (field === 'quantity') {
      // Allow empty string, otherwise convert to number
      newItems[index] = { ...newItems[index], quantity: value === '' ? '' : parseInt(value, 10) };
    } else if (field === 'readyBeltsId') {
      // When a belt is selected, extract its type, size, and price
      const selectedBelt = readyBelts.find(b => b.id === value);
      if (selectedBelt) {
        newItems[index] = {
          ...newItems[index],
          readyBeltsId: value,
          type: selectedBelt.type,
          size: selectedBelt.size,
          price: selectedBelt.price
        };
      } else {
        newItems[index] = { ...newItems[index], readyBeltsId: value, type: "", size: "", price: 0 };
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { readyBeltsId: "",type: "",size:"", quantity: 1, price: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || items.some(i => !i.readyBeltsId || i.quantity === '')) {
        alert("Please select a customer and ensure all items have a belt selected and quantity.");
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
          readyBeltsId: item.readyBeltsId,
          type: item.type,
          size: item.size,
          quantity: Number(item.quantity) || 0,
          price: item.price
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

  if (loadingCust || loadingRb) {
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
                value={item.readyBeltsId}
                onChange={(value) => handleItemChange(idx, "readyBeltsId", value)}
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