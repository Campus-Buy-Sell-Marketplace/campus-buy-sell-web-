// ============================================================
// LAVSA — Orders Page — Light Theme
// ============================================================

import React from 'react';
import AppLayout from '../../components/Layout/AppLayout';

const OrdersPage: React.FC = () => (
  <AppLayout>
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={headingStyle}>My Orders</h1>
      <p style={subStyle}>Track items you have purchased from campus sellers</p>
      <div style={emptyCardStyle}>
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>📦</div>
        <h3 style={{ color: '#111827', margin: '0 0 8px 0' }}>No Orders Yet</h3>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
          When you purchase items, your orders will appear here.
        </p>
      </div>
    </div>
  </AppLayout>
);

const headingStyle: React.CSSProperties = { color: '#111827', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' };
const subStyle: React.CSSProperties     = { color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' };
const emptyCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '48px 24px',
  textAlign: 'center',
};

export default OrdersPage;
