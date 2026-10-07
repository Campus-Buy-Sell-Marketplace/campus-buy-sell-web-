// ============================================================
// Campus Marketplace — User Service
// Handles preferences (settings) and wishlist API calls.
// ============================================================

import api from './api';
import { Product } from './productService';

// ── Preferences ───────────────────────────────────────────────────────────────

export interface UserPreferences {
  email_notifications: boolean;
}

export async function getPreferences(): Promise<UserPreferences> {
  const res = await api.get('/user/preferences');
  return res.data;
}

export async function savePreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
  const res = await api.patch('/user/preferences', prefs);
  return res.data;
}

// ── Wishlist ──────────────────────────────────────────────────────────────────

export interface WishlistItem extends Product {
  wishlist_id: string;
  added_at: string;
}

export async function getWishlist(): Promise<WishlistItem[]> {
  const res = await api.get('/user/wishlist');
  return res.data.wishlist;
}

export async function getWishlistIds(): Promise<string[]> {
  const res = await api.get('/user/wishlist/ids');
  return res.data.ids;
}

export async function addToWishlist(productId: string): Promise<void> {
  await api.post('/user/wishlist', { product_id: productId });
}

export async function removeFromWishlist(productId: string): Promise<void> {
  await api.delete(`/user/wishlist/${productId}`);
}
