/** MenuItemCard Component **/

import { Plus } from 'lucide-react';
import clsx from 'clsx';
import type { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  AddToCart?: (item: MenuItem) => void;
}

export const MenuItemCard = ({ item, AddToCart }: MenuItemCardProps) => {
  const onAddToCart = () => {
    if (AddToCart) {
      AddToCart(item);
    }
  };

  return (
    <>
      <div
        className="min-w-65 h-70 bg-[#3d416d] rounded-3xl overflow-hidden shadow-xl hover:scale-101
        transition-scale duration-300"
        key={item.id}
      >
        <div className="w-full h-[65%] flex items-center justify-center p-4">
          {item.image ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="bg-white w-full h-full object-cover object-center rounded-2xl"
            />
          ) : (
            <img
              alt={item.name}
              className="bg-white w-full h-full object-cover object-center"
            />
          )}
        </div>
        <div className="h-[35%] flex flex-col">
          <div className="flex flex-row justify-between h-15 mx-3">
            <div className="flex flex-col justify-center w-full">
              <p className="font-normal text-lg text-white">{item.name}</p>
              <div className="flex items-baseline">
                <span className="font-semibold text-lg text-white pr-1">
                  ${item.price} -
                </span>
                {item.stock == 0 ? (
                  <span className="font-normal text-red-500 text-lg">
                    0 stock
                  </span>
                ) : item?.lowStockThreshold ? (
                  <span className="font-normal text-yellow-300 text-lg">
                    {item.stock} stocks
                  </span>
                ) : (
                  <span className="font-normal text-green-300 text-lg">
                    {item.stock} stocks
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                className={clsx(
                  'rounded-full w-10 h-10 border-2 flex justify-center items-center',
                  item.stock === 0
                    ? 'border-gray-500 text-gray-500 transition-colors duration-300'
                    : 'border-white text-white hover:bg-[#fac604]'
                )}
                disabled={item.stock === 0}
                onClick={onAddToCart}
              >
                <Plus size={35} />
              </button>
            </div>
          </div>

          <div className="flex pl-3 bg-transparent">
            <p className="font-normal text-white text-md">{item.description}</p>
          </div>
        </div>
      </div>
    </>
  );
};
