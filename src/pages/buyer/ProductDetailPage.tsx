// ============================================================
// LAVSA — Product Detail Page
// Shows full product info, seller info, and add-to-cart.
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { getProductById, Product } from '../../services/productService';
import { useCart } from '../../context/CartContext';

const CONDITIONS: Record<string, { label: string; color: string; bg: string }> = {
  NEW:      { label: 'New',       color: '#065f46', bg: '#f0fdf4' },
  LIKE_NEW: { label: 'Like New',  color: '#1e40af', bg: '#eff6ff' },
  GOOD:     { label: 'Good',      color: '#374151', bg: '#f3f4f6' },
  FAIR:     { label: 'Fair',      color: '#92400e', bg: '#fffbeb' },
  POOR:     { label: 'Poor',      color: '#991b1b', bg: '#fef2f2' },
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getProductById(id)
      .then((data) => setProduct(data))
      .catch(() => setError('Product not found or unavailable.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    await addToCart(product.id, quantity);
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div style={centerStyle}>
          <div style={spinnerStyle} />
          <p style={{ color: '#6b7280', marginTop: '12px' }}>Loading product...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !product) {
    return (
      <AppLayout>
        <div style={centerStyle}>
          <span style={{ fontSize: '48px' }}>😕</span>
          <h2 style={{ color: '#374151', margin: '16px 0 8px 0' }}>
            {error || 'Product not found'}
          </h2>
          <Link to="/products" style={backLinkStyle}>← Back to Products</Link>
        </div>
      </AppLayout>
    );
  }

  const condition = product.condition ? CONDITIONS[product.condition] : null;

  return (
    <AppLayout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={breadcrumbStyle}>
          <Link to="/products" style={breadcrumbLinkStyle}>Products</Link>
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
              <img
                src={product.image_url}
                alt={product.title}
                style={mainImageStyle}
              />
            ) : (
              <div style={noImageStyle}>
                <span style={{ fontSize: '64px' }}>📦</span>
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
                <span style={{
                  ...conditionTagStyle,
                  color: condition.color,
                  backgroundColor: condition.bg,
                }}>
                  {condition.label}
                </span>
              )}
            </div>

            <h1 style={titleStyle}>{product.title}</h1>

            <div style={priceRowStyle}>
              <span style={priceStyle}>₹{Number(product.price).toFixed(2)}</span>
              <span style={stockStyle}>
                {Number(product.stock) > 0
                  ? `${product.stock} in stock`
                  : '❌ Out of stock'}
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
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={qtyBtnStyle}
                    id="qty-dec"
                  >
                    −
                  </button>
                  <span style={qtyValueStyle}>{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(Number(product.stock), q + 1))}
                    style={qtyBtnStyle}
                    disabled={quantity >= Number(product.stock)}
                    id="qty-inc"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={actionBtnsStyle}>
              <button
                onClick={handleAddToCart}
                disabled={isAdding || Number(product.stock) === 0}
                style={{
                  ...addToCartBtnStyle,
                  backgroundColor: added ? '#065f46' : '#111827',
                }}
                id="detail-add-to-cart-btn"
              >
                {isAdding ? 'Adding...' : added ? '✓ Added to Cart' : '+ Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={Number(product.stock) === 0}
                style={buyNowBtnStyle}
                id="detail-buy-now-btn"
              >
                Buy Now →
              </button>
            </div>

            {/* Listed date */}
            <p style={listedStyle}>
              Listed on{' '}
              {new Date(product.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        #detail-add-to-cart-btn:hover:not(:disabled) { opacity: 0.9; }
        #detail-buy-now-btn:hover:not(:disabled) { background-color: #1e3a5f !important; }
        #qty-dec:hover, #qty-inc:hover:not(:disabled) { background-color: #e5e7eb !important; }
      `}</style>
    </AppLayout>
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
  padding: '14px', borderRadius: '10px', border: 'none',
  color: '#ffffff', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const buyNowBtnStyle: React.CSSProperties = {
  padding: '14px', borderRadius: '10px', border: '1.5px solid #1e3a5f',
  backgroundColor: '#1e3a5f', color: '#ffffff', fontSize: '15px', fontWeight: '700',
  cursor: 'pointer', transition: 'background-color 0.2s ease',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const listedStyle: React.CSSProperties = {
  fontSize: '12px', color: '#9ca3af', margin: 0,
};

export default ProductDetailPage;
