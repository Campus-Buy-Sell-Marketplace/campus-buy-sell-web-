// ============================================================
// LAVSA — Seller Products Page — Light Theme
// ============================================================

import React from 'react';
import AppLayout from '../../components/Layout/AppLayout';

const SellerProductsPage: React.FC = () => (
  <AppLayout>
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={headingStyle}>My Listings</h1>
          <p style={subStyle}>Manage the items you are selling on LAVSA</p>
        </div>
        <button style={addBtnStyle} id="add-product-btn">+ Add Product</button>
      </div>

      <div style={emptyCardStyle}>
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>🏷️</div>
        <h3 style={{ color: '#111827', margin: '0 0 8px 0' }}>No Active Listings</h3>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
          Click the button above to post your first campus item for sale!
        </p>
      </div>
    </div>
  </AppLayout>
);

const headingStyle: React.CSSProperties = { color: '#111827', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' };
const subStyle: React.CSSProperties     = { color: '#6b7280', fontSize: '14px', margin: 0 };
const addBtnStyle: React.CSSProperties  = {
  padding: '10px 18px', borderRadius: '8px', border: 'none',
  backgroundColor: '#111827', color: '#ffffff',
  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  fontFamily: "'Inter', system-ui, sans-serif",
};
const emptyCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff', border: '1px solid #e5e7eb',
  borderRadius: '12px', padding: '48px 24px', textAlign: 'center',
};

export default SellerProductsPage;
