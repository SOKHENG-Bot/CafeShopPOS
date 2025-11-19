import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MenuProvider } from './contexts/MenuContext';
import LeftSideLayout from './layouts/LeftSideLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage.jsx';
import Menu from './pages/Menu.jsx';
import MenuItemCard from './components/MenuItemCard.jsx';
import { CartProvider } from './contexts/CardContext.jsx';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'sonner';
import { OrderProvider } from './contexts/OrderContext.jsx';
import './index.css';
import OrderPage from './pages/Orders.jsx';

const theme = createTheme({
  typography: {
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <MenuProvider>
        <OrderProvider>
          <CartProvider>
            <Toaster
              position="top-center"
              richColors
              closeButton
              toastOptions={{
                style: {
                  fontSize: '1.15rem',
                  fontWeight: '600',
                  padding: '1rem 1.5rem',
                  borderRadius: '1rem',
                  minWidth: '300px',
                },
                duration: 3000,
              }}
            />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<LeftSideLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/Orders" element={<OrderPage />} />
                <Route path="/Menu" element={<Menu />} />
                <Route path="/Inventory" element={<NotFoundPage />} />
                <Route path="/Settings" element={<MenuItemCard />} />
              </Route>
            </Routes>
          </CartProvider>
        </OrderProvider>
      </MenuProvider>
    </ThemeProvider>
  );
};
export default App;
