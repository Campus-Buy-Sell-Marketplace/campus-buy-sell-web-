// ============================================================
// LAVSA — Protected Route Component
// ============================================================
// Wraps routes that require authentication and/or specific roles.

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactElement;
  /** If provided, the user must have one of these roles to access the route. */
  allowedRoles?: UserRole[];
  /** If true, requires isSeller === true (in addition to being authenticated). */
  requireSeller?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireSeller = false,
}) => {
  const { isAuthenticated, isLoading, role, isSeller } = useAuth();
  const location = useLocation();

  // ── Still restoring auth session — show spinner, not login ───────────────
  if (isLoading) {
    return <LoadingSpinner fullScreen message="Restoring session..." />;
  }

  // ── Not authenticated — redirect to login, preserving intended path ───────
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ── Seller-only route ─────────────────────────────────────────────────────
  if (requireSeller && !isSeller) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ── Role-based access check ───────────────────────────────────────────────
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
