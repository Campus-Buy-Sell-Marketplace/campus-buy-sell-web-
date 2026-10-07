// ============================================================
// LAVSA — App Layout (Authenticated Shell) — Top Navbar
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { APP_NAME } from '../../config/appConfig';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, role, isSeller, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = buildNavLinks(role, isSeller);

  return (
    <div style={outerStyle}>
      {/* ── Top Navbar ── */}
      <header style={navbarStyle}>
        <div style={innerStyle}>
          {/* Logo */}
          <NavLink to="/home" style={logoStyle}>
            <span style={logoTextStyle}>{APP_NAME}</span>
            <span style={logoDotStyle}>●</span>
          </NavLink>

          {/* Desktop Nav Links */}
          <nav id="desktop-nav" style={desktopNavStyle}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => navLinkStyle(isActive)}
                onClick={() => setMenuOpen(false)}
              >
                <span style={{ fontSize: '15px' }}>{link.icon}</span>
                {link.label}
                {link.to === '/cart' && totalCount > 0 && (
                  <span style={cartBadgeStyle}>{totalCount > 99 ? '99+' : totalCount}</span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: Cart + User Avatar + Hamburger */}
          <div style={rightStyle}>
            {/* Cart shortcut (desktop) */}
            <NavLink to="/cart" style={({ isActive }) => cartIconLinkStyle(isActive)} id="nav-cart-icon">
              <span style={{ fontSize: '20px' }}>🛒</span>
              {totalCount > 0 && (
                <span style={cartBubbleStyle}>{totalCount > 99 ? '99+' : totalCount}</span>
              )}
            </NavLink>

            {/* User dropdown */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                style={avatarBtnStyle}
                onClick={() => setDropdownOpen((p) => !p)}
                id="user-avatar-btn"
                aria-expanded={dropdownOpen}
              >
                <span style={avatarCircleStyle}>{user?.name?.charAt(0).toUpperCase() ?? 'U'}</span>
                <span style={userNameStyle}>{user?.name?.split(' ')[0]}</span>
                <span style={{ fontSize: '10px', color: '#9ca3af', marginLeft: '2px' }}>▾</span>
              </button>

              {dropdownOpen && (
                <div style={dropdownStyle}>
                  <div style={dropdownHeaderStyle}>
                    <div style={dropdownAvatarStyle}>{user?.name?.charAt(0).toUpperCase() ?? 'U'}</div>
                    <div>
                      <div style={dropdownNameStyle}>{user?.name}</div>
                      <div style={dropdownRoleStyle}>{getRoleLabel(role, isSeller)}</div>
                    </div>
                  </div>
                  <div style={dropdownDividerStyle} />
                  <NavLink to="/profile" style={dropdownItemStyle} onClick={() => setDropdownOpen(false)} id="dd-profile">
                    👤 Profile
                  </NavLink>
                  <NavLink to="/settings" style={dropdownItemStyle} onClick={() => setDropdownOpen(false)} id="dd-settings">
                    ⚙️ Settings
                  </NavLink>
                  <div style={dropdownDividerStyle} />
                  <button style={dropdownLogoutStyle} onClick={handleLogout} id="dd-logout">
                    ⏻ Logout
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger (mobile) */}
            <button
              style={hamburgerStyle}
              onClick={() => setMenuOpen((p) => !p)}
              id="hamburger-btn"
              aria-label="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <nav id="mobile-nav" style={mobileNavStyle}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => mobileLinkStyle(isActive)}
                onClick={() => setMenuOpen(false)}
              >
                <span>{link.icon}</span>
                {link.label}
                {link.to === '/cart' && totalCount > 0 && (
                  <span style={cartBadgeStyle}>{totalCount > 99 ? '99+' : totalCount}</span>
                )}
              </NavLink>
            ))}
            <NavLink to="/profile" style={({ isActive }) => mobileLinkStyle(isActive)} onClick={() => setMenuOpen(false)}>
              👤 Profile
            </NavLink>
            <NavLink to="/settings" style={({ isActive }) => mobileLinkStyle(isActive)} onClick={() => setMenuOpen(false)}>
              ⚙️ Settings
            </NavLink>
            <button style={mobileLogoutStyle} onClick={handleLogout} id="mobile-logout-btn">
              ⏻ Logout
            </button>
          </nav>
        )}
      </header>

      {/* ── Page content ── */}
      <main style={mainStyle}>{children}</main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        #user-avatar-btn:hover { background-color: #f3f4f6 !important; }
        #nav-cart-icon:hover { opacity: 0.8; }
        #dd-profile:hover, #dd-settings:hover { background-color: #f3f4f6 !important; color: #111827 !important; }
        #dd-logout:hover { background-color: #fee2e2 !important; color: #dc2626 !important; }
        #mobile-logout-btn:hover { background-color: #fee2e2 !important; color: #dc2626 !important; }
        @media (max-width: 768px) {
          #desktop-nav { display: none !important; }
          #hamburger-btn { display: flex !important; }
          #nav-cart-icon { display: none !important; }
        }
        @media (min-width: 769px) {
          #hamburger-btn { display: none !important; }
          #mobile-nav { display: none !important; }
        }
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
    { to: '/wishlist', label: 'Wishlist',  icon: '❤️' },
    { to: '/orders',   label: 'My Orders', icon: '📦' },
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

// ── Styles ────────────────────────────────────────────────────────────────

const outerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#f9fafb',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const navbarStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};

const innerStyle: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '0 24px',
  height: '64px',
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
};

const logoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  textDecoration: 'none',
  flexShrink: 0,
};

const logoTextStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: '900',
  letterSpacing: '0.08em',
  color: '#111827',
};

const logoDotStyle: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '7px',
  marginTop: '4px',
};

const desktopNavStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  flex: 1,
};

const navLinkStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '7px 12px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '13.5px',
  fontWeight: isActive ? '600' : '500',
  color: isActive ? '#111827' : '#6b7280',
  backgroundColor: isActive ? '#f3f4f6' : 'transparent',
  transition: 'all 0.15s ease',
  whiteSpace: 'nowrap',
});

const rightStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginLeft: 'auto',
  flexShrink: 0,
};

const cartIconLinkStyle = (isActive: boolean): React.CSSProperties => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  padding: '7px',
  borderRadius: '8px',
  textDecoration: 'none',
  backgroundColor: isActive ? '#f3f4f6' : 'transparent',
  transition: 'opacity 0.15s ease',
});

const cartBubbleStyle: React.CSSProperties = {
  position: 'absolute',
  top: '2px',
  right: '2px',
  backgroundColor: '#ef4444',
  color: '#ffffff',
  fontSize: '9px',
  fontWeight: '700',
  borderRadius: '50%',
  width: '15px',
  height: '15px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const cartBadgeStyle: React.CSSProperties = {
  marginLeft: '4px',
  minWidth: '17px',
  height: '17px',
  borderRadius: '9px',
  backgroundColor: '#ef4444',
  color: '#ffffff',
  fontSize: '9px',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 4px',
};

const avatarBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 10px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'background-color 0.15s ease',
};

const avatarCircleStyle: React.CSSProperties = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  backgroundColor: '#111827',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: '700',
  flexShrink: 0,
};

const userNameStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#111827',
};

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 8px)',
  right: 0,
  width: '210px',
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '10px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
  overflow: 'hidden',
  zIndex: 200,
};

const dropdownHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '14px 16px',
};

const dropdownAvatarStyle: React.CSSProperties = {
  width: '34px',
  height: '34px',
  borderRadius: '50%',
  backgroundColor: '#111827',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '13px',
  fontWeight: '700',
  flexShrink: 0,
};

const dropdownNameStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#111827',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const dropdownRoleStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#9ca3af',
  marginTop: '1px',
};

const dropdownDividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: '#f3f4f6',
};

const dropdownItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 16px',
  fontSize: '13px',
  color: '#374151',
  textDecoration: 'none',
  transition: 'background-color 0.1s ease',
};

const dropdownLogoutStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 16px',
  fontSize: '13px',
  color: '#374151',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'background-color 0.1s ease',
};

const hamburgerStyle: React.CSSProperties = {
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontSize: '16px',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const mobileNavStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '8px 16px 16px',
  gap: '2px',
  borderTop: '1px solid #e5e7eb',
  backgroundColor: '#ffffff',
};

const mobileLinkStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 12px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: isActive ? '600' : '400',
  color: isActive ? '#111827' : '#6b7280',
  backgroundColor: isActive ? '#f3f4f6' : 'transparent',
});

const mobileLogoutStyle: React.CSSProperties = {
  marginTop: '8px',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  backgroundColor: 'transparent',
  color: '#6b7280',
  fontSize: '14px',
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'all 0.15s ease',
};

const mainStyle: React.CSSProperties = {
  flex: 1,
  padding: '32px 24px',
  maxWidth: '1400px',
  width: '100%',
  margin: '0 auto',
  boxSizing: 'border-box',
};

export default AppLayout;
