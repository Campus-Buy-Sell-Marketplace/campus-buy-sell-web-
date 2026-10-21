// ============================================================
// UniTrade — Public Navbar — Minimal (Amazon/Flipkart style)
// ============================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../../config/appConfig';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

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
        {/* Logo */}
        <Link to="/" style={logoStyle}>
          <span style={logoTextStyle}>{APP_NAME}</span>
          <span style={logoDotStyle}>.</span>
        </Link>

        {/* Search — center, full width */}
        <form onSubmit={handleSearch} style={searchFormStyle}>
          <div style={searchWrapStyle}>
            <svg style={{ flexShrink: 0, color: '#9ca3af' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={searchInputStyle}
              id="public-search-input"
            />
          </div>
        </form>

        {/* Right: auth actions */}
        <div style={actionsStyle}>
          {isAuthenticated ? (
            <>
              <Link to="/cart" style={cartLinkStyle} id="navbar-cart-btn">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                {totalCount > 0 && <span style={cartBadgeStyle}>{totalCount}</span>}
              </Link>
              <Link to="/home" style={dashboardBtnStyle} id="navbar-dashboard-btn">
                <span style={avatarStyle}>{user?.name?.charAt(0).toUpperCase()}</span>
                <span>My Account</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" style={loginLinkStyle} id="navbar-login-btn">Login</Link>
              <Link to="/login" style={signupBtnStyle} id="navbar-signup-btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        #public-search-input::placeholder { color: #9ca3af; }
        #public-search-input:focus { outline: none; }
        #navbar-login-btn:hover { color: #111827 !important; }
        #navbar-signup-btn:hover { background: #374151 !important; }
        #navbar-dashboard-btn:hover { background: #f3f4f6 !important; }
        #navbar-cart-btn:hover { background: #f3f4f6 !important; }
      `}</style>
    </header>
  );
};

const navbarStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e5e7eb',
  fontFamily: "'Inter', system-ui, sans-serif",
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
  alignItems: 'baseline',
  textDecoration: 'none',
  flexShrink: 0,
};

const logoTextStyle: React.CSSProperties = {
  fontSize: '19px',
  fontWeight: '800',
  letterSpacing: '-0.01em',
  color: '#111827',
};

const logoDotStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: '900',
  color: '#111827',
};

const searchFormStyle: React.CSSProperties = {
  flex: 1,
};

const searchWrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  height: '38px',
  padding: '0 14px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
};

const searchInputStyle: React.CSSProperties = {
  flex: 1,
  border: 'none',
  background: 'transparent',
  color: '#111827',
  fontSize: '14px',
  fontFamily: "'Inter', system-ui, sans-serif",
  outline: 'none',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
};

const loginLinkStyle: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: '13px',
  fontWeight: '500',
  color: '#6b7280',
  textDecoration: 'none',
  borderRadius: '6px',
  transition: 'color 0.15s',
};

const signupBtnStyle: React.CSSProperties = {
  padding: '7px 16px',
  fontSize: '13px',
  fontWeight: '600',
  color: '#ffffff',
  backgroundColor: '#111827',
  textDecoration: 'none',
  borderRadius: '7px',
  transition: 'background 0.15s',
};

const cartLinkStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  color: '#374151',
  textDecoration: 'none',
  transition: 'background 0.15s',
};

const cartBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '2px',
  right: '2px',
  backgroundColor: '#111827',
  color: '#fff',
  fontSize: '8px',
  fontWeight: '700',
  borderRadius: '50%',
  width: '14px',
  height: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const dashboardBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  padding: '5px 12px 5px 6px',
  borderRadius: '8px',
  textDecoration: 'none',
  color: '#374151',
  fontSize: '13px',
  fontWeight: '500',
  transition: 'background 0.15s',
};

const avatarStyle: React.CSSProperties = {
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  backgroundColor: '#111827',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
  fontWeight: '700',
  flexShrink: 0,
};

export default PublicNavbar;
