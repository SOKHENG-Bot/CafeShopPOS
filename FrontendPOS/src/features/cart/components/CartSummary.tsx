/** CartSummary.tsx - Cart Summary Badge Component **/

import { QrCode, Wallet } from 'lucide-react';
import { useCart } from '@/features/cart/hooks/useCart';
import { useState } from 'react';
import { CreateOrderData } from '@/features/orders/types';
import { useCreateOrder } from '@/features/orders/hooks/useOrders';
import clsx from 'clsx';

export const CartSummary = () => {
  const { itemCount, total, items } = useCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('qrcode');
  const [cashReceive, setCashReceive] = useState('');

  const handleChangeReceive = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCashReceive(event.target.value);
  };

  const onCashChange =
    selectedPaymentMethod === 'cash' && cashReceive
      ? Math.max(0, parseFloat(cashReceive) - total)
      : 0;

  const { mutate: createOrder } = useCreateOrder();
  const orderData: CreateOrderData = {
    items: items.map((item) => ({
      menu_item: item.menuItemId,
      price: item.price,
      quantity: item.quantity,
      status: 'pending',
    })),
    total,
  };

  const handlePlaceOrder = () => {
    createOrder(orderData);
  };

  const isDisabled =
    itemCount === 0 ||
    (selectedPaymentMethod === 'cash' &&
      (!cashReceive || parseFloat(cashReceive || '0') < total));

  return (
    <>
      <div>
        <p className="font-semibold text-xl text-white">Payment Details</p>
        <div className="my-2">
          <div className="flex justify-between">
            <p className="font-normal text-lg text-white">Item</p>
            <p className="font-normal text-lg text-white">{itemCount}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-normal text-lg text-white">Subtotal</p>
            <p className="font-normal text-lg text-white">
              ${total.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between pt-1">
            <p className="font-normal text-lg text-white">Total</p>
            <p className="font-semibold text-lg text-[#fac604]">
              ${total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-top mt-2">
        <div className="flex-1">
          <p className="font-semibold text-xl text-white">Payment Method</p>
          <div className="flex-1 h-12 mt-4 gap-3 flex flex-row justify-start items-center">
            <button
              className={clsx(
                'w-12 h-full rounded-xl flex flex-col justify-center items-center',
                selectedPaymentMethod === 'qrcode'
                  ? 'bg-[#fac604] text-black'
                  : 'bg-[#1d224f] text-white hover:text-black hover:bg-[#fac604] transition-colors duration-300'
              )}
              onClick={() => setSelectedPaymentMethod('qrcode')}
            >
              <QrCode size={25} />
            </button>
            <button
              className={clsx(
                'w-12 h-full rounded-xl flex flex-col justify-center items-center',
                selectedPaymentMethod === 'cash'
                  ? 'bg-[#fac604] text-black'
                  : 'bg-[#1d224f] text-white hover:text-black hover:bg-[#fac604] transition-colors duration-300'
              )}
              onClick={() => setSelectedPaymentMethod('cash')}
            >
              <Wallet size={25} />
            </button>
          </div>
        </div>

        {selectedPaymentMethod === 'cash' && (
          <div className="flex-1 flex-col items-center">
            <div className="flex justify-end">
              <input
                id="receive"
                type="number"
                placeholder="Cash Receive"
                value={cashReceive}
                onChange={handleChangeReceive}
                className="w-full px-3 h-12 bg-[#1d224f] text-lg text-white font-normal rounded-xl transition-colors duration-300"
              />
            </div>
            {cashReceive === '' || (
              <div className="flex items-baseline my-1">
                <p className="text-md mr-3 font-normal text-lg text-white">
                  Change:
                </p>
                <p className="text-2lg font-semibold text-lg text-[#fac604]">
                  ${onCashChange.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-5">
        <button
          className={clsx(
            'w-full h-15 rounded-xl flex flex-col justify-center items-center font-semibold text-xl',
            isDisabled
              ? 'bg-[#3d416d] border-2 text-gray-500 border-gray-500'
              : 'bg-[#fac604] text-black hover:scale-101 transition-scale duration-300'
          )}
          disabled={isDisabled}
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
      </div>
    </>
  );
};

