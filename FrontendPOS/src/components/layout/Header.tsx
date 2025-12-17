/** Header.tsx - Application Header Component **/

import { Menu, LogIn, Settings } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { useState } from 'react';

interface onToggleSidebarProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: onToggleSidebarProps) => {
  const { user, logout } = useAuth();
  const { data: orders } = useOrders();
  const [openProfile, setOpenProfile] = useState(false);

  const role = user?.is_superuser ? 'admin' : 'cashier';
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const toggleOpenProfile = () => {
    setOpenProfile(!openProfile);
  };

  const handleLogout = () => {
    logout();
  };

  const lengthOrder = orders?.length || 0;

  return (
    <>
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl bg-[#3d416d] hover:bg-[#6974e1] transition-colors duration-300"
          aria-label="Toggle menu"
        >
          <Menu size={30} className="text-white font-bold" />
        </button>
        <div className="flex items-baseline gap-3">
          <p className="text-3xl font-bold text-white">CoffeeShop</p>
          <p className="font-medium text-lg text-2lg text-white hidden md:block">
            {currentDate}
          </p>
        </div>
      </div>

      <div className="relative flex items-center gap-4">
        {lengthOrder === 1 ? (
          <p className="font-medium text-lg text-white hidden md:block">
            Total: {lengthOrder} order
          </p>
        ) : (
          <p className="font-medium text-lg text-white hidden md:block">
            Total: {lengthOrder} orders
          </p>
        )}

        <button
          onClick={toggleOpenProfile}
          className="flex items-center h-14 gap-3 pr-3 pl-2 py-3 rounded-xl bg-[#3d416d] hover:bg-[#6974e1] transition-colors duration-300"
        >
          <div className="w-10 h-10 rounded-xl bg-white text-gray-900 flex items-center justify-center font-semibold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="text-left hidden md:block">
            <span className="text-md font-semibold text-white">
              {user?.username || 'User'}
            </span>
            <span className="text-white">, </span>
            <span className="text-sm text-white capitalize">{role}</span>
          </div>
        </button>

        {openProfile && (
          <div className="absolute top-full right-0 mt-6 w-80 bg-[#3d416d] border border-gray-500 rounded-lg shadow-2xl p-4 z-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex justify-center items-center text-white">
                <span className="font-semibold">{user?.username}</span>
                <span className="text-white">, </span>
                <span className="text-sm text-white capitalize pl-1">
                  {role}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button className="flex-1 flex justify-center items-center gap-2 bg-[#3d416d] border border-gray-500 text-white py-2 rounded-xl hover:bg-[#6974e1]">
                <Settings />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 flex justify-center items-center gap-2 bg-[#3d416d] border border-gray-500 text-white py-2 rounded-xl hover:bg-[#fac604] hover:text-black"
              >
                <LogIn />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
