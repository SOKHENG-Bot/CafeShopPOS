/** OrderCard.tsx - Single Order Card Component **/

import type { Order } from '../types';
import { AlarmClock, ClipboardCheck, Loader, CircleX } from 'lucide-react';
import {
  useCancelOrder,
  useUpdateOrder,
} from '@/features/orders/hooks/useOrders';

interface OrderCardProps {
  order: Order;
}

const statusColor = {
  pending: 'bg-[#6974e1] text-white',
  preparing: 'bg-[#fac604] text-black',
  completed: 'bg-[#1d224f] text-white',
  cancelled: 'bg-[#3d416d] text-white',
};

const signStatus = {
  pending: Loader,
  preparing: AlarmClock,
  completed: ClipboardCheck,
  cancelled: CircleX,
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    weekday: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const OrderCard = ({ order }: OrderCardProps) => {
  const cancelOrderMutation = useCancelOrder();
  const updateStatusMutation = useUpdateOrder();
  const StatusIcon = signStatus[order.status];

  const handleCancelOrder = () => {
    cancelOrderMutation.mutate(order.id);
  };

  const handleUpdateStatus = (newStatus: string) => {
    updateStatusMutation.mutate({ id: order.id, status: newStatus });
  };

  return (
    <div
      className="bg-[#3d416d] flex flex-col items-center max-w-90 h-100 rounded-2xl p-5 shadow-xl hover:scale-101
      transition-scale duration-300"
    >
      <header className="w-full h-20 flex flex-row justify-between items-top">
        <div className="flex flex-col">
          <span className="font-semibold text-lg text-[#fac604]">
            Order Number
          </span>
          <span className="text-md text-gray-300">#{order.order_number}</span>
          <span className="text-md text-gray-300">
            {formatDate(order.created_at)}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <div
            className={`h-8 px-2 rounded-lg flex justify-center items-center ${statusColor[order.status] || 'text-gray-700'}`}
          >
            <StatusIcon size={18} />
            <span className="text-md pl-1">
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
      </header>

      <div className="w-full h-0.5 bg-gray-500 my-2"></div>

      <main className="w-full h-50">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="font-normal text-white text-left">Items</th>
              <th className="font-normal text-white text-center pl-20">Qty</th>
              <th className="font-normal text-white text-right">Price</th>
            </tr>
            <tr className="h-2"></tr>
          </thead>

          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td className="font-normal text-white text-left">
                  {item.menu_item}
                </td>
                <td className="font-normal text-white text-center pl-20">
                  {item.quantity}
                </td>
                <td className="font-normal text-white text-right">
                  ${item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <div className="w-full h-0.5 bg-gray-500"></div>

      <footer className="w-full h-20">
        <div className="h-10 flex justify-between items-center">
          <p className="font-semibold text-lg text-white">Total</p>
          <p className="font-semibold text-lg text-white">${order.total}</p>
        </div>
        <div className="h-10 flex justify-between items-center mt-1">
          {order.status === 'pending' && (
            <button
              className="bg-[#1d224f] w-32 h-full text-white font-semibold
              hover:bg-[#fac604] rounded-xl hover:text-black transition-colors duration-300"
              onClick={() => handleUpdateStatus('preparing')}
            >
              Set Preparing
            </button>
          )}
          {order.status === 'preparing' && (
            <button
              className="bg-[#1d224f] w-32 h-full text-white font-semibold
              hover:bg-[#fac604] rounded-xl hover:text-black transition-colors duration-300"
              onClick={() => handleUpdateStatus('completed')}
            >
              Set Completed
            </button>
          )}
          {order.status === 'completed' && (
            <button
              className="bg-[#1d224f] w-32 h-full text-gray-500 font-semibold rounded-xl"
              disabled={order.status === 'completed'}
            >
              Ready to Serve
            </button>
          )}
          <button
            className="bg-red-400 w-32 h-full rounded-xl text-white font-semibold hover:bg-red-300"
            onClick={handleCancelOrder}
          >
            {order.status === 'completed' ? 'Remove' : 'Cancel Order'}
          </button>
        </div>
      </footer>
    </div>
  );
};