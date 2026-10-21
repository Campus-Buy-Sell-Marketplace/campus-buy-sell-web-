// ============================================================
// LAVSA — Application Routes Configuration
// ============================================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import TermsPage from '../pages/public/TermsPage';
import PrivacyPage from '../pages/public/PrivacyPage';
import RefundPolicyPage from '../pages/public/RefundPolicyPage';
import ShippingPolicyPage from '../pages/public/ShippingPolicyPage';
import ContactUsPage from '../pages/public/ContactUsPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';

// Buyer Pages
import HomePage from '../pages/buyer/HomePage';
import ProductsPage from '../pages/buyer/ProductsPage';
import ProductDetailPage from '../pages/buyer/ProductDetailPage';
import OrdersPage from '../pages/buyer/OrdersPage';
import ProfilePage from '../pages/buyer/ProfilePage';
import SettingsPage from '../pages/buyer/SettingsPage';
import CartPage from '../pages/buyer/CartPage';
import WishlistPage from '../pages/buyer/WishlistPage';
import ChatPage from '../pages/buyer/ChatPage';

// Seller Pages
import SellerSignInPage from '../pages/seller/SellerSignInPage';
import SellerDashboardPage from '../pages/seller/SellerDashboardPage';
import SellerProductsPage from '../pages/seller/SellerProductsPage';
import SellerOrdersPage from '../pages/seller/SellerOrdersPage';
import SellerOnboardingPage from '../pages/seller/SellerOnboardingPage';
import SellerPayoutsPage from '../pages/seller/SellerPayoutsPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminListingsPage from '../pages/admin/AdminListingsPage';
import AdminPayoutsPage from '../pages/admin/AdminPayoutsPage';

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
      {/* ── Root: public landing page for everyone ── */}
      <Route path="/" element={<LandingPage />} />

      {/* ── Public Regulatory & Policy Pages (Razorpay Compliance) ── */}
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/terms-and-conditions" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/privacy-policy" element={<PrivacyPage />} />
      <Route path="/refund-policy" element={<RefundPolicyPage />} />
      <Route path="/cancellation-and-refund" element={<RefundPolicyPage />} />
      <Route path="/refunds" element={<RefundPolicyPage />} />
      <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
      <Route path="/shipping-and-delivery" element={<ShippingPolicyPage />} />
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route path="/contact" element={<ContactUsPage />} />

      {/* Public Login Route (redirects to home if already logged in) */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />}
      />

      {/* ── Public product routes (no auth needed) ── */}
      {/* These redirect to the same pages but inside authenticated layout when logged in */}

      {/* ── Buyer / General Routes ── */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="/products" element={<Navigate to="/home" replace />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
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
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:orderId"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      {/* ── Seller Routes ── */}
      {/* Seller Sign-In — accessible to any authenticated user */}
      <Route
        path="/seller/sign-in"
        element={
          <ProtectedRoute>
            <SellerSignInPage />
          </ProtectedRoute>
        }
      />
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
      <Route
        path="/seller/payouts"
        element={
          <ProtectedRoute requireSeller>
            <SellerPayoutsPage />
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
      <Route
        path="/admin/payouts"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminPayoutsPage />
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
