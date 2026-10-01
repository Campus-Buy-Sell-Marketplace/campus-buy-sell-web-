// ============================================================
// LAVSA — Cart Page
// Shows the user's cart, persisted in backend per user.
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { useCart } from '../../context/CartContext';

const CartPage: React.FC = () => {
  const { items, totalCount, totalPrice, isLoading, removeFromCart, updateQuantity, clearCart } =
    useCart();

  return (
    <AppLayout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={headerRowStyle}>
          <div>
            <h1 style={headingStyle}>🛒 My Cart</h1>
            <p style={subStyle}>
              {totalCount > 0
                ? `${totalCount} item${totalCount !== 1 ? 's' : ''} · ₹${totalPrice.toFixed(2)} total`
                : 'Your cart is empty'}
            </p>
          </div>
          {items.length > 0 && (
            <button style={clearBtnStyle} onClick={clearCart} id="clear-cart-btn">
              Clear Cart
            </button>
          )}
        </div>

        {isLoading && (
          <div style={centerStyle}>
            <div style={spinnerStyle} />
            <p style={{ color: '#6b7280', marginTop: '12px' }}>Loading your cart...</p>
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div style={emptyStyle}>
            <span style={{ fontSize: '64px' }}>🛒</span>
            <h2 style={{ color: '#374151', margin: '16px 0 8px 0' }}>Your cart is empty</h2>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '24px' }}>
              Browse products and add items you like!
            </p>
            <Link to="/" style={shopNowBtnStyle} id="shop-now-btn">
              Shop Now
            </Link>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <div style={cartLayoutStyle}>
            {/* Cart items */}
            <div style={itemsColStyle}>
              {items.map((item) => (
                <div key={item.cart_item_id} style={cartItemStyle} id={`cart-item-${item.cart_item_id}`}>
                  {/* Image */}
                  <div style={itemImageWrapStyle}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} style={itemImageStyle} />
                    ) : (
                      <div style={itemNoImageStyle}>📦</div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={itemDetailsStyle}>
                    <Link to={`/products/${item.product_id}`} style={itemTitleStyle}>
                      {item.title}
                    </Link>
                    <div style={itemSellerStyle}>Sold by {item.seller_name}</div>
                    <div style={itemPriceStyle}>₹{Number(item.price).toFixed(2)}</div>

                    {/* Quantity controls */}
                    <div style={quantityRowStyle}>
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? updateQuantity(item.cart_item_id, item.quantity - 1)
                            : removeFromCart(item.cart_item_id)
                        }
                        style={qtyBtnStyle}
                        id={`qty-dec-${item.cart_item_id}`}
                      >
                        −
                      </button>
                      <span style={qtyValueStyle}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                        style={qtyBtnStyle}
                        disabled={item.quantity >= item.stock}
                        id={`qty-inc-${item.cart_item_id}`}
                      >
                        +
                      </button>
                      <span style={itemSubtotalStyle}>
                        Subtotal: ₹{(Number(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.cart_item_id)}
                    style={removeItemBtnStyle}
                    id={`remove-item-${item.cart_item_id}`}
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div style={summaryStyle}>
              <h2 style={summaryHeadingStyle}>Order Summary</h2>

              <div style={summaryRowStyle}>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>
                  Subtotal ({totalCount} item{totalCount !== 1 ? 's' : ''})
                </span>
                <span style={{ color: '#111827', fontWeight: '600' }}>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div style={{ ...summaryRowStyle, borderTop: '1px solid #f3f4f6', paddingTop: '12px', marginTop: '4px' }}>
                <span style={{ color: '#111827', fontWeight: '700', fontSize: '16px' }}>Total</span>
                <span style={{ color: '#111827', fontWeight: '800', fontSize: '18px' }}>₹{totalPrice.toFixed(2)}</span>
              </div>

              <button
                style={checkoutBtnStyle}
                id="checkout-btn"
                onClick={() => alert('Checkout coming soon!')}
              >
                Proceed to Checkout →
              </button>

              <Link to="/" style={continueLinkStyle} id="continue-shopping-btn">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        #clear-cart-btn:hover { background-color: #fee2e2 !important; color: #dc2626 !important; }
        #checkout-btn:hover { background-color: #374151 !important; }
        #shop-now-btn:hover { background-color: #374151 !important; }
      `}</style>
    </AppLayout>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const headingStyle: React.CSSProperties = {
  color: '#111827',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 4px 0',
};

const subStyle: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '14px',
  margin: 0,
};

const headerRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginBottom: '24px',
};

const clearBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  backgroundColor: '#ffffff',
  color: '#6b7280',
  fontSize: '13px',
  cursor: 'pointer',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'all 0.15s ease',
};

const centerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 0',
};

const spinnerStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  border: '3px solid #e5e7eb',
  borderTop: '3px solid #111827',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
  margin: '0 auto',
};

const emptyStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 0',
};

const shopNowBtnStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '12px 28px',
  borderRadius: '8px',
  backgroundColor: '#111827',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  transition: 'background-color 0.15s ease',
};

const cartLayoutStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 300px',
  gap: '24px',
  alignItems: 'start',
};

const itemsColStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const cartItemStyle: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '16px',
  position: 'relative',
};

const itemImageWrapStyle: React.CSSProperties = {
  width: '90px',
  height: '90px',
  borderRadius: '8px',
  overflow: 'hidden',
  flexShrink: 0,
};

const itemImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const itemNoImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: '#f3f4f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '28px',
};

const itemDetailsStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const itemTitleStyle: React.CSSProperties = {
  color: '#111827',
  fontWeight: '600',
  fontSize: '14px',
  textDecoration: 'none',
};

const itemSellerStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '12px',
};

const itemPriceStyle: React.CSSProperties = {
  color: '#111827',
  fontWeight: '700',
  fontSize: '15px',
  marginTop: '2px',
};

const quantityRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginTop: '8px',
};

const qtyBtnStyle: React.CSSProperties = {
  width: '28px',
  height: '28px',
  borderRadius: '6px',
  border: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
  color: '#374151',
  fontSize: '16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const qtyValueStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#111827',
  minWidth: '20px',
  textAlign: 'center',
};

const itemSubtotalStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#6b7280',
  marginLeft: '4px',
};

const removeItemBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  border: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
  color: '#9ca3af',
  fontSize: '11px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const summaryStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '20px',
  position: 'sticky',
  top: '24px',
};

const summaryHeadingStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#111827',
  margin: '0 0 16px 0',
  paddingBottom: '12px',
  borderBottom: '1px solid #f3f4f6',
};

const summaryRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
};

const checkoutBtnStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#111827',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '700',
  cursor: 'pointer',
  marginTop: '16px',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'background-color 0.15s ease',
};

const continueLinkStyle: React.CSSProperties = {
  display: 'block',
  textAlign: 'center',
  marginTop: '12px',
  fontSize: '13px',
  color: '#6b7280',
  textDecoration: 'none',
};

export default CartPage;
