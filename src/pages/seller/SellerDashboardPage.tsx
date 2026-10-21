// ============================================================
// LAVSA — Seller Dashboard — Light Theme
// Shows real stats from the seller's actual listings.
// ============================================================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { getMyProducts, Product } from '../../services/productService';

const SellerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMyProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const activeListings = products.filter((p) => p.is_active !== false).length;
  const totalProducts = products.length;
  const lowStock = products.filter((p) => Number(p.stock) < 3).length;

  const stats = [
    {
      label: 'Total Listings',
      value: isLoading ? '—' : String(totalProducts),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
      ),
    },
    {
      label: 'Active Listings',
      value: isLoading ? '—' : String(activeListings),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
    {
      label: 'Low Stock Items',
      value: isLoading ? '—' : String(lowStock),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ),
    },
    {
      label: 'Pending Orders',
      value: '—',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
    },
  ];

  return (
    <AppLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
          <div>
            <h1 style={headingStyle}>Seller Dashboard</h1>
            <p style={subStyle}>Welcome back, {user?.name}. Here is an overview of your store.</p>
          </div>
          <Link to="/seller/products" style={addProductBtnStyle} id="dashboard-add-product-btn">
            + Add Product
          </Link>
        </div>

        {/* Stats */}
        <div style={gridStyle}>
          {stats.map((s, i) => (
            <div key={i} style={statCardStyle}>
              <div style={{ ...iconStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
              <div>
                <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500' }}>{s.label}</div>
                <div style={{ color: '#111827', fontSize: '22px', fontWeight: '700', marginTop: '2px' }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={quickLinksStyle}>
          <h2 style={cardHeadingStyle}>Quick Actions</h2>
          <div style={quickLinksGridStyle}>
            <Link to="/seller/products" style={{ ...quickLinkCardStyle, borderColor: '#111827' }} id="ql-add-product">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
              <div style={{ fontWeight: '700', color: '#111827', marginTop: '8px' }}>Add Product</div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>List a new item for sale</div>
            </Link>
            <Link to="/seller/products" style={quickLinkCardStyle} id="ql-my-listings">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
              </div>
              <div style={{ fontWeight: '600', color: '#111827', marginTop: '8px' }}>My Listings</div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>Add or manage products</div>
            </Link>
            <Link to="/seller/orders" style={quickLinkCardStyle} id="ql-orders">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <div style={{ fontWeight: '600', color: '#111827', marginTop: '8px' }}>Orders</div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>View incoming orders</div>
            </Link>
            <Link to="/seller/payouts" style={{ ...quickLinkCardStyle, borderColor: '#059669' }} id="ql-payouts">
              <span style={{ fontSize: '28px' }}>💳</span>
              <div style={{ fontWeight: '700', color: '#059669', marginTop: '8px' }}>Earnings & UPI</div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>UPI payouts & net sales</div>
            </Link>
          </div>
        </div>

        {/* Recent listings */}
        <div style={cardStyle}>
          <h2 style={cardHeadingStyle}>Recent Listings</h2>
          {isLoading && (
            <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>Loading...</p>
          )}
          {!isLoading && products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 16px 0' }}>
                No products listed yet. Start selling by adding your first product!
              </p>
              <Link to="/seller/products" style={addProductBtnStyle} id="dashboard-add-product-btn">
                + Add Product
              </Link>
            </div>
          )}
          {!isLoading && products.length > 0 && (
            <div style={recentListStyle}>
              {products.slice(0, 5).map((p) => (
                <div key={p.id} style={recentItemStyle}>
                  <div style={recentThumbStyle}>
                    {p.image_url
                      ? <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '20px' }}>📦</span>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', color: '#111827', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.title}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '12px' }}>
                      ₹{Number(p.price).toFixed(2)} · {p.stock} in stock
                    </div>
                  </div>
                  <span style={statusPillStyle(p.is_active !== false)}>
                    {p.is_active !== false ? 'Active' : 'Hidden'}
                  </span>
                </div>
              ))}
              {products.length > 5 && (
                <Link to="/seller/products" style={{ display: 'block', textAlign: 'center', color: '#6b7280', fontSize: '13px', marginTop: '12px', textDecoration: 'none' }}>
                  View all {products.length} listings →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        #ql-my-listings:hover, #ql-orders:hover { border-color: #111827 !important; }
        #dashboard-add-product-btn:hover { background-color: #374151 !important; }
      `}</style>
    </AppLayout>
  );
};

const headingStyle: React.CSSProperties  = { color: '#111827', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' };
const subStyle: React.CSSProperties      = { color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' };
const gridStyle: React.CSSProperties     = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' };
const statCardStyle: React.CSSProperties = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' };
const iconStyle: React.CSSProperties     = { fontSize: '26px' };
const cardStyle: React.CSSProperties     = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginTop: '16px' };
const cardHeadingStyle: React.CSSProperties = { color: '#111827', fontSize: '15px', fontWeight: '600', margin: '0 0 16px 0' };

const quickLinksStyle: React.CSSProperties = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginTop: '16px' };
const quickLinksGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' };
const quickLinkCardStyle: React.CSSProperties = {
  display: 'block', padding: '20px', borderRadius: '10px', border: '1.5px solid #e5e7eb',
  textDecoration: 'none', textAlign: 'center', transition: 'border-color 0.15s ease',
};

const addProductBtnStyle: React.CSSProperties = {
  display: 'inline-block', padding: '10px 20px', borderRadius: '8px', backgroundColor: '#111827',
  color: '#ffffff', fontSize: '13px', fontWeight: '600', textDecoration: 'none',
  transition: 'background-color 0.15s ease',
};

const recentListStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px' };
const recentItemStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '12px',
  padding: '10px 0', borderBottom: '1px solid #f9fafb',
};
const recentThumbStyle: React.CSSProperties = {
  width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f3f4f6',
  flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const statusPillStyle = (active: boolean): React.CSSProperties => ({
  padding: '2px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '600',
  backgroundColor: active ? '#f0fdf4' : '#f3f4f6',
  color: active ? '#166534' : '#6b7280', flexShrink: 0,
});

export default SellerDashboardPage;
