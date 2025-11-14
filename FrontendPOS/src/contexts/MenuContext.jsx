import axios from "axios";
import { createContext, useEffect, useState } from "react";

const baseURL = "http://localhost:8000";
const MenuContext = createContext(undefined);

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/menu/menu-items/`);
        const data = response.data;

        if (data.items) {
          setMenuItems(data.items);
          localStorage.setItem("menuItems", JSON.stringify(data.items));
        }
        if (data.categories) {
          setCategories(data.categories);
          localStorage.setItem("categories", JSON.stringify(data.categories));
        }
      } catch (error) {
        console.error("Failed to fetch menu data:", error);
        // Fallback to localStorage if API fails
        const storedMenuItems = localStorage.getItem("menuItems");
        const storedCategories = localStorage.getItem("categories");
        if (storedMenuItems) setMenuItems(JSON.parse(storedMenuItems));
        if (storedCategories) setCategories(JSON.parse(storedCategories));
      }
    };
    loadMenuData();
  }, []);

  const createMenuItem = (item) => {
    setMenuItems((prev) => [...prev, { ...item }]);
  };

  const updateMenuItem = (id, updateData) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id == id ? { ...item, ...updateData } : item))
    );
  };

  const deleteMenuItem = (id) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const createCategory = (category) => {
    setCategories((prev) => [...prev, { ...category }]);
  };

  const updateCategory = (id, updateData) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, ...updateData } : category
      )
    );
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  const updateStock = (menuItemId, quantity) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === menuItemId ? { ...item, ...quantity } : item
      )
    );
  };

  const values = {
    menuItems,
    categories,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    createCategory,
    updateCategory,
    deleteCategory,
    updateStock,
  };

  return (
    <MenuContext.Provider value={values}>
      {children}
    </MenuContext.Provider>
  )
};

export { MenuContext };
