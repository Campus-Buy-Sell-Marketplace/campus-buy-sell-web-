// ============================================================
// LAVSA — Seller Dashboard — Design System
// Shows real stats computed from the seller's actual listings.
// Recent orders come from the same incoming-orders endpoint
// used by the orders page. No numbers are invented.
// ============================================================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { getMyProducts, Product } from '../../services/productService';
import api from '../../services/api';
import { PageHeader, Badge, EmptyState, Skeleton } from '../../components/UI/ui';
import {
  IconTag,
  IconCheckCircle,
  IconAlertTriangle,
  IconShoppingBag,
  IconWallet,
  IconPlus,
  IconArrowRight,
  IconImage,
} from '../../components/UI/Icons';
import { formatPrice, formatDate } from '../../utils/format';

// ── Minimal order shape for the recent-orders table ──────────
interface DashboardOrder {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  buyer_name: string;
  items: Array<{ title: string; quantity: number }>;
}

const ORDER_BADGE: Record<
  string,
  { label: string; color: 'amber' | 'blue' | 'green' | 'red' | 'gray' }
> = {
  PENDING_MEETUP: { label: 'Awaiting Meetup', color: 'amber' },
  PAID_PENDING_MEETUP: { label: 'Paid · Meetup', color: 'blue' },
  PENDING_PAYMENT: { label: 'Payment Pending', color: 'amber' },
  COMPLETED: { label: 'Completed', color: 'green' },
  CANCELLED: { label: 'Cancelled', color: 'red' },
  CONFIRMED: { label: 'Confirmed', color: 'green' },
  PENDING: { label: 'Pending', color: 'amber' },
};

const SellerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Existing data fetching — preserved exactly.
  useEffect(() => {
    getMyProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // Recent orders for the dashboard table.
  useEffect(() => {
    api
      .get<{ orders: DashboardOrder[] }>('/orders/seller/incoming')
      .then((res) => setOrders(res.data.orders))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, []);

  const activeListings = products.filter((p) => p.is_active !== false).length;
  const totalProducts = products.length;
  const lowStock = products.filter((p) => Number(p.stock) < 3).length;

  const stats: Array<{
    label: string;
    value: string;
    icon: React.ReactNode;
    tint: string;
    link?: string;
    hint?: string;
  }> = [
    {
      label: 'Total Listings',
      value: isLoading ? '—' : String(totalProducts),
      icon: <IconTag size={19} color="var(--brand-active)" />,
      tint: 'var(--brand-soft)',
    },
    {
      label: 'Active Listings',
      value: isLoading ? '—' : String(activeListings),
      icon: <IconCheckCircle size={19} color="var(--success-strong)" />,
      tint: 'var(--success-soft)',
    },
    {
      label: 'Low Stock Items',
      value: isLoading ? '—' : String(lowStock),
      icon: <IconAlertTriangle size={19} color="var(--warning-strong)" />,
      tint: 'var(--warning-soft)',
    },
    {
      label: 'Pending Orders',
      value: '—',
      icon: <IconShoppingBag size={19} color="var(--text-secondary)" />,
      tint: 'var(--surface-muted)',
      link: '/seller/orders',
      hint: 'View orders',
    },
    {
      label: 'Available Earnings',
      value: '—',
      icon: <IconWallet size={19} color="var(--text-secondary)" />,
      tint: 'var(--surface-muted)',
      link: '/seller/payouts',
      hint: 'View payouts',
    },
  ];

  return (
    <AppLayout>
      <div className="sdash">
        <PageHeader
          title="Seller Dashboard"
          subtitle={`Welcome back, ${user?.name}. Here is an overview of your store.`}
          icon="dashboard"
          actions={
            <Link to="/seller/products" className="btn btn-dark" id="dashboard-add-product-btn">
              <IconPlus size={16} />
              Add Product
            </Link>
          }
        />

        {/* KPI stats */}
        <div className="sd-stats">
          {stats.map((s, i) => {
            const inner = (
              <>
                <span className="sd-stat-icon" style={{ background: s.tint }}>
                  {s.icon}
                </span>
                <span className="sd-stat-body">
                  <span className="sd-stat-label">{s.label}</span>
                  <span className="sd-stat-value">{s.value}</span>
                  {s.hint && (
                    <span className="sd-stat-hint">
                      {s.hint} <IconArrowRight size={12} />
                    </span>
                  )}
                </span>
              </>
            );
            return s.link ? (
              <Link key={i} to={s.link} className="sd-stat card card-hover" style={{ textDecoration: 'none' }}>
                {inner}
              </Link>
            ) : (
              <div key={i} className="sd-stat card">
                {inner}
              </div>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="card card-pad sd-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="sd-quick-grid">
            <Link to="/seller/products" className="sd-quick card-hover sd-quick-em" id="ql-add-product">
              <span className="sd-quick-icon" style={{ background: 'var(--brand-soft)', color: 'var(--brand-active)' }}>
                <IconPlus size={20} strokeWidth={2.4} />
              </span>
              <span className="sd-quick-title">Add Product</span>
              <span className="sd-quick-desc">List a new item for sale</span>
            </Link>
            <Link to="/seller/products" className="sd-quick card-hover" id="ql-my-listings">
              <span className="sd-quick-icon">
                <IconTag size={20} />
              </span>
              <span className="sd-quick-title">My Listings</span>
              <span className="sd-quick-desc">Add or manage products</span>
            </Link>
            <Link to="/seller/orders" className="sd-quick card-hover" id="ql-orders">
              <span className="sd-quick-icon">
                <IconShoppingBag size={20} />
              </span>
              <span className="sd-quick-title">Orders</span>
              <span className="sd-quick-desc">View incoming orders</span>
            </Link>
            <Link to="/seller/payouts" className="sd-quick card-hover" id="ql-payouts">
              <span className="sd-quick-icon">
                <IconWallet size={20} />
              </span>
              <span className="sd-quick-title">Earnings & UPI</span>
              <span className="sd-quick-desc">UPI payouts & net sales</span>
            </Link>
          </div>
        </div>

        {/* Recent orders */}
        <div className="card card-pad sd-section">
          <div className="sd-sec-head">
            <h2 className="section-title">Recent Orders</h2>
            {!ordersLoading && orders.length > 0 && (
              <Link to="/seller/orders" className="sd-viewall">
                View all orders <IconArrowRight size={13} />
              </Link>
            )}
          </div>
          {ordersLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Skeleton w="60%" h={12} />
              <Skeleton w="100%" h={40} r={8} />
              <Skeleton w="100%" h={40} r={8} />
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              compact
              icon="shopping-bag"
              title="No orders yet"
              description="When buyers purchase your products, recent orders will show up here."
            />
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Buyer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((o) => {
                    const badge = ORDER_BADGE[o.status] || { label: o.status, color: 'gray' as const };
                    return (
                      <tr key={o.id}>
                        <td className="mono" style={{ fontWeight: 600, color: 'var(--text)' }}>
                          #{o.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td style={{ color: 'var(--text)' }}>{o.buyer_name}</td>
                        <td>
                          <span className="truncate-1" style={{ display: 'inline-block', maxWidth: 180 }}>
                            {o.items?.length ? o.items[0].title : '—'}
                            {o.items?.length > 1 ? ` +${o.items.length - 1} more` : ''}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--text)' }}>
                          {formatPrice(Number(o.total_amount))}
                        </td>
                        <td>
                          <Badge color={badge.color}>{badge.label}</Badge>
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>{formatDate(o.created_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent listings */}
        <div className="card card-pad sd-section">
          <div className="sd-sec-head">
            <h2 className="section-title">Recent Listings</h2>
            {!isLoading && products.length > 5 && (
              <Link to="/seller/products" className="sd-viewall">
                View all {products.length} listings <IconArrowRight size={13} />
              </Link>
            )}
          </div>
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Skeleton w="100%" h={48} r={10} />
              <Skeleton w="100%" h={48} r={10} />
              <Skeleton w="100%" h={48} r={10} />
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              compact
              icon="tag"
              title="No products listed yet"
              description="Start selling by adding your first product."
              action={
                <Link to="/seller/products" className="btn btn-primary" id="dashboard-add-product-empty">
                  <IconPlus size={15} />
                  Add Product
                </Link>
              }
            />
          ) : (
            <div className="sd-recent-list">
              {products.slice(0, 5).map((p) => (
                <div key={p.id} className="sd-recent-item">
                  <div className="sd-recent-thumb">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} />
                    ) : (
                      <IconImage size={18} color="var(--text-faint)" />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="sd-recent-title truncate-1">{p.title}</div>
                    <div className="sd-recent-meta">
                      {formatPrice(Number(p.price))} · {p.stock} in stock
                    </div>
                  </div>
                  <Badge color={p.is_active !== false ? 'green' : 'gray'}>
                    {p.is_active !== false ? 'Active' : 'Hidden'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .sdash { max-width: 1000px; margin: 0 auto; }
        .sd-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 14px;
          margin-bottom: 18px;
        }
        .sd-stat { display: flex; align-items: center; gap: 13px; padding: 16px 18px; }
        .sd-stat-icon {
          width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .sd-stat-body { display: flex; flex-direction: column; min-width: 0; }
        .sd-stat-label { font-size: 12px; font-weight: 500; color: var(--text-muted); }
        .sd-stat-value { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; line-height: 1.2; }
        .sd-stat-hint {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 600; color: var(--brand); margin-top: 2px;
        }
        .sd-section { margin-bottom: 18px; }
        .sd-sec-head {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; margin-bottom: 14px;
        }
        .sd-viewall {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 13px; font-weight: 600; color: var(--brand); text-decoration: none;
        }
        .sd-viewall:hover { text-decoration: underline; }
        .sd-quick-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 12px;
        }
        .sd-quick {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          padding: 20px 14px; border-radius: var(--radius-md); text-decoration: none;
          border: 1px solid var(--border); background: var(--surface);
        }
        .sd-quick-em { border-color: var(--brand-border); }
        .sd-quick-icon {
          width: 42px; height: 42px; border-radius: 12px;
          background: var(--surface-muted); color: var(--text-secondary);
          display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;
        }
        .sd-quick-title { font-size: 14px; font-weight: 700; color: var(--text); }
        .sd-quick-em .sd-quick-title { color: var(--brand-active); }
        .sd-quick-desc { font-size: 12px; color: var(--text-muted); margin-top: 3px; }
        .sd-recent-list { display: flex; flex-direction: column; }
        .sd-recent-item {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 0; border-bottom: 1px solid var(--surface-muted);
        }
        .sd-recent-item:last-child { border-bottom: none; }
        .sd-recent-thumb {
          width: 42px; height: 42px; border-radius: 10px; background: var(--surface-muted);
          border: 1px solid var(--border); flex-shrink: 0; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .sd-recent-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .sd-recent-title { font-size: 14px; font-weight: 600; color: var(--text); }
        .sd-recent-meta { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

        @media (max-width: 768px) {
          .sd-stats { grid-template-columns: repeat(2, 1fr); }
          .sd-quick-grid { grid-template-columns: repeat(2, 1fr); }
          .sd-stat-value { font-size: 19px; }
        }
        @media (max-width: 560px) {
          .sd-stats { grid-template-columns: 1fr; }
          .sd-quick-grid { grid-template-columns: 1fr; }
          .sd-sec-head { flex-direction: column; align-items: flex-start; gap: 6px; }
        }
      `}</style>
    </AppLayout>
  );
};

export default SellerDashboardPage;
