// ============================================================
// LAVSA — App Layout (Authenticated Shell)
// Sticky navbar with brand mark, role-aware nav, cart bubble,
// user dropdown and responsive mobile menu.
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { APP_NAME } from '../../config/appConfig';
import Footer from '../Footer/Footer';
import {
  IconHome,
  IconHeart,
  IconShoppingBag,
  IconCart,
  IconStore,
  IconLayoutDashboard,
  IconUsers,
  IconGrid,
  IconShield,
  IconUser,
  IconSettings,
  IconLogOut,
  IconChevronDown,
  IconX,
} from '../UI/Icons';
import type { IconProps } from '../UI/Icons';

interface AppLayoutProps {
  children: React.ReactNode;
}

type NavItem = { to: string; label: string; icon: React.FC<IconProps> };

function buildNavLinks(role: string | null, isSeller: boolean): NavItem[] {
  const buyer: NavItem[] = [
    { to: '/home', label: 'Home', icon: IconHome },
    { to: '/wishlist', label: 'Wishlist', icon: IconHeart },
    { to: '/orders', label: 'My Orders', icon: IconShoppingBag },
  ];
  const seller: NavItem[] = [
    { to: '/seller/dashboard', label: 'Seller Hub', icon: IconLayoutDashboard },
    { to: '/seller/products', label: 'My Listings', icon: IconStore },
    { to: '/seller/orders', label: 'Seller Orders', icon: IconShoppingBag },
  ];
  const admin: NavItem[] = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: IconUsers },
    { to: '/admin/listings', label: 'Listings', icon: IconGrid },
  ];
  const superAdmin: NavItem[] = [
    { to: '/super-admin/dashboard', label: 'SA Dashboard', icon: IconShield },
    { to: '/super-admin/admins', label: 'Admins', icon: IconUsers },
  ];

  if (role === 'SUPER_ADMIN') return [...superAdmin, ...admin, ...buyer];
  if (role === 'ADMIN') return [...admin, ...buyer];
  if (isSeller) return [...buyer, ...seller];
  return buyer;
}

function getRoleLabel(role: string | null, isSeller: boolean): string {
  if (role === 'SUPER_ADMIN') return 'Super Admin';
  if (role === 'ADMIN') return 'Admin';
  if (isSeller) return 'Buyer · Seller';
  return 'Buyer';
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
  const initials = user?.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <div style={outerStyle}>
      {/* ── Top Navbar ── */}
      <header style={navbarStyle}>
        <div style={innerStyle}>
          {/* Brand */}
          <NavLink to="/home" style={logoStyle} aria-label={`${APP_NAME} home`}>
            <span style={logoMarkStyle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <span style={logoTextStyle}>{APP_NAME}</span>
          </NavLink>

          {/* Desktop Nav Links */}
          <nav id="desktop-nav" style={desktopNavStyle} aria-label="Main navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `nav-pill ${isActive ? 'nav-pill-active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <link.icon size={14} strokeWidth={2.2} />
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
            <NavLink
              to="/cart"
              className="nav-icon-btn"
              id="nav-cart-icon"
              aria-label={`Cart${totalCount > 0 ? ` (${totalCount} items)` : ''}`}
            >
              <IconCart size={17} strokeWidth={2} />
              {totalCount > 0 && <span style={cartBubbleStyle}>{totalCount > 99 ? '99+' : totalCount}</span>}
            </NavLink>

            {/* User dropdown */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                style={avatarBtnStyle}
                onClick={() => setDropdownOpen((p) => !p)}
                id="user-avatar-btn"
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
              >
                <span style={avatarCircleStyle}>{initials}</span>
                <span style={userNameStyle} className="user-name-text">{user?.name?.split(' ')[0]}</span>
                <span style={{ display: 'flex', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s ease' }}>
                  <IconChevronDown size={11} color="var(--text-faint)" strokeWidth={2.4} />
                </span>
              </button>

              {dropdownOpen && (
                <div style={dropdownStyle} className="slide-up" role="menu">
                  <div style={dropdownHeaderStyle}>
                    <div style={dropdownAvatarStyle}>{initials}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={dropdownNameStyle}>{user?.name}</div>
                      <div style={dropdownRoleStyle}>{getRoleLabel(role, isSeller)}</div>
                    </div>
                  </div>
                  <div style={dropdownDividerStyle} />
                  <NavLink to="/profile" style={dropdownItemStyle} className="dd-item" onClick={() => setDropdownOpen(false)} id="dd-profile" role="menuitem">
                    <IconUser size={14} />
                    Profile
                  </NavLink>
                  <NavLink to="/settings" style={dropdownItemStyle} className="dd-item" onClick={() => setDropdownOpen(false)} id="dd-settings" role="menuitem">
                    <IconSettings size={14} />
                    Settings
                  </NavLink>
                  <div style={dropdownDividerStyle} />
                  <button style={dropdownLogoutStyle} className="dd-item" onClick={handleLogout} id="dd-logout" role="menuitem">
                    <IconLogOut size={14} />
                    Log out
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger (mobile) */}
            <button
              style={{ ...hamburgerStyle, color: menuOpen ? 'var(--text)' : 'var(--text-secondary)' }}
              onClick={() => setMenuOpen((p) => !p)}
              id="hamburger-btn"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <IconX size={17} /> : <IconMenuSvg />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <nav id="mobile-nav" style={mobileNavStyle} className="slide-up" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `mobile-link ${isActive ? 'mobile-link-active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <link.icon size={16} strokeWidth={2.1} />
                {link.label}
                {link.to === '/cart' && totalCount > 0 && (
                  <span style={cartBadgeStyle}>{totalCount > 99 ? '99+' : totalCount}</span>
                )}
              </NavLink>
            ))}
            <NavLink to="/profile" className={({ isActive }) => `mobile-link ${isActive ? 'mobile-link-active' : ''}`} onClick={() => setMenuOpen(false)}>
              <IconUser size={16} strokeWidth={2.1} />
              Profile
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `mobile-link ${isActive ? 'mobile-link-active' : ''}`} onClick={() => setMenuOpen(false)}>
              <IconSettings size={16} strokeWidth={2.1} />
              Settings
            </NavLink>
            <button style={mobileLogoutStyle} onClick={handleLogout} id="mobile-logout-btn">
              <IconLogOut size={16} />
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
        #user-avatar-btn:hover { background-color: var(--surface-muted) !important; }
        #dd-profile:hover, #dd-settings:hover { background-color: var(--surface-soft) !important; color: var(--text) !important; }
        #dd-logout:hover { background-color: var(--danger-soft) !important; color: var(--danger-strong) !important; }
        #mobile-logout-btn:hover { background-color: var(--danger-soft) !important; color: var(--danger-strong) !important; border-color: var(--danger-border) !important; }
        @media (max-width: 768px) {
          #desktop-nav { display: none !important; }
          #hamburger-btn { display: flex !important; }
          #nav-cart-icon { display: none !important; }
          #user-avatar-btn .user-name-text { display: none !important; }
        }
        @media (min-width: 769px) {
          #hamburger-btn { display: none !important; }
          #mobile-nav { display: none !important; }
        }
      `}</style>
    </div>
  );
};

const IconMenuSvg: React.FC = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

// ── Styles ────────────────────────────────────────────────────────────────

const outerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: 'var(--page-bg)',
  fontFamily: 'var(--font)',
};

const navbarStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  backgroundColor: 'rgba(255, 255, 255, 0.88)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid var(--border)',
};

const innerStyle: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '0 24px',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
};

const logoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none',
  flexShrink: 0,
};

const logoMarkStyle: React.CSSProperties = {
  width: 27,
  height: 27,
  borderRadius: 8,
  background: 'var(--brand-gradient)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'var(--shadow-brand)',
  flexShrink: 0,
};

const logoTextStyle: React.CSSProperties = {
  fontSize: '17px',
  fontWeight: 800,
  letterSpacing: '0.02em',
  color: 'var(--text)',
};

const desktopNavStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  flex: 1,
  minWidth: 0,
  overflowX: 'auto',
  scrollbarWidth: 'none',
};

const rightStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginLeft: 'auto',
  flexShrink: 0,
};

const cartBadgeStyle: React.CSSProperties = {
  marginLeft: '2px',
  minWidth: '16px',
  height: '16px',
  borderRadius: '8px',
  backgroundColor: 'var(--brand)',
  color: '#ffffff',
  fontSize: '9px',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 4px',
};

const cartBubbleStyle: React.CSSProperties = {
  position: 'absolute',
  top: '2px',
  right: '2px',
  backgroundColor: 'var(--brand)',
  color: '#ffffff',
  fontSize: '8px',
  fontWeight: 700,
  borderRadius: '50%',
  minWidth: '13px',
  height: '13px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 2px',
  border: '1.5px solid #fff',
};

const avatarBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  padding: '5px 10px',
  borderRadius: 'var(--radius-full)',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontFamily: 'var(--font)',
  transition: 'background-color 0.15s ease',
};

const avatarCircleStyle: React.CSSProperties = {
  width: '27px',
  height: '27px',
  borderRadius: '50%',
  background: 'var(--brand-gradient)',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
  fontWeight: 700,
  flexShrink: 0,
};

const userNameStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text)',
};

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 8px)',
  right: 0,
  width: '224px',
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-lg)',
  overflow: 'hidden',
  zIndex: 200,
};

const dropdownHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '14px 16px',
  backgroundColor: 'var(--surface-soft)',
};

const dropdownAvatarStyle: React.CSSProperties = {
  width: '34px',
  height: '34px',
  borderRadius: '50%',
  background: 'var(--brand-gradient)',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '13px',
  fontWeight: 700,
  flexShrink: 0,
};

const dropdownNameStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const dropdownRoleStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-faint)',
  marginTop: '1px',
};

const dropdownDividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: 'var(--border)',
};

const dropdownItemStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '9px',
  padding: '10px 16px',
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'var(--font)',
  textAlign: 'left',
  transition: 'background-color 0.1s ease',
};

const dropdownLogoutStyle: React.CSSProperties = {
  ...dropdownItemStyle,
  color: 'var(--text-secondary)',
};

const hamburgerStyle: React.CSSProperties = {
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  width: '34px',
  height: '34px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  backgroundColor: 'transparent',
  cursor: 'pointer',
};

const mobileNavStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '8px 16px 16px',
  gap: '2px',
  borderTop: '1px solid var(--border)',
  backgroundColor: 'var(--surface)',
};

const mobileLogoutStyle: React.CSSProperties = {
  marginTop: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  backgroundColor: 'transparent',
  color: 'var(--text-muted)',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'var(--font)',
  transition: 'all 0.15s ease',
};

const mainStyle: React.CSSProperties = {
  flex: 1,
  width: '100%',
  maxWidth: '1440px',
  margin: '0 auto',
  padding: 0,
};

export default AppLayout;
