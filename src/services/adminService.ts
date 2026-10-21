// ============================================================
// LAVSA — Admin Service
// ============================================================
// API calls for Admin dashboard features.
// Uses the shared axios instance (auto-attaches JWT token).

import api from './api';

export interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  totalStudents: number;
  totalAdmins: number;
  pendingApplications?: number;
  pendingPayoutsCount?: number;
  pendingPayoutsAmount?: number;
  platformCommissionEarned?: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  created_at: string;
}

export interface SellerApplication {
  id: string;
  user_id: string;
  business_name: string;
  description: string;
  contact_number: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_email: string;
  user_role: string;
}

export interface AdminPayout {
  id: string;
  order_id: string;
  seller_id: string;
  order_amount: number;
  commission_percent: number;
  commission_amount: number;
  net_payout_amount: number;
  seller_upi_id: string;
  account_holder_name?: string | null;
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'CANCELLED';
  transaction_reference?: string | null;
  admin_notes?: string | null;
  paid_at?: string | null;
  created_at: string;
  seller_name: string;
  seller_email: string;
  seller_phone?: string | null;
  payment_method: string;
  order_created_at: string;
}

// GET /api/admin/stats
export async function fetchStats(): Promise<AdminStats> {
  const { data } = await api.get<AdminStats>('/admin/stats');
  return data;
}

// GET /api/admin/users
export async function fetchUsers(): Promise<AdminUser[]> {
  const { data } = await api.get<{ users: AdminUser[] }>('/admin/users');
  return data.users;
}

// PATCH /api/admin/users/:id/role
export async function updateUserRole(userId: string, role: string): Promise<AdminUser> {
  const { data } = await api.patch<{ user: AdminUser }>(`/admin/users/${userId}/role`, { role });
  return data.user;
}

// GET /api/admin/seller-applications
export async function fetchSellerApplications(): Promise<SellerApplication[]> {
  const { data } = await api.get<{ applications: SellerApplication[] }>('/admin/seller-applications');
  return data.applications;
}

// PATCH /api/admin/seller-applications/:id/status
export async function updateSellerApplicationStatus(
  applicationId: string,
  status: 'APPROVED' | 'REJECTED',
  adminNotes?: string
): Promise<SellerApplication> {
  const { data } = await api.patch<{ application: SellerApplication }>(
    `/admin/seller-applications/${applicationId}/status`,
    { status, adminNotes }
  );
  return data.application;
}

// GET /api/admin/payouts
export async function fetchPayouts(status?: string): Promise<AdminPayout[]> {
  const params = status && status !== 'ALL' ? { status } : {};
  const { data } = await api.get<{ payouts: AdminPayout[] }>('/admin/payouts', { params });
  return data.payouts;
}

// PATCH /api/admin/payouts/:id/mark-paid
export async function markPayoutAsPaid(
  payoutId: string,
  transactionReference: string,
  adminNotes?: string
): Promise<AdminPayout> {
  const { data } = await api.patch<{ payout: AdminPayout }>(
    `/admin/payouts/${payoutId}/mark-paid`,
    { transactionReference, adminNotes }
  );
  return data.payout;
}
