// ============================================================
// LAVSA — Seller Orders Page
// Shows incoming orders for this seller.
// For PENDING_MEETUP orders: seller enters buyer's OTP to confirm delivery.
// ============================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import api from '../../services/api';

interface OrderItem {
  product_id: string;
  title: string;
  quantity: number;
  unit_price: number;
  image_url?: string;
}

interface SellerOrder {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  payment_method: string;
  otp_verified: boolean;
  buyer_name: string;
  buyer_email: string;
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

const SellerOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // OTP input state per order id
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [verifying, setVerifying] = useState<string | null>(null);
  const [otpErrors, setOtpErrors] = useState<Record<string, string>>({});
  const [otpSuccess, setOtpSuccess] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setIsLoading(true);
    api
      .get<{ orders: SellerOrder[] }>('/orders/seller/incoming')
      .then((res) => setOrders(res.data.orders))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setIsLoading(false));
  };

  const handleVerifyOtp = async (orderId: string) => {
    const otp = (otpInputs[orderId] || '').trim();
    if (otp.length !== 6) {
      setOtpErrors((prev) => ({ ...prev, [orderId]: 'Please enter the full 6-digit OTP.' }));
      return;
    }
    setVerifying(orderId);
    setOtpErrors((prev) => ({ ...prev, [orderId]: '' }));
    try {
      const res = await api.post<{ message: string }>(`/orders/${orderId}/verify-otp`, { otp });
      setOtpSuccess((prev) => ({ ...prev, [orderId]: res.data.message }));
      // Refresh orders to show updated status
      fetchOrders();
    } catch (err: any) {
      setOtpErrors((prev) => ({
        ...prev,
        [orderId]: err?.response?.data?.message || 'OTP verification failed.',
      }));
    } finally {
      setVerifying(null);
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={headingStyle}>Incoming Orders</h1>
        <p style={subStyle}>Orders placed by buyers for your products. Verify OTP after campus handoff.</p>

        {isLoading && (
          <div style={centerStyle}>
            <div style={spinnerStyle} />
            <p style={{ color: '#6b7280', marginTop: '12px' }}>Loading orders...</p>
          </div>
        )}

        {error && (
          <div style={errorStyle}>⚠️ {error}</div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div style={emptyCardStyle}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📬</div>
            <h3 style={{ color: '#111827', margin: '0 0 8px 0' }}>No incoming orders yet</h3>
            <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
              When buyers purchase your products, orders will appear here.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => {
            const statusInfo = STATUS_LABELS[order.status] || { label: order.status, color: '#374151', bg: '#f3f4f6' };
            const isPending = order.status === 'PENDING_MEETUP';
            const isVerifyingThis = verifying === order.id;

            return (
              <div key={order.id} style={orderCardStyle}>
                {/* Header */}
                <div style={orderHeaderStyle}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#9ca3af', display: 'block' }}>
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                      👤 {order.buyer_name}
                    </span>
                    <span style={{ fontSize: '12px', color: '#9ca3af', display: 'block' }}>
                      {order.buyer_email}
                    </span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
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
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{item.title}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                          Qty: {item.quantity} × ₹{Number(item.unit_price).toFixed(2)}
                        </div>
                      </div>
                      <div style={{ fontWeight: '700', color: '#111827', fontSize: '14px' }}>
                        ₹{(item.quantity * Number(item.unit_price)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div style={totalRowStyle}>
                  <span style={{ color: '#374151', fontSize: '14px' }}>Order Total</span>
                  <span style={{ fontWeight: '800', fontSize: '16px', color: '#111827' }}>
                    ₹{Number(order.total_amount).toFixed(2)}
                  </span>
                </div>

                {/* Campus Meetup Information for Seller */}
                {order.meetup_location && (
                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', marginTop: '12px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: '700', marginBottom: '4px' }}>
                      <span>📍 Handover Spot:</span>
                      <span>{order.meetup_location}</span>
                    </div>
                    {order.meetup_time && (
                      <div style={{ color: '#15803d', fontSize: '12px', marginBottom: order.meetup_notes ? '4px' : '0' }}>
                        ⏰ <strong>Scheduled Meetup:</strong> {order.meetup_time}
                      </div>
                    )}
                    {order.meetup_notes && (
                      <div style={{ color: '#166534', fontSize: '12px', fontStyle: 'italic', marginTop: '2px' }}>
                        📝 Note from buyer: "{order.meetup_notes}"
                      </div>
                    )}
                  </div>
                )}

                {/* ── OTP Verification Panel (only for PENDING_MEETUP) ── */}
                {isPending && (
                  <div style={otpPanelStyle}>
                    <p style={otpTitleStyle}>🔑 Enter Delivery OTP</p>
                    <p style={otpHintStyle}>
                      Ask the buyer to share their 6-digit OTP <strong>after you hand over the item</strong>.
                      {order.payment_method === 'OFFLINE' && ' Collect cash payment first.'}
                    </p>

                    <div style={otpInputRowStyle}>
                      <input
                        id={`otp-input-${order.id}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        value={otpInputs[order.id] || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setOtpInputs((prev) => ({ ...prev, [order.id]: val }));
                          setOtpErrors((prev) => ({ ...prev, [order.id]: '' }));
                        }}
                        style={otpInputStyle}
                        disabled={isVerifyingThis}
                      />
                      <button
                        id={`verify-otp-btn-${order.id}`}
                        onClick={() => handleVerifyOtp(order.id)}
                        disabled={isVerifyingThis || (otpInputs[order.id] || '').length !== 6}
                        style={verifyBtnStyle(isVerifyingThis || (otpInputs[order.id] || '').length !== 6)}
                      >
                        {isVerifyingThis ? 'Verifying…' : 'Confirm Delivery'}
                      </button>
                    </div>

                    {otpErrors[order.id] && (
                      <p style={otpErrStyle}>❌ {otpErrors[order.id]}</p>
                    )}
                  </div>
                )}

                {/* Success message after OTP verified */}
                {otpSuccess[order.id] && (
                  <div style={successNoteStyle}>✅ {otpSuccess[order.id]}</div>
                )}

                {order.status === 'COMPLETED' && !otpSuccess[order.id] && (
                  <div style={completedNoteStyle}>✅ Delivery confirmed. OTP was verified.</div>
                )}

                {/* Chat button */}
                <div style={{ marginTop: '12px', textAlign: 'right' }}>
                  <button
                    id={`chat-order-${order.id}`}
                    onClick={() => navigate(`/chat/${order.id}`)}
                    style={chatBtnStyle}
                  >
                    💬 Chat with Buyer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        #verify-otp-btn:hover:not(:disabled) { background-color: #065f46 !important; }
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
const errorStyle: React.CSSProperties = { padding: '12px 16px', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '14px', marginBottom: '16px' };
const emptyCardStyle: React.CSSProperties = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '48px 24px', textAlign: 'center' };
const orderCardStyle: React.CSSProperties = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' };
const orderHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' };
const statusBadgeStyle: React.CSSProperties = { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' };
const itemsListStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' };
const itemRowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px' };
const itemImgStyle: React.CSSProperties = { width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 };
const totalRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f3f4f6' };
const otpPanelStyle: React.CSSProperties = { marginTop: '14px', padding: '14px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px' };
const otpTitleStyle: React.CSSProperties = { fontSize: '13px', fontWeight: '700', color: '#065f46', margin: '0 0 6px 0' };
const otpHintStyle: React.CSSProperties = { fontSize: '12px', color: '#374151', margin: '0 0 12px 0', lineHeight: '1.5' };
const otpInputRowStyle: React.CSSProperties = { display: 'flex', gap: '8px', alignItems: 'center' };
const otpInputStyle: React.CSSProperties = { padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #d1fae5', fontSize: '18px', fontWeight: '700', letterSpacing: '4px', width: '160px', fontFamily: "'Inter', system-ui, sans-serif", color: '#111827', outline: 'none', textAlign: 'center' };
const verifyBtnStyle = (disabled: boolean): React.CSSProperties => ({
  padding: '10px 18px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: '700', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: "'Inter', system-ui, sans-serif", transition: 'background-color 0.15s ease',
  backgroundColor: disabled ? '#9ca3af' : '#065f46',
  color: '#ffffff',
});
const otpErrStyle: React.CSSProperties = { fontSize: '12px', color: '#991b1b', margin: '8px 0 0 0' };
const successNoteStyle: React.CSSProperties = { marginTop: '12px', padding: '10px 12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '13px', color: '#065f46' };
const completedNoteStyle: React.CSSProperties = { marginTop: '12px', padding: '10px 12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '13px', color: '#065f46' };
const chatBtnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.15s ease' };

export default SellerOrdersPage;
