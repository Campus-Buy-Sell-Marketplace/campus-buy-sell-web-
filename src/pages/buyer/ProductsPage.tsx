// ============================================================
// LAVSA — Products Page — Premium White Theme
// Full product browse with Add to Cart + Buy Now
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { getProducts, Product } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { getWishlistIds, addToWishlist, removeFromWishlist } from '../../services/userService';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Furniture', 'Sports', 'Other'];

const CONDITION_COLORS: Record<string, { text: string; bg: string }> = {
  NEW:      { text: '#059669', bg: '#ecfdf5' },
  LIKE_NEW: { text: '#2563eb', bg: '#eff6ff' },
  GOOD:     { text: '#7c3aed', bg: '#f5f3ff' },
  FAIR:     { text: '#d97706', bg: '#fffbeb' },
  POOR:     { text: '#dc2626', bg: '#fef2f2' },
};

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const [addingId, setAddingId] = useState<string | null>(null);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [togglingWishId, setTogglingWishId] = useState<string | null>(null);

  useEffect(() => {
    getWishlistIds().then((ids) => setWishlistIds(new Set(ids))).catch(() => {});
  }, []);

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
      setError('Could not load products. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSearchParams(cat !== 'All' ? { category: cat } : {});
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputValue);
    const p: Record<string, string> = {};
    if (selectedCategory !== 'All') p.category = selectedCategory;
    if (inputValue.trim()) p.q = inputValue.trim();
    setSearchParams(p);
  };

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
    setBuyingId(productId);
    try {
      await addToCart(productId, 1);
      navigate('/cart');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed. Try again.', 'warning');
      setBuyingId(null);
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

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .prod-card { transition: transform 0.22s cubic-bezier(.4,0,.2,1), box-shadow 0.22s ease !important; }
        .prod-card:hover { transform: translateY(-4px) !important; box-shadow: 0 20px 48px rgba(0,0,0,0.10) !important; }
        .btn-cart-p:hover:not(:disabled) { background: #1d4ed8 !important; }
        .btn-buy-p:hover:not(:disabled) { background: #1e293b !important; }
        .wish-btn-p:hover { transform: scale(1.18); }
        .search-prod-input:focus { outline: none; border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important; }
        .cat-pill-p { transition: all 0.15s ease !important; }
        .cat-pill-p:hover { background: #f1f5f9 !important; border-color: #94a3b8 !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in-p { animation: fadeIn 0.3s ease forwards; }
        @media (max-width: 640px) {
          .products-header-row { flex-direction: column !important; align-items: stretch !important; }
          .search-prod-form { width: 100% !important; }
          .search-prod-input { flex: 1 !important; }
          .products-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important; }
          .cat-scroll { overflow-x: auto; padding-bottom: 8px; flex-wrap: nowrap !important; }
        }
      `}</style>

      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Page Header ── */}
        <div style={headerWrapStyle} className="products-header-row">
          <div>
            <h1 style={headingStyle}>Products</h1>
            <p style={subStyle}>
              {isLoading
                ? 'Searching...'
                : `${products.length} item${products.length !== 1 ? 's' : ''} available`}
            </p>
          </div>

          <form onSubmit={handleSearch} style={searchFormStyle} className="search-prod-form">
            <input
              type="text"
              placeholder="Search products..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={searchInputStyle}
              className="search-prod-input"
              id="products-search-input"
            />
            <button type="submit" style={searchBtnStyle} id="products-search-btn">
              Search
            </button>
          </form>
        </div>

        {/* ── Category Pills ── */}
        <div style={catRowStyle} className="cat-scroll">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={catPillStyle(isActive)}
                className="cat-pill-p"
                id={`products-cat-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={errorStyle}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Loading ── */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '70px 0' }}>
            <div style={spinnerStyle} />
            <p style={{ color: '#94a3b8', marginTop: '14px', fontSize: '14px' }}>Loading products...</p>
          </div>
        )}

        {/* ── Empty ── */}
        {!isLoading && !error && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '70px 20px' }}>
            <div style={{ fontSize: '52px', marginBottom: '14px' }}>🔍</div>
            <h3 style={{ color: '#334155', fontWeight: '700', margin: '0 0 8px' }}>No products found</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>
              Try a different category or search term.
            </p>
          </div>
        )}

        {/* ── Products Grid ── */}
        {!isLoading && !error && products.length > 0 && (
          <div style={gridStyle} className="products-grid">
            {products.map((product) => {
              const cond = CONDITION_COLORS[product.condition || ''];
              const isAdding = addingId === product.id;
              const isBuying = buyingId === product.id;
              const isAdded = addedId === product.id;
              const isWishlisted = wishlistIds.has(product.id);
              const busy = isAdding || isBuying;

              return (
                <div
                  key={product.id}
                  className="prod-card fade-in-p"
                  style={cardStyle}
                  id={`product-${product.id}`}
                >
                  {/* Image area — clicking goes to detail */}
                  <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={cardImgWrapStyle}>
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.title}
                          style={cardImgStyle}
                          loading="lazy"
                        />
                      ) : (
                        <div style={noImgStyle}>
                          <span style={{ fontSize: '44px' }}>📦</span>
                        </div>
                      )}

                      {/* Condition badge */}
                      {cond && (
                        <span style={{ ...condBadgeStyle, color: cond.text, backgroundColor: cond.bg }}>
                          {product.condition!.replace('_', ' ')}
                        </span>
                      )}

                      {/* Wishlist */}
                      <button
                        onClick={(e) => handleWishlistToggle(e, product.id)}
                        style={{ ...heartBtnStyle, color: isWishlisted ? '#ef4444' : '#94a3b8' }}
                        className="wish-btn-p"
                        disabled={togglingWishId === product.id}
                        id={`wish-${product.id}`}
                        title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                      >
                        {isWishlisted ? '♥' : '♡'}
                      </button>
                    </div>

                    {/* Card body */}
                    <div style={cardBodyStyle}>
                      <span style={catLabelStyle}>{product.category || 'General'}</span>
                      <h3 style={cardTitleStyle}>{product.title}</h3>
                      {product.description && (
                        <p style={cardDescStyle}>
                          {product.description.length > 72
                            ? product.description.slice(0, 72) + '…'
                            : product.description}
                        </p>
                      )}
                      <div style={sellerStyle}>by {product.seller_name}</div>
                    </div>
                  </Link>

                  {/* Price + Action row */}
                  <div style={cardFootStyle}>
                    <div style={priceStyle}>
                      ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                    </div>
                    <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                      {/* Cart icon button */}
                      <button
                        onClick={(e) => handleAddToCart(e, product.id)}
                        style={{
                          ...addCartBtnStyle,
                          background: isAdded ? '#059669' : '#2563eb',
                          opacity: busy ? 0.65 : 1,
                        }}
                        disabled={busy}
                        className="btn-cart-p"
                        id={`add-cart-${product.id}`}
                        title="Add to cart"
                      >
                        {isAdding ? '…' : isAdded ? '✓' : '🛒'}
                      </button>

                      {/* Buy Now */}
                      <button
                        onClick={(e) => handleBuyNow(e, product.id)}
                        style={{
                          ...buyNowBtnStyle,
                          opacity: busy ? 0.65 : 1,
                        }}
                        disabled={busy}
                        className="btn-buy-p"
                        id={`buy-now-${product.id}`}
                      >
                        {isBuying ? 'Going…' : 'Buy Now'}
                      </button>
                    </div>
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

const headingStyle: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: '800',
  color: '#0f172a',
  margin: '0 0 3px 0',
  letterSpacing: '-0.02em',
};

const subStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#94a3b8',
  margin: 0,
  fontWeight: '500',
};

const headerWrapStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginBottom: '18px',
  flexWrap: 'wrap',
  gap: '14px',
};

const searchFormStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0',
  flexShrink: 0,
};

const searchInputStyle: React.CSSProperties = {
  height: '42px',
  padding: '0 14px',
  borderRadius: '10px 0 0 10px',
  border: '1.5px solid #e2e8f0',
  borderRight: 'none',
  backgroundColor: '#ffffff',
  color: '#0f172a',
  fontSize: '13px',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'border-color 0.15s, box-shadow 0.15s',
  width: '220px',
};

const searchBtnStyle: React.CSSProperties = {
  height: '42px',
  padding: '0 18px',
  borderRadius: '0 10px 10px 0',
  border: '1.5px solid #6366f1',
  backgroundColor: '#6366f1',
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '600',
  fontFamily: "'Inter', system-ui, sans-serif",
  whiteSpace: 'nowrap',
};

const catRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  marginBottom: '24px',
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
  letterSpacing: active ? '0' : '0',
});

const errorStyle: React.CSSProperties = {
  padding: '14px 18px',
  borderRadius: '12px',
  backgroundColor: '#fffbeb',
  border: '1px solid #fde68a',
  color: '#92400e',
  fontSize: '14px',
  marginBottom: '18px',
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
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  transition: 'transform 0.3s ease',
};

const noImgStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
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
  padding: '14px 16px 10px',
  flex: 1,
};

const catLabelStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: '700',
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  display: 'block',
  marginBottom: '5px',
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
  margin: '0 0 6px 0',
  lineHeight: '1.55',
};

const sellerStyle: React.CSSProperties = {
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

const priceStyle: React.CSSProperties = {
  fontSize: '17px',
  fontWeight: '800',
  color: '#0f172a',
  letterSpacing: '-0.01em',
};

const addCartBtnStyle: React.CSSProperties = {
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
  transition: 'background 0.15s',
  flexShrink: 0,
  fontFamily: "'Inter', system-ui, sans-serif",
};

const buyNowBtnStyle: React.CSSProperties = {
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

export default ProductsPage;
