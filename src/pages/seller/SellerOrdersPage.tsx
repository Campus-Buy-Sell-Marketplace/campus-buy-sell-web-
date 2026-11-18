// ============================================================
// LAVSA — Seller Orders Page
// Shows incoming orders for this seller.
// For PENDING_MEETUP orders: seller enters buyer's OTP to confirm delivery.
// Redesigned with the LAVSA design system (global.css + UI kit).
// ============================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import api from '../../services/api';
import { Button, Card, Badge, EmptyState, PageHeader, PageLoader, ErrorBanner } from '../../components/UI/ui';
import {
  IconShoppingBag,
  IconMapPin,
  IconClock,
  IconUser,
} from '../../components/UI/Icons';
import { formatPrice, formatDate } from '../../utils/format';

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

const STATUS_CONFIG: Record<string, { label: string; color: 'amber' | 'blue' | 'green' | 'red' | 'gray' }> = {
  PENDING_MEETUP: { label: 'Awaiting Meetup', color: 'amber' },
  PAID_PENDING_MEETUP: { label: 'Paid · Awaiting Meetup', color: 'blue' },
  PENDING_PAYMENT: { label: 'Payment Pending', color: 'amber' },
  COMPLETED: { label: 'Completed', color: 'green' },
  CANCELLED: { label: 'Cancelled', color: 'red' },
  CONFIRMED: { label: 'Confirmed', color: 'green' },
  PENDING: { label: 'Pending', color: 'gray' },
};

const SellerOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

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
      .catch(() => setError('Failed to load incoming seller orders.'))
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

  const filteredOrders = orders.filter((o) => {
    if (filter === 'PENDING') {
      return o.status === 'PENDING_MEETUP' || o.status === 'PAID_PENDING_MEETUP' || o.status === 'PENDING_PAYMENT';
    }
    if (filter === 'COMPLETED') {
      return o.status === 'COMPLETED' || o.status === 'CONFIRMED';
    }
    return true;
  });

  return (
    <AppLayout>
      <div className="page seller-orders-page" style={{ maxWidth: 900, margin: '0 auto' }}>
        <PageHeader
          title="Incoming Orders"
          subtitle="Orders placed by fellow campus students. Verify OTP upon meetup to finalize delivery."
          icon="shopping-bag"
        />

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {(['ALL', 'PENDING', 'COMPLETED'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`category-chip ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab === 'ALL' ? 'All Orders' : tab === 'PENDING' ? 'Awaiting Meetup' : 'Completed'}
            </button>
          ))}
        </div>

        {isLoading && <PageLoader label="Loading incoming orders..." />}

        {error && (
          <div style={{ marginBottom: 16 }}>
            <ErrorBanner message={error} onRetry={fetchOrders} />
          </div>
        )}

        {!isLoading && !error && filteredOrders.length === 0 && (
          <EmptyState
            icon="shopping-bag"
            title="No orders found"
            description={
              filter === 'PENDING'
                ? 'No pending meetups at this time.'
                : 'You have not received any orders yet. Make sure your listings are active!'
            }
          />
        )}

        {!isLoading && filteredOrders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {filteredOrders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] ?? { label: order.status, color: 'gray' };
              const isPending = order.status === 'PENDING_MEETUP' || order.status === 'PAID_PENDING_MEETUP';
              const otpVal = otpInputs[order.id] || '';
              const otpErr = otpErrors[order.id];
              const otpSucc = otpSuccess[order.id];

              return (
                <Card key={order.id} padded className="seller-order-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Order Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      paddingBottom: 14,
                      borderBottom: '1px solid var(--border)',
                      gap: 12,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <Badge color={statusCfg.color}>{statusCfg.label}</Badge>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                        Ordered on {formatDate(order.created_at)} · Payment:{' '}
                        <strong>{order.payment_method === 'ONLINE' ? 'Razorpay Escrow' : 'Cash at Meetup'}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon="message"
                        onClick={() => navigate(`/chat/${order.id}`)}
                        id={`chat-buyer-${order.id}`}
                      >
                        Chat with Buyer
                      </Button>
                    </div>
                  </div>

                  {/* Buyer & Meetup Details */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: 12,
                      background: 'var(--surface-soft)',
                      padding: 14,
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                        Buyer Info
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <IconUser size={14} color="var(--brand)" />
                        {order.buyer_name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {order.buyer_email}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                        Campus Handover Details
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                        <IconMapPin size={13} color="var(--brand)" />
                        {order.meetup_location || 'Campus Central Library'}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <IconClock size={13} color="var(--text-faint)" />
                        {order.meetup_time || 'Campus Hours'}
                      </div>
                      {order.meetup_notes && (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 2 }}>
                          "{order.meetup_notes}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-xs)',
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 'var(--radius-xs)',
                            overflow: 'hidden',
                            background: 'var(--surface-muted)',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <IconShoppingBag size={18} color="var(--text-faint)" />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }} className="truncate-1">
                            {item.title}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            Qty: {item.quantity} · {formatPrice(Number(item.unit_price))} each
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>
                          {formatPrice(Number(item.unit_price) * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Amount & OTP Verification Form */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: 12,
                      borderTop: '1px solid var(--border)',
                      flexWrap: 'wrap',
                      gap: 14,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Sale Value</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-active)' }}>
                        {formatPrice(Number(order.total_amount))}
                      </div>
                    </div>

                    {/* Verification input for pending order */}
                    {isPending && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit OTP"
                          value={otpVal}
                          onChange={(e) =>
                            setOtpInputs((prev) => ({ ...prev, [order.id]: e.target.value.replace(/\D/g, '') }))
                          }
                          className="input"
                          style={{
                            width: 140,
                            fontFamily: 'monospace',
                            fontSize: 15,
                            letterSpacing: 2,
                            textAlign: 'center',
                            height: 38,
                          }}
                          id={`otp-input-${order.id}`}
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          icon="check"
                          loading={verifying === order.id}
                          disabled={otpVal.length !== 6 || verifying === order.id}
                          onClick={() => handleVerifyOtp(order.id)}
                          id={`verify-otp-btn-${order.id}`}
                        >
                          Confirm Delivery
                        </Button>
                      </div>
                    )}

                    {order.otp_verified && (
                      <Badge color="green" icon="check-circle">
                        Delivery Verified &amp; Completed
                      </Badge>
                    )}
                  </div>

                  {otpErr && (
                    <div style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 600 }}>
                      ⚠️ {otpErr}
                    </div>
                  )}

                  {otpSucc && (
                    <div style={{ fontSize: 12, color: 'var(--success-strong)', fontWeight: 600 }}>
                      ✓ {otpSucc}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SellerOrdersPage;
