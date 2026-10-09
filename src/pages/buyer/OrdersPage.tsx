// ============================================================
// LAVSA — Orders Page (Buyer)
// Shows buyer's order history. For PENDING_MEETUP orders,
// displays the delivery OTP so they can share it with the seller.
// ============================================================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import api from '../../services/api';

interface OrderItem {
  product_id: string;
  title: string;
  quantity: number;
  unit_price: number;
  image_url?: string;
  seller_name?: string;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  payment_method: string;
  delivery_otp: string | null;
  otp_verified: boolean;
  meetup_location?: string;
  meetup_time?: string;
  meetup_notes?: string;
  items: OrderItem[];
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  PENDING_MEETUP: { label: '⏳ Awaiting Meetup', color: '#92400e', bg: '#fffbeb' },
  COMPLETED:      { label: '✅ Completed',        color: '#065f46', bg: '#f0fdf4' },
  CANCELLED:      { label: '❌ Cancelled',         color: '#991b1b', bg: '#fef2f2' },
  CONFIRMED:      { label: '✅ Confirmed',          color: '#065f46', bg: '#f0fdf4' },
  PENDING:        { label: '⏳ Pending',            color: '#92400e', bg: '#fffbeb' },
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // Track which OTPs are revealed (by order id)
  const [revealedOtps, setRevealedOtps] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    api
      .get<{ orders: Order[] }>('/orders')
      .then((res) => setOrders(res.data.orders))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setIsLoading(false));
  }, []);

  const toggleOtpReveal = (orderId: string) => {
    setRevealedOtps((prev) => {
      const next = new Set(prev);
      next.has(orderId) ? next.delete(orderId) : next.add(orderId);
      return next;
    });
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={headingStyle}>My Orders</h1>
        <p style={subStyle}>Track items you have purchased from campus sellers</p>

        {isLoading && (
          <div style={centerStyle}>
            <div style={spinnerStyle} />
            <p style={{ color: '#6b7280', marginTop: '12px' }}>Loading orders...</p>
          </div>
        )}

        {error && (
          <div style={errorStyle}>
            <span>⚠️ {error}</span>
            <button onClick={() => setError('')} style={dismissBtnStyle} aria-label="Dismiss">✕</button>
          </div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div style={emptyCardStyle}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
            <h2 style={{ color: '#374151', margin: '0 0 8px 0', fontSize: '18px' }}>No orders yet</h2>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px' }}>
              Add items to your cart and place an order!
            </p>
            <Link to="/products" style={shopBtnStyle} id="browse-products-btn">
              Browse Products
            </Link>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => {
            const statusInfo = STATUS_LABELS[order.status] || { label: order.status, color: '#374151', bg: '#f3f4f6' };
            const isPending = order.status === 'PENDING_MEETUP';
            const otpRevealed = revealedOtps.has(order.id);

            return (
              <div key={order.id} style={orderCardStyle}>
                {/* Order header */}
                <div style={orderHeaderStyle}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#9ca3af', display: 'block' }}>
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ ...statusBadgeStyle, color: statusInfo.color, backgroundColor: statusInfo.bg }}>
                      {statusInfo.label}
                    </span>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      {order.payment_method === 'OFFLINE' ? '💵 Cash at Meetup' : '💳 Online'}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div style={itemsListStyle}>
                  {order.items.map((item, i) => (
                    <div key={i} style={itemRowStyle}>
                      {item.image_url && (
                        <img src={item.image_url} alt={item.title} style={itemImgStyle} />
                      )}
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{item.title}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                          Qty: {item.quantity} × ₹{Number(item.unit_price).toFixed(2)}
                          {item.seller_name && ` · Sold by ${item.seller_name}`}
                        </div>
                      </div>
                      <div style={{ marginLeft: 'auto', fontWeight: '700', color: '#111827', fontSize: '14px' }}>
                        ₹{(item.quantity * Number(item.unit_price)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div style={totalRowStyle}>
                  <span style={{ color: '#374151', fontSize: '14px' }}>Total</span>
                  <span style={{ fontWeight: '800', fontSize: '16px', color: '#111827' }}>
                    ₹{Number(order.total_amount).toFixed(2)}
                  </span>
                </div>

                {/* Campus Meetup Information */}
                {order.meetup_location && (
                  <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px 14px', marginTop: '12px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1f2937', fontWeight: '600', marginBottom: '4px' }}>
                      <span>📍 Meetup Spot:</span>
                      <span style={{ color: '#111827', fontWeight: '700' }}>{order.meetup_location}</span>
                    </div>
                    {order.meetup_time && (
                      <div style={{ color: '#4b5563', fontSize: '12px', marginBottom: order.meetup_notes ? '4px' : '0' }}>
                        ⏰ <strong>Scheduled:</strong> {order.meetup_time}
                      </div>
                    )}
                    {order.meetup_notes && (
                      <div style={{ color: '#6b7280', fontSize: '12px', fontStyle: 'italic', marginTop: '2px' }}>
                        📝 Note: "{order.meetup_notes}"
                      </div>
                    )}
                  </div>
                )}

                {/* OTP section — shown only for PENDING_MEETUP orders */}
                {isPending && order.delivery_otp && (
                  <div style={otpSectionStyle}>
                    <div style={otpHeaderRow}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#92400e' }}>
                        🔑 Delivery OTP
                      </span>
                      <button
                        id={`reveal-otp-${order.id}`}
                        onClick={() => toggleOtpReveal(order.id)}
                        style={revealBtnStyle}
                      >
                        {otpRevealed ? 'Hide OTP' : 'Show OTP'}
                      </button>
                    </div>
                    {otpRevealed ? (
                      <>
                        <div style={otpDigitsRow}>
                          {order.delivery_otp.split('').map((d, i) => (
                            <div key={i} style={otpDigitStyle}>{d}</div>
                          ))}
                        </div>
                        <p style={otpNoteStyle}>
                          Share this code with the seller <strong>only after receiving your item</strong>.
                        </p>
                      </>
                    ) : (
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                        Click "Show OTP" to reveal your delivery code.
                      </p>
                    )}
                  </div>
                )}

                {order.status === 'COMPLETED' && (
                  <div style={completedNoteStyle}>✅ Delivery confirmed. OTP was verified by the seller.</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        #browse-products-btn:hover { background-color: #374151 !important; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </AppLayout>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const headingStyle: React.CSSProperties = { color: '#111827', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' };
const subStyle: React.CSSProperties = { color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' };
const centerStyle: React.CSSProperties = { textAlign: 'center', padding: '60px 0' };
const spinnerStyle: React.CSSProperties = { width: '32px', height: '32px', border: '3px solid #e5e7eb', borderTop: '3px solid #111827', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' };
const errorStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '14px', marginBottom: '16px' };
const dismissBtnStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', fontWeight: 'bold' };
const emptyCardStyle: React.CSSProperties = { textAlign: 'center', padding: '60px 24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb' };
const shopBtnStyle: React.CSSProperties = { display: 'inline-block', padding: '10px 24px', borderRadius: '8px', backgroundColor: '#111827', color: '#ffffff', fontSize: '14px', fontWeight: '600', textDecoration: 'none' };
const orderCardStyle: React.CSSProperties = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' };
const orderHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' };
const statusBadgeStyle: React.CSSProperties = { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' };
const itemsListStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' };
const itemRowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px' };
const itemImgStyle: React.CSSProperties = { width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 };
const totalRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f3f4f6' };
const otpSectionStyle: React.CSSProperties = { marginTop: '14px', padding: '14px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px' };
const otpHeaderRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' };
const revealBtnStyle: React.CSSProperties = { padding: '4px 12px', borderRadius: '6px', border: '1px solid #92400e', backgroundColor: '#ffffff', color: '#92400e', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" };
const otpDigitsRow: React.CSSProperties = { display: 'flex', gap: '6px', marginBottom: '8px' };
const otpDigitStyle: React.CSSProperties = { width: '38px', height: '48px', borderRadius: '8px', backgroundColor: '#111827', color: '#ffffff', fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const otpNoteStyle: React.CSSProperties = { fontSize: '11px', color: '#92400e', margin: 0 };
const completedNoteStyle: React.CSSProperties = { marginTop: '12px', padding: '10px 12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '13px', color: '#065f46' };

export default OrdersPage;
