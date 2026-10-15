// ============================================================
// UniTrade — Public Landing Page — White Theme
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar/PublicNavbar';
import { getProducts, Product } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { APP_NAME, APP_TAGLINE } from '../../config/appConfig';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Furniture', 'Sports', 'Other'];

const CONDITION_COLORS: Record<string, { text: string; bg: string }> = {
  NEW:      { text: '#059669', bg: '#ecfdf5' },
  LIKE_NEW: { text: '#2563eb', bg: '#eff6ff' },
  GOOD:     { text: '#7c3aed', bg: '#f5f3ff' },
  FAIR:     { text: '#d97706', bg: '#fffbeb' },
  POOR:     { text: '#dc2626', bg: '#fef2f2' },
};

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [addingId, setAddingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(t);
    }
  }, [error]);

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
      setError('Could not load products right now.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    setAddingId(productId);
    try {
      await addToCart(productId, 1);
      const prod = products.find((p) => p.id === productId);
      showToast(`"${prod?.title || 'Product'}" added to cart!`, 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to add to cart.', 'warning');
    } finally {
      setAddingId(null);
    }
  };

  const handleBuyNow = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    setAddingId(productId);
    try {
      await addToCart(productId, 1);
      navigate('/cart');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed. Try again.', 'warning');
      setAddingId(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputValue);
  };

  return (
    <div style={pageStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .lp-card { transition: transform 0.22s cubic-bezier(.4,0,.2,1), box-shadow 0.22s ease !important; }
        .lp-card:hover { transform: translateY(-4px) !important; box-shadow: 0 20px 48px rgba(0,0,0,0.10) !important; }
        .lp-btn-cart:hover:not(:disabled) { background: #1d4ed8 !important; }
        .lp-btn-buy:hover:not(:disabled) { background: #1e293b !important; }
        .lp-cat:hover { background: #f1f5f9 !important; border-color: #94a3b8 !important; }
        #landing-search-input:focus { outline: none; border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        @media (max-width: 640px) {
          .hero-title { font-size: 28px !important; }
          .hero-actions { flex-direction: column !important; align-items: stretch !important; }
          .hero-actions a { text-align: center !important; }
          .lp-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important; }
          .cat-scroll { overflow-x: auto; flex-wrap: nowrap !important; padding-bottom: 6px; }
        }
      `}</style>

      <PublicNavbar />

      {/* ── Hero ── */}
      <section style={heroStyle}>
        <div style={heroInnerStyle}>
          <div style={heroBadgeStyle}>🎓 Campus Marketplace</div>
          <h1 className="hero-title" style={heroTitleStyle}>{APP_NAME}</h1>
          <p style={heroSubStyle}>{APP_TAGLINE} — Buy and sell with fellow students on campus</p>

          {/* Hero search */}
          <form onSubmit={handleSearch} style={heroSearchStyle}>
            <input
              type="text"
              placeholder="What are you looking for?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={heroSearchInputStyle}
              id="landing-search-input"
            />
            <button type="submit" style={heroSearchBtnStyle} id="landing-search-btn">
              Search
            </button>
          </form>

          <div style={heroActionsStyle} className="hero-actions">
            <Link to={isAuthenticated ? '/home' : '/login'} style={primaryBtnStyle} id="hero-browse-btn">
              {isAuthenticated ? 'Go to Dashboard' : 'Sign In to Buy'}
            </Link>
            {!isAuthenticated && (
              <Link to="/products" style={ghostBtnStyle} id="hero-browse-all-btn">
                Browse Products
              </Link>
            )}
          </div>
        </div>

        {/* Floating stats */}
        <div style={statsRowStyle}>
          {[
            { icon: '🛍️', label: 'Products Listed', val: products.length > 0 ? `${products.length}+` : '—' },
            { icon: '👩‍🎓', label: 'Student Sellers', val: '50+' },
            { icon: '✅', label: 'Safe Campus Trades', val: '100%' },
          ].map((s) => (
            <div key={s.label} style={statCardStyle}>
              <span style={{ fontSize: '22px' }}>{s.icon}</span>
              <div style={{ fontWeight: '800', fontSize: '18px', color: '#0f172a' }}>{s.val}</div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <div style={filterBarStyle}>
        <div style={filterInnerStyle}>
          <div style={catRowStyle} className="cat-scroll">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={catPillStyle(active)}
                  className="lp-cat"
                  id={`cat-${cat.toLowerCase()}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Products Grid ── */}
      <main style={mainStyle}>
        <div style={mainInnerStyle}>
          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={sectionTitleStyle}>
                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                {isLoading ? 'Loading...' : `${products.length} item${products.length !== 1 ? 's' : ''} available`}
              </p>
            </div>
            {!isAuthenticated && (
              <Link to="/login" style={signInChipStyle}>
                Sign in to buy →
              </Link>
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '70px 0' }}>
              <div style={spinnerStyle} />
              <p style={{ color: '#94a3b8', marginTop: '14px', fontSize: '14px' }}>Loading products...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={errorStyle}>⚠️ {error}</div>
          )}

          {/* Empty */}
          {!isLoading && !error && products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '70px 0' }}>
              <div style={{ fontSize: '52px', marginBottom: '14px' }}>🛍️</div>
              <h3 style={{ color: '#334155', fontWeight: '700', margin: '0 0 8px' }}>No products yet</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                Be the first to list something — sign in and go to Settings → Start Selling.
              </p>
            </div>
          )}

          {/* Grid */}
          {!isLoading && !error && products.length > 0 && (
            <div style={gridStyle} className="lp-grid">
              {products.map((product) => {
                const cond = CONDITION_COLORS[product.condition || ''];
                const isAdding = addingId === product.id;
                return (
                  <div key={product.id} className="lp-card fade-up" style={cardStyle} id={`product-card-${product.id}`}>
                    {/* Image — clicking goes to detail */}
                    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                      <div style={cardImgWrapStyle}>
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.title} style={cardImgStyle} loading="lazy" />
                        ) : (
                          <div style={cardNoImgStyle}>
                            <span style={{ fontSize: '42px' }}>📦</span>
                          </div>
                        )}
                        {cond && (
                          <span style={{ ...condBadgeStyle, color: cond.text, backgroundColor: cond.bg }}>
                            {product.condition!.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      <div style={cardBodyStyle}>
                        <span style={catLabelStyle}>{product.category || 'General'}</span>
                        <h3 style={cardTitleStyle}>{product.title}</h3>
                        {product.description && (
                          <p style={cardDescStyle}>
                            {product.description.length > 70 ? product.description.slice(0, 70) + '…' : product.description}
                          </p>
                        )}
                        <div style={sellerStyle}>by {product.seller_name}</div>
                      </div>
                    </Link>

                    {/* Price + Actions */}
                    <div style={cardFootStyle}>
                      <div style={priceStyle}>
                        ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                      </div>
                      <div style={{ display: 'flex', gap: '7px' }}>
                        <button
                          onClick={(e) => handleAddToCart(e, product.id)}
                          style={{ ...cartBtnStyle, opacity: isAdding ? 0.65 : 1 }}
                          disabled={isAdding}
                          className="lp-btn-cart"
                          id={`add-cart-${product.id}`}
                          title="Add to cart"
                        >
                          {isAdding ? '…' : '🛒'}
                        </button>
                        <button
                          onClick={(e) => handleBuyNow(e, product.id)}
                          style={{ ...buyBtnStyle, opacity: isAdding ? 0.65 : 1 }}
                          disabled={isAdding}
                          className="lp-btn-buy"
                          id={`buy-now-${product.id}`}
                        >
                          {isAuthenticated ? 'Buy Now' : 'Sign in'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={footerStyle}>
        <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '4px', letterSpacing: '0.04em' }}>
          {APP_NAME}<span style={{ color: '#6366f1' }}>.</span>
        </div>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>
          © {new Date().getFullYear()} {APP_NAME} · {APP_TAGLINE}
        </p>
      </footer>
    </div>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const heroStyle: React.CSSProperties = {
  background: 'linear-gradient(160deg, #ffffff 0%, #f0f4ff 50%, #faf5ff 100%)',
  padding: '56px 24px 40px',
  textAlign: 'center',
  borderBottom: '1px solid #e8edf3',
};

const heroInnerStyle: React.CSSProperties = {
  maxWidth: '680px',
  margin: '0 auto',
};

const heroBadgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '5px 16px',
  borderRadius: '20px',
  backgroundColor: 'rgba(99,102,241,0.1)',
  color: '#4f46e5',
  fontSize: '13px',
  fontWeight: '600',
  marginBottom: '18px',
  letterSpacing: '0.03em',
};

const heroTitleStyle: React.CSSProperties = {
  fontSize: '52px',
  fontWeight: '900',
  color: '#0f172a',
  margin: '0 0 14px 0',
  letterSpacing: '-0.03em',
  lineHeight: '1.1',
};

const heroSubStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#64748b',
  margin: '0 0 28px 0',
  lineHeight: '1.65',
};

const heroSearchStyle: React.CSSProperties = {
  display: 'flex',
  maxWidth: '480px',
  margin: '0 auto 24px',
};

const heroSearchInputStyle: React.CSSProperties = {
  flex: 1,
  height: '48px',
  padding: '0 16px',
  borderRadius: '12px 0 0 12px',
  border: '1.5px solid #e2e8f0',
  borderRight: 'none',
  backgroundColor: '#ffffff',
  color: '#0f172a',
  fontSize: '14px',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

const heroSearchBtnStyle: React.CSSProperties = {
  height: '48px',
  padding: '0 24px',
  borderRadius: '0 12px 12px 0',
  border: '1.5px solid #6366f1',
  backgroundColor: '#6366f1',
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  fontFamily: "'Inter', system-ui, sans-serif",
  whiteSpace: 'nowrap',
  transition: 'background 0.15s',
};

const heroActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
  flexWrap: 'wrap',
};

const primaryBtnStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '13px 28px',
  borderRadius: '12px',
  backgroundColor: '#0f172a',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '700',
  textDecoration: 'none',
  transition: 'background 0.15s',
  letterSpacing: '0.01em',
};

const ghostBtnStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '13px 28px',
  borderRadius: '12px',
  border: '1.5px solid #e2e8f0',
  backgroundColor: '#ffffff',
  color: '#374151',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  transition: 'border-color 0.15s',
};

const statsRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginTop: '40px',
};

const statCardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  padding: '16px 28px',
  backgroundColor: '#ffffff',
  borderRadius: '14px',
  border: '1px solid #e8edf3',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  minWidth: '130px',
};

const filterBarStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e8edf3',
  padding: '12px 24px',
};

const filterInnerStyle: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto',
};

const catRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
};

const catPillStyle = (active: boolean): React.CSSProperties => ({
  padding: '6px 16px',
  borderRadius: '20px',
  border: `1.5px solid ${active ? '#6366f1' : '#e2e8f0'}`,
  backgroundColor: active ? '#6366f1' : '#ffffff',
  color: active ? '#ffffff' : '#64748b',
  fontSize: '13px',
  fontWeight: active ? '600' : '500',
  cursor: 'pointer',
  fontFamily: "'Inter', system-ui, sans-serif",
  whiteSpace: 'nowrap',
  transition: 'all 0.15s',
});

const mainStyle: React.CSSProperties = { padding: '32px 24px 48px' };

const mainInnerStyle: React.CSSProperties = { maxWidth: '1400px', margin: '0 auto' };

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: '800',
  color: '#0f172a',
  margin: '0 0 3px 0',
  letterSpacing: '-0.01em',
};

const signInChipStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#6366f1',
  textDecoration: 'none',
  padding: '6px 14px',
  borderRadius: '8px',
  border: '1.5px solid #e0e7ff',
  background: '#f5f3ff',
};

const spinnerStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  border: '3px solid #e2e8f0',
  borderTop: '3px solid #6366f1',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
  margin: '0 auto',
};

const errorStyle: React.CSSProperties = {
  padding: '14px 18px',
  borderRadius: '12px',
  backgroundColor: '#fffbeb',
  border: '1px solid #fde68a',
  color: '#92400e',
  fontSize: '14px',
  marginBottom: '18px',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: '20px',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  border: '1px solid #f1f5f9',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  cursor: 'pointer',
};

const cardImgWrapStyle: React.CSSProperties = {
  position: 'relative',
  height: '185px',
  overflow: 'hidden',
  backgroundColor: '#f8fafc',
};

const cardImgStyle: React.CSSProperties = {
  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
};

const cardNoImgStyle: React.CSSProperties = {
  width: '100%', height: '100%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
};

const condBadgeStyle: React.CSSProperties = {
  position: 'absolute', top: '10px', left: '10px',
  padding: '3px 9px', borderRadius: '6px',
  fontSize: '10px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase',
};

const cardBodyStyle: React.CSSProperties = {
  padding: '14px 16px 8px',
};

const catLabelStyle: React.CSSProperties = {
  fontSize: '10px', fontWeight: '700', color: '#94a3b8',
  textTransform: 'uppercase', letterSpacing: '0.07em',
  display: 'block', marginBottom: '5px',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: '14px', fontWeight: '700', color: '#0f172a',
  margin: '0 0 5px 0', lineHeight: '1.4',
  display: '-webkit-box', WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical', overflow: 'hidden',
};

const cardDescStyle: React.CSSProperties = {
  fontSize: '12px', color: '#64748b', margin: '0 0 5px 0', lineHeight: '1.5',
};

const sellerStyle: React.CSSProperties = {
  fontSize: '11px', color: '#94a3b8', fontWeight: '500',
};

const cardFootStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '12px 16px', borderTop: '1px solid #f1f5f9',
  backgroundColor: '#fafbfc', gap: '8px',
};

const priceStyle: React.CSSProperties = {
  fontSize: '17px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.01em',
};

const cartBtnStyle: React.CSSProperties = {
  width: '36px', height: '36px', borderRadius: '10px', border: 'none',
  backgroundColor: '#2563eb', color: '#ffffff',
  fontSize: '15px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background 0.15s', flexShrink: 0,
  fontFamily: "'Inter', system-ui, sans-serif",
};

const buyBtnStyle: React.CSSProperties = {
  height: '36px', padding: '0 14px', borderRadius: '10px',
  border: 'none', backgroundColor: '#0f172a', color: '#ffffff',
  fontSize: '12px', fontWeight: '700', cursor: 'pointer',
  transition: 'background 0.15s', fontFamily: "'Inter', system-ui, sans-serif",
  whiteSpace: 'nowrap',
};

const footerStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderTop: '1px solid #e8edf3',
  padding: '28px 24px',
  textAlign: 'center',
};

export default LandingPage;
