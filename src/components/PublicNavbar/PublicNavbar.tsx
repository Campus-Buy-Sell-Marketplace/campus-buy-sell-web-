// ============================================================
// LAVSA — Public Top Navbar
// Shown on public pages (landing, products) before login.
// Has: Logo | Search | Sign In | Cart
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
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header style={navbarStyle}>
      <div style={innerStyle}>
        {/* ── Logo ── */}
        <Link to="/" style={logoStyle}>
          <span style={logoTextStyle}>{APP_NAME}</span>
          <span style={logoDotStyle}>●</span>
        </Link>

        {/* ── Search bar ── */}
        <form onSubmit={handleSearch} style={searchFormStyle}>
          <input
            type="text"
            placeholder="Search products on campus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
            id="public-search-input"
          />
          <button type="submit" style={searchBtnStyle} id="public-search-btn">
            🔍
          </button>
        </form>

        {/* ── Right actions ── */}
        <div style={actionsStyle}>
          {/* Cart */}
          <Link to={isAuthenticated ? '/cart' : '/login'} style={cartBtnStyle} id="navbar-cart-btn">
            <span style={{ fontSize: '20px' }}>🛒</span>
            {totalCount > 0 && (
              <span style={cartBadgeStyle}>{totalCount > 99 ? '99+' : totalCount}</span>
            )}
            <span style={cartLabelStyle}>Cart</span>
          </Link>

          {/* Auth button */}
          {isAuthenticated ? (
            <Link to="/home" style={signInBtnStyle} id="navbar-dashboard-btn">
              <span style={avatarStyle}>{user?.name?.charAt(0).toUpperCase()}</span>
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link to="/login" style={signInBtnStyle} id="navbar-signin-btn">
              Sign In
            </Link>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        #public-search-input:focus { outline: none; border-color: #111827 !important; box-shadow: 0 0 0 3px rgba(17,24,39,0.08); }
        #navbar-signin-btn:hover { background-color: #374151 !important; }
        #navbar-cart-btn:hover { opacity: 0.8; }
        #navbar-dashboard-btn:hover { background-color: #374151 !important; }
      `}</style>
    </header>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const navbarStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  backgroundColor: '#111827',
  borderBottom: '1px solid #1f2937',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const innerStyle: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '0 24px',
  height: '64px',
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
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
  color: '#ffffff',
};

const logoDotStyle: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '7px',
  marginTop: '4px',
};

const searchFormStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  maxWidth: '600px',
  position: 'relative',
};

const searchInputStyle: React.CSSProperties = {
  flex: 1,
  height: '38px',
  padding: '0 12px',
  borderRadius: '6px 0 0 6px',
  border: '1.5px solid #374151',
  borderRight: 'none',
  backgroundColor: '#1f2937',
  color: '#f9fafb',
  fontSize: '14px',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'border-color 0.15s ease',
};

const searchBtnStyle: React.CSSProperties = {
  height: '38px',
  padding: '0 14px',
  borderRadius: '0 6px 6px 0',
  border: '1.5px solid #374151',
  backgroundColor: '#374151',
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'background-color 0.15s ease',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexShrink: 0,
  marginLeft: 'auto',
};

const cartBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 10px',
  borderRadius: '6px',
  textDecoration: 'none',
  color: '#f9fafb',
  fontSize: '14px',
  position: 'relative',
  transition: 'opacity 0.15s ease',
};

const cartBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '0px',
  right: '4px',
  backgroundColor: '#ef4444',
  color: '#ffffff',
  fontSize: '10px',
  fontWeight: '700',
  borderRadius: '50%',
  width: '16px',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const cartLabelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '500',
};

const signInBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 18px',
  borderRadius: '6px',
  backgroundColor: '#ffffff',
  color: '#111827',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  transition: 'background-color 0.15s ease',
};

const avatarStyle: React.CSSProperties = {
  width: '22px',
  height: '22px',
  borderRadius: '50%',
  backgroundColor: '#111827',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
  fontWeight: '700',
};

export default PublicNavbar;
