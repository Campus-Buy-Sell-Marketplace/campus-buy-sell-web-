// ============================================================
// LAVSA — Seller Dashboard — Light Theme
// ============================================================

import React from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

const SellerDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Active Listings', value: '12', icon: '🏷️' },
    { label: 'Total Sales',     value: '$450',  icon: '💰' },
    { label: 'Pending Orders',  value: '3',     icon: '📦' },
    { label: 'Rating',          value: '4.9 ★', icon: '⭐' },
  ];

  return (
    <AppLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={headingStyle}>Seller Dashboard</h1>
        <p style={subStyle}>Welcome back, {user?.name}. Here is an overview of your store.</p>

        <div style={gridStyle}>
          {stats.map((s, i) => (
            <div key={i} style={statCardStyle}>
              <div style={iconStyle}>{s.icon}</div>
              <div>
                <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500' }}>{s.label}</div>
                <div style={{ color: '#111827', fontSize: '22px', fontWeight: '700', marginTop: '2px' }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <h2 style={cardHeadingStyle}>Recent Activity</h2>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
            No recent seller activities. Start listing items or check your orders!
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

const headingStyle: React.CSSProperties  = { color: '#111827', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' };
const subStyle: React.CSSProperties      = { color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' };
const gridStyle: React.CSSProperties     = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' };
const statCardStyle: React.CSSProperties = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' };
const iconStyle: React.CSSProperties     = { fontSize: '26px' };
const cardStyle: React.CSSProperties     = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' };
const cardHeadingStyle: React.CSSProperties = { color: '#111827', fontSize: '15px', fontWeight: '600', margin: '0 0 12px 0' };

export default SellerDashboardPage;
