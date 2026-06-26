// src/App.tsx
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminRoute } from './routes/AdminRoute';
import { WorkerRoute } from './routes/WorkerRoute';
import {Loading} from './components/ui/Loading';


// Lazy load pages
const Login = lazy(() => import('./pages/auth/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const CustomerDetail = lazy(() => import('./pages/admin/CustomerDetail'));
const Workers = lazy(() => import('./pages/admin/Workers'));
const RawMaterials = lazy(() => import('./pages/admin/inventory/RawMaterials'));
const ReadyBelts = lazy(() => import('./pages/admin/inventory/ReadyBelts'));
const ReadyBeltDetail = lazy(() => import('./pages/admin/inventory/ReadyBeltDetail'));
const ProductionOrders = lazy(() => import('./pages/admin/orders/ProductionOrders'));
const SalesOrders = lazy(() => import('./pages/admin/orders/SalesOrders'));
const WorkerDashboard = lazy(() => import('./pages/worker/WorkerDashboard'));
const SignUp = lazy(() => import('./pages/auth/Signup'));
const Test = lazy(() => import('./pages/Test'));


// Lazy load layouts
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const WorkerLayout = lazy(() => import('./components/layout/WorkerLayout'));
  // Import PendingApproval page
  const PendingApproval = lazy(() => import('./pages/auth/PendingApproval'));

export default function App() {

  return (
    <AuthProvider>
      <Suspense fallback={<Loading message="Loading application..." />}> </Suspense>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/pending-approval" element={
          <Suspense fallback={<Loading message="Loading approval page..." />}> <PendingApproval /> </Suspense>
        } />

        {/* Admin routes */}
        <Route
          path="/*"
          element={
            <AdminRoute>
              <Suspense fallback={<Loading message="Loading admin panel..." />}> 
              <AdminLayout /> 
              </Suspense>
            </AdminRoute>
          }
        >
            <Route
              index
              element={
                <Suspense fallback={<Loading message="Loading dashboard..." />}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route
              path="customers"
              element={
                <Suspense fallback={<Loading message="Loading customers..." />}>
                  <Customers />
                </Suspense>
              }
            />
            <Route
              path="customers/:id"
              element={
                <Suspense fallback={<Loading message="Loading customer details..." />}>
                  <CustomerDetail />
                </Suspense>
              }
            />
            <Route
              path="workers"
              element={
                <Suspense fallback={<Loading message="Loading workers..." />}>
                  <Workers />
                </Suspense>
              }
            />
            <Route
              path="inventory/raw-materials"
              element={
                <Suspense fallback={<Loading message="Loading raw materials..." />}>
                  <RawMaterials />
                </Suspense>
              }
            />
            <Route
              path="inventory/ready-belts"
              element={
                <Suspense fallback={<Loading message="Loading ready belts..." />}>
                  <ReadyBelts />
                </Suspense>
              }
            />
            <Route
              path="inventory/ready-belts/:type"
              element={
                <Suspense fallback={<Loading message="Loading ready belt details..." />}>
                  <ReadyBeltDetail />
                </Suspense>
              }
            />
            <Route
              path="orders/production"
              element={
                <Suspense fallback={<Loading message="Loading production orders..." />}>
                  <ProductionOrders />
                </Suspense>
              }
            />
            <Route
              path="orders/sales"
              element={
                <Suspense fallback={<Loading message="Loading sales orders..." />}>
                  <SalesOrders />
                </Suspense>
              }
            />
        </Route>

        {/* Worker dashboard */}
        <Route
          path="/worker-dashboard"
          element={
            <WorkerRoute>
                <Suspense fallback={<Loading message="Loading worker dashboard..." />}>
                  <WorkerLayout>
                    <WorkerDashboard />
                  </WorkerLayout>
                </Suspense>
            </WorkerRoute>
          }
        />

        {/* Diagnostic Route */}
        <Route 
          path="/test" 
          element={
            <Suspense fallback={<Loading message="Loading diagnostics..." />}>
              <Test />
            </Suspense>
          } 
        />

        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}