// ============================================================
// LAVSA — Orders Page — fetches real order history from API
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
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<{ orders: Order[] }>('/orders')
      .then((res) => setOrders(res.data.orders))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setIsLoading(false));
  }, []);

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
          <div style={errorStyle}>⚠️ {error}</div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div style={emptyCardStyle}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
            <h3 style={{ color: '#111827', margin: '0 0 8px 0' }}>No Orders Yet</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 20px 0' }}>
              When you purchase items, your orders will appear here.
            </p>
            <Link to="/products" style={shopBtnStyle}>Browse Products</Link>
          </div>
        )}

        {!isLoading && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => (
              <div key={order.id} style={orderCardStyle}>
                {/* Order Header */}
                <div style={orderHeaderStyle}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '2px' }}>
                      Order ID: <span style={{ fontFamily: 'monospace', color: '#374151' }}>{order.id.slice(0, 8)}…</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={statusBadgeStyle(order.status)}>{order.status}</span>
                    <div style={{ fontWeight: '700', fontSize: '16px', color: '#111827', marginTop: '4px' }}>
                      ₹{Number(order.total_amount).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={orderItemRowStyle}>
                      <div style={thumbStyle}>
                        {item.image_url
                          ? <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: '20px' }}>📦</span>
                        }
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>{item.title}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          Qty: {item.quantity} × ₹{Number(item.unit_price).toFixed(2)}
                        </div>
                      </div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#111827' }}>
                        ₹{(item.quantity * Number(item.unit_price)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </AppLayout>
  );
};

const headingStyle: React.CSSProperties = { color: '#111827', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' };
const subStyle: React.CSSProperties = { color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' };

const centerStyle: React.CSSProperties = { textAlign: 'center', padding: '60px 0' };
const spinnerStyle: React.CSSProperties = {
  width: '32px', height: '32px', border: '3px solid #e5e7eb',
  borderTop: '3px solid #111827', borderRadius: '50%', margin: '0 auto',
  animation: 'spin 0.8s linear infinite',
};

const errorStyle: React.CSSProperties = {
  padding: '14px 16px', borderRadius: '10px', backgroundColor: '#fffbeb',
  border: '1px solid #fde68a', color: '#92400e', fontSize: '14px', marginBottom: '16px',
};

const emptyCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff', border: '1px solid #e5e7eb',
  borderRadius: '12px', padding: '48px 24px', textAlign: 'center',
};

const shopBtnStyle: React.CSSProperties = {
  display: 'inline-block', padding: '10px 20px', borderRadius: '8px',
  backgroundColor: '#111827', color: '#ffffff', fontSize: '13px',
  fontWeight: '600', textDecoration: 'none',
};

const orderCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff', border: '1px solid #e5e7eb',
  borderRadius: '12px', padding: '16px 20px',
};

const orderHeaderStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between',
  alignItems: 'flex-start', marginBottom: '14px',
};

const statusBadgeStyle = (status: string): React.CSSProperties => ({
  display: 'inline-block', padding: '2px 10px', borderRadius: '10px',
  fontSize: '11px', fontWeight: '600',
  backgroundColor: status === 'CONFIRMED' ? '#f0fdf4' : status === 'CANCELLED' ? '#fef2f2' : '#fffbeb',
  color: status === 'CONFIRMED' ? '#166534' : status === 'CANCELLED' ? '#991b1b' : '#92400e',
});

const orderItemRowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '12px',
};

const thumbStyle: React.CSSProperties = {
  width: '44px', height: '44px', borderRadius: '8px', backgroundColor: '#f3f4f6',
  flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
};

export default OrdersPage;
