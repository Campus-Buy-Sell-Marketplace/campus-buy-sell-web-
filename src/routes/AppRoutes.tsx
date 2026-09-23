// ============================================================
// LAVSA — Application Routes Configuration
// ============================================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';

// Buyer Pages
import HomePage from '../pages/buyer/HomePage';
import ProductsPage from '../pages/buyer/ProductsPage';
import ProductDetailPage from '../pages/buyer/ProductDetailPage';
import OrdersPage from '../pages/buyer/OrdersPage';
import ProfilePage from '../pages/buyer/ProfilePage';
import SettingsPage from '../pages/buyer/SettingsPage';

// Seller Pages
import SellerDashboardPage from '../pages/seller/SellerDashboardPage';
import SellerProductsPage from '../pages/seller/SellerProductsPage';
import SellerOrdersPage from '../pages/seller/SellerOrdersPage';
import SellerOnboardingPage from '../pages/seller/SellerOnboardingPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminListingsPage from '../pages/admin/AdminListingsPage';

// Super Admin Pages
import SuperAdminDashboardPage from '../pages/super-admin/SuperAdminDashboardPage';
import SuperAdminAdminsPage from '../pages/super-admin/SuperAdminAdminsPage';

// Utility Pages
import UnauthorizedPage from '../pages/UnauthorizedPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />}
      />

      {/* Public Login Route (redirects to home if already logged in) */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />}
      />

      {/* ── Buyer / General Routes ── */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/:id"
        element={
          <ProtectedRoute>
            <ProductDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* ── Seller Routes ── */}
      <Route
        path="/seller/onboarding"
        element={
          <ProtectedRoute>
            <SellerOnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/dashboard"
        element={
          <ProtectedRoute requireSeller>
            <SellerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products"
        element={
          <ProtectedRoute requireSeller>
            <SellerProductsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/orders"
        element={
          <ProtectedRoute requireSeller>
            <SellerOrdersPage />
          </ProtectedRoute>
        }
      />

      {/* ── Admin Routes ── */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/listings"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminListingsPage />
          </ProtectedRoute>
        }
      />

      {/* ── Super Admin Routes ── */}
      <Route
        path="/super-admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <SuperAdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin/admins"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <SuperAdminAdminsPage />
          </ProtectedRoute>
        }
      />

      {/* Utility Routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
