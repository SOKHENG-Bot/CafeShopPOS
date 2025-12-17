/** HomePage Component **/

import { useState, useRef } from 'react';
import { Search, ChevronsRight, ChevronsLeft } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router';
import { CategoryTabs } from '@/features/menu/components/CategoryTabs';
import { MenuItemCard } from '@/features/menu/components/MenuItemCard';
import { useCart } from '@/features/cart/hooks/useCart';
import { useMenuItems, useMenuCategories } from '@/features/menu/hooks/useMenu';
import { Cart } from '@/features/cart/components/Cart';
import type { MenuItem, MenuCategory } from '@/features/menu';
import clsx from 'clsx';

export const Route = createFileRoute('/_authenticated/home')({
  component: HomeComponent,
});

function HomeComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const { AddMenuItem } = useCart();
  const { data: items } = useMenuItems();
  const { data: categories } = useMenuCategories();
  const [isOpenCart, setIsOpenCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  const categoryAll: MenuCategory = {
    id: 'all',
    name: 'All',
    order: 0,
    created_at: '',
    updated_at: '',
    item_count:
      categories?.reduce((sum, cate) => sum + (cate.item_count || 0), 0) || 0,
  };

  const nestCategory: MenuCategory[] = [categoryAll, ...(categories || [])];

  const filteredItems = items?.filter((item: MenuItem) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchSearch;
  });

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  const openCart = () => setIsOpenCart(true);
  const closeCart = () => setIsOpenCart(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleAddToCart = (items: MenuItem) => {
    AddMenuItem(items);
    openCart();
  };

  const handleSelctedCategory = (_: any, newValue: any) => {
    setSelectedCategory(newValue);
  };

  return (
    <>
      <div className="h-screen flex flex-col mx-30">
        {/* Search */}
        <header
          className={`sticky top-0 z-0 ${isOpenCart ? 'w-[70%]' : 'w-full'}`}
        >
          <div className="relative p-1 shadow-xl">
            <div className="absolute inset-y-0 left-0 px-5 flex items-center pointer-events-none">
              <Search size={30} className="text-white" />
            </div>
            <input
              id="menu item"
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-13 py-3 bg-[#3d416d] font-normal text-md text-white rounded-2xl transition-colors"
            />
          </div>

          <div className="relative flex justify-start items-center pb-5 pt-5">
            <button
              className="absolute -left-7 top-1/2 transform -translate-y-1/2 z-10 w-8 h-24 bg-transparent flex justify-center items-center"
              onClick={scrollLeft}
            >
              <ChevronsLeft
                className="text-white font-normal hover:scale-105 transition-scale duration-300"
                size={30}
              />
            </button>
            <div
              ref={containerRef}
              className="flex items-center gap-3 px-1 overflow-x-hidden scrollbar-hide shadow-xl"
            >
              {nestCategory
                ?.filter((category: MenuCategory) => category.item_count > 0)
                .map((category: MenuCategory) => (
                  <CategoryTabs
                    key={category.id}
                    categories={category}
                    isActive={category.id === selectedCategory}
                    onClick={() => handleSelctedCategory(null, category.id)}
                  />
                ))}
            </div>
            <button
              className="absolute -right-7 top-1/2 transform -translate-y-1/2 z-10 w-8 h-24 bg-transparent flex justify-center items-center"
              onClick={scrollRight}
            >
              <ChevronsRight
                className="text-white font-semibold hover:scale-105 transition-scale duration-300"
                size={30}
              />
            </button>
          </div>
        </header>

        {/* Grid Menu */}
        <main
          className={clsx(
            'flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide p-1 pr-3',
            isOpenCart ? 'w-[70%]' : 'w-full'
          )}
        >
          <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-5 pb-30 py-3">
            {filteredItems
              ?.sort((a: MenuItem, b: MenuItem) => b.stock - a.stock)
              .map((item) => (
                <MenuItemCard
                  AddToCart={handleAddToCart}
                  item={item}
                  key={item.id}
                />
              ))}
          </div>
        </main>

        {/* Cart */}
        <aside
          className={clsx(
            'bg-[#3d416d] inset-y-0 top-24 w-118 fixed right-0 flex flex-col px-5 mb-5 rounded-3xl justify-center items-center shadow-2xl transform transition-transform duration-300 ease-in-out z-0',
            isOpenCart ? '-translate-x-30' : 'translate-x-full'
          )}
        >
          <Cart isOpen={isOpenCart} onClose={closeCart} />
        </aside>
      </div>
    </>
  );
}
