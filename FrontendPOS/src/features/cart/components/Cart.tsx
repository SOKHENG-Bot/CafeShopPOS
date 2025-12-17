/** Cart.tsx - Shopping Cart Component **/

import { ChevronRight, Trash2 } from 'lucide-react';
import { CartItemTab } from '@/features/cart/components/CartItem';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { useCart } from '@/features/cart/hooks/useCart';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Cart = ({ isOpen, onClose }: CartProps) => {
  if (!isOpen) return null;

  const { items, clearCart } = useCart();

  return (
    <>
      <header className="w-full h-22 flex justify-between items-center">
        <div className="w-12 h-12 rounded-xl bg-[#fac604]">
          <button
            onClick={onClose}
            className="w-full h-12 flex justify-center items-center hover:scale-101 transition-scale duration-300"
          >
            <ChevronRight className="font-normal text-black" size={30} />
          </button>
        </div>

        <div>
          <div className="flex justify-center">
            <p className="font-semibold text-xl text-white">Order Receipt</p>
          </div>
        </div>

        <div className="w-12 h-12 rounded-xl bg-[#fac604]">
          <button
            onClick={clearCart}
            className="w-full h-full flex justify-center items-center rounded-xl text-black hover:scale-101 transition-scale duration-300"
          >
            <Trash2 className="font-normal" size={25} />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full bg-[#1d224f] gap-3 mb-3 py-3 pr-3 pl-3 flex flex-col overflow-y-scroll overflow-x-hidden rounded-l-3xl">
        {items.map((item, index) => (
          <CartItemTab key={`${item.id}-${index}`} item={item} />
        ))}
      </main>

      <footer className="w-full mb-5">
        <CartSummary />
      </footer>
    </>
  );
};
