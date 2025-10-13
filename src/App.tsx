// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminRoute } from './routes/AdminRoute';
import { WorkerRoute } from './routes/WorkerRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import Customers from './pages/admin/Customers';
import CustomerDetail from './pages/admin/CustomerDetail';
import Workers from './pages/admin/Workers';
import RawMaterials from './pages/admin/inventory/RawMaterials';
import ReadyBelts from './pages/admin/inventory/ReadyBelts';
import ProductionOrders from './pages/admin/orders/ProductionOrders';
import SalesOrders from './pages/admin/orders/SalesOrders';
import WorkerDashboard from './pages/worker/WorkerDashboard';


// Layouts
import AdminLayout from './components/layout/AdminLayout';
import WorkerLayout from './components/layout/WorkerLayout';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route
          path="/*"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="workers" element={<Workers />} />
          <Route path="inventory/raw-materials" element={<RawMaterials />} />
          <Route path="inventory/ready-belts" element={<ReadyBelts />} />
          <Route path="orders/production" element={<ProductionOrders />} />
          <Route path="orders/sales" element={<SalesOrders />} />
        </Route>

        {/* Worker dashboard */}
        <Route
          path="/worker-dashboard"
          element={
            <WorkerRoute>
              <WorkerLayout>
                <WorkerDashboard />
              </WorkerLayout>
            </WorkerRoute>
          }
        />

        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}