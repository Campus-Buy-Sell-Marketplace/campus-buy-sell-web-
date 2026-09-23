// ============================================================
// LAVSA — App Layout (Authenticated Shell) — Light Theme
// ============================================================

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME } from '../../config/appConfig';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, role, isSeller, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navLinks = buildNavLinks(role, isSeller);

  return (
    <div style={layoutStyle}>
      {/* ── Sidebar ── */}
      <aside style={sidebarStyle}>
        <div style={brandStyle}>
          <span style={brandTextStyle}>{APP_NAME}</span>
          <span style={brandDotStyle}>●</span>
        </div>

        <nav style={navStyle}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => navLinkStyle(isActive)}
            >
              <span style={{ fontSize: '17px' }}>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div style={sidebarFooterStyle}>
          <div style={userInfoStyle}>
            <div style={avatarStyle}>
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={userNameStyle}>{user?.name}</div>
              <div style={userRoleStyle}>{getRoleLabel(role, isSeller)}</div>
            </div>
          </div>
          <button style={logoutBtnStyle} onClick={handleLogout} id="logout-btn">
            ⏻ Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={mainStyle}>{children}</main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        a.nav-link:hover { background-color: #f3f4f6 !important; color: #111827 !important; }
        #logout-btn:hover { background-color: #fee2e2 !important; color: #dc2626 !important; border-color: #fecaca !important; }
      `}</style>
    </div>
  );
};

// ── Nav link builder ──────────────────────────────────────────────────────
type NavItem = { to: string; label: string; icon: string };

function buildNavLinks(role: string | null, isSeller: boolean): NavItem[] {
  const buyer: NavItem[] = [
    { to: '/home',     label: 'Home',      icon: '🏠' },
    { to: '/products', label: 'Products',  icon: '🛍️' },
    { to: '/orders',   label: 'My Orders', icon: '📦' },
    { to: '/profile',  label: 'Profile',   icon: '👤' },
    { to: '/settings', label: 'Settings',  icon: '⚙️' },
  ];
  const seller: NavItem[] = [
    { to: '/seller/dashboard', label: 'Seller Dashboard', icon: '📊' },
    { to: '/seller/products',  label: 'My Listings',      icon: '🏷️' },
    { to: '/seller/orders',    label: 'Seller Orders',     icon: '📬' },
  ];
  const admin: NavItem[] = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '🛡️' },
    { to: '/admin/users',     label: 'Users',     icon: '👥' },
    { to: '/admin/listings',  label: 'Listings',  icon: '📋' },
  ];
  const superAdmin: NavItem[] = [
    { to: '/super-admin/dashboard', label: 'SA Dashboard', icon: '⚡' },
    { to: '/super-admin/admins',    label: 'Admins',       icon: '🔑' },
  ];

  if (role === 'SUPER_ADMIN') return [...superAdmin, ...admin, ...buyer];
  if (role === 'ADMIN')       return [...admin, ...buyer];
  if (isSeller)               return [...buyer, ...seller];
  return buyer;
}

function getRoleLabel(role: string | null, isSeller: boolean): string {
  if (role === 'SUPER_ADMIN') return 'Super Admin';
  if (role === 'ADMIN')       return 'Admin';
  if (isSeller)               return 'Buyer · Seller';
  return 'Buyer';
}

// ── Styles — white light theme ────────────────────────────────────────────

const layoutStyle: React.CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f9fafb',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const sidebarStyle: React.CSSProperties = {
  width: '240px',
  minHeight: '100vh',
  backgroundColor: '#ffffff',
  borderRight: '1px solid #e5e7eb',
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
};

const brandStyle: React.CSSProperties = {
  padding: '24px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  borderBottom: '1px solid #e5e7eb',
};

const brandTextStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: '900',
  letterSpacing: '0.1em',
  color: '#111827',
};

const brandDotStyle: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '8px',
  marginTop: '4px',
};

const navStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px 10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};

const navLinkStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '9px 12px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: isActive ? '600' : '400',
  color: isActive ? '#111827' : '#6b7280',
  backgroundColor: isActive ? '#f3f4f6' : 'transparent',
  transition: 'all 0.15s ease',
});

const sidebarFooterStyle: React.CSSProperties = {
  padding: '16px',
  borderTop: '1px solid #e5e7eb',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const userInfoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const avatarStyle: React.CSSProperties = {
  width: '34px',
  height: '34px',
  borderRadius: '50%',
  backgroundColor: '#111827',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: '700',
  flexShrink: 0,
};

const userNameStyle: React.CSSProperties = {
  color: '#111827',
  fontSize: '13px',
  fontWeight: '600',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const userRoleStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '11px',
  marginTop: '1px',
};

const logoutBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  backgroundColor: 'transparent',
  color: '#6b7280',
  fontSize: '13px',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const mainStyle: React.CSSProperties = {
  flex: 1,
  padding: '32px',
  overflowY: 'auto',
};

export default AppLayout;
