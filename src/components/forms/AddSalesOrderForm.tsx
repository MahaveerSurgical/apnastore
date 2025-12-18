import { useState, useMemo } from "react";
import { useSalesOrders } from "../../hooks/domain/useSalesOrders.ts";
import { useCustomers } from "../../hooks/domain/useCustomers.ts";
import { useReadyBelts } from "../../hooks/domain/useReadyBelts.ts";
import SearchableDropdown from "../ui/SearchableDropdown.tsx";
import FormLayout from "../layout/FormLayout.tsx";
import PrimaryButton from "../ui/PrimaryButton.tsx";

type OrderItem = {
  readyBeltsId: string;
  type: string;
  size: string;
  quantity: number | "";
  price: number;
};

export default function AddSalesOrderForm({ onClose }: { onClose: () => void }) {
  const { addSalesOrder } = useSalesOrders();
  const { customers, loading: loadingCust } = useCustomers();
  const { readyBelts, loading: loadingRb } = useReadyBelts();

  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<OrderItem[]>([
    { readyBeltsId: "", type: "", size: "", quantity: 0, price: 0 },
  ]);

  const totalAmount = useMemo(() => {
    return items.reduce((total, item) => {
      const belt = readyBelts.find((b) => b.id === item.readyBeltsId);
      const price = belt?.price || 0;
      const quantity = Number(item.quantity) || 0;
      return total + price * quantity;
    }, 0);
  }, [items, readyBelts]);

  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    value: string
  ) => {
    const newItems = [...items];
    if (field === "quantity") {
      newItems[index] = {
        ...newItems[index],
        quantity: value === "" ? "" : parseInt(value, 0),
      };
    } else if (field === "readyBeltsId") {
      const selectedBelt = readyBelts.find((b) => b.id === value);
      if (selectedBelt) {
        newItems[index] = {
          ...newItems[index],
          readyBeltsId: value,
          type: selectedBelt.type,
          size: selectedBelt.size,
          price: selectedBelt.price,
        };
      } else {
        newItems[index] = {
          ...newItems[index],
          readyBeltsId: value,
          type: "",
          size: "",
          price: 0,
        };
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const addItem = () =>
    setItems([
      ...items,
      { readyBeltsId: "", type: "", size: "", quantity: 0, price: 0 },
    ]);

  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const handleSave = async () => {
    if (!customerId || items.some((i) => !i.readyBeltsId || i.quantity === "")) {
      alert("Please select a customer and ensure all items have valid entries.");
      return;
    }

    const selectedCustomer = customers.find((c) => c.id === customerId);
    if (!selectedCustomer) {
      alert("Invalid customer selection");
      return;
    }

    await addSalesOrder({
      orderNumber: `SO-${Date.now()}`,
      customerId,
      customerName: selectedCustomer.name,
      items: items.map((item) => ({
        readyBeltsId: item.readyBeltsId,
        type: item.type,
        size: item.size,
        quantity: Number(item.quantity) || 0,
        price: item.price,
      })),
      status: "pending",
      totalAmount,
      paidAmount: 0,
      dueAmount: totalAmount,
      deliveryDate: new Date(),
    });

    onClose();
  };

  if (loadingCust || loadingRb) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <FormLayout title="Add Sales Order" onClose={onClose} onSave={handleSave}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-5"
      >
        {/* Customer Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Customer Information
          </h3>
          <hr className="mt-1 border-gray-200" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Customer <span className="text-red-500">*</span>
          </label>
          <SearchableDropdown
            options={customers
              .filter((c) => c.id)
              .map((c) => ({ id: c.id!, label: c.name }))}
            value={customerId}
            onChange={setCustomerId}
            placeholder="Select customer"
            required
          />
        </div>

        {/* Order Items Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mt-6">
            Order Items
          </h3>
          <hr className="mt-1 border-gray-200" />
        </div>

        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-3 border border-gray-200 rounded-lg space-y-3 bg-gray-50"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Select Belt <span className="text-red-500">*</span>
              </label>
              <SearchableDropdown
                options={readyBelts
                  .filter((belt) => belt.id)
                  .map((belt) => ({
                    id: belt.id!,
                    label: `${belt.type} - ${belt.size} (₹${belt.price})`,
                  }))}
                value={item.readyBeltsId}
                onChange={(value) => handleItemChange(idx, "readyBeltsId", value)}
                placeholder="Select belt"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col w-1/2">
                <label className="text-sm font-medium text-gray-700">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(idx, "quantity", e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  min="1"
                  required
                />
              </div>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-red-600 text-sm font-medium hover:underline mt-6"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        <PrimaryButton
          type="button"
          variant="success"
          onClick={addItem}
          className="mt-2"
        >
          + Add Another Item
        </PrimaryButton>

        <div className="text-right font-semibold text-lg text-gray-800 pt-4">
          Total Amount: ₹{totalAmount.toFixed(2)}
        </div>
      </form>
    </FormLayout>
  );
}