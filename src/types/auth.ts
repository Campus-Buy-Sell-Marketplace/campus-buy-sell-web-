// ============================================================
// LAVSA — Auth Types
// ============================================================

/** All possible user roles in the system (must match PostgreSQL user_role enum). */
export type UserRole = 'STUDENT' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN';

/** The shape of the authenticated user object returned by the backend. */
export interface User {
  id: string;
  name: string;
  email: string;
  /** The user's base role as assigned by the backend. */
  role: UserRole;
  /** Whether the user has seller capability activated. */
  isSeller: boolean;
  /** Profile image URL (optional). */
  avatar?: string;
  /** When the account was created. */
  createdAt?: string;
}

/** Shape of the backend auth response (login / google login). */
export interface AuthResponse {
  token: string;
  user: User;
}

/** Global authentication state managed by AuthContext. */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  /** True while auth is being restored from localStorage on app load. */
  isLoading: boolean;
}
