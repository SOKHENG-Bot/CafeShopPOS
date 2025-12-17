/** Inventory Feature - TypeScript Types **/

export interface InventoryItem {
  id: string;
  menu_item: string;
  menu_item_name: string;
  menu_item_id: number;
  category_name: string;
  category_id: number;
  category: string;
  quantity: number;
  minimum_quantity: number;
  is_low_stock: boolean;
}

export interface CreateInventoryItem {
  menu_item: string;
  quantity: number;
  minimum_quantity: number;
}

export interface AdjustmentInventoryItem {
  id: string;
  inventory_item: number;
  change: number;
  created_by: string;
  updated_at: string;
}
