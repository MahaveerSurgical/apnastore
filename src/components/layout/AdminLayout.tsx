import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import FormManager from "../FormManager";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-4 flex-1 overflow-auto">
          <Outlet />
        <FormManager />  
        </main>
      </div>
    </div>
  );
}