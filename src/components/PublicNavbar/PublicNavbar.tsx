// ============================================================
// LAVSA — Public Navbar — for landing, login & legal pages
// Brand mark + centered search + auth actions.
// ============================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../../config/appConfig';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { IconCart, IconSearch } from '../UI/Icons';

const PublicNavbar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header style={navbarStyle}>
      <div style={innerStyle}>
        {/* Brand */}
        <Link to="/" style={logoStyle} aria-label={`${APP_NAME} home`}>
          <span style={logoMarkStyle}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
          <span style={logoTextStyle}>{APP_NAME}</span>
        </Link>

        {/* Search — center, full width */}
        <form onSubmit={handleSearch} style={searchFormStyle} role="search">
          <div style={searchWrapStyle}>
            <span style={{ display: 'flex', flexShrink: 0, color: 'var(--text-faint)' }}>
              <IconSearch size={15} />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={searchInputStyle}
              id="public-search-input"
              aria-label="Search products"
            />
          </div>
        </form>

        {/* Right: auth actions */}
        <div style={actionsStyle}>
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="pubnav-icon-btn" id="navbar-cart-btn" aria-label={`Cart (${totalCount} items)`}>
                <IconCart size={17} />
                {totalCount > 0 && <span style={cartBadgeStyle}>{totalCount}</span>}
              </Link>
              <Link to="/home" className="pubnav-account-btn" id="navbar-dashboard-btn">
                <span style={avatarStyle}>{user?.name?.charAt(0).toUpperCase()}</span>
                <span>My Account</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="pubnav-login" id="navbar-login-btn">Login</Link>
              <Link to="/login" className="btn btn-dark btn-sm" id="navbar-signup-btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        #navbar-login-btn:hover { color: var(--text) !important; }
        #navbar-dashboard-btn:hover { background: var(--surface-muted) !important; }
        #navbar-cart-btn:hover { background: var(--surface-muted) !important; }
        @media (max-width: 560px) {
          .pubnav-account-btn span:last-child { display: none !important; }
          #navbar-login-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};

const navbarStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  backgroundColor: 'rgba(255, 255, 255, 0.88)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid var(--border)',
  fontFamily: 'var(--font)',
};

const innerStyle: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '0 20px',
  height: '58px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const logoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none',
  flexShrink: 0,
};

const logoMarkStyle: React.CSSProperties = {
  width: 26,
  height: 26,
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

const searchFormStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const searchWrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  height: '38px',
  padding: '0 14px',
  borderRadius: 'var(--radius-full)',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--surface-soft)',
  transition: 'border-color 0.15s ease, background-color 0.15s ease',
};
const searchInputStyle: React.CSSProperties = {
  flex: 1,
  border: 'none',
  background: 'transparent',
  color: 'var(--text)',
  fontSize: '14px',
  fontFamily: 'var(--font)',
  outline: 'none',
  minWidth: 0,
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
};

const cartBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '2px',
  right: '2px',
  backgroundColor: 'var(--brand)',
  color: '#fff',
  fontSize: '8px',
  fontWeight: 700,
  borderRadius: '50%',
  minWidth: '14px',
  height: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 2px',
  border: '1.5px solid #fff',
};

const avatarStyle: React.CSSProperties = {
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  background: 'var(--brand-gradient)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
  fontWeight: 700,
  flexShrink: 0,
};

export default PublicNavbar;
