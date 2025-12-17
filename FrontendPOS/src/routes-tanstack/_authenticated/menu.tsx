/** Menu Page Route (/menu) **/

import { createFileRoute } from '@tanstack/react-router';
import { Plus, ChevronDown, Trash, PencilLine } from 'lucide-react';
import {
  useCreateMenuItem,
  useUpdateMenuItem,
  useCreateCategory,
  useUpdateCategory,
  useRemoveCategory,
  useMenuCategories,
  useMenuItems,
} from '@/features/menu/hooks/useMenu';
import { useState, useRef, useEffect } from 'react';
import { useRemoveMenuItem } from '@/features/menu/hooks/useMenu';
import { CreateItemDialog } from '@/features/menu/components/CreateItemDialog';
import {
  CreateMenuItemData,
  CreateMenuCategoryData,
} from '@/features/menu/types';
import { EditItemDialog } from '@/features/menu/components/EditItemDialog';
import { CreateCategoryDialog } from '@/features/menu/components/CreateCategoryDialog';
import { EditCategoryDialog } from '@/features/menu/components/EditCategoryDialog';
import type { MenuItem, MenuCategory } from '@/features/menu';
import clsx from 'clsx';

export const Route = createFileRoute('/_authenticated/menu')({
  component: MenuComponent,
});

const MenuHeaders = [
  { id: 1, name: 'ID' },
  { id: 2, name: 'Name' },
  { id: 3, name: 'Description' },
  { id: 4, name: 'Price' },
  { id: 5, name: 'Stock' },
  { id: 6, name: 'Status' },
  { id: 7, name: 'Actions' },
];

function MenuComponent() {
  const removeMenuItemMutation = useRemoveMenuItem();
  const removeCategoryMutation = useRemoveCategory();
  const { data: categories } = useMenuCategories();
  const { data: items } = useMenuItems();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(
    null
  );
  const [isOpenItemTab, setIsOpenItemTab] = useState<Record<string, boolean>>(
    {}
  );

  const handleRemoveMenuItem = (itemId: string) => {
    removeMenuItemMutation.mutate(itemId);
  };
  const handleRemoveCategory = (categoryId: string) => {
    removeCategoryMutation.mutate(categoryId);
  };
  const toggleOpenItemTab = (categoryId: string) => {
    setIsOpenItemTab((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  /* Create Item Section */
  const createItemRef = useRef<HTMLDialogElement>(null);
  const openCreateItemDialog = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    createItemRef.current?.showModal();
  };
  const closeCreateItemDialog = () => {
    createItemRef.current?.close();
  };
  const handleCreateItemSubmit = (data: CreateMenuItemData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price.toString());
    formData.append('description', data.description);
    formData.append('category', selectedCategoryId);
    if (data.image) {
      formData.append('image', data.image);
    }
    createMenuItem.mutate(formData, {
      onSuccess: () => {
        closeCreateItemDialog();
      },
    });
  };
  const createMenuItem = useCreateMenuItem();

  /* Edit Item Section */
  const editItemRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (editingItem) {
      editItemRef.current?.showModal();
    }
  }, [editingItem]);
  const openEditItemDialog = (categoryId: string, item: MenuItem) => {
    setEditingItem(item);
    setSelectedCategoryId(categoryId);
    editItemRef.current?.showModal();
  };
  const closeEditItemDialog = () => {
    setEditingItem(null);
    editItemRef.current?.close();
  };
  const handleEditItemSubmit = (data: CreateMenuItemData) => {
    if (!editingItem) return;
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price.toString());
    formData.append('description', data.description);
    formData.append('category', selectedCategoryId);
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
    } else if (!data.image) {
      formData.append('image', '');
    }
    updateMenuItem.mutate(
      { id: editingItem.id, formData: formData },
      {
        onSuccess: () => {
          closeEditItemDialog();
        },
      }
    );
  };
  const updateMenuItem = useUpdateMenuItem();

  /* Create Category Section */
  const createCategoryRef = useRef<HTMLDialogElement>(null);
  const openCreateCategoryDialog = () => {
    createCategoryRef.current?.showModal();
  };
  const closeCreateCategoryDialog = () => {
    createCategoryRef.current?.close();
  };
  const handleCreateCategorySubmit = (data: CreateMenuCategoryData) => {
    const formData = data.name;
    createCategory.mutate(formData, {
      onSuccess: () => {
        closeCreateCategoryDialog();
      },
    });
  };
  const createCategory = useCreateCategory();

  /* Edit Category Section */
  const editCategoryRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (editingCategory) {
      editCategoryRef.current?.showModal();
    }
  }, [editingCategory]);
  const openEditCategoryDialog = (category: MenuCategory) => {
    setEditingCategory(category);
    editCategoryRef.current?.showModal();
  };
  const closeEditCategoryDialog = () => {
    setEditingCategory(null);
    editCategoryRef.current?.close();
  };
  const handleEditCategorySubmit = (data: CreateMenuCategoryData) => {
    if (!editingCategory) return;
    const formData = data.name;
    updateCategory.mutate(
      { id: editingCategory.id, name: formData },
      {
        onSuccess: () => {
          closeEditCategoryDialog();
        },
      }
    );
  };
  const updateCategory = useUpdateCategory();

  return (
    <div className="h-screen flex flex-col mx-30">
      <header className="w-full mb-5">
        <h1 className="font-semibold text-white text-3xl mb-5">
          Menu Management
        </h1>
      </header>

      <section className="h-15 flex justify-between items-center mb-5 pr-3">
        <button
          onClick={openCreateCategoryDialog}
          className="bg-[#3d416d] h-12 flex justify-center items-center font-normal text-lg text-white rounded-xl px-2 py-2 hover:bg-[#6974e1] transition-colors duration-300"
        >
          <Plus size={25} />
          <span className="p-1">New Category</span>
        </button>
      </section>

      <main className="w-full h-full overflow-y-auto mb-30 pr-3">
        <div className="flex flex-col">
          {categories?.map((category) => (
            <div key={category.id}>
              <header className="h-auto w-full z-10 relative shadow-xl">
                <div className="bg-[#3d416d] h-18 px-3 flex justify-between items-center rounded-xl">
                  <div className="flex items-center text-white gap-2">
                    <button
                      className="hover:text-[#fac604]"
                      onClick={() => toggleOpenItemTab(category.id)}
                    >
                      <ChevronDown
                        size={25}
                        className={clsx(
                          'transform transition-transform duration-300',
                          isOpenItemTab[category.id] ? 'rotate-180' : 'rotate-0'
                        )}
                      />
                    </button>
                    <span className="font-normal text-md">
                      {category.name.toUpperCase()}
                    </span>
                    <span className="font-normal text-md text-[#fac604]">
                      ( {category.item_count} items )
                    </span>
                  </div>

                  <div className="flex gap-3 h-12">
                    <button
                      onClick={() => openEditCategoryDialog(category)}
                      className="bg-transparent gap-2 flex justify-center items-center font-normal text-lg text-white rounded-lg hover:bg-[#6974e1] px-3 transition-colors duration-300"
                    >
                      <PencilLine size={20} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleRemoveCategory(category.id)}
                      className="bg-transparent gap-2 flex justify-center text-white items-center font-normal text-lg rounded-lg hover:bg-[#6974e1] px-3 transition-colors duration-300"
                    >
                      <Trash size={20} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </header>

              <main
                className={clsx(
                  'bg-[#3d416d] flex-1 px-2 pb-3 rounded-b-xl z-0 relative transition-all duration-400 ease-in-out overflow-hidden',
                  isOpenItemTab[category.id]
                    ? 'max-h-screen opacity-100 mb-3 -mt-5 pt-8'
                    : 'max-h-0 opacity-0'
                )}
              >
                <table className="border-separate border-spacing-y-5 w-full table-auto">
                  <thead>
                    <tr>
                      {MenuHeaders.map((header) => {
                        const key = header.name;

                        if (key === 'Actions') {
                          return (
                            <td
                              key={header.id}
                              className="font-normal text-[#fac604] text-center text-lg"
                            >
                              {header.name}
                            </td>
                          );
                        }

                        return (
                          <th
                            key={header.id}
                            className={`font-normal text-lg text-[#fac604] text-center pl-5`}
                          >
                            {header.name}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody>
                    {items
                      ?.filter(
                        (item: MenuItem) => item.category === category.id
                      )
                      .map((item: MenuItem, index: number) => (
                        <tr key={index || item.id}>
                          {MenuHeaders.map((header) => {
                            const key = header.name.toLowerCase();

                            if (key === 'price') {
                              return (
                                <td
                                  key={header.id}
                                  className="font-normal text-white text-lg text-center pl-5"
                                >
                                  $ {item[key]}
                                </td>
                              );
                            }

                            if (key === 'stock') {
                              return (
                                <td
                                  key={header.id}
                                  className="font-normal text-white text-lg text-center pl-5"
                                >
                                  {item[key]}
                                </td>
                              );
                            }

                            if (key === 'status') {
                              return (
                                <td
                                  key={header.id}
                                  className="font-normal text-white text-lg text-center pl-5"
                                >
                                  {item.lowStockThreshold ? (
                                    <span className="text-[#fac604]">
                                      Low Stock
                                    </span>
                                  ) : item.lowStockThreshold === 0 ? (
                                    <span className="text-red-500">
                                      Out of Stock
                                    </span>
                                  ) : (
                                    <span className="text-green-500">
                                      Avaiable
                                    </span>
                                  )}
                                </td>
                              );
                            }

                            if (key === 'actions') {
                              return (
                                <td
                                  key={header.id}
                                  className="font-normal text-white text-center text-lg"
                                >
                                  <div className="flex justify-center gap-3 items-center">
                                    <button
                                      onClick={() =>
                                        handleRemoveMenuItem(item.id)
                                      }
                                      className="text-red-400 hover:text-red-500 transition-colors duration-300"
                                    >
                                      <Trash size={22} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        openEditItemDialog(category.id, item)
                                      }
                                      className="text-gray-300 hover:text-gray-500 transition-colors duration-300"
                                    >
                                      <PencilLine size={22} />
                                    </button>
                                  </div>
                                </td>
                              );
                            }

                            return (
                              <td
                                key={header.id}
                                className="font-normal text-white text-center text-lg pl-5"
                              >
                                {item[key as keyof MenuItem]}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                  </tbody>
                </table>

                <div className="w-full flex justify-center items-center my-1">
                  <button
                    onClick={() => openCreateItemDialog(category.id)}
                    className="bg-trasparent p-2 gap-2 text-[#fac604] flex justify-center items-center font-normal text-lg rounded-lg hover:bg-[#6974e1] hover:text-white transition-colors duration-300"
                  >
                    <Plus size={25} />
                    <span className="pr-1">New Item</span>
                  </button>
                </div>
              </main>
            </div>
          ))}
        </div>
      </main>

      <CreateItemDialog
        ref={createItemRef}
        onClose={closeCreateItemDialog}
        onSubmit={handleCreateItemSubmit}
      />

      {editingItem && (
        <EditItemDialog
          ref={editItemRef}
          onClose={closeEditItemDialog}
          onSubmit={handleEditItemSubmit}
          initialData={editingItem}
        />
      )}

      <CreateCategoryDialog
        ref={createCategoryRef}
        onSubmit={handleCreateCategorySubmit}
        onClose={closeCreateCategoryDialog}
      />

      {editingCategory && (
        <EditCategoryDialog
          ref={editCategoryRef}
          onSubmit={handleEditCategorySubmit}
          onClose={closeEditCategoryDialog}
          initialData={editingCategory}
        />
      )}
    </div>
  );
}
