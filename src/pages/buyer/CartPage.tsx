// ============================================================
// LAVSA — Cart Page
// Shows the user's cart with payment method selection (Offline / Online).
// After checkout, shows the 6-digit delivery OTP to the buyer.
// Redesigned with the LAVSA design system (global.css + UI kit).
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/Layout/AppLayout';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { Button, Card, EmptyState, PageHeader, PageLoader, ErrorBanner } from '../../components/UI/ui';
import {
  IconMinus,
  IconPlus,
  IconTrash,
  IconCheck,
  IconMapPin,
  IconShield,
  IconShoppingBag,
} from '../../components/UI/Icons';
import { formatPrice } from '../../utils/format';

interface CheckoutOrder {
  orderId: string;
  deliveryOtp: string;
  paymentMethod: string;
  totalAmount: number;
  meetupLocation?: string;
  meetupTime?: string;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { items, totalCount, totalPrice, isLoading, removeFromCart, updateQuantity, clearCart, refreshCart } =
    useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'OFFLINE' | 'ONLINE'>('OFFLINE');
  const [meetupLocation, setMeetupLocation] = useState('Campus Central Library Gate');
  const [meetupTime, setMeetupTime] = useState('Tomorrow (4:00 PM - 5:30 PM)');
  const [meetupNotes, setMeetupNotes] = useState('');
  const [completedOrder, setCompletedOrder] = useState<CheckoutOrder | null>(null);
  const [copiedOtp, setCopiedOtp] = useState(false);

  useEffect(() => {
    if (checkoutError) {
      const timer = setTimeout(() => setCheckoutError(''), 4500);
      return () => clearTimeout(timer);
    }
  }, [checkoutError]);

  const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    setCheckoutError('');
    setIsCheckingOut(true);
    try {
      const res = await api.post<{ order: CheckoutOrder }>('/orders/checkout', {
        paymentMethod,
        meetupLocation,
        meetupTime,
        meetupNotes: meetupNotes.trim() || undefined,
      });
      const order = res.data.order;

      if (paymentMethod === 'ONLINE') {
        const scriptLoaded = await loadRazorpay();
        if (!scriptLoaded) {
          throw new Error('Failed to load Razorpay payment gateway. Please check your internet connection.');
        }

        const initRes = await api.post<{
          razorpayOrderId: string;
          amountPaise: number;
          currency: string;
          keyId: string;
        }>('/payments/init', { orderId: order.orderId });

        const options = {
          key: initRes.data.keyId,
          amount: initRes.data.amountPaise,
          currency: initRes.data.currency,
          name: 'Campus Marketplace',
          description: `Order #${order.orderId.slice(0, 8).toUpperCase()}`,
          order_id: initRes.data.razorpayOrderId,
          prefill: {
            name: user?.name || 'Campus Student',
            email: user?.email || 'student@campus.edu',
            contact: (user as any)?.phone || '9999999999',
          },
          handler: async function (response: any) {
            try {
              setIsCheckingOut(true);
              const verifyRes = await api.post<{ deliveryOtp: string }>('/payments/verify', {
                orderId: order.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (typeof refreshCart === 'function') await refreshCart();
              showToast('Payment verified successfully!', 'success');
              setCompletedOrder({
                ...order,
                deliveryOtp: verifyRes.data.deliveryOtp,
              });
            } catch (vErr: any) {
              const msg = vErr?.response?.data?.message || 'Payment verification failed.';
              showToast(msg, 'error');
              navigate('/orders');
            } finally {
              setIsCheckingOut(false);
            }
          },
          modal: {
            ondismiss: function () {
              if (typeof refreshCart === 'function') refreshCart();
              showToast('Payment window closed. You can complete payment anytime from My Orders.', 'info');
              navigate('/orders');
            },
          },
          theme: {
            color: '#4f46e5',
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          showToast(`Payment failed: ${resp.error.description || 'Transaction declined'}`, 'error');
        });
        rzp.open();
      } else {
        // Offline Pay at Meetup
        if (typeof refreshCart === 'function') await refreshCart();
        setCompletedOrder(order);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Checkout failed. Please try again.';
      setCheckoutError(msg);
      showToast(msg, 'error');
    } finally {
      if (paymentMethod === 'OFFLINE') {
        setIsCheckingOut(false);
      }
    }
  };

  const handleCopyOtp = () => {
    if (!completedOrder?.deliveryOtp) return;
    navigator.clipboard.writeText(completedOrder.deliveryOtp);
    setCopiedOtp(true);
    showToast('OTP copied to clipboard!', 'success');
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleOtpDismiss = () => {
    setCompletedOrder(null);
    navigate('/orders');
  };

  return (
    <AppLayout>
      <div className="page cart-page" style={{ maxWidth: 1040, margin: '0 auto' }}>
        <PageHeader
          title="Shopping Cart"
          subtitle={
            totalCount > 0
              ? `${totalCount} item${totalCount !== 1 ? 's' : ''} in your cart`
              : 'Your cart is currently empty'
          }
          icon="cart"
          actions={
            items.length > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                icon="trash"
                onClick={clearCart}
                id="clear-cart-btn"
              >
                Clear Cart
              </Button>
            ) : undefined
          }
        />

        {isLoading && <PageLoader label="Loading your cart..." />}

        {!isLoading && items.length === 0 && (
          <EmptyState
            icon="cart"
            title="Your cart is empty"
            description="Explore textbooks, gadgets, and campus essentials from fellow students."
            action={
              <Link to="/home" className="btn btn-primary" id="shop-now-btn">
                Browse Campus Products
              </Link>
            }
          />
        )}

        {!isLoading && items.length > 0 && (
          <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
            {/* Cart Items List */}
            <div className="cart-items" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {items.map((item) => (
                <Card key={item.cart_item_id} padded className="cart-item-card" id={`cart-item-${item.cart_item_id}`}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: 96,
                        height: 96,
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        background: 'var(--surface-muted)',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <IconShoppingBag size={28} color="var(--text-faint)" />
                      )}
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                          <Link
                            to={`/products/${item.product_id}`}
                            style={{
                              fontWeight: 600,
                              fontSize: 15,
                              color: 'var(--ink)',
                              textDecoration: 'none',
                            }}
                            className="truncate-2"
                          >
                            {item.title}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.cart_item_id)}
                            id={`remove-item-${item.cart_item_id}`}
                            title="Remove item"
                            className="btn btn-ghost btn-sm"
                            style={{ padding: 4, color: 'var(--text-muted)' }}
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                          Sold by {item.seller_name}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                        {/* Stepper */}
                        <div className="pd-stepper" style={{ height: 32 }}>
                          <button
                            onClick={() =>
                              item.quantity > 1
                                ? updateQuantity(item.cart_item_id, item.quantity - 1)
                                : removeFromCart(item.cart_item_id)
                            }
                            className="pd-step-btn"
                            id={`qty-dec-${item.cart_item_id}`}
                            aria-label="Decrease quantity"
                          >
                            <IconMinus size={13} />
                          </button>
                          <span className="pd-qty-value" style={{ minWidth: 26, fontSize: 13 }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                            className="pd-step-btn"
                            disabled={item.quantity >= item.stock}
                            id={`qty-inc-${item.cart_item_id}`}
                            aria-label="Increase quantity"
                          >
                            <IconPlus size={13} />
                          </button>
                        </div>

                        {/* Price & Subtotal */}
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>
                            {formatPrice(Number(item.price) * item.quantity)}
                          </div>
                          {item.quantity > 1 && (
                            <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                              {formatPrice(Number(item.price))} each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary & Checkout */}
            <div className="cart-sidebar" style={{ position: 'sticky', top: 24 }}>
              <Card padded className="cart-summary-card">
                <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 16px 0', color: 'var(--ink)' }}>
                  Order Summary
                </h2>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Subtotal ({totalCount} item{totalCount !== 1 ? 's' : ''})
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{formatPrice(totalPrice)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 14 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Campus Handover Delivery</span>
                  <span style={{ fontWeight: 600, color: 'var(--success-strong)' }}>Free</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: 14,
                    borderTop: '1px solid var(--border)',
                    marginBottom: 20,
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Total</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--brand-active)' }}>
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* Payment Method Selector */}
                <div style={{ marginBottom: 18 }}>
                  <label className="label" style={{ marginBottom: 8, display: 'block' }}>
                    Payment Method
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Offline Cash */}
                    <div
                      id="pay-offline-btn"
                      onClick={() => setPaymentMethod('OFFLINE')}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        border: paymentMethod === 'OFFLINE' ? '2px solid var(--brand)' : '1px solid var(--border)',
                        background: paymentMethod === 'OFFLINE' ? 'var(--brand-soft)' : 'var(--surface)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            border: paymentMethod === 'OFFLINE' ? '5px solid var(--brand)' : '2px solid var(--border-strong)',
                            background: '#fff',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Cash at Meetup</span>
                            <span className="badge badge-green" style={{ fontSize: 10, padding: '1px 6px' }}>Recommended</span>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                            Pay in cash or direct UPI upon receiving · Verify with OTP
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Online Razorpay */}
                    <div
                      id="pay-online-btn"
                      onClick={() => setPaymentMethod('ONLINE')}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        border: paymentMethod === 'ONLINE' ? '2px solid var(--brand)' : '1px solid var(--border)',
                        background: paymentMethod === 'ONLINE' ? 'var(--brand-soft)' : 'var(--surface)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            border: paymentMethod === 'ONLINE' ? '5px solid var(--brand)' : '2px solid var(--border-strong)',
                            background: '#fff',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Pay Online</span>
                            <span className="badge badge-brand" style={{ fontSize: 10, padding: '1px 6px' }}>Escrow Protected</span>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                            UPI, Google Pay, PhonePe, Cards &amp; Netbanking
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Handover Details Section */}
                <div
                  style={{
                    background: 'var(--surface-soft)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 14,
                    marginBottom: 18,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontWeight: 700, fontSize: 12, color: 'var(--ink)' }}>
                    <IconMapPin size={14} color="var(--brand)" />
                    Campus Handover Details
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <label htmlFor="meetup-location-select" className="label" style={{ fontSize: 11, marginBottom: 3 }}>
                      Meetup Spot on Campus
                    </label>
                    <select
                      id="meetup-location-select"
                      value={meetupLocation}
                      onChange={(e) => setMeetupLocation(e.target.value)}
                      className="select"
                      style={{ fontSize: 12, padding: '7px 10px' }}
                    >
                      <option value="Campus Central Library Gate">Campus Central Library Gate</option>
                      <option value="Student Activity Center (SAC)">Student Activity Center (SAC)</option>
                      <option value="Main Canteen / Food Court">Main Canteen / Food Court</option>
                      <option value="Academic Block A - Reception">Academic Block A - Reception</option>
                      <option value="Hostel Block - Common Area">Hostel Block - Common Area</option>
                      <option value="Sports Complex / Ground">Sports Complex / Ground</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <label htmlFor="meetup-time-select" className="label" style={{ fontSize: 11, marginBottom: 3 }}>
                      Preferred Meetup Time
                    </label>
                    <select
                      id="meetup-time-select"
                      value={meetupTime}
                      onChange={(e) => setMeetupTime(e.target.value)}
                      className="select"
                      style={{ fontSize: 12, padding: '7px 10px' }}
                    >
                      <option value="Today (4:30 PM - 6:00 PM)">Today (4:30 PM - 6:00 PM)</option>
                      <option value="Tomorrow (1:00 PM - 2:00 PM - Lunch)">Tomorrow (1:00 PM - 2:00 PM - Lunch)</option>
                      <option value="Tomorrow (4:00 PM - 5:30 PM)">Tomorrow (4:00 PM - 5:30 PM)</option>
                      <option value="Day After Tomorrow (4:00 PM - 5:30 PM)">Day After Tomorrow (4:00 PM - 5:30 PM)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="meetup-notes-input" className="label" style={{ fontSize: 11, marginBottom: 3 }}>
                      Note for Seller (Optional)
                    </label>
                    <input
                      id="meetup-notes-input"
                      type="text"
                      placeholder="e.g. Near main stairs, wearing blue hoodie..."
                      value={meetupNotes}
                      onChange={(e) => setMeetupNotes(e.target.value)}
                      className="input"
                      style={{ fontSize: 12, padding: '7px 10px' }}
                    />
                  </div>
                </div>

                {checkoutError && (
                  <div style={{ marginBottom: 14 }}>
                    <ErrorBanner message={checkoutError} onRetry={() => setCheckoutError('')} />
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  block
                  loading={isCheckingOut}
                  onClick={handleCheckout}
                  id="checkout-btn"
                  iconRight="arrow-right"
                >
                  {isCheckingOut
                    ? 'Processing Order…'
                    : paymentMethod === 'OFFLINE'
                    ? 'Place Order (Pay Cash at Meetup)'
                    : 'Proceed to Pay Online'}
                </Button>

                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <Link
                    to="/home"
                    id="continue-shopping-btn"
                    style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ── Delivery OTP Modal ── */}
        {completedOrder && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(17, 24, 39, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          >
            <div
              className="slide-up"
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 28px',
                maxWidth: 440,
                width: '100%',
                textAlign: 'center',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: 'var(--success-soft)',
                  color: 'var(--success-strong)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <IconCheck size={30} strokeWidth={2.4} />
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', margin: '0 0 6px 0' }}>
                Order Placed Successfully!
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
                {completedOrder.paymentMethod === 'OFFLINE'
                  ? 'Pay cash or direct UPI to the seller during campus meetup.'
                  : 'Payment initiated via Razorpay Escrow. Handover OTP below.'}
              </p>

              <div
                style={{
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 12px',
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>
                  Share this 6-Digit Delivery OTP with the seller at meetup:
                </div>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 12 }}>
                  {completedOrder.deliveryOtp.split('').map((digit, i) => (
                    <div
                      key={i}
                      style={{
                        width: 40,
                        height: 50,
                        borderRadius: 8,
                        background: 'var(--ink)',
                        color: '#fff',
                        fontSize: 22,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {digit}
                    </div>
                  ))}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={copiedOtp ? 'check' : 'copy'}
                  onClick={handleCopyOtp}
                >
                  {copiedOtp ? 'Copied OTP' : 'Copy OTP'}
                </Button>
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: 'var(--warning-strong)',
                  background: 'var(--warning-soft)',
                  border: '1px solid var(--warning-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  textAlign: 'left',
                  marginBottom: 16,
                  display: 'flex',
                  gap: 8,
                  alignItems: 'flex-start',
                }}
              >
                <IconShield size={16} color="var(--warning-strong)" style={{ flexShrink: 0, marginTop: 1 }} />
                <span>
                  <strong>Safety Notice:</strong> Only share this OTP <em>after</em> you have personally inspected and received the product.
                </span>
              </div>

              <div
                style={{
                  background: 'var(--surface-muted)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  textAlign: 'left',
                  fontSize: 12,
                  marginBottom: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <div style={{ color: 'var(--ink)' }}>
                  📍 <strong>Meetup Spot:</strong> {completedOrder.meetupLocation || meetupLocation}
                </div>
                <div style={{ color: 'var(--ink)' }}>
                  ⏰ <strong>Time:</strong> {completedOrder.meetupTime || meetupTime}
                </div>
                <div style={{ color: 'var(--brand-active)', fontWeight: 700, marginTop: 2 }}>
                  Total: {formatPrice(Number(completedOrder.totalAmount))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <Button
                  variant="primary"
                  block
                  icon="message"
                  onClick={() => {
                    const id = completedOrder.orderId;
                    setCompletedOrder(null);
                    navigate(`/chat/${id}`);
                  }}
                  id="otp-chat-btn"
                >
                  Chat with Seller
                </Button>
                <Button
                  variant="secondary"
                  block
                  icon="shopping-bag"
                  onClick={handleOtpDismiss}
                  id="otp-done-btn"
                >
                  My Orders
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CartPage;
