// ============================================================
// LAVSA — Buyer Home Page — Premium White Theme
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { getProducts, Product } from '../../services/productService';
import { getWishlistIds, addToWishlist, removeFromWishlist } from '../../services/userService';

const CONDITION_COLORS: Record<string, string> = {
  NEW:      '#059669',
  LIKE_NEW: '#2563eb',
  GOOD:     '#7c3aed',
  FAIR:     '#d97706',
  POOR:     '#dc2626',
};

const CONDITION_BG: Record<string, string> = {
  NEW:      '#ecfdf5',
  LIKE_NEW: '#eff6ff',
  GOOD:     '#f5f3ff',
  FAIR:     '#fffbeb',
  POOR:     '#fef2f2',
};

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [togglingWishId, setTogglingWishId] = useState<string | null>(null);


  useEffect(() => {
    getProducts({ limit: 12 })
      .then((res) => setProducts(res.products))
      .catch(() => {})
      .finally(() => setIsLoading(false));
    getWishlistIds().then((ids) => setWishlistIds(new Set(ids))).catch(() => {});
  }, []);

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingId(productId);
    try {
      await addToCart(productId, 1);
      setAddedId(productId);
      const prod = products.find((p) => p.id === productId);
      showToast(`"${prod?.title || 'Product'}" added to cart!`, 'success');
      setTimeout(() => setAddedId(null), 2000);
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to add to cart.', 'warning');
    } finally {
      setAddingId(null);
    }
  };

  const handleBuyNow = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingId(productId);
    try {
      await addToCart(productId, 1);
      navigate('/cart');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed. Try again.', 'warning');
      setAddingId(null);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (togglingWishId === productId) return;
    setTogglingWishId(productId);
    try {
      if (wishlistIds.has(productId)) {
        await removeFromWishlist(productId);
        setWishlistIds((prev) => { const s = new Set(prev); s.delete(productId); return s; });
      } else {
        await addToWishlist(productId);
        setWishlistIds((prev) => new Set(prev).add(productId));
      }
    } catch { /* silent */ } finally {
      setTogglingWishId(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .home-product-card { transition: transform 0.22s cubic-bezier(.4,0,.2,1), box-shadow 0.22s ease !important; }
        .home-product-card:hover { transform: translateY(-4px) !important; box-shadow: 0 20px 48px rgba(0,0,0,0.10) !important; }
        .btn-cart:hover { background: #1d4ed8 !important; }
        .btn-buy:hover { background: #111827 !important; }
        .wish-btn:hover { transform: scale(1.15); }
        .search-home-input:focus { outline: none; border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important; }
        .cat-pill:hover { background: #f1f5f9 !important; border-color: #94a3b8 !important; }
        .cat-pill-active { background: #111827 !important; color: #fff !important; border-color: #111827 !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.35s ease forwards; }
        @media (max-width: 640px) {
          .hero-title { font-size: 26px !important; }
          .hero-sub { font-size: 14px !important; }
          .search-home-row { flex-direction: column !important; }
          .search-home-input { border-radius: 10px !important; border-right: 1.5px solid #e2e8f0 !important; }
          .search-home-btn { border-radius: 10px !important; }
        }
      `}</style>

      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Hero Banner ── */}
        <div style={heroStyle}>
          <div style={{ maxWidth: '580px' }}>
            <div style={greetChipStyle}>👋 Welcome back, {firstName}!</div>
            <h1 className="hero-title" style={heroTitleStyle}>
              Find the best deals<br />on campus today
            </h1>
            <p className="hero-sub" style={heroSubStyle}>
              Browse student-listed products — textbooks, electronics, clothing & more.
            </p>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0', maxWidth: '480px' }} className="search-home-row">
              <input
                type="text"
                placeholder="Search for anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={searchInputStyle}
                className="search-home-input"
                id="home-search-input"
              />
              <button type="submit" style={searchBtnStyle} className="search-home-btn" id="home-search-btn">
                Search
              </button>
            </form>
          </div>

          {/* Quick links */}
          <div style={quickLinksStyle}>
            {[
              { to: '/products?category=Electronics', icon: '💻', label: 'Electronics' },
              { to: '/products?category=Books', icon: '📚', label: 'Books' },
              { to: '/products?category=Clothing', icon: '👕', label: 'Clothing' },
              { to: '/products?category=Sports', icon: '⚽', label: 'Sports' },
            ].map((q) => (
              <Link key={q.to} to={q.to} style={quickLinkStyle}>
                <span style={{ fontSize: '22px' }}>{q.icon}</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>{q.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Section header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              Latest Listings
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '3px 0 0 0' }}>
              {isLoading ? 'Loading...' : `${products.length} products available`}
            </p>
          </div>
          <Link to="/products" style={viewAllStyle}>
            View all →
          </Link>
        </div>

        {/* ── Loading ── */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={spinnerStyle} />
            <p style={{ color: '#94a3b8', marginTop: '14px', fontSize: '14px' }}>Loading products...</p>
          </div>
        )}

        {/* ── Empty ── */}
        {!isLoading && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '52px', marginBottom: '14px' }}>🛍️</div>
            <h3 style={{ color: '#334155', fontWeight: '700', margin: '0 0 8px' }}>No products yet</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Be the first to list something for sale!</p>
          </div>
        )}

        {/* ── Products Grid ── */}
        {!isLoading && products.length > 0 && (
          <div style={gridStyle} className="fade-in">
            {products.map((product) => {

              const condColor = CONDITION_COLORS[product.condition || ''] || '#6b7280';
              const condBg = CONDITION_BG[product.condition || ''] || '#f8fafc';
              const isAdding = addingId === product.id;
              const isAdded = addedId === product.id;
              const isWishlisted = wishlistIds.has(product.id);

              return (
                <div
                  key={product.id}
                  className="home-product-card fade-in"
                  style={cardOuterStyle}
                >
                  {/* Image */}
                  <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={cardImageWrapStyle}>
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.title} style={cardImageStyle} loading="lazy" />
                      ) : (
                        <div style={noImageStyle}>
                          <span style={{ fontSize: '40px' }}>📦</span>
                        </div>
                      )}

                      {/* Condition badge */}
                      {product.condition && (
                        <span style={{ ...condBadgeStyle, color: condColor, backgroundColor: condBg }}>
                          {product.condition.replace('_', ' ')}
                        </span>
                      )}

                      {/* Wishlist heart */}
                      <button
                        onClick={(e) => handleWishlistToggle(e, product.id)}
                        style={{ ...heartBtnStyle, color: isWishlisted ? '#ef4444' : '#94a3b8' }}
                        className="wish-btn"
                        disabled={togglingWishId === product.id}
                        id={`wish-home-${product.id}`}
                        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        {isWishlisted ? '♥' : '♡'}
                      </button>
                    </div>

                    {/* Card Body */}
                    <div style={cardBodyStyle}>
                      <div style={cardCatStyle}>{product.category || 'General'}</div>
                      <h3 style={cardTitleStyle}>{product.title}</h3>
                      {product.description && (
                        <p style={cardDescStyle}>
                          {product.description.length > 65
                            ? product.description.slice(0, 65) + '…'
                            : product.description}
                        </p>
                      )}
                      <div style={cardSellerStyle}>by {product.seller_name}</div>
                    </div>
                  </Link>

                  {/* Price + Actions */}
                  <div style={cardFootStyle}>
                    <div style={cardPriceStyle}>₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 0 })}</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={(e) => handleAddToCart(e, product.id)}
                        style={{
                          ...cartBtnStyle,
                          opacity: isAdding ? 0.7 : 1,
                          background: isAdded ? '#059669' : '#2563eb',
                        }}
                        disabled={isAdding}
                        className="btn-cart"
                        id={`cart-home-${product.id}`}
                      >
                        {isAdding ? '…' : isAdded ? '✓' : '🛒'}
                      </button>
                      <button
                        onClick={(e) => handleBuyNow(e, product.id)}
                        style={{ ...buyBtnStyle, opacity: isAdding ? 0.7 : 1 }}
                        disabled={isAdding}
                        className="btn-buy"
                        id={`buy-home-${product.id}`}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── View All button ── */}
        {!isLoading && products.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '20px' }}>
            <Link to="/products" style={viewAllBtnStyle}>
              Browse All Products →
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────

const heroStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 50%, #faf5ff 100%)',
  borderRadius: '20px',
  padding: '40px 36px',
  marginBottom: '36px',
  border: '1px solid #e8eaf6',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '28px',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
};

const greetChipStyle: React.CSSProperties = {
  display: 'inline-block',
  background: 'rgba(99,102,241,0.1)',
  color: '#4f46e5',
  fontSize: '13px',
  fontWeight: '600',
  borderRadius: '20px',
  padding: '4px 14px',
  marginBottom: '14px',
};

const heroTitleStyle: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: '800',
  color: '#0f172a',
  lineHeight: '1.25',
  margin: '0 0 12px 0',
  letterSpacing: '-0.02em',
};

const heroSubStyle: React.CSSProperties = {
  fontSize: '15px',
  color: '#64748b',
  margin: '0 0 24px 0',
  lineHeight: '1.6',
};

const searchInputStyle: React.CSSProperties = {
  flex: 1,
  height: '46px',
  padding: '0 16px',
  borderRadius: '12px 0 0 12px',
  border: '1.5px solid #e2e8f0',
  borderRight: 'none',
  backgroundColor: '#ffffff',
  color: '#0f172a',
  fontSize: '14px',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'border-color 0.15s, box-shadow 0.15s',
  minWidth: 0,
};

const searchBtnStyle: React.CSSProperties = {
  height: '46px',
  padding: '0 22px',
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

const quickLinksStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  alignSelf: 'center',
};

const quickLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 16px',
  borderRadius: '12px',
  backgroundColor: '#ffffff',
  border: '1px solid #e8eaf6',
  textDecoration: 'none',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.15s',
  minWidth: '150px',
};

const viewAllStyle: React.CSSProperties = {
  fontSize: '13.5px',
  fontWeight: '600',
  color: '#6366f1',
  textDecoration: 'none',
  padding: '6px 14px',
  borderRadius: '8px',
  border: '1.5px solid #e0e7ff',
  background: '#f5f3ff',
  transition: 'all 0.15s',
  whiteSpace: 'nowrap',
};

const spinnerStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  border: '3px solid #e2e8f0',
  borderTop: '3px solid #6366f1',
  borderRadius: '50%',
  margin: '0 auto',
  animation: 'spin 0.8s linear infinite',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: '20px',
};

const cardOuterStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  border: '1px solid #f1f5f9',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  cursor: 'pointer',
};

const cardImageWrapStyle: React.CSSProperties = {
  position: 'relative',
  height: '180px',
  overflow: 'hidden',
  backgroundColor: '#f8fafc',
};

const cardImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const noImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
};

const condBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  padding: '3px 9px',
  borderRadius: '6px',
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

const heartBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: 'rgba(255,255,255,0.95)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
  transition: 'transform 0.15s, color 0.15s',
  zIndex: 1,
};

const cardBodyStyle: React.CSSProperties = {
  padding: '14px 16px 8px',
  flex: 1,
};

const cardCatStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: '700',
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  marginBottom: '4px',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '700',
  color: '#0f172a',
  margin: '0 0 5px 0',
  lineHeight: '1.4',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const cardDescStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#64748b',
  margin: '0 0 4px 0',
  lineHeight: '1.5',
};

const cardSellerStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#94a3b8',
  fontWeight: '500',
};

const cardFootStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderTop: '1px solid #f1f5f9',
  backgroundColor: '#fafbfc',
  gap: '8px',
};

const cardPriceStyle: React.CSSProperties = {
  fontSize: '17px',
  fontWeight: '800',
  color: '#0f172a',
  letterSpacing: '-0.01em',
};

const cartBtnStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  border: 'none',
  color: '#ffffff',
  fontSize: '15px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.15s, transform 0.1s',
  flexShrink: 0,
  fontFamily: "'Inter', system-ui, sans-serif",
};

const buyBtnStyle: React.CSSProperties = {
  height: '36px',
  padding: '0 14px',
  borderRadius: '10px',
  border: 'none',
  backgroundColor: '#0f172a',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'background 0.15s',
  fontFamily: "'Inter', system-ui, sans-serif",
  whiteSpace: 'nowrap',
  letterSpacing: '0.01em',
};

const viewAllBtnStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '13px 32px',
  borderRadius: '12px',
  backgroundColor: '#0f172a',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '700',
  textDecoration: 'none',
  transition: 'background 0.15s',
  letterSpacing: '0.01em',
};

export default HomePage;
