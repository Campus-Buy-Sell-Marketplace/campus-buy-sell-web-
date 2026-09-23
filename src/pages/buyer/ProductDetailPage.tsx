// ============================================================
// LAVSA — Product Detail Page — Light Theme
// ============================================================

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <AppLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/products" style={backLinkStyle}>← Back to Products</Link>
        <div style={cardStyle}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <h1 style={headingStyle}>Product #{id}</h1>
          <p style={subStyle}>Product details will be displayed here once the backend is connected.</p>
        </div>
      </div>
    </AppLayout>
  );
};

const backLinkStyle: React.CSSProperties = { color: '#6b7280', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' };
const cardStyle: React.CSSProperties    = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '40px 32px', textAlign: 'center' };
const headingStyle: React.CSSProperties = { color: '#111827', fontSize: '22px', fontWeight: '700', margin: '0 0 8px 0' };
const subStyle: React.CSSProperties    = { color: '#6b7280', fontSize: '14px', margin: 0 };

export default ProductDetailPage;
