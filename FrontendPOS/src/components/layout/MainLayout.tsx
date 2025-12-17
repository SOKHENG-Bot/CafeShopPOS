/** MainLayout.tsx - Main Application Layout Wrapper **/

import { Outlet } from '@tanstack/react-router';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useState } from 'react';
import clsx from 'clsx';

export const MainLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const toggleSidebar = () => setOpenSidebar(!openSidebar);

  return (
    <div className="h-full flex flex-col bg-[#1d224f]">
      <header className="px-30 py-5 flex items-center justify-between sticky top-0 z-50">
        <Header onToggleSidebar={toggleSidebar} />
      </header>

      <main className="flex-1 w-full h-auto overflow-hidden z-0 mb-5">
        <Outlet />
      </main>

      <aside
        className={clsx(
          'fixed left-0 top-0 h-full py-5 flex justify-center items-center bg-transparent z-0 transition-all duration-500 ease-in-out',
          openSidebar ? 'translate-x-3' : '-translate-x-full'
        )}
        onClick={toggleSidebar}
      >
        <Sidebar />
      </aside>
    </div>
  );
};
