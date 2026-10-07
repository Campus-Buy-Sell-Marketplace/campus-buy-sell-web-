// ============================================================
// LAVSA — Wishlist Page
// Shows all saved/wishlisted products for the current user.
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { getWishlist, removeFromWishlist, WishlistItem } from '../../services/userService';
import { useCart } from '../../context/CartContext';

const CONDITIONS: Record<string, string> = {
  NEW: '#065f46',
  LIKE_NEW: '#1e40af',
  GOOD: '#374151',
  FAIR: '#92400e',
  POOR: '#991b1b',
};

const WishlistPage: React.FC = () => {
  const { addToCart } = useCart();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getWishlist();
      setItems(data);
    } catch {
      setError('Could not load wishlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    try {
      await removeFromWishlist(productId);
      setItems((prev) => prev.filter((i) => i.id !== productId));
    } catch {
      alert('Failed to remove from wishlist.');
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    setAddingId(productId);
    try {
      await addToCart(productId, 1);
      setAddedId(productId);
      setTimeout(() => setAddedId(null), 1500);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={headerRowStyle}>
          <div>
            <h1 style={headingStyle}>My Wishlist</h1>
            <p style={subStyle}>
              {isLoading ? 'Loading…' : `${items.length} saved item${items.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {error && <div style={errorBoxStyle}>⚠️ {error}</div>}

        {isLoading && (
          <div style={centerStyle}>
            <div style={spinnerStyle} />
            <p style={{ color: '#6b7280', marginTop: '12px' }}>Loading wishlist…</p>
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div style={emptyCardStyle}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤍</div>
            <h3 style={{ color: '#111827', margin: '0 0 8px 0' }}>Your wishlist is empty</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 20px 0' }}>
              Browse products and hit ❤️ to save items for later.
            </p>
            <Link to="/products" style={browseBtnStyle}>Browse Products →</Link>
          </div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <div style={gridStyle}>
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/products/${item.id}`}
                style={cardStyle}
                className="wish-card"
                id={`wish-${item.id}`}
              >
                {/* Image */}
                <div style={cardImageWrapStyle}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} style={cardImageStyle} loading="lazy" />
                  ) : (
                    <div style={cardNoImageStyle}><span style={{ fontSize: '36px' }}>📦</span></div>
                  )}
                  {item.condition && (
                    <span style={{ ...condBadgeStyle, backgroundColor: CONDITIONS[item.condition] || '#374151' }}>
                      {item.condition.replace('_', ' ')}
                    </span>
                  )}
                  {/* Remove from wishlist */}
                  <button
                    onClick={(e) => { e.preventDefault(); handleRemove(item.id); }}
                    style={heartBtnStyle}
                    disabled={removingId === item.id}
                    id={`remove-wish-${item.id}`}
                    title="Remove from wishlist"
                  >
                    {removingId === item.id ? '…' : '❤️'}
                  </button>
                </div>

                {/* Body */}
                <div style={cardBodyStyle}>
                  <div style={cardCatStyle}>{item.category || 'General'}</div>
                  <h3 style={cardTitleStyle}>{item.title}</h3>
                  {item.description && (
                    <p style={cardDescStyle}>
                      {item.description.slice(0, 70)}{item.description.length > 70 ? '…' : ''}
                    </p>
                  )}
                  <div style={cardFootStyle}>
                    <div>
                      <div style={cardPriceStyle}>₹{Number(item.price).toFixed(2)}</div>
                      <div style={cardSellerStyle}>by {item.seller_name}</div>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, item.id)}
                      style={{
                        ...cartBtnStyle,
                        backgroundColor: addedId === item.id ? '#065f46' : '#111827',
                      }}
                      disabled={addingId === item.id || Number(item.stock) === 0}
                      id={`wish-cart-${item.id}`}
                    >
                      {Number(item.stock) === 0
                        ? 'Out of stock'
                        : addingId === item.id
                        ? '...'
                        : addedId === item.id
                        ? '✓ Added'
                        : '+ Cart'}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .wish-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
        #${items.map(i => `remove-wish-${i.id}`).join(':hover, #')}:hover { transform: scale(1.15); }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </AppLayout>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const headingStyle: React.CSSProperties = { color: '#111827', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' };
const subStyle: React.CSSProperties = { color: '#6b7280', fontSize: '14px', margin: 0 };
const headerRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' };
const errorBoxStyle: React.CSSProperties = { padding: '16px', borderRadius: '10px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', fontSize: '14px', marginBottom: '16px' };
const centerStyle: React.CSSProperties = { textAlign: 'center', padding: '60px 0' };
const spinnerStyle: React.CSSProperties = { width: '32px', height: '32px', border: '3px solid #e5e7eb', borderTop: '3px solid #111827', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' };
const emptyCardStyle: React.CSSProperties = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '60px 24px', textAlign: 'center' };
const browseBtnStyle: React.CSSProperties = { display: 'inline-block', padding: '10px 20px', borderRadius: '8px', backgroundColor: '#111827', color: '#ffffff', fontSize: '14px', fontWeight: '600', textDecoration: 'none' };
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '16px' };
const cardStyle: React.CSSProperties = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', textDecoration: 'none', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s ease, box-shadow 0.2s ease', cursor: 'pointer' };
const cardImageWrapStyle: React.CSSProperties = { position: 'relative', height: '170px', overflow: 'hidden' };
const cardImageStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const cardNoImageStyle: React.CSSProperties = { width: '100%', height: '100%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const condBadgeStyle: React.CSSProperties = { position: 'absolute', top: '8px', left: '8px', padding: '2px 8px', borderRadius: '4px', color: '#ffffff', fontSize: '10px', fontWeight: '700', letterSpacing: '0.05em' };
const heartBtnStyle: React.CSSProperties = { position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', transition: 'transform 0.15s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' };
const cardBodyStyle: React.CSSProperties = { padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, gap: '4px' };
const cardCatStyle: React.CSSProperties = { fontSize: '11px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' };
const cardTitleStyle: React.CSSProperties = { fontSize: '14px', fontWeight: '600', color: '#111827', margin: '2px 0 4px 0', lineHeight: '1.4' };
const cardDescStyle: React.CSSProperties = { fontSize: '12px', color: '#6b7280', margin: 0, lineHeight: '1.5' };
const cardFootStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: '10px' };
const cardPriceStyle: React.CSSProperties = { fontSize: '16px', fontWeight: '800', color: '#111827' };
const cardSellerStyle: React.CSSProperties = { fontSize: '11px', color: '#9ca3af', marginTop: '2px' };
const cartBtnStyle: React.CSSProperties = { padding: '6px 12px', borderRadius: '6px', border: 'none', color: '#ffffff', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.15s ease', fontFamily: "'Inter', system-ui, sans-serif", flexShrink: 0 };

export default WishlistPage;
