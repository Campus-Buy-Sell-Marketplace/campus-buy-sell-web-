// ============================================================
// LAVSA — Unified Buyer Marketplace (Home & Products)
// Single unified marketplace with category pills and search
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import CartButton from '../../components/CartButton/CartButton';
import { getProducts, Product } from '../../services/productService';
import { getWishlistIds, addToWishlist, removeFromWishlist } from '../../services/userService';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Furniture', 'Sports', 'Other'];

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
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [togglingWishId, setTogglingWishId] = useState<string | null>(null);

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    const q = searchParams.get('q') || '';
    setSelectedCategory(cat);
    setSearchQuery(q);
    setInputValue(q);
  }, [searchParams]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery.trim()) params.q = searchQuery.trim();
      const res = await getProducts(params);
      setProducts(res.products);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    getWishlistIds().then((ids) => setWishlistIds(new Set(ids))).catch(() => {});
  }, []);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputValue.trim());
    const newParams = new URLSearchParams(searchParams);
    if (inputValue.trim()) {
      newParams.set('q', inputValue.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const handleWishlistToggle = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (togglingWishId === productId) return;
    setTogglingWishId(productId);
    try {
      if (wishlistIds.has(productId)) {
        await removeFromWishlist(productId);
        setWishlistIds((prev) => {
          const s = new Set(prev);
          s.delete(productId);
          return s;
        });
      } else {
        await addToWishlist(productId);
        setWishlistIds((prev) => new Set(prev).add(productId));
      }
    } catch {
      /* silent */
    } finally {
      setTogglingWishId(null);
    }
  };

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .home-product-card { transition: transform 0.18s ease, box-shadow 0.18s ease !important; }
        .home-product-card:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.09) !important; }
        .wish-btn:hover { transform: scale(1.15); }
        .search-home-input:focus { outline: none; border-color: #111827 !important; }
        .cat-pill:hover { background-color: #f3f4f6 !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease forwards; }
        .cat-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", maxWidth: '1200px', margin: '0 auto' }}>
        {/* ── Search Bar ── */}
        <div style={{ marginBottom: '18px', marginTop: '4px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0', maxWidth: '540px' }} className="search-home-row">
            <input
              type="text"
              placeholder="Search products by title, category, or seller..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={searchInputStyle}
              className="search-home-input"
              id="home-search-input"
            />
            <button type="submit" style={searchBtnStyle} className="search-home-btn" id="home-search-btn">
              Search
            </button>
          </form>
        </div>

        {/* ── Category Pills ── */}
        <div style={catRowStyle} className="cat-scroll">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                style={catPillStyle(active)}
                className="cat-pill"
                id={`cat-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ── Section header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '3px 0 0 0' }}>
              {isLoading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} available`}
            </p>
          </div>
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
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <h3 style={{ color: '#334155', fontWeight: '700', margin: '0 0 8px' }}>No products found</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Try searching for something else or pick another category.</p>
          </div>
        )}

        {/* ── Products Grid ── */}
        {!isLoading && products.length > 0 && (
          <div style={gridStyle} className="fade-in">
            {products.map((product) => {
              const condColor = CONDITION_COLORS[product.condition || ''] || '#6b7280';
              const condBg = CONDITION_BG[product.condition || ''] || '#f8fafc';
              const isWishlisted = wishlistIds.has(product.id);

              return (
                <div
                  key={product.id}
                  className="home-product-card fade-in"
                  style={cardOuterStyle}
                >
                  {/* Image & Body */}
                  <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={cardImageWrapStyle}>
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.title} style={cardImageStyle} loading="lazy" />
                      ) : (
                        <div style={noImageStyle}>
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                            <line x1="12" y1="22.08" x2="12" y2="12"/>
                          </svg>
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
                        type="button"
                        onClick={(e) => handleWishlistToggle(e, product.id)}
                        style={heartBtnStyle}
                        className="wish-btn"
                        disabled={togglingWishId === product.id}
                        id={`wish-home-${product.id}`}
                        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={isWishlisted ? '#ef4444' : 'none'}
                          stroke={isWishlisted ? '#ef4444' : '#64748b'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>

                    {/* Card Body */}
                    <div style={cardBodyStyle}>
                      <div style={cardCatStyle}>{product.category || 'General'}</div>
                      <h3 style={cardTitleStyle}>{product.title}</h3>
                      <div style={cardSellerStyle}>by {product.seller_name}</div>
                    </div>
                  </Link>

                  {/* Price + ADD / Stepper */}
                  <div style={cardFootStyle}>
                    <div style={cardPriceStyle}>
                      ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                    </div>
                    <CartButton
                      productId={product.id}
                      stock={product.stock}
                      productTitle={product.title}
                      id={`add-home-${product.id}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────

const searchInputStyle: React.CSSProperties = {
  flex: 1,
  height: '44px',
  padding: '0 16px',
  borderRadius: '8px 0 0 8px',
  border: '1px solid #e5e7eb',
  borderRight: 'none',
  backgroundColor: '#ffffff',
  color: '#111827',
  fontSize: '14px',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'border-color 0.15s',
  minWidth: 0,
};

const searchBtnStyle: React.CSSProperties = {
  height: '44px',
  padding: '0 22px',
  borderRadius: '0 8px 8px 0',
  border: '1px solid #111827',
  backgroundColor: '#111827',
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '700',
  letterSpacing: '0.04em',
  fontFamily: "'Inter', system-ui, sans-serif",
  whiteSpace: 'nowrap',
  transition: 'background 0.15s',
};

const catRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  marginBottom: '22px',
  overflowX: 'auto',
  paddingBottom: '2px',
};

const catPillStyle = (active: boolean): React.CSSProperties => ({
  padding: '6px 16px',
  borderRadius: '20px',
  border: `1px solid ${active ? '#111827' : '#e5e7eb'}`,
  backgroundColor: active ? '#111827' : '#ffffff',
  color: active ? '#ffffff' : '#374151',
  fontSize: '12px',
  fontWeight: active ? '700' : '500',
  cursor: 'pointer',
  fontFamily: "'Inter', system-ui, sans-serif",
  whiteSpace: 'nowrap',
  transition: 'all 0.15s ease',
});

const spinnerStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  border: '2.5px solid #e5e7eb',
  borderTop: '2.5px solid #111827',
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
  borderRadius: '10px',
  border: '1px solid #e5e7eb',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  cursor: 'pointer',
  boxSizing: 'border-box',
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
  background: '#f3f4f6',
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
  cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
  transition: 'transform 0.15s, color 0.15s',
  zIndex: 1,
};

const cardBodyStyle: React.CSSProperties = {
  padding: '14px 16px 8px',
  display: 'flex',
  flexDirection: 'column',
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
  lineHeight: '1.35',
  height: '38px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const cardSellerStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#94a3b8',
  fontWeight: '500',
  margin: '0',
  marginTop: 'auto',
};

const cardFootStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 16px 12px',
  borderTop: '1px solid #f3f4f6',
  gap: '8px',
  marginTop: 'auto',
  minHeight: '56px',
  boxSizing: 'border-box',
};

const cardPriceStyle: React.CSSProperties = {
  fontSize: '17px',
  fontWeight: '800',
  color: '#0f172a',
  letterSpacing: '-0.01em',
  display: 'flex',
  alignItems: 'center',
};

export default HomePage;
