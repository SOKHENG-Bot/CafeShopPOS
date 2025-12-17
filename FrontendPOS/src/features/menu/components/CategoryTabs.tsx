/** CategoryTabs **/

import { MenuCategory } from '../types';
import clsx from 'clsx';

interface CategoryTabsProps {
  categories: MenuCategory;
  isActive: boolean;
  onClick?: () => void;
}

export const CategoryTabs = ({
  categories,
  isActive,
  onClick,
}: CategoryTabsProps) => {
  return (
    <>
      <button
        className={clsx(
          'min-w-35 h-18 flex flex-col rounded-2xl justify-center items-center hover:scale-101 transition-scale duration-300',
          isActive ? 'bg-[#fac604] text-black' : 'bg-[#3d416d] text-white'
        )}
        onClick={onClick}
      >
        <p
          className={clsx(
            'font-semibold text-lg',
            isActive ? 'text-black' : 'text-white'
          )}
        >
          {categories.name}
        </p>
        <p
          className={clsx(
            'font-normal text-md',
            isActive ? 'text-black' : 'text-white'
          )}
        >
          {categories.item_count} items
        </p>
      </button>
    </>
  );
};
