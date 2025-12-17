import { useState, forwardRef } from 'react';
import { X } from 'lucide-react';
import { useMenuItems } from '@/features/menu/hooks/useMenu';
import { MenuItem } from '@/features/menu';
import type { InventoryItem } from '../types';

const DialogInventoryListName = [
  {
    id: 1,
    name: 'Menu Item',
    key: 'menu_item',
    type: 'text',
    placeholder: 'Enter item name',
  },
  {
    id: 2,
    name: 'Quantity',
    key: 'quantity',
    type: 'text',
    placeholder: 'Enter quantity',
  },
  {
    id: 3,
    name: 'Minimum Quantity',
    key: 'minimum_quantity',
    type: 'number',
    placeholder: 'Enter minimum quantity',
  },
];

interface EditInventoryDialogProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
  initialData: InventoryItem;
}

export const EditInventoryDialog = forwardRef<
  HTMLDialogElement,
  EditInventoryDialogProps
>(({ onSubmit, onClose, initialData }, ref) => {
  const [inventoryForm, setInventoryForm] = useState({
    menu_item: initialData.menu_item_id,
    quantity: initialData.quantity,
    minimum_quantity: initialData.minimum_quantity,
  });
  const { data: items } = useMenuItems();

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setInventoryForm({
      menu_item: initialData.menu_item_id,
      quantity: initialData.quantity,
      minimum_quantity: initialData.minimum_quantity,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { ...inventoryForm };
    onSubmit(formData);
    resetForm();
    onClose();
  };

  const handleInputChange = (key: string, value: string) => {
    setInventoryForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <dialog
      ref={ref}
      className="top-1/2 left-1/2 w-150 max-h-[90vh] overflow-hidden transform -translate-x-1/2 -translate-y-1/2 p-8 rounded-xl bg-[#3d416d] text-white backdrop:bg-black backdrop:opacity-30 shadow-2xl"
    >
      <header className="flex justify-between items-center pb-8">
        <span className="font-semibold text-xl text-[#fac604]">
          Add new item inventory
        </span>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-[#6974e1] rounded-lg transition-colors duration-300"
        >
          <X />
        </button>
      </header>

      <form onSubmit={handleSubmit}>
        <main className="flex flex-col justify-between gap-5 mb-3">
          {DialogInventoryListName.map((list) => (
            <div key={list.id} className="flex justify-between items-top">
              <span className="font-normal text-xl">{list.name} :</span>

              {list.key === 'menu_item' ? (
                <select
                  id={list.key}
                  required
                  value={inventoryForm[list.key as keyof typeof inventoryForm]}
                  onChange={(e) => handleInputChange(list.key, e.target.value)}
                  className="min-h-12 w-80 px-2 border-2 bg-[#3d416d] font-normal text-md text-white rounded-xl transition-colors"
                >
                  <option value="">--Select Menu Item--</option>
                  {items?.map((item: MenuItem) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={list.key}
                  type={list.type}
                  value={inventoryForm[list.key as keyof typeof inventoryForm]}
                  placeholder={list.placeholder}
                  onChange={(e) => handleInputChange(list.key, e.target.value)}
                  required
                  className="min-h-12 w-80 pl-2 border-2 border-bg-white font-normal text-md text-white rounded-xl transition-colors"
                />
              )}
            </div>
          ))}
        </main>

        <button
          type="submit"
          className="flex justify-start items-center pr-6 py-2 text-[#fac604]
          rounded-lg hover:bg-[#fac604] hover:text-black transition-colors
          duration-300"
        >
          <span className="font-semibold text-xl hover:translate-x-3 transition-all duration-300">
            Finish
          </span>
        </button>
      </form>
    </dialog>
  );
});
