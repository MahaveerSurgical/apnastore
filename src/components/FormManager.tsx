import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import FloatingAddButton from './ui/FloatingAddButton';
import { Modal } from './ui/Modal';
import { Loading } from './ui/Loading';

// Lazy load form components
const CustomerForm = lazy(() => import('./forms/AddCustomerForm'));
const WorkerForm = lazy(() => import('./forms/AddWorkerForm'));
const SalesOrderForm = lazy(() => import('./forms/AddSalesOrderForm'));
const RawMaterialForm = lazy(() => import('./forms/AddRawMaterialForm'));
const ReadyBeltForm = lazy(() => import('./forms/AddReadyBeltForm'));
const ProductionOrderForm = lazy(() => import('./forms/AddProductionOrderForm'));

const FormManager: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const formToRender = useMemo(() => {
    const { pathname } = location;
    
    if (pathname === '/customers') return <CustomerForm onClose={() => setOpen(false)} />;
    if (pathname === '/workers') return <WorkerForm onClose={() => setOpen(false)} />;
    if (pathname === '/orders/sales') return <SalesOrderForm onClose={() => setOpen(false)} />;
    if (pathname === '/inventory/raw-materials') return <RawMaterialForm onClose={() => setOpen(false)} />;
    if (pathname === '/inventory/ready-belts') return <ReadyBeltForm onClose={() => setOpen(false)} />;
    if (pathname === '/orders/production') return <ProductionOrderForm onClose={() => setOpen(false)} />;

    return null;
  }, [location.pathname]);

  if (!formToRender) {
    return null;
  }

  return (
    <>
      <FloatingAddButton onClick={() => setOpen(true)} />
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <Suspense fallback={<Loading message="Loading form..." />}>
          {formToRender}
        </Suspense>
      </Modal>
    </>
  );
};

export default FormManager;