// ============================================================
// LAVSA — Admin Dashboard — Real Stats from PostgreSQL
// ============================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { fetchStats, AdminStats } from '../../services/adminService';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(() => setError('Failed to load stats.'))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: 'Total Users',           value: stats.totalUsers,           color: '#111827' },
        { label: 'Pending Seller Apps',   value: stats.pendingApplications ?? 0, color: (stats.pendingApplications ?? 0) > 0 ? '#d97706' : '#111827', link: '/admin/users' },
        { label: 'Active Sellers',        value: stats.totalSellers,         color: '#059669' },
        { label: 'Students / Buyers',     value: stats.totalStudents,        color: '#2563eb' },
        { label: 'Admins',                value: stats.totalAdmins,          color: '#7c3aed' },
      ]
    : [];

  return (
    <AppLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <h1 style={headingStyle}>Admin Dashboard</h1>
        <p style={subStyle}>Live overview of platform users and applications from PostgreSQL</p>

        {loading && <p style={{ color: '#6b7280' }}>Loading stats…</p>}
        {error   && <p style={{ color: '#dc2626' }}>{error}</p>}

        {!loading && !error && (
          <div style={gridStyle}>
            {cards.map((c, i) => (
              <div
                key={i}
                style={{
                  ...statCardStyle,
                  cursor: c.link ? 'pointer' : 'default',
                  borderTop: c.link && c.value > 0 ? '3px solid #f59e0b' : '1px solid #e5e7eb',
                }}
                onClick={() => c.link && navigate(c.link)}
                title={c.link ? 'Click to view applications' : undefined}
              >
                <div style={labelStyle}>{c.label}</div>
                <div style={{ ...valueStyle, color: c.color }}>{c.value}</div>
                {c.link && c.value > 0 && (
                  <span style={pendingLinkStyle}>Review Applications →</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={cardStyle}>
          <h2 style={cardHeadingStyle}>About This Dashboard</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 12px 0', lineHeight: '1.5' }}>
            All statistics and seller applications are fetched live from your Neon PostgreSQL database.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={actionBtnStyle} onClick={() => navigate('/admin/users')}>
              Manage Users & Seller Apps →
            </button>
            <button style={secondaryBtnStyle} onClick={() => navigate('/admin/listings')}>
              View Listings →
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

const headingStyle: React.CSSProperties = { color: '#111827', fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0', letterSpacing: '-0.02em' };
const subStyle: React.CSSProperties     = { color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' };
const gridStyle: React.CSSProperties    = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' };
const statCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px',
  padding: '20px', transition: 'box-shadow 0.2s',
  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
};
const labelStyle: React.CSSProperties   = { color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' };
const valueStyle: React.CSSProperties   = { fontSize: '32px', fontWeight: '800', marginTop: '6px' };
const pendingLinkStyle: React.CSSProperties = { fontSize: '11px', color: '#d97706', fontWeight: '700', marginTop: '4px', display: 'inline-block' };
const cardStyle: React.CSSProperties    = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' };
const cardHeadingStyle: React.CSSProperties = { color: '#111827', fontSize: '16px', fontWeight: '700', margin: '0 0 8px 0' };
const actionBtnStyle: React.CSSProperties = {
  padding: '10px 16px', backgroundColor: '#111827', color: '#ffffff',
  borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: '600',
  cursor: 'pointer',
};
const secondaryBtnStyle: React.CSSProperties = {
  padding: '10px 16px', backgroundColor: '#ffffff', color: '#374151',
  borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px', fontWeight: '600',
  cursor: 'pointer',
};

export default AdminDashboardPage;
