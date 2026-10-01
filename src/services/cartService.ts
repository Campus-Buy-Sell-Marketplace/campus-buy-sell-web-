// ============================================================
// LAVSA — Cart Service
// ============================================================

import api from './api';

export interface CartItem {
  cart_item_id: string;
  product_id: string;
  title: string;
  price: number;
  image_url?: string;
  stock: number;
  is_active: boolean;
  quantity: number;
  seller_name: string;
  added_at: string;
}

export interface CartResponse {
  items: CartItem[];
}

// ── Get cart ───────────────────────────────────────────────────────────────────
export const getCart = async (): Promise<CartItem[]> => {
  const { data } = await api.get<CartResponse>('/cart');
  return data.items;
};

// ── Add or increment item ──────────────────────────────────────────────────────
export const addToCart = async (
  productId: string,
  quantity = 1
): Promise<CartItem> => {
  const { data } = await api.post<{ item: CartItem }>('/cart', { productId, quantity });
  return data.item;
};

// ── Update quantity ────────────────────────────────────────────────────────────
export const updateCartItem = async (
  itemId: string,
  quantity: number
): Promise<CartItem> => {
  const { data } = await api.patch<{ item: CartItem }>(`/cart/${itemId}`, { quantity });
  return data.item;
};

// ── Remove single item ─────────────────────────────────────────────────────────
export const removeFromCart = async (itemId: string): Promise<void> => {
  await api.delete(`/cart/${itemId}`);
};

// ── Clear entire cart ──────────────────────────────────────────────────────────
export const clearCart = async (): Promise<void> => {
  await api.delete('/cart');
};
