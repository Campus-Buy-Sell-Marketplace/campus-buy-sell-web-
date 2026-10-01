// ============================================================
// LAVSA — Cart Context
// Provides global cart state. Cart is fetched from backend
// when user logs in, and cleared when they log out.
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import * as cartService from '../services/cartService';
import { CartItem } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const fetchedItems = await cartService.getCart();
      setItems(fetchedItems);
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Reload cart whenever authentication state changes
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (productId: string, quantity = 1) => {
    await cartService.addToCart(productId, quantity);
    await refreshCart();
  }, [refreshCart]);

  const removeFromCart = useCallback(async (itemId: string) => {
    await cartService.removeFromCart(itemId);
    setItems((prev) => prev.filter((i) => i.cart_item_id !== itemId));
  }, []);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    await cartService.updateCartItem(itemId, quantity);
    setItems((prev) =>
      prev.map((i) => (i.cart_item_id === itemId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(async () => {
    await cartService.clearCart();
    setItems([]);
  }, []);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        totalPrice,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
