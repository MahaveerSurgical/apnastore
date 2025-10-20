import { useState } from 'react';
import { useCustomers } from '../../hooks/useCustomers';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';
// import { Modal } from '../../components/ui/Modal';
// import { db } from '../../firebase/firebaseConfig';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Customers() {
  const { customers, loading, error } = useCustomers();
  const [query, setQuery] = useState('');
  // const [isOpen, setIsOpen] = useState(false);
  // const [name, setName] = useState('');
  // const [phone, setPhone] = useState('');
  // const [address, setAddress] = useState('');
  const navigate = useNavigate();

  // const handleAdd = async () => {
  //   try {
  //     await addDoc(collection(db, 'customers'), {
  //       name,
  //       phone,
  //       address,
  //       notes: '',
  //       pendingAmount: 0,
  //       createdAt: serverTimestamp()
  //     });
  //     setIsOpen(false);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customers</h2>
      <div className="mb-4">
        <input
          placeholder="Search by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md border p-2 rounded"
        />
      </div>
      {loading && <Loading />}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && customers.length === 0 && (
        <div className="text-gray-500">No customers yet. Use the + button to add one.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers
          .filter((c: any) => c.name?.toLowerCase().includes(query.toLowerCase()))
          .map((c: any) => (
          <Card
            key={c.id}
            title={c.name}
            onClick={() => navigate(`/customers/${c.id}`)}
            className="cursor-pointer"
          >
            <p>Phone: {c.phone}</p>
            <p>Pending: ₹{c.pendingAmount}</p>
            <>Notes: {c.notes}</>
          </Card>
        ))}
      </div>
      {/* <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-500 text-grey rounded-full w-14 h-14 text-3xl"
      >
        +
      </button> */}

      {/* <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Customer">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />
        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />
        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />
        <button onClick={handleAdd} className="bg-primary-500 text-blue px-4 py-2 rounded">
          Add
        </button>
      </Modal> */}
    </div>
  );
}