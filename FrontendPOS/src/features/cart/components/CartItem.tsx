/** CartItem.tsx - Single Cart Item Component **/

import { CartItem } from '@/features/cart/types';
import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '@/features/cart/hooks/useCart';

interface CartItemTabProps {
  item: CartItem;
}

export const CartItemTab = ({ item }: CartItemTabProps) => {
  const { removeItem, updateQuantity } = useCart();

  return (
    <>
      <div className="bg-[#3d416d] shadow-lg max-h-24 rounded-2xl">
        <div className="w-full h-full flex justify-between items-center p-2">
          <div className="w-20 h-20 overflow-hidden flex justify-center items-center rounded-2xl">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="w-45 h-full flex flex-col justify-center items-start">
            <p className="h-full font-semibold text-lg text-white flex justify-center items-center">
              {item.name}
            </p>

            <div className="w-full h-full gap-5 flex justify-between items-center">
              <p className="font-semibold text-lg text-white mr-1">
                ${item.price}
              </p>
              <div className="bg-[#1d224f] gap-3 p-1 rounded-2xl flex justify-center items-center">
                <button
                  onClick={() =>
                    updateQuantity(item.menuItemId, item.quantity - 1)
                  }
                  className="bg-[#3d416d] w-7 h-7 rounded-full text-white flex justify-center items-center hover:bg-[#fac604] hover:text-black transition-colors duration-300"
                >
                  <Minus size={20} />
                </button>
                <p className="font-semibold text-lg text-white">
                  {item.quantity}
                </p>
                <button
                  onClick={() =>
                    updateQuantity(item.menuItemId, item.quantity + 1)
                  }
                  className="bg-[#3d416d] w-7 h-7 rounded-full text-white flex justify-center items-center hover:bg-[#fac604] hover:text-black transition-colors duration-300"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="w-15 h-full flex flex-col items-end">
            <div className="w-full h-full flex justify-end items-center text-red-500 font-bold hover:border-red-500 hover:text-red-400 transition-colors duration-300">
              <button onClick={() => removeItem(item.menuItemId)}>
                <X size={25} />
              </button>
            </div>
            <div className="w-full h-full font-semibold text-lg flex justify-end items-center text-[#fac604]">
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
