import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './SideBar';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-1/5 h-full border-r bg-white">
        <Sidebar/>
      </aside>

      <main className="w-4/5 h-full overflow-auto p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;