import { createFileRoute } from '@tanstack/react-router';
import {
  useCreateInventoryItem,
  useRemoveInventoryItem,
  useUpdateInventoryItem,
  useInventoryItems,
} from '@/features/inventory/hooks/useInventory';
import { InventoryItem, CreateInventoryItem } from '@/features/inventory/types';
import { Plus, PencilLine, Trash, Package, TriangleAlert } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { CreateInventoryDialog } from '@/features/inventory/components/CreateInventoryDialog';
import { EditInventoryDialog } from '@/features/inventory/components/EditInventoryDialog';
import { useMenuCategories } from '@/features/menu/hooks/useMenu';
import { MenuCategory } from '@/features/menu';

export const Route = createFileRoute('/_authenticated/inventory')({
  component: RouteComponent,
});

const TableHeaders = [
  { id: 1, name: 'ID' },
  { id: 2, name: 'Item Name' },
  { id: 3, name: 'Category Name' },
  { id: 4, name: 'Stock Quantity' },
  { id: 5, name: 'Min Quantity' },
  { id: 6, name: 'Status' },
  { id: 7, name: 'Actions' },
];

const InventoryItemsList = [
  { id: 1, name: 'id' },
  { id: 2, name: 'menu_item_name' },
  { id: 3, name: 'category_name' },
  { id: 4, name: 'quantity' },
  { id: 5, name: 'minimum_quantity' },
  { id: 6, name: 'is_low_stock' },
  { id: 7, name: 'actions' },
];

function RouteComponent() {
  const { data: categories } = useMenuCategories();
  const { data: inventoryItems } = useInventoryItems();
  const editInventoryItemMutation = useUpdateInventoryItem();
  const createInventoryItemMutation = useCreateInventoryItem();
  const removeInventoryItemMutation = useRemoveInventoryItem();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingInventory, setEditingInventory] =
    useState<InventoryItem | null>(null);

  const handleRemoveInventoryItem = (id: string) => {
    removeInventoryItemMutation.mutate(id);
  };

  /* Create Inventory Section */
  const createInventoryRef = useRef<HTMLDialogElement>(null);
  const openCreateInventoryDialog = () => {
    createInventoryRef.current?.showModal();
  };
  const closeCreateInventoryItemDialog = () => {
    createInventoryRef.current?.close();
  };
  const handleCreateInventorySubmit = (createData: CreateInventoryItem) => {
    createInventoryItemMutation.mutate(createData, {
      onSuccess: () => {
        closeCreateInventoryItemDialog();
      },
    });
  };

  /* Edit Inventory Section */
  const editInventoryRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (editingInventory) {
      editInventoryRef.current?.showModal();
    }
  }, [editingInventory]);
  const openEditInventoryDialog = (item: InventoryItem) => {
    setEditingInventory(item);
    editInventoryRef.current?.showModal();
  };
  const closeEditInventoryItemDialog = () => {
    setEditingInventory(null);
    editInventoryRef.current?.close();
  };
  const handleEditInventorySubmit = (updateData: CreateInventoryItem) => {
    if (!editingInventory) return;
    editInventoryItemMutation.mutate(
      { id: editingInventory.id, updateData: updateData },
      {
        onSuccess: () => {
          closeEditInventoryItemDialog();
        },
      }
    );
  };

  const filteredInventoryItems = inventoryItems?.filter(
    (item: InventoryItem) => {
      if (!selectedCategory) return true;
      return item.category_id?.toString() === selectedCategory;
    }
  );

  const totalItems = inventoryItems?.length;
  const itemLowStock =
    inventoryItems?.filter((item) => item.is_low_stock && item.quantity > 0)
      .length || 0;
  const itemOutOfStock =
    inventoryItems?.filter((item) => item.quantity === 0).length || 0;

  return (
    <div className="h-screen flex flex-col mx-30">
      <header className="w-full mb-5">
        <h1 className="font-semibold text-white text-3xl mb-3">
          Inventory Management
        </h1>
      </header>

      <div className="w-full h-20 flex justify-between items-center mb-5 gap-15">
        <div className="w-1/3 h-full bg-[#3d416d] rounded-xl text-lg text-white flex justify-evenly items-center">
          <span>Total Items In Inventory</span>
          <span className="font-semibold text-3xl">{totalItems}</span>
          <span>
            <Package />
          </span>
        </div>

        <div className="w-1/3 h-full bg-[#3d416d] rounded-xl text-lg text-white flex justify-evenly items-center">
          <span>Total Items Low Stock</span>
          <span className="font-semibold text-3xl text-[#fac604]">
            {itemLowStock}
          </span>
          <span className="text-[#fac604]">
            <TriangleAlert />
          </span>
        </div>

        <div className="w-1/3 h-full bg-[#3d416d] rounded-xl text-lg text-white flex justify-evenly items-center">
          <span>Total Items Out of Stock</span>
          <span className="font-semibold text-3xl text-red-500">
            {itemOutOfStock}
          </span>
          <span className="text-red-500">
            <TriangleAlert />
          </span>
        </div>
      </div>

      <section className="h-15 flex justify-between items-center mb-5 pr-3">
        <button className="bg-[#3d416d] h-12 flex justify-center items-center font-normal text-lg text-white rounded-xl px-2 py-2 hover:bg-[#6974e1] transition-colors duration-300">
          <Plus size={25} />
          <span onClick={openCreateInventoryDialog} className="p-1">
            Add item to inventory
          </span>
        </button>

        <div>
          <select
            required
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="min-h-12 w-60 px-2 bg-[#3d416d] font-normal text-md text-white rounded-xl transition-colors hover:bg-[#6974e1]"
          >
            <option value="">All Category</option>
            {categories?.map((category: MenuCategory) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="flex-1 h-full overflow-y-auto pb-30">
        <table className="border-separate w-full border-spacing-y-5 bg-[#3d416d] table-auto rounded-xl">
          <thead className="shadow-xl">
            <tr>
              {TableHeaders.map((header) => (
                <th
                  key={header.id}
                  className={`font-normal text-lg text-[#fac604] text-center pb-5 px-5`}
                >
                  {header.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredInventoryItems && filteredInventoryItems.length > 0 ? (
              filteredInventoryItems?.map(
                (item: InventoryItem, index: number) => (
                  <tr key={index || item.id}>
                    {InventoryItemsList.map((header) => {
                      const key = header.name.toLowerCase();

                      if (key === 'actions') {
                        return (
                          <td
                            key={header.id}
                            className="font-normal text-white text-lg mb-10"
                          >
                            <div className="flex justify-center gap-3 items-center">
                              <button
                                onClick={() =>
                                  handleRemoveInventoryItem(item.id)
                                }
                                className="text-red-400 hover:text-red-500 transition-colors duration-300"
                              >
                                <Trash size={22} />
                              </button>
                              <button
                                onClick={() => openEditInventoryDialog(item)}
                                className="text-gray-300 hover:text-gray-500 transition-colors duration-300"
                              >
                                <PencilLine size={22} />
                              </button>
                            </div>
                          </td>
                        );
                      }

                      if (key === 'is_low_stock') {
                        return (
                          <td
                            key={header.id}
                            className="font-normal text-white text-center text-lg pl-10 pr-10"
                          >
                            {item.quantity === 0 ? (
                              <span className="text-red-500">Out of Stock</span>
                            ) : item.is_low_stock ? (
                              <span className="text-[#fac604]">Low Stock</span>
                            ) : (
                              <span className="text-green-500">Avaiable</span>
                            )}
                          </td>
                        );
                      }

                      return (
                        <td
                          key={header.id}
                          className="font-normal text-white text-center text-lg"
                        >
                          {item[key as keyof InventoryItem]}
                        </td>
                      );
                    })}
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={TableHeaders.length}
                  className="font-normal text-white text-center text-lg pl-10"
                >
                  <span className="">
                    {selectedCategory
                      ? 'No items found in this category'
                      : 'No inventory items available'}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateInventoryDialog
        ref={createInventoryRef}
        onClose={closeCreateInventoryItemDialog}
        onSubmit={handleCreateInventorySubmit}
      />

      {editingInventory && (
        <EditInventoryDialog
          ref={editInventoryRef}
          onClose={closeEditInventoryItemDialog}
          onSubmit={handleEditInventorySubmit}
          initialData={editingInventory}
        />
      )}
    </div>
  );
}
