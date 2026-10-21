// ============================================================
// LAVSA — App Layout (Authenticated Shell) — Clean Professional
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { APP_NAME } from '../../config/appConfig';
import Footer from '../Footer/Footer';

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
            <span style={logoDotStyle}>.</span>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
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
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Profile
                  </NavLink>
                  <NavLink to="/settings" style={dropdownItemStyle} onClick={() => setDropdownOpen(false)} id="dd-settings">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
                    Settings
                  </NavLink>
                  <div style={dropdownDividerStyle} />
                  <button style={dropdownLogoutStyle} onClick={handleLogout} id="dd-logout">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Log out
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
                {link.label}
              </NavLink>
            ))}
            <NavLink to="/profile" style={({ isActive }) => mobileLinkStyle(isActive)} onClick={() => setMenuOpen(false)}>
              Profile
            </NavLink>
            <NavLink to="/settings" style={({ isActive }) => mobileLinkStyle(isActive)} onClick={() => setMenuOpen(false)}>
              Settings
            </NavLink>
            <button style={mobileLogoutStyle} onClick={handleLogout} id="mobile-logout-btn">
              Log out
            </button>
          </nav>
        )}
      </header>

      {/* ── Page content ── */}
      <main style={mainStyle}>{children}</main>

      {/* ── Compliance Footer ── */}
      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        #user-avatar-btn:hover { background-color: #f3f4f6 !important; }
        #nav-cart-icon { color: #6b7280; }
        #nav-cart-icon:hover { color: #111827; background-color: #f3f4f6 !important; }
        #dd-profile:hover, #dd-settings:hover { background-color: #f9fafb !important; color: #111827 !important; }
        #dd-logout:hover { background-color: #fef2f2 !important; color: #dc2626 !important; }
        #mobile-logout-btn:hover { background-color: #fef2f2 !important; color: #dc2626 !important; }
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
type NavItem = { to: string; label: string; icon?: string };

function buildNavLinks(role: string | null, isSeller: boolean): NavItem[] {
  const buyer: NavItem[] = [
    { to: '/home',     label: 'Home' },
    { to: '/wishlist', label: 'Wishlist' },
    { to: '/orders',   label: 'My Orders' },
  ];
  const seller: NavItem[] = [
    { to: '/seller/dashboard', label: 'Dashboard' },
    { to: '/seller/products',  label: 'My Listings' },
    { to: '/seller/orders',    label: 'Orders' },
  ];
  const admin: NavItem[] = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/users',     label: 'Users' },
    { to: '/admin/listings',  label: 'Listings' },
  ];
  const superAdmin: NavItem[] = [
    { to: '/super-admin/dashboard', label: 'SA Dashboard' },
    { to: '/super-admin/admins',    label: 'Admins' },
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
};

const innerStyle: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '0 24px',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
};

const logoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  textDecoration: 'none',
  flexShrink: 0,
};

const logoTextStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: '800',
  letterSpacing: '-0.01em',
  color: '#111827',
};

const logoDotStyle: React.CSSProperties = {
  color: '#111827',
  fontSize: '22px',
  fontWeight: '900',
  lineHeight: 1,
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
  padding: '6px 12px',
  borderRadius: '7px',
  textDecoration: 'none',
  fontSize: '13px',
  fontWeight: isActive ? '600' : '500',
  color: isActive ? '#111827' : '#6b7280',
  backgroundColor: isActive ? '#f3f4f6' : 'transparent',
  transition: 'all 0.15s ease',
  whiteSpace: 'nowrap',
});

const rightStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  marginLeft: 'auto',
  flexShrink: 0,
};

const cartIconLinkStyle = (isActive: boolean): React.CSSProperties => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  borderRadius: '7px',
  textDecoration: 'none',
  backgroundColor: isActive ? '#f3f4f6' : 'transparent',
  transition: 'all 0.15s ease',
});

const cartBubbleStyle: React.CSSProperties = {
  position: 'absolute',
  top: '4px',
  right: '4px',
  backgroundColor: '#111827',
  color: '#ffffff',
  fontSize: '8px',
  fontWeight: '700',
  borderRadius: '50%',
  width: '13px',
  height: '13px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const cartBadgeStyle: React.CSSProperties = {
  marginLeft: '4px',
  minWidth: '16px',
  height: '16px',
  borderRadius: '8px',
  backgroundColor: '#111827',
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
  gap: '7px',
  padding: '5px 10px',
  borderRadius: '7px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'background-color 0.15s ease',
};

const avatarCircleStyle: React.CSSProperties = {
  width: '27px',
  height: '27px',
  borderRadius: '50%',
  backgroundColor: '#111827',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
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
  boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
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
  width: '32px',
  height: '32px',
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
  gap: '9px',
  padding: '9px 16px',
  fontSize: '13px',
  color: '#374151',
  textDecoration: 'none',
  transition: 'background-color 0.1s ease',
};

const dropdownLogoutStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '9px',
  padding: '9px 16px',
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
  width: '34px',
  height: '34px',
  borderRadius: '7px',
  border: '1px solid #e5e7eb',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontSize: '15px',
  color: '#374151',
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
  padding: '9px 12px',
  borderRadius: '7px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: isActive ? '600' : '400',
  color: isActive ? '#111827' : '#6b7280',
  backgroundColor: isActive ? '#f3f4f6' : 'transparent',
});

const mobileLogoutStyle: React.CSSProperties = {
  marginTop: '8px',
  padding: '9px 12px',
  borderRadius: '7px',
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
