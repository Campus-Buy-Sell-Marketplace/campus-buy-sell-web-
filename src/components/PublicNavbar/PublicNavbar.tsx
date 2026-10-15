// ============================================================
// UniTrade — Public Top Navbar — White Theme
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
          <Link to={isAuthenticated ? '/cart' : '/login'} style={cartBtnStyle} id="navbar-cart-btn">
            <span style={{ fontSize: '18px' }}>🛒</span>
            {totalCount > 0 && (
              <span style={cartBadgeStyle}>{totalCount > 99 ? '99+' : totalCount}</span>
            )}
            <span style={cartLabelStyle}>Cart</span>
          </Link>

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
        #public-search-input::placeholder { color: #94a3b8; }
        #public-search-input:focus { outline: none; border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        #navbar-signin-btn:hover { background-color: #0f172a !important; color: #fff !important; }
        #navbar-cart-btn:hover { background-color: #f8fafc !important; }
        #navbar-dashboard-btn:hover { background-color: #0f172a !important; color: #fff !important; }
        #public-search-btn:hover { background-color: #4f46e5 !important; }
        @media (max-width: 640px) {
          #public-search-form { display: none !important; }
        }
      `}</style>
    </header>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const navbarStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e8edf3',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
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
  letterSpacing: '0.04em',
  color: '#0f172a',
};

const logoDotStyle: React.CSSProperties = {
  color: '#6366f1',
  fontSize: '8px',
  marginTop: '4px',
};

const searchFormStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  maxWidth: '560px',
};

const searchInputStyle: React.CSSProperties = {
  flex: 1,
  height: '40px',
  padding: '0 14px',
  borderRadius: '10px 0 0 10px',
  border: '1.5px solid #e2e8f0',
  borderRight: 'none',
  backgroundColor: '#f8fafc',
  color: '#0f172a',
  fontSize: '14px',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

const searchBtnStyle: React.CSSProperties = {
  height: '40px',
  padding: '0 16px',
  borderRadius: '0 10px 10px 0',
  border: '1.5px solid #6366f1',
  backgroundColor: '#6366f1',
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: '15px',
  transition: 'background-color 0.15s',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  flexShrink: 0,
  marginLeft: 'auto',
};

const cartBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '7px 12px',
  borderRadius: '9px',
  textDecoration: 'none',
  color: '#374151',
  fontSize: '14px',
  fontWeight: '500',
  position: 'relative',
  transition: 'background-color 0.15s',
  border: '1.5px solid #e2e8f0',
};

const cartBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-4px',
  right: '-4px',
  backgroundColor: '#ef4444',
  color: '#ffffff',
  fontSize: '9px',
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
  fontWeight: '600',
};

const signInBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 18px',
  borderRadius: '9px',
  backgroundColor: '#0f172a',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  transition: 'background-color 0.15s',
};

const avatarStyle: React.CSSProperties = {
  width: '22px',
  height: '22px',
  borderRadius: '50%',
  backgroundColor: '#6366f1',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
  fontWeight: '700',
};

export default PublicNavbar;
