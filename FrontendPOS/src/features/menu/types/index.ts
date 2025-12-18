/** Menu Feature - TypeScript Types **/

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image: string;
  image_url: string;
  stock: number;
  lowStockThreshold?: number;
}

export interface CreateMenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: File;
}

export interface MenuCategory {
  id: string;
  name: string;
  order: number;
  created_at: string;
  updated_at: string;
  item_count: number;
}

export interface CreateMenuCategoryData {
  id: string;
  name: string;
}

export interface MenuFilters {
  categoryId?: string | null;
  searchQuery?: string;
}

export interface MenuState {
  items: MenuItem[];
  categories: MenuCategory[];
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;
}
