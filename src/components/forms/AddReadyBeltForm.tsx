import React, { useState } from "react";
import { useReadyBelts } from "../../hooks/useReadyBelts";
import { useRawMaterials } from "../../hooks/useRawMaterials";
import CancelButton from "../ui/CancelButton";
import PrimaryButton from "../ui/PrimaryButton";

interface BOMItem {
  quantity: number | '';
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
    quantity: 0 as number | '',
    minQuantity: 10 as number | '',
    price: 0 as number | '',
    notes: ""
  });

  const [bom, setBom] = useState<BOMState>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setForm({ ...form, [name]: value === '' ? '' : parseInt(value, 10) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleBomChange = (materialId: string, quantity: string) => {
    const material = rawMaterials.find(m => m.id === materialId);
    if (!material) return;

    setBom(prev => ({
      ...prev,
      [materialId]: {
        quantity: quantity === '' ? '' : parseInt(quantity, 10),
        materialName: material.name,
        unit: material.unit
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.size) {
      alert('Please fill all required fields');
      return;
    }

    // Convert BOM items to proper format and validate
    const billOfMaterials = Object.entries(bom).reduce((acc, [materialId, item]) => {
      if (item.quantity && typeof item.quantity === 'number' && item.quantity > 0) {
        acc[materialId] = {
          quantity: item.quantity,
          materialName: item.materialName,
          unit: item.unit
        };
      }
      return acc;
    }, {} as { [key: string]: { quantity: number; materialName: string; unit: string } });

    try {
      await addReadyBelt({
        ...form,
        quantity: Number(form.quantity) || 0,
        minQuantity: Number(form.minQuantity) || 0,
        price: Number(form.price) || 0,
        billOfMaterials
      });
      onClose();
    } catch (error) {
      console.error('Failed to add ready belt:', error);
      alert('Failed to add ready belt');
    }
  };



  if (loading) {
    return <div className="p-4 text-center">Loading materials...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="h-[calc(100vh-8rem)] flex flex-col p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add Ready Belt</h2>
      
      <div className="flex-1 overflow-y-auto pr-2">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="col-span-2">
            <input
              name="type"
              placeholder="Belt Type"
              value={form.type}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
              required
            />
          </div>
          <div className="col-span-2">
            <input
              name="size"
              placeholder="Belt Size"
              value={form.size}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
              required
            />
          </div>
          <div>
            <input
              name="quantity"
              type="number"
              placeholder="Initial Quantity"
              value={form.quantity}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
            />
          </div>
          <div>
            <input
              name="minQuantity"
              type="number"
              placeholder="Min Quantity"
              value={form.minQuantity}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
            />
          </div>
          <div className="col-span-2">
            <input
              name="price"
              type="number"
              placeholder="Price Per Unit"
              value={form.price}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
            />
          </div>
          <div className="col-span-2">
            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
              rows={2}
            />
          </div>
        </div>

        {/* Bill of Materials Section */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Bill of Materials</h3>
          <div className="space-y-2">
            {rawMaterials.map(material => (
              <div key={material.id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                <span className="flex-grow text-sm">
                  {material.name} ({material.unit})
                </span>
                <input
                  type="number"
                  placeholder="Qty"
                  value={bom[material.id || '']?.quantity ?? ''}
                  onChange={e => handleBomChange(material.id || '', e.target.value)}
                  className="border rounded px-2 py-1 w-20 text-sm"
                  min="0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4 border-t mt-4">
        <CancelButton onClick={onClose} />
        <PrimaryButton type="submit" variant="primary">Save</PrimaryButton>
      </div>
    </form>
  );

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Add Ready Belt</h2>
      <input 
        name="type" 
        placeholder="Belt Type" 
        value={form.type} 
        onChange={handleChange} 
        className="border rounded w-full px-3 py-2" 
        required 
      />
      <input 
        name="size" 
        placeholder="Belt Size" 
        value={form.size} 
        onChange={handleChange} 
        className="border rounded w-full px-3 py-2" 
        required 
      />
      <input 
        name="quantity" 
        type="number" 
        placeholder="Initial Quantity" 
        value={form.quantity} 
        onChange={handleChange} 
        className="border rounded w-full px-3 py-2" 
      />
      <input 
        name="minQuantity" 
        type="number" 
        placeholder="Minimum Quantity" 
        value={form.minQuantity} 
        onChange={handleChange} 
        className="border rounded w-full px-3 py-2" 
      />
      <input 
        name="price" 
        type="number" 
        placeholder="Price Per Unit" 
        value={form.price} 
        onChange={handleChange} 
        className="border rounded w-full px-3 py-2" 
      />
      <textarea 
        name="notes" 
        placeholder="Notes" 
        value={form.notes} 
        onChange={handleChange} 
        className="border rounded w-full px-3 py-2" 
        rows={3} 
      />
      
      <hr className="my-4" />
            <div className="flex justify-end gap-3 pt-2">
        <CancelButton onClick={onClose} />
        <PrimaryButton type="submit" variant="primary">Save</PrimaryButton>
      </div>
    </form>
  );
}