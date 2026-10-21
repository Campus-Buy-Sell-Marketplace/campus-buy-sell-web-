// ============================================================
// UniTrade — Landing Page — Blinkit/Amazon style
// No hero. Straight to category filter + product grid.
// Products visible to all. Sign in required only to add/buy.
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar/PublicNavbar';
import { getProducts, Product } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';
import CartButton from '../../components/CartButton/CartButton';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Furniture', 'Sports', 'Other'];

const CONDITION_COLORS: Record<string, { text: string; bg: string }> = {
  NEW:      { text: '#166534', bg: '#dcfce7' },
  LIKE_NEW: { text: '#1d4ed8', bg: '#dbeafe' },
  GOOD:     { text: '#374151', bg: '#f3f4f6' },
  FAIR:     { text: '#92400e', bg: '#fef3c7' },
  POOR:     { text: '#991b1b', bg: '#fee2e2' },
};

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');

  // Sync search from URL
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchQuery(q);
    setInputValue(q);
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery.trim()) params.q = searchQuery.trim();
      const data = await getProducts(params);
      setProducts(data.products);
    } catch {
      setError('Could not load products.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?q=${encodeURIComponent(inputValue.trim())}`);
  };


  return (
    <div style={pageStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .lp-card { transition: box-shadow 0.18s ease, transform 0.18s ease !important; }
        .lp-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.10) !important; transform: translateY(-2px) !important; }
        .add-btn:hover:not(:disabled) { background: #1a7a3e !important; }
        .add-btn-added:hover:not(:disabled) { background: #1a7a3e !important; }
        .cat-btn:hover { background: #f3f4f6 !important; }
        #lp-search-input:focus { outline: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.3s ease forwards; }
        @media (max-width: 640px) {
          .lp-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .cat-scroll { overflow-x: auto; flex-wrap: nowrap !important; }
        }
      `}</style>

      <PublicNavbar />

      {/* ── Category + Search Bar ── */}
      <div style={topBarStyle}>
        <div style={topBarInnerStyle}>
          {/* Inline search (mobile visible) */}
          <form onSubmit={handleSearch} style={mobileSearchStyle} id="lp-search-form">
            <div style={mobileSearchWrapStyle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={mobileSearchInputStyle}
                id="lp-search-input"
              />
            </div>
          </form>

          {/* Category pills */}
          <div style={catRowStyle} className="cat-scroll">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={catBtnStyle(active)}
                  className="cat-btn"
                  id={`cat-${cat.toLowerCase()}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <main style={mainStyle}>
        <div style={mainInnerStyle}>

          {/* Header row */}
          <div style={sectionHeaderStyle}>
            <div>
              <h2 style={sectionTitleStyle}>
                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
              </h2>
              {!isLoading && (
                <p style={sectionCountStyle}>{products.length} item{products.length !== 1 ? 's' : ''}</p>
              )}
            </div>
            {!isAuthenticated && (
              <Link to="/login" style={signInChipStyle}>Sign in to buy →</Link>
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div style={loadingWrapStyle}>
              <div style={spinnerStyle} />
            </div>
          )}

          {/* Error */}
          {error && <div style={errorStyle}>{error}</div>}

          {/* Empty */}
          {!isLoading && !error && products.length === 0 && (
            <div style={emptyStyle}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>No products found</p>
            </div>
          )}

          {/* Blinkit-style Grid */}
          {!isLoading && !error && products.length > 0 && (
            <div style={gridStyle} className="lp-grid">
              {products.map((product) => {
                const cond = CONDITION_COLORS[product.condition || ''];

                return (
                  <div key={product.id} className="lp-card fade-up" style={cardStyle}>
                    {/* Clickable image + info area */}
                    <Link to={`/products/${product.id}`} style={cardLinkStyle}>
                      {/* Image */}
                      <div style={cardImgWrapStyle}>
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.title} style={cardImgStyle} loading="lazy" />
                        ) : (
                          <div style={cardNoImgStyle}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                              <line x1="12" y1="22.08" x2="12" y2="12"/>
                            </svg>
                          </div>
                        )}
                        {/* Condition badge */}
                        {cond && (
                          <span style={{ ...condBadgeStyle, color: cond.text, backgroundColor: cond.bg }}>
                            {product.condition!.replace('_', ' ')}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div style={cardInfoStyle}>
                        <span style={catTagStyle}>{product.category || 'General'}</span>
                        <p style={cardTitleStyle}>{product.title}</p>
                        <p style={cardSellerStyle}>by {product.seller_name}</p>
                      </div>
                    </Link>

                    {/* Price + ADD / Stepper button — bottom of card */}
                    <div style={cardFootStyle}>
                      <div style={cardPriceStyle}>
                        ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                      </div>
                      <CartButton
                        productId={product.id}
                        stock={product.stock}
                        productTitle={product.title}
                        id={`add-${product.id}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={footerStyle}>
        <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px' }}>
          © {new Date().getFullYear()} UniTrade · Campus Buy &amp; Sell Marketplace
        </p>
      </footer>
    </div>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#f9fafb',
  fontFamily: "'Inter', system-ui, sans-serif",
  display: 'flex',
  flexDirection: 'column',
};

const topBarStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e5e7eb',
  position: 'sticky',
  top: '58px',
  zIndex: 90,
};

const topBarInnerStyle: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '10px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
};

const mobileSearchStyle: React.CSSProperties = {
  display: 'none',
};

const mobileSearchWrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  height: '34px',
  padding: '0 12px',
  borderRadius: '6px',
  border: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
};

const mobileSearchInputStyle: React.CSSProperties = {
  flex: 1,
  border: 'none',
  background: 'transparent',
  fontSize: '13px',
  outline: 'none',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const catRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '6px',
  flexWrap: 'wrap',
};

const catBtnStyle = (active: boolean): React.CSSProperties => ({
  padding: '5px 14px',
  borderRadius: '20px',
  border: `1px solid ${active ? '#111827' : '#e5e7eb'}`,
  backgroundColor: active ? '#111827' : '#ffffff',
  color: active ? '#ffffff' : '#374151',
  fontSize: '12px',
  fontWeight: active ? '600' : '500',
  cursor: 'pointer',
  fontFamily: "'Inter', system-ui, sans-serif",
  whiteSpace: 'nowrap',
  transition: 'all 0.15s',
});

const mainStyle: React.CSSProperties = {
  padding: '20px 20px 48px',
  flex: 1,
};

const mainInnerStyle: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto',
};

const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '16px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#111827',
  margin: '0 0 2px',
};

const sectionCountStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: 0,
};

const signInChipStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: '500',
  color: '#374151',
  textDecoration: 'none',
  padding: '5px 12px',
  borderRadius: '6px',
  border: '1px solid #e5e7eb',
  background: '#ffffff',
};

const loadingWrapStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  padding: '60px 0',
};

const spinnerStyle: React.CSSProperties = {
  width: '30px',
  height: '30px',
  border: '2.5px solid #e5e7eb',
  borderTop: '2.5px solid #111827',
  borderRadius: '50%',
  animation: 'spin 0.7s linear infinite',
};

const errorStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: '8px',
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  color: '#dc2626',
  fontSize: '13px',
  marginBottom: '16px',
};

const emptyStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 0',
};

// ─── Blinkit-style card ───────────────────────────────────────────────────────

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: '14px',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  border: '1px solid #e5e7eb',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  cursor: 'pointer',
  boxSizing: 'border-box',
};

const cardLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
};

const cardImgWrapStyle: React.CSSProperties = {
  position: 'relative',
  height: '160px',
  backgroundColor: '#f9fafb',
  overflow: 'hidden',
};

const cardImgStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const cardNoImgStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f3f4f6',
};

const condBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '8px',
  left: '8px',
  padding: '2px 7px',
  borderRadius: '4px',
  fontSize: '9px',
  fontWeight: '700',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
};

const cardInfoStyle: React.CSSProperties = {
  padding: '10px 12px 6px',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
};

const catTagStyle: React.CSSProperties = {
  fontSize: '9px',
  fontWeight: '700',
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  display: 'block',
  marginBottom: '4px',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#111827',
  margin: '0 0 3px',
  lineHeight: '1.35',
  height: '36px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const cardSellerStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#9ca3af',
  margin: '0',
  marginTop: 'auto',
};

const cardPriceStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '800',
  color: '#111827',
  letterSpacing: '-0.02em',
  display: 'flex',
  alignItems: 'center',
};

const cardFootStyle: React.CSSProperties = {
  marginTop: 'auto',
  padding: '8px 12px 10px',
  borderTop: '1px solid #f3f4f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  minHeight: '52px',
  boxSizing: 'border-box',
};

const footerStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderTop: '1px solid #e5e7eb',
  padding: '20px',
  textAlign: 'center',
};

export default LandingPage;
