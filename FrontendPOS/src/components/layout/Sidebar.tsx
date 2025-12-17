/** Sidebar.tsx - Navigation Sidebar Component **/

import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Home, PanelsTopLeft, Package, ShoppingBag } from 'lucide-react';

interface routePageDataType {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
}

export const Sidebar = () => {
  const location = useLocation();

  const routePage: routePageDataType[] = [
    { name: 'HOME', href: '/home', icon: Home },
    { name: 'ORDER', href: '/order', icon: ShoppingBag },
    { name: 'MENU', href: '/menu', icon: PanelsTopLeft },
    { name: 'INVENTORY', href: '/inventory', icon: Package },
  ];

  return (
    <div
      className="w-23 py-4 bg-[#3d416d] justify-center flex flex-col items-center shadow-xl rounded-3xl"
      aria-label="Sidebar"
    >
      <nav className="">
        <ul className="flex flex-col gap-5 px-3">
          {routePage.map((item: routePageDataType) => {
            const Icon = item.icon;
            const isActive: boolean = location.pathname === item.href;

            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`
                    flex flex-col items-center gap-2 px-4 py-4 rounded-2xl
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-[#1d224f] text-white shadow-xl'
                        : 'text-white hover:bg-[#1d224f] hover:text-white transition-colors duration-300'
                    }
                  `}
                >
                  <div className="flex flex-col items-center justify-center">
                    <Icon size={30} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
