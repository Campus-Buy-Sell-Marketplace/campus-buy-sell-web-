// ============================================================
// LAVSA — Cart Page
// Shows the user's cart with payment method selection (Offline / Online).
// After checkout, shows the 6-digit delivery OTP to the buyer.
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

interface CheckoutOrder {
  orderId: string;
  deliveryOtp: string;
  paymentMethod: string;
  totalAmount: number;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { items, totalCount, totalPrice, isLoading, removeFromCart, updateQuantity, clearCart, refreshCart } =
    useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'OFFLINE' | 'ONLINE'>('OFFLINE');
  // After checkout succeeds — show OTP modal
  const [completedOrder, setCompletedOrder] = useState<CheckoutOrder | null>(null);

  useEffect(() => {
    if (checkoutError) {
      const timer = setTimeout(() => setCheckoutError(''), 4500);
      return () => clearTimeout(timer);
    }
  }, [checkoutError]);

  const handleCheckout = async () => {
    setCheckoutError('');
    setIsCheckingOut(true);
    try {
      const res = await api.post<{ order: CheckoutOrder }>('/orders/checkout', { paymentMethod });
      const order = res.data.order;
      if (typeof refreshCart === 'function') await refreshCart();
      // Show OTP modal instead of navigating immediately
      setCompletedOrder(order);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Checkout failed. Please try again.';
      setCheckoutError(msg);
      showToast(msg, 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleOtpDismiss = () => {
    setCompletedOrder(null);
    navigate('/orders');
  };

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
                  <div style={itemImageWrapStyle}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} style={itemImageStyle} />
                    ) : (
                      <div style={itemNoImageStyle}>📦</div>
                    )}
                  </div>

                  <div style={itemDetailsStyle}>
                    <Link to={`/products/${item.product_id}`} style={itemTitleStyle}>
                      {item.title}
                    </Link>
                    <div style={itemSellerStyle}>Sold by {item.seller_name}</div>
                    <div style={itemPriceStyle}>₹{Number(item.price).toFixed(2)}</div>

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

            {/* Order Summary */}
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

              {/* Payment method selector */}
              <div style={paymentSectionStyle}>
                <p style={paymentLabelStyle}>Payment Method</p>
                <div style={paymentToggleStyle}>
                  <button
                    id="pay-offline-btn"
                    onClick={() => setPaymentMethod('OFFLINE')}
                    style={payMethodBtnStyle(paymentMethod === 'OFFLINE')}
                  >
                    💵 Pay Cash at Meetup
                  </button>
                  <button
                    id="pay-online-btn"
                    onClick={() => setPaymentMethod('ONLINE')}
                    style={payMethodBtnStyle(paymentMethod === 'ONLINE')}
                  >
                    💳 Pay Online
                  </button>
                </div>
                <p style={paymentHintStyle}>
                  {paymentMethod === 'OFFLINE'
                    ? '📍 Meet the seller on campus and pay cash. Show your OTP after receiving the item.'
                    : '🔒 Online payment support coming soon. OTP still confirms delivery.'}
                </p>
              </div>

              {checkoutError && (
                <div style={checkoutErrorStyle}>
                  <span>⚠️ {checkoutError}</span>
                  <button
                    onClick={() => setCheckoutError('')}
                    style={{ background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', fontWeight: 'bold' }}
                    aria-label="Dismiss error"
                  >
                    ✕
                  </button>
                </div>
              )}

              <button
                style={{ ...checkoutBtnStyle, opacity: isCheckingOut ? 0.7 : 1 }}
                id="checkout-btn"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Placing Order…' : 'Place Order →'}
              </button>

              <Link to="/" style={continueLinkStyle} id="continue-shopping-btn">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── OTP Modal — shown after successful checkout ── */}
      {completedOrder && (
        <div style={otpOverlayStyle}>
          <div style={otpModalStyle}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
            <h2 style={otpTitleStyle}>Order Placed!</h2>
            <p style={otpSubStyle}>
              {completedOrder.paymentMethod === 'OFFLINE'
                ? 'Pay cash to the seller when you meet on campus.'
                : 'Proceed with payment and confirm delivery with your OTP.'}
            </p>

            <p style={otpInstructStyle}>
              Share this OTP with the seller <strong>after receiving your item</strong>:
            </p>

            {/* OTP Display */}
            <div style={otpBoxStyle}>
              {completedOrder.deliveryOtp.split('').map((digit, i) => (
                <div key={i} style={otpDigitStyle}>{digit}</div>
              ))}
            </div>

            <p style={otpWarningStyle}>
              ⚠️ Share this code <strong>only after</strong> you have received your items. The seller will enter it to confirm delivery.
            </p>

            <div style={otpAmountStyle}>
              Total: <strong>₹{Number(completedOrder.totalAmount).toFixed(2)}</strong>
            </div>

            <button id="otp-done-btn" onClick={handleOtpDismiss} style={otpDoneBtn}>
              Got it — View My Orders
            </button>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        #clear-cart-btn:hover { background-color: #fee2e2 !important; color: #dc2626 !important; }
        #checkout-btn:hover:not(:disabled) { background-color: #374151 !important; }
        #shop-now-btn:hover { background-color: #374151 !important; }
        #otp-done-btn:hover { background-color: #374151 !important; }
        #pay-offline-btn:hover, #pay-online-btn:hover { opacity: 0.85; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </AppLayout>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const headingStyle: React.CSSProperties = { color: '#111827', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' };
const subStyle: React.CSSProperties = { color: '#6b7280', fontSize: '14px', margin: 0 };
const headerRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' };
const clearBtnStyle: React.CSSProperties = { padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', color: '#6b7280', fontSize: '13px', cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif", transition: 'all 0.15s ease' };
const centerStyle: React.CSSProperties = { textAlign: 'center', padding: '60px 0' };
const spinnerStyle: React.CSSProperties = { width: '32px', height: '32px', border: '3px solid #e5e7eb', borderTop: '3px solid #111827', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' };
const emptyStyle: React.CSSProperties = { textAlign: 'center', padding: '60px 0' };
const shopNowBtnStyle: React.CSSProperties = { display: 'inline-block', padding: '12px 28px', borderRadius: '8px', backgroundColor: '#111827', color: '#ffffff', fontSize: '14px', fontWeight: '600', textDecoration: 'none', transition: 'background-color 0.15s ease' };
const cartLayoutStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' };
const itemsColStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '12px' };
const cartItemStyle: React.CSSProperties = { display: 'flex', gap: '16px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', position: 'relative' };
const itemImageWrapStyle: React.CSSProperties = { width: '90px', height: '90px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 };
const itemImageStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const itemNoImageStyle: React.CSSProperties = { width: '100%', height: '100%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' };
const itemDetailsStyle: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' };
const itemTitleStyle: React.CSSProperties = { color: '#111827', fontWeight: '600', fontSize: '14px', textDecoration: 'none' };
const itemSellerStyle: React.CSSProperties = { color: '#9ca3af', fontSize: '12px' };
const itemPriceStyle: React.CSSProperties = { color: '#111827', fontWeight: '700', fontSize: '15px', marginTop: '2px' };
const quantityRowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' };
const qtyBtnStyle: React.CSSProperties = { width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#374151', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif" };
const qtyValueStyle: React.CSSProperties = { fontSize: '14px', fontWeight: '600', color: '#111827', minWidth: '20px', textAlign: 'center' };
const itemSubtotalStyle: React.CSSProperties = { fontSize: '12px', color: '#6b7280', marginLeft: '4px' };
const removeItemBtnStyle: React.CSSProperties = { position: 'absolute', top: '12px', right: '12px', width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#9ca3af', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif" };
const summaryStyle: React.CSSProperties = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', position: 'sticky', top: '24px' };
const summaryHeadingStyle: React.CSSProperties = { fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 16px 0', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' };
const summaryRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' };
const checkoutBtnStyle: React.CSSProperties = { display: 'block', width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#111827', color: '#ffffff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '16px', fontFamily: "'Inter', system-ui, sans-serif", transition: 'background-color 0.15s ease' };
const continueLinkStyle: React.CSSProperties = { display: 'block', textAlign: 'center', marginTop: '12px', fontSize: '13px', color: '#6b7280', textDecoration: 'none' };
const checkoutErrorStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '13px', marginBottom: '12px' };

// Payment method styles
const paymentSectionStyle: React.CSSProperties = { marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f3f4f6' };
const paymentLabelStyle: React.CSSProperties = { fontSize: '13px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' };
const paymentToggleStyle: React.CSSProperties = { display: 'flex', gap: '8px', marginBottom: '8px' };
const payMethodBtnStyle = (active: boolean): React.CSSProperties => ({
  flex: 1, padding: '8px 6px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s ease', fontFamily: "'Inter', system-ui, sans-serif",
  border: active ? '2px solid #111827' : '1px solid #e5e7eb',
  backgroundColor: active ? '#111827' : '#f9fafb',
  color: active ? '#ffffff' : '#6b7280',
});
const paymentHintStyle: React.CSSProperties = { fontSize: '11px', color: '#6b7280', margin: 0, lineHeight: '1.4' };

// OTP Modal styles
const otpOverlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
const otpModalStyle: React.CSSProperties = { backgroundColor: '#ffffff', borderRadius: '16px', padding: '36px 32px', maxWidth: '420px', width: '100%', textAlign: 'center', animation: 'fadeIn 0.25s ease', fontFamily: "'Inter', system-ui, sans-serif" };
const otpTitleStyle: React.CSSProperties = { fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' };
const otpSubStyle: React.CSSProperties = { fontSize: '13px', color: '#6b7280', margin: '0 0 20px 0', lineHeight: '1.5' };
const otpInstructStyle: React.CSSProperties = { fontSize: '13px', color: '#374151', margin: '0 0 16px 0' };
const otpBoxStyle: React.CSSProperties = { display: 'flex', gap: '8px', justifyContent: 'center', margin: '0 0 16px 0' };
const otpDigitStyle: React.CSSProperties = { width: '44px', height: '56px', borderRadius: '10px', backgroundColor: '#111827', color: '#ffffff', fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '0' };
const otpWarningStyle: React.CSSProperties = { fontSize: '12px', color: '#92400e', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 12px', margin: '0 0 14px 0', lineHeight: '1.5' };
const otpAmountStyle: React.CSSProperties = { fontSize: '14px', color: '#374151', margin: '0 0 20px 0' };
const otpDoneBtn: React.CSSProperties = { width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#111827', color: '#ffffff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif", transition: 'background-color 0.15s ease' };

export default CartPage;
