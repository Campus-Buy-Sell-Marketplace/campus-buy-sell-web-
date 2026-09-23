// ============================================================
// LAVSA — Seller Orders Page — Light Theme
// ============================================================

import React from 'react';
import AppLayout from '../../components/Layout/AppLayout';

const SellerOrdersPage: React.FC = () => (
  <AppLayout>
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={headingStyle}>Seller Orders</h1>
      <p style={subStyle}>Track purchases placed by buyers for your items</p>
      <div style={emptyCardStyle}>
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>📬</div>
        <h3 style={{ color: '#111827', margin: '0 0 8px 0' }}>No Incoming Orders</h3>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
          When buyers place orders for your products, they will appear here.
        </p>
      </div>
    </div>
  </AppLayout>
);

const headingStyle: React.CSSProperties = { color: '#111827', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' };
const subStyle: React.CSSProperties     = { color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' };
const emptyCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff', border: '1px solid #e5e7eb',
  borderRadius: '12px', padding: '48px 24px', textAlign: 'center',
};

export default SellerOrdersPage;
