// ============================================================
// LAVSA — Admin Dashboard — Light Theme
// ============================================================

import React from 'react';
import AppLayout from '../../components/Layout/AppLayout';

const AdminDashboardPage: React.FC = () => {
  const stats = [
    { label: 'Total Users',     value: '1,240' },
    { label: 'Total Sellers',   value: '184'   },
    { label: 'Active Listings', value: '412'   },
    { label: 'Reported Items',  value: '2', alert: true },
  ];

  return (
    <AppLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={headingStyle}>Admin Dashboard</h1>
        <p style={subStyle}>Overview of platform users, active listings, and moderation activity</p>

        <div style={gridStyle}>
          {stats.map((s, i) => (
            <div key={i} style={statCardStyle}>
              <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              <div style={{ color: s.alert ? '#dc2626' : '#111827', fontSize: '28px', fontWeight: '700', marginTop: '6px' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <h2 style={cardHeadingStyle}>Recent Moderation Activity</h2>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>No pending moderation tasks.</p>
        </div>
      </div>
    </AppLayout>
  );
};

const headingStyle: React.CSSProperties  = { color: '#111827', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' };
const subStyle: React.CSSProperties      = { color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' };
const gridStyle: React.CSSProperties     = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' };
const statCardStyle: React.CSSProperties = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' };
const cardStyle: React.CSSProperties     = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' };
const cardHeadingStyle: React.CSSProperties = { color: '#111827', fontSize: '15px', fontWeight: '600', margin: '0 0 12px 0' };

export default AdminDashboardPage;
