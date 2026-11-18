// ============================================================
// LAVSA — Orders Page (Buyer)
// Shows buyer's order history. For PENDING_MEETUP orders,
// displays the delivery OTP so they can share it with the seller.
// Redesigned with the LAVSA design system (global.css + UI kit).
// ============================================================

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import api from '../../services/api';
import { Button, Card, Badge, EmptyState, PageHeader, PageLoader, ErrorBanner } from '../../components/UI/ui';
import {
  IconShoppingBag,
  IconClock,
  IconMapPin,
  IconShield,
  IconCheckCircle,
} from '../../components/UI/Icons';
import { formatPrice, formatDate } from '../../utils/format';

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

const STATUS_CONFIG: Record<string, { label: string; color: 'amber' | 'blue' | 'green' | 'red' | 'gray' }> = {
  PENDING_MEETUP: { label: 'Awaiting Meetup', color: 'amber' },
  PAID_PENDING_MEETUP: { label: 'Paid · Awaiting Meetup', color: 'blue' },
  PENDING_PAYMENT: { label: 'Payment Pending', color: 'amber' },
  COMPLETED: { label: 'Completed', color: 'green' },
  CANCELLED: { label: 'Cancelled', color: 'red' },
  CONFIRMED: { label: 'Confirmed', color: 'green' },
  PENDING: { label: 'Pending', color: 'gray' },
};

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [revealedOtps, setRevealedOtps] = useState<Set<string>>(new Set());
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [copiedOtpId, setCopiedOtpId] = useState<string | null>(null);

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

  const handlePayNow = async (order: Order) => {
    setPayingOrderId(order.id);
    setError('');
    try {
      if (!(window as any).Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
          document.body.appendChild(script);
        });
      }

      const initRes = await api.post<{
        razorpayOrderId: string;
        amountPaise: number;
        currency: string;
        keyId: string;
      }>('/payments/init', { orderId: order.id });

      const options = {
        key: initRes.data.keyId,
        amount: initRes.data.amountPaise,
        currency: initRes.data.currency,
        name: 'Campus Marketplace',
        description: `Order #${order.id.slice(0, 8).toUpperCase()}`,
        order_id: initRes.data.razorpayOrderId,
        handler: async function (response: any) {
          try {
            await api.post('/payments/verify', {
              orderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            const refreshed = await api.get<{ orders: Order[] }>('/orders');
            setOrders(refreshed.data.orders);
          } catch (vErr: any) {
            setError(vErr?.response?.data?.message || 'Payment verification failed.');
          } finally {
            setPayingOrderId(null);
          }
        },
        modal: {
          ondismiss: function () {
            setPayingOrderId(null);
          },
        },
        theme: {
          color: '#4f46e5',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to start payment.');
      setPayingOrderId(null);
    }
  };

  const toggleOtpReveal = (orderId: string) => {
    setRevealedOtps((prev) => {
      const next = new Set(prev);
      next.has(orderId) ? next.delete(orderId) : next.add(orderId);
      return next;
    });
  };

  const handleCopyOtp = (orderId: string, otp: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedOtpId(orderId);
    setTimeout(() => setCopiedOtpId(null), 2000);
  };

  return (
    <AppLayout>
      <div className="page orders-page" style={{ maxWidth: 880, margin: '0 auto' }}>
        <PageHeader
          title="My Orders"
          subtitle="Track items you have purchased and manage campus handoffs"
          icon="shopping-bag"
        />

        {isLoading && <PageLoader label="Loading your orders..." />}

        {error && (
          <div style={{ marginBottom: 16 }}>
            <ErrorBanner message={error} onRetry={() => setError('')} />
          </div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <EmptyState
            icon="shopping-bag"
            title="No orders yet"
            description="Explore campus listings, add items to your cart, and place an order!"
            action={
              <Link to="/home" className="btn btn-primary" id="browse-products-btn">
                Browse Campus Products
              </Link>
            }
          />
        )}

        {!isLoading && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] ?? { label: order.status, color: 'gray' };
              const isPending = order.status === 'PENDING_MEETUP' || order.status === 'PAID_PENDING_MEETUP';
              const isUnpaid = order.status === 'PENDING_PAYMENT';
              const otpRevealed = revealedOtps.has(order.id);

              return (
                <Card key={order.id} padded className="order-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Order Card Header */}
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
                        Placed on {formatDate(order.created_at)} · Payment via{' '}
                        <strong>{order.payment_method === 'ONLINE' ? 'Razorpay Online' : 'Cash at Meetup'}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon="message"
                        onClick={() => navigate(`/chat/${order.id}`)}
                        id={`chat-order-${order.id}`}
                      >
                        Chat with Seller
                      </Button>

                      {isUnpaid && (
                        <Button
                          variant="primary"
                          size="sm"
                          icon="credit-card"
                          loading={payingOrderId === order.id}
                          onClick={() => handlePayNow(order)}
                          id={`pay-order-${order.id}`}
                        >
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          background: 'var(--surface-soft)',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        <div
                          style={{
                            width: 52,
                            height: 52,
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
                            <img
                              src={item.image_url}
                              alt={item.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <IconShoppingBag size={20} color="var(--text-faint)" />
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Link
                            to={`/products/${item.product_id}`}
                            style={{
                              fontWeight: 600,
                              fontSize: 14,
                              color: 'var(--ink)',
                              textDecoration: 'none',
                            }}
                            className="truncate-1"
                          >
                            {item.title}
                          </Link>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                            Qty: {item.quantity} · {formatPrice(Number(item.unit_price))} each
                            {item.seller_name ? ` · Sold by ${item.seller_name}` : ''}
                          </div>
                        </div>

                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', flexShrink: 0 }}>
                          {formatPrice(Number(item.unit_price) * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Meetup Info & Delivery OTP */}
                  <div
                    style={{
                      background: 'var(--surface-soft)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink)', fontWeight: 600 }}>
                        <IconMapPin size={13} color="var(--brand)" />
                        Spot: {order.meetup_location || 'Campus Central Library'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                        <IconClock size={13} color="var(--text-faint)" />
                        Time: {order.meetup_time || 'Campus Hours'}
                      </div>
                      {order.meetup_notes && (
                        <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 2 }}>
                          Note: "{order.meetup_notes}"
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Order Total</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-active)' }}>
                        {formatPrice(Number(order.total_amount))}
                      </div>
                    </div>
                  </div>

                  {/* Delivery OTP Section (for pending meetup) */}
                  {isPending && order.delivery_otp && (
                    <div
                      style={{
                        background: 'var(--brand-soft)',
                        border: '1px solid var(--brand-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'var(--brand)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <IconShield size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-active)' }}>
                            Campus Delivery OTP
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                            Provide this code to the seller only after receiving your item.
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            fontFamily: 'monospace',
                            fontSize: 18,
                            fontWeight: 800,
                            letterSpacing: 3,
                            background: '#fff',
                            padding: '4px 12px',
                            borderRadius: 6,
                            border: '1px solid var(--brand-border)',
                            color: 'var(--ink)',
                          }}
                        >
                          {otpRevealed ? order.delivery_otp : '••••••'}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          icon={otpRevealed ? 'eye-off' : 'eye'}
                          onClick={() => toggleOtpReveal(order.id)}
                        >
                          {otpRevealed ? 'Hide' : 'Show'}
                        </Button>

                        {otpRevealed && (
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={copiedOtpId === order.id ? 'check' : 'copy'}
                            onClick={() => handleCopyOtp(order.id, order.delivery_otp!)}
                          >
                            {copiedOtpId === order.id ? 'Copied' : 'Copy'}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {order.otp_verified && (
                    <div
                      style={{
                        background: 'var(--success-soft)',
                        border: '1px solid var(--success-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 12,
                        color: 'var(--success-strong)',
                        fontWeight: 600,
                      }}
                    >
                      <IconCheckCircle size={15} color="var(--success-strong)" />
                      Delivery confirmed &amp; verified via OTP handoff.
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

export default OrdersPage;
