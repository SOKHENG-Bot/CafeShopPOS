/** Order Page Route (/order) **/

import { createFileRoute } from '@tanstack/react-router';
import { OrderCard } from '@/features/orders/components/OrderCard';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { useState } from 'react';
import clsx from 'clsx';

export const Route = createFileRoute('/_authenticated/order')({
  component: OrderComponent,
});

const statuses = [
  { id: '', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'completed', label: 'Completed' },
];

function OrderComponent() {
  const { data: orders } = useOrders();
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const filterOrderStatus = orders?.filter(
    (order) => selectedStatus === '' || order.status === selectedStatus
  );

  const handleSelctedStatus = (_: any, newValue: any) => {
    setSelectedStatus(newValue);
  };

  return (
    <div className="h-screen flex flex-col items-center mx-30 px-2">
      <header className="w-full mb-5">
        <h1 className="font-semibold text-white text-3xl mb-5">Orders</h1>
        <div className="w-full flex gap-3">
          {statuses.map((status) => (
            <button
              key={status.id}
              className={clsx(
                'px-5 py-2 rounded-lg text-lg text-white hover:text-white hover:bg-[#6974e1] transition-colors duration-300',
                selectedStatus === status.id ? 'bg-[#6974e1]' : 'bg-[#3d416d]'
              )}
              onClick={() => handleSelctedStatus(null, status.id)}
            >
              {status.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 w-full overflow-y-auto">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-5 pb-35 pr-4 p-1">
          {filterOrderStatus?.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </main>
    </div>
  );
}