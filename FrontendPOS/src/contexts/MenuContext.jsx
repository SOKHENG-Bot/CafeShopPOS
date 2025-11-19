import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

const baseURL = 'http://localhost:8000';
const MenuContext = createContext(undefined);

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        const [menuResponse, categoriesResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/menu/menu-items/'),
          axios.get('http://localhost:8000/api/menu/categories/')
        ]);

        setMenuItems(menuResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Failed to fetch menu data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, []);

  // CREATE Menu Item
  const createMenuItem = async (itemData) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/menu/menu-items/`,
        itemData, { headers: { "Content-Type": "multipart/form-data" } }
      );
      const newItem = response.data;

      setMenuItems((prev) => [...prev, newItem]);
      return newItem;
    } catch (error) {
      console.error('Failed to create item:', error);
      throw error;
    }
  };

  // UPDATE Menu Item
  const updateMenuItem = async (id, updateData) => {
    try {
      const response = await axios.patch(
        `${baseURL}/api/menu/menu-items/${id}/`,
        updateData, { headers: { "Content-Type": "multipart/form-data" } }
      );
      const updatedItem = response.data;

      setMenuItems((prev) =>
        prev.map((item) =>
          (item.id == id ? { ...item, ...updatedItem } : item))
      );
      return updatedItem;
    } catch (error) {
      console.error('Failed to update item:', error);
      alert('Failed to save changes');
      throw error;
    };
  };

  // DELETE Menu Item
  const deleteMenuItem = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/menu/menu-items/${id}/`);
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Could not delete item');
      throw error;
    };
  };

  // UPDATE Item Stock
  const updateStock = async (menuItemId, quantity) => {
    try {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === menuItemId ? { ...item, ...quantity } : item
        )
      );
    } catch (error) {
      console.error("Failed to update stock:", error);
      throw error;
    }
  };

  // CREATE category
  const createCategory = async (categoryData) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/menu/categories/`,
        categoryData
      );
      const newCategory = response.data;

      setCategories((prev) => [...prev, { ...categoryData }]);
      return newCategory;
    } catch (error) {
      console.error("Failed to create categories:", error);
      throw error
    };
  };

  // UPDATE category
  const updateCategory = async (id, updateData) => {
    try {
      const response = await axios.put(
        `${baseURL}/api/menu/categories/${id}/`,
        updateData
      );
      const updateCategory = response.data;

      setCategories((prev) =>
        prev.map(cate =>
          (cate.id == id ? updateCategory : cate))
      );
      return updateCategory;
    } catch (error) {
      console.error("Failed to update categories:", error);
      alert("Failed to save changes.")
      throw error;
    }
  };

  // DELETE category
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/menu/categories/${id}/`)
      setCategories((prev) => prev.filter((cate) => cate.id !== id));
    } catch (error) {
      console.error("Failed to delete categories:", error);
      alert("Cannot delete categories.")
      throw error;
    }
  };

  const values = {
    menuItems,
    categories,
    loading,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    createCategory,
    updateCategory,
    deleteCategory,
    updateStock,
  };

  return <MenuContext.Provider value={values}>{children}</MenuContext.Provider>;
};

export { MenuContext };
