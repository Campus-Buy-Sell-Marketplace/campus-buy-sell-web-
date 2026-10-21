// ============================================================
// LAVSA — Seller Payout Service
// ============================================================

import api from './api';

export interface SellerPayoutProfile {
  id?: string;
  user_id?: string;
  upi_id: string;
  account_holder_name: string;
  phone_number?: string | null;
  bank_name?: string | null;
  bank_account_number?: string | null;
  bank_ifsc?: string | null;
  is_verified?: boolean;
  updated_at?: string;
}

export interface SellerEarnings {
  totalGross: number;
  totalCommission: number;
  totalNet: number;
  pendingPayout: number;
  completedPayout: number;
  pendingCount: number;
  completedCount: number;
  commissionRate: number;
}

export interface SellerPayoutRecord {
  id: string;
  order_id: string;
  order_amount: number;
  commission_percent: number;
  commission_amount: number;
  net_payout_amount: number;
  seller_upi_id: string;
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'CANCELLED';
  transaction_reference?: string | null;
  admin_notes?: string | null;
  paid_at?: string | null;
  created_at: string;
  order_created_at: string;
}

// GET /api/seller/payout-profile
export async function getPayoutProfile(): Promise<SellerPayoutProfile | null> {
  const { data } = await api.get<{ profile: SellerPayoutProfile | null }>('/seller/payout-profile');
  return data.profile;
}

// POST /api/seller/payout-profile
export async function savePayoutProfile(profileData: {
  upiId: string;
  accountHolderName: string;
  phoneNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
}): Promise<SellerPayoutProfile> {
  const { data } = await api.post<{ message: string; profile: SellerPayoutProfile }>(
    '/seller/payout-profile',
    profileData
  );
  return data.profile;
}

// GET /api/seller/earnings
export async function getSellerEarnings(): Promise<SellerEarnings> {
  const { data } = await api.get<SellerEarnings>('/seller/earnings');
  return data;
}

// GET /api/seller/payouts
export async function getSellerPayouts(): Promise<SellerPayoutRecord[]> {
  const { data } = await api.get<{ payouts: SellerPayoutRecord[] }>('/seller/payouts');
  return data.payouts;
}
