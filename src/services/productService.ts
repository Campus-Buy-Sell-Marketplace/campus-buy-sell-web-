// ============================================================
// LAVSA — Product Service
// ============================================================

import api from './api';

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  category?: string;
  condition?: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';
  image_url?: string;
  stock: number;
  seller_name: string;
  seller_id: string;
  created_at: string;
  is_active?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

// ── Public: get all active products (no auth needed) ─────────────────────────
export const getProducts = async (params?: {
  category?: string;
  q?: string;
  limit?: number;
  offset?: number;
}): Promise<ProductsResponse> => {
  const { data } = await api.get<ProductsResponse>('/products', { params });
  return data;
};

// ── Public: get a single product by ID ────────────────────────────────────────
export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await api.get<{ product: Product }>(`/products/${id}`);
  return data.product;
};

// ── Seller: get my own listings ────────────────────────────────────────────────
export const getMyProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<{ products: Product[] }>('/products/seller/my-listings');
  return data.products;
};

// ── Seller: create a product ────────────────────────────────────────────────────
export const createProduct = async (payload: {
  title: string;
  description?: string;
  price: number;
  category?: string;
  condition?: string;
  image_url?: string;
  stock?: number;
}): Promise<Product> => {
  const { data } = await api.post<{ product: Product }>('/products', payload);
  return data.product;
};

// ── Seller: update a product ─────────────────────────────────────────────────
export const updateProduct = async (
  id: string,
  payload: Partial<{
    title: string;
    description: string;
    price: number;
    category: string;
    condition: string;
    image_url: string;
    stock: number;
    is_active: boolean;
  }>
): Promise<Product> => {
  const { data } = await api.patch<{ product: Product }>(`/products/${id}`, payload);
  return data.product;
};

// ── Seller: delete a product ─────────────────────────────────────────────────
export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};
