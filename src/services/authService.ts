// ============================================================
// LAVSA — Auth Service
// ============================================================
// All authentication API calls live here.
// When REACT_APP_USE_MOCK_AUTH=true (or backend unreachable),
// mock credentials are used so the UI can be tested standalone.

import api from './api';
import { AUTH_TOKEN_KEY } from '../config/appConfig';
import { AuthResponse, User } from '../types/auth';

/** Persist JWT token to localStorage. */
const saveToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

/** Remove JWT token from localStorage. */
const clearToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/** Retrieve stored JWT token. */
export const getStoredToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};





// ── Email + Password Login ─────────────────────────────────────────────────
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  saveToken(data.token);
  return data;
};

// ── Google OAuth Login ─────────────────────────────────────────────────────
export const googleLogin = async (
  googleIdToken: string
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/google', {
    token: googleIdToken,
  });
  saveToken(data.token);
  return data;
};

// ── Get Current Authenticated User ────────────────────────────────────────
export const getCurrentUser = async (): Promise<User | null> => {
  const token = getStoredToken();
  if (!token) return null;
  try {
    const { data } = await api.get<User>('/auth/me');
    return (data as any)?.user || data;
  } catch {
    clearToken();
    return null;
  }
};

// ── Logout ─────────────────────────────────────────────────────────────────
export const logout = async (): Promise<void> => {
  clearToken();
  try {
    await api.post('/auth/logout');
  } catch {
    // ignore logout errors
  }
};

// ── Seller Onboarding ──────────────────────────────────────────────────────
export interface SellerOnboardingData {
  businessName: string;
  description: string;
  contactNumber: string;
}

export const applyAsSeller = async (data: SellerOnboardingData): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/seller/apply', data);
  return response.data;
};
