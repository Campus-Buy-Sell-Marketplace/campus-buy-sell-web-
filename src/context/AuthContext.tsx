// ============================================================
// LAVSA — Auth Context
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { User, UserRole } from '../types/auth';
import * as authService from '../services/authService';

// ── Context shape ──────────────────────────────────────────────────────────
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  /** True while auth is being restored on app load (prevents flash-to-login). */
  isLoading: boolean;
  role: UserRole | null;
  isSeller: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (googleIdToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ── On mount: restore session from stored JWT ────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  // ── Email + Password login ───────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const { user: loggedInUser } = await authService.login(email, password);
    setUser(loggedInUser);
  }, []);

  // ── Google login ─────────────────────────────────────────────────────────
  const googleLogin = useCallback(async (googleIdToken: string) => {
    const { user: loggedInUser } = await authService.googleLogin(googleIdToken);
    setUser(loggedInUser);
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  // ── Re-fetch current user (e.g. after seller activation) ─────────────────
  const refreshUser = useCallback(async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    role: user?.role ?? null,
    isSeller: user?.isSeller ?? false,
    login,
    googleLogin,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ── Hook ───────────────────────────────────────────────────────────────────
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
