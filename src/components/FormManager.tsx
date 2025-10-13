// src/components/FormManager.tsx
import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import FloatingAddButton from './ui/FloatingAddButton';
import CustomerForm from './forms/AddCustomerForm';
import WorkerForm from './forms/AddWorkerForm';
import SalesOrderForm from './forms/AddSalesOrderForm';
import RawMaterialForm from './forms/AddRawMaterialForm';
import ReadyBeltForm from './forms/AddReadyBeltForm.tsx';
import ProductionOrderForm from './forms/AddProductionOrderForm.tsx';
import { Modal } from './ui/Modal';

const FormManager: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Determine which form component to render based on the exact path.
  // We use useMemo to avoid re-calculating on every render.
  const formToRender = useMemo(() => {
    const { pathname } = location;
    
    // Check for exact paths to avoid showing the button on detail pages
    if (pathname === '/customers') return <CustomerForm onClose={() => setOpen(false)} />;
    if (pathname === '/workers') return <WorkerForm onClose={() => setOpen(false)} />;
    if (pathname === '/orders/sales') return <SalesOrderForm onClose={() => setOpen(false)} />;
    if (pathname === '/inventory/raw-materials') return <RawMaterialForm onClose={() => setOpen(false)} />;
    if (pathname === '/inventory/ready-belts') return <ReadyBeltForm onClose={() => setOpen(false)} />;
    if (pathname === '/orders/production') return <ProductionOrderForm onClose={() => setOpen(false)} />;

    // For any other path, return null.
    return null;
  }, [location.pathname]);

  // If there is no form for this route, render absolutely nothing.
  if (!formToRender) {
    return null;
  }

  // Only if there's a form to show will we render the button and modal.
  return (
    <>
      <FloatingAddButton onClick={() => setOpen(true)} />
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        {formToRender}
      </Modal>
    </>
  );
};

export default FormManager;