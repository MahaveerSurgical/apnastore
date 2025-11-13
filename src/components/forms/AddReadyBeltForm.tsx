import React, { useState } from "react";
import { useReadyBelts } from "../../hooks/domain/useReadyBelts";
import { useRawMaterials } from "../../hooks/domain/useRawMaterials";
import FormLayout from "../layout/FormLayout";

interface BOMItem {
  quantity: number | "";
  materialName: string;
  unit: string;
}

interface BOMState {
  [materialId: string]: BOMItem;
}

export default function AddReadyBeltForm({ onClose }: { onClose: () => void }) {
  const { addReadyBelt } = useReadyBelts();
  const { rawMaterials, loading } = useRawMaterials();

  const [form, setForm] = useState({
    type: "",
    size: "",
    quantity: 0 as number | "",
    minQuantity: 10 as number | "",
    price: 0 as number | "",
    notes: "",
  });

  const [bom, setBom] = useState<BOMState>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setForm({ ...form, [name]: value === "" ? "" : parseInt(value, 10) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleBomChange = (materialId: string, quantity: string) => {
    const material = rawMaterials.find((m) => m.id === materialId);
    if (!material) return;

    setBom((prev) => ({
      ...prev,
      [materialId]: {
        quantity: quantity === "" ? "" : parseInt(quantity, 10),
        materialName: material.name,
        unit: material.unit,
      },
    }));
  };

  const handleSave = async () => {
    if (!form.type || !form.size) {
      alert("Please fill all required fields");
      return;
    }

    const billOfMaterials = Object.entries(bom).reduce(
      (acc, [materialId, item]) => {
        if (
          item.quantity &&
          typeof item.quantity === "number" &&
          item.quantity > 0
        ) {
          acc[materialId] = {
            quantity: item.quantity,
            materialName: item.materialName,
            unit: item.unit,
          };
        }
        return acc;
      },
      {} as { [key: string]: { quantity: number; materialName: string; unit: string } }
    );

    await addReadyBelt({
      ...form,
      currentStock: Number(form.quantity) || 0,
      minQuantity: Number(form.minQuantity) || 0,
      price: Number(form.price) || 0,
      billOfMaterials,
    });

    onClose();
  };

  if (loading) {
    return <div className="p-4 text-center">Loading materials...</div>;
  }

  return (
    <FormLayout title="Add Ready Belt" onClose={onClose} onSave={handleSave}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6"
      >
        {/* Section Title */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Ready Belt Information
          </h3>
          <hr className="mt-1 border-gray-200" />
        </div>

        {/* Belt Type */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Belt Type <span className="text-red-500">*</span>
          </label>
          <input
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="Enter belt type"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Belt Size */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Belt Size <span className="text-red-500">*</span>
          </label>
          <input
            name="size"
            value={form.size}
            onChange={handleChange}
            placeholder="Enter belt size"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Quantities & Price */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Initial Quantity
            </label>
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g. 20"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Minimum Quantity
            </label>
            <input
              name="minQuantity"
              type="number"
              value={form.minQuantity}
              onChange={handleChange}
              placeholder="e.g. 10"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="col-span-2 space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Price Per Unit
            </label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 500"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any notes or special instructions"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            rows={2}
          />
        </div>

        {/* Bill of Materials */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mt-6">
            Bill of Materials
          </h3>
          <hr className="mt-1 border-gray-200 mb-2" />

          <div className="space-y-2">
            {rawMaterials.map((material) => (
              <div
                key={material.id}
                className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200"
              >
                <span className="text-sm text-gray-700 flex-grow">
                  {material.name} ({material.unit})
                </span>
                <input
                  type="number"
                  placeholder="Qty"
                  value={bom[material.id || ""]?.quantity ?? ""}
                  onChange={(e) =>
                    handleBomChange(material.id || "", e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-2 py-1 w-20 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  min="0"
                />
              </div>
            ))}
          </div>
        </div>
      </form>
    </FormLayout>
  );
}