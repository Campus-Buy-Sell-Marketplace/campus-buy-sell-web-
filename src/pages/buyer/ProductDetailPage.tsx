// ============================================================
// LAVSA — Product Detail Page
// Shows full product info, seller info, and add-to-cart.
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import PublicNavbar from '../../components/PublicNavbar/PublicNavbar';
import { getProductById, Product } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getWishlistIds, addToWishlist, removeFromWishlist } from '../../services/userService';

const CONDITIONS: Record<string, { label: string; color: string; bg: string }> = {
  NEW:      { label: 'New',       color: '#111827', bg: '#f3f4f6' },
  LIKE_NEW: { label: 'Like New',  color: '#111827', bg: '#f3f4f6' },
  GOOD:     { label: 'Good',      color: '#374151', bg: '#f3f4f6' },
  FAIR:     { label: 'Fair',      color: '#4b5563', bg: '#f3f4f6' },
  POOR:     { label: 'Poor',      color: '#6b7280', bg: '#f3f4f6' },
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Auto-dismiss action error after 4 seconds
  useEffect(() => {
    if (actionError) {
      const timer = setTimeout(() => setActionError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionError]);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getProductById(id)
      .then((data) => setProduct(data))
      .catch(() => setError('Product not found or unavailable.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  // Load wishlist state for this product
  useEffect(() => {
    if (!id) return;
    getWishlistIds()
      .then((ids) => setIsWishlisted(ids.includes(id)))
      .catch(() => {});
  }, [id]);

  const handleWishlistToggle = async () => {
    if (!product || wishlistLoading) return;
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        setIsWishlisted(false);
      } else {
        await addToWishlist(product.id);
        setIsWishlisted(true);
      }
    } catch {
      alert('Could not update wishlist. Please try again.');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (!isAuthenticated) { navigate('/login'); return; }
    setActionError('');
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
      setAdded(true);
      showToast(`Added ${quantity} × "${product.title}" to cart!`, 'success');
      setTimeout(() => setAdded(false), 2000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to add item to cart.';
      setActionError(msg);
      showToast(msg, 'warning');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (!isAuthenticated) { navigate('/login'); return; }
    setActionError('');
    try {
      await addToCart(product.id, quantity);
      navigate('/cart');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to add item to cart.';
      setActionError(msg);
      showToast(msg, 'warning');
      if (err?.response?.status === 409) {
        navigate('/cart');
      }
    }
  };

  // Determine which layout to use based on auth state
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    isAuthenticated
      ? <AppLayout>{children}</AppLayout>
      : (
          <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: "'Inter', system-ui, sans-serif" }}>
            <PublicNavbar />
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 20px' }}>{children}</div>
          </div>
        );

  if (isLoading) {
    return (
      <Wrapper>
        <div style={centerStyle}>
          <div style={spinnerStyle} />
          <p style={{ color: '#6b7280', marginTop: '12px' }}>Loading product...</p>
        </div>
      </Wrapper>
    );
  }

  if (error || !product) {
    return (
      <Wrapper>
        <div style={centerStyle}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px auto' }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h2 style={{ color: '#374151', margin: '8px 0 8px 0' }}>
            {error || 'Product not found'}
          </h2>
          <Link to="/" style={backLinkStyle}>← Back to Products</Link>
        </div>
      </Wrapper>
    );
  }

  const condition = product.condition ? CONDITIONS[product.condition] : null;

  return (
    <Wrapper>
      <div style={{ maxWidth: isAuthenticated ? '900px' : '860px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={breadcrumbStyle}>
          <Link to="/" style={breadcrumbLinkStyle}>Products</Link>
          <span style={{ color: '#d1d5db' }}>›</span>
          {product.category && (
            <>
              <Link to={`/products?category=${product.category}`} style={breadcrumbLinkStyle}>
                {product.category}
              </Link>
              <span style={{ color: '#d1d5db' }}>›</span>
            </>
          )}
          <span style={{ color: '#6b7280', fontSize: '13px' }}>{product.title}</span>
        </div>

        {/* Main content */}
        <div style={detailGridStyle}>
          {/* Left: Image */}
          <div style={imageColStyle}>
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} style={mainImageStyle} />
            ) : (
              <div style={noImageStyle}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
                <p style={{ color: '#9ca3af', margin: '8px 0 0 0', fontSize: '14px' }}>No image available</p>
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div style={infoColStyle}>
            {/* Category + condition */}
            <div style={tagsRowStyle}>
              {product.category && (
                <span style={categoryTagStyle}>{product.category}</span>
              )}
              {condition && (
                <span style={{ ...conditionTagStyle, color: condition.color, backgroundColor: condition.bg }}>
                  {condition.label}
                </span>
              )}
            </div>

            <h1 style={titleStyle}>{product.title}</h1>

            <div style={priceRowStyle}>
              <span style={priceStyle}>₹{Number(product.price).toFixed(2)}</span>
              <span style={stockStyle}>
                {Number(product.stock) > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {product.description && (
              <p style={descStyle}>{product.description}</p>
            )}

            {/* Seller info */}
            <div style={sellerCardStyle}>
              <div style={sellerAvatarStyle}>
                {product.seller_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>Sold by</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                  {product.seller_name}
                </div>
              </div>
            </div>

            {/* Quantity selector */}
            {Number(product.stock) > 0 && (
              <div style={quantityRowStyle}>
                <span style={qtyLabelStyle}>Quantity</span>
                <div style={qtyControlsStyle}>
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} style={qtyBtnStyle} id="qty-dec">−</button>
                  <span style={qtyValueStyle}>{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(Number(product.stock), q + 1))}
                    style={qtyBtnStyle}
                    disabled={quantity >= Number(product.stock)}
                    id="qty-inc"
                  >+</button>
                </div>
              </div>
            )}

            {/* Error banner */}
            {actionError && (
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', borderRadius: '8px', backgroundColor: '#fef2f2',
                border: '1px solid #fecaca', color: '#991b1b', fontSize: '13px', marginBottom: '14px',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {actionError}
                </span>
                <button
                  onClick={() => setActionError('')}
                  style={{ background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', fontWeight: 'bold' }}
                  aria-label="Dismiss error"
                >✕</button>
              </div>
            )}

            {/* Action buttons */}
            {isAuthenticated ? (
              <div style={actionBtnsStyle}>
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || Number(product.stock) === 0}
                  style={{
                    ...addToCartBtnStyle,
                    backgroundColor: added ? '#f3f4f6' : '#ffffff',
                    color: '#111827',
                  }}
                  id="detail-add-to-cart-btn"
                >
                  {isAdding ? 'Adding...' : added ? '✓ Added to Cart' : '+ Add to Cart'}
                </button>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleBuyNow}
                    disabled={Number(product.stock) === 0}
                    style={{ ...buyNowBtnStyle, flex: 1 }}
                    id="detail-buy-now-btn"
                  >
                    Buy Now →
                  </button>
                  <button
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                    style={wishBtnStyle(isWishlisted)}
                    id="detail-wishlist-btn"
                    title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={isWishlisted ? '#111827' : 'none'}
                      stroke="#111827"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                  Sign in to add this item to your cart or buy it.
                </p>
                <Link to="/login" style={signInToBuyBtnStyle} id="detail-signin-btn">
                  Sign in to Buy
                </Link>
              </div>
            )}

            {/* Listed date */}
            <p style={listedStyle}>
              Listed on{' '}
              {new Date(product.created_at).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          #detail-add-to-cart-btn:hover:not(:disabled) { background-color: #f3f4f6 !important; }
          #detail-buy-now-btn:hover:not(:disabled) { background-color: #111827 !important; color: #ffffff !important; }
          #qty-dec:hover, #qty-inc:hover:not(:disabled) { background-color: #e5e7eb !important; }
          #detail-wishlist-btn:hover:not(:disabled) { background-color: #f3f4f6 !important; }
          #detail-signin-btn:hover { background: #374151 !important; }
        `}</style>
      </div>
    </Wrapper>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const centerStyle: React.CSSProperties = { textAlign: 'center', padding: '80px 0' };

const spinnerStyle: React.CSSProperties = {
  width: '36px', height: '36px', border: '3px solid #e5e7eb',
  borderTop: '3px solid #111827', borderRadius: '50%', margin: '0 auto',
  animation: 'spin 0.8s linear infinite',
};

const backLinkStyle: React.CSSProperties = {
  display: 'inline-block', marginTop: '12px', color: '#6b7280',
  fontSize: '14px', textDecoration: 'none',
};

const breadcrumbStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '8px',
  fontSize: '13px', marginBottom: '24px',
};

const breadcrumbLinkStyle: React.CSSProperties = {
  color: '#6b7280', textDecoration: 'none', fontSize: '13px',
};

const detailGridStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start',
};

const imageColStyle: React.CSSProperties = {
  borderRadius: '14px', overflow: 'hidden', border: '1px solid #e5e7eb',
};

const mainImageStyle: React.CSSProperties = {
  width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block',
};

const noImageStyle: React.CSSProperties = {
  aspectRatio: '1 / 1', backgroundColor: '#f3f4f6', display: 'flex',
  flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
};

const infoColStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: '16px',
};

const tagsRowStyle: React.CSSProperties = { display: 'flex', gap: '8px', flexWrap: 'wrap' };

const categoryTagStyle: React.CSSProperties = {
  padding: '3px 10px', borderRadius: '4px', backgroundColor: '#f3f4f6',
  color: '#6b7280', fontSize: '12px', fontWeight: '500',
};

const conditionTagStyle: React.CSSProperties = {
  padding: '3px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
};

const titleStyle: React.CSSProperties = {
  fontSize: '26px', fontWeight: '800', color: '#111827', margin: 0, lineHeight: '1.3',
};

const priceRowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'baseline', gap: '14px',
};

const priceStyle: React.CSSProperties = {
  fontSize: '32px', fontWeight: '900', color: '#111827',
};

const stockStyle: React.CSSProperties = {
  fontSize: '13px', color: '#6b7280',
};

const descStyle: React.CSSProperties = {
  fontSize: '14px', color: '#374151', lineHeight: '1.7', margin: 0,
  borderTop: '1px solid #f3f4f6', paddingTop: '16px',
};

const sellerCardStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '10px',
  padding: '12px 16px', borderRadius: '10px', backgroundColor: '#f9fafb',
  border: '1px solid #f3f4f6',
};

const sellerAvatarStyle: React.CSSProperties = {
  width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#111827',
  color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '14px', fontWeight: '700', flexShrink: 0,
};

const quantityRowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '16px',
};

const qtyLabelStyle: React.CSSProperties = {
  fontSize: '14px', fontWeight: '600', color: '#374151',
};

const qtyControlsStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '8px',
};

const qtyBtnStyle: React.CSSProperties = {
  width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb', color: '#374151', fontSize: '18px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: "'Inter', system-ui, sans-serif", transition: 'background-color 0.15s ease',
};

const qtyValueStyle: React.CSSProperties = {
  fontSize: '16px', fontWeight: '700', color: '#111827', minWidth: '24px', textAlign: 'center',
};

const actionBtnsStyle: React.CSSProperties = {
  display: 'flex', gap: '12px', flexDirection: 'column',
};

const addToCartBtnStyle: React.CSSProperties = {
  padding: '14px', borderRadius: '10px', border: '1.5px solid #111827',
  backgroundColor: '#ffffff', color: '#111827', fontSize: '15px', fontWeight: '700',
  cursor: 'pointer', transition: 'all 0.18s ease',
  fontFamily: "'Inter', system-ui, sans-serif",
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const buyNowBtnStyle: React.CSSProperties = {
  padding: '14px', borderRadius: '10px', border: '1.5px solid #111827',
  backgroundColor: '#ffffff', color: '#111827', fontSize: '15px', fontWeight: '700',
  cursor: 'pointer', transition: 'all 0.18s ease',
  fontFamily: "'Inter', system-ui, sans-serif",
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const wishBtnStyle = (active: boolean): React.CSSProperties => ({
  padding: '14px 18px', borderRadius: '10px',
  border: '1.5px solid #e5e7eb',
  backgroundColor: active ? '#f3f4f6' : '#ffffff',
  cursor: 'pointer', transition: 'all 0.18s ease', flexShrink: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
});

const listedStyle: React.CSSProperties = {
  fontSize: '12px', color: '#9ca3af', margin: 0,
};

const signInToBuyBtnStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '13px 28px',
  borderRadius: '10px',
  backgroundColor: '#111827',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '700',
  textDecoration: 'none',
  transition: 'background 0.15s',
  fontFamily: "'Inter', system-ui, sans-serif",
};

export default ProductDetailPage;
