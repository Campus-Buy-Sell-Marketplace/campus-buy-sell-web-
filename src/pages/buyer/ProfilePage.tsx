// ============================================================
// LAVSA — Profile Page — Light Theme
// ============================================================

import React from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, role, isSeller } = useAuth();

  const rows = [
    { label: 'Full Name',  value: user?.name  ?? '—' },
    { label: 'Email',      value: user?.email ?? '—' },
    { label: 'Account Role', value: role === 'SUPER_ADMIN' ? 'Super Admin' : role === 'ADMIN' ? 'Admin' : 'User' },
    { label: 'Seller Status', value: isSeller ? '✅ Active Seller' : '—  Not a seller yet' },
  ];

  return (
    <AppLayout>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={headingStyle}>My Profile</h1>
        <p style={subStyle}>Your account information</p>

        {/* Avatar card */}
        <div style={avatarCardStyle}>
          <div style={avatarStyle}>{user?.name?.charAt(0).toUpperCase() ?? 'U'}</div>
          <div>
            <div style={{ color: '#111827', fontSize: '18px', fontWeight: '700' }}>{user?.name}</div>
            <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '2px' }}>{user?.email}</div>
          </div>
        </div>

        {/* Info rows */}
        <div style={infoCardStyle}>
          {rows.map((r, i) => (
            <div key={i} style={{ ...rowStyle, borderBottom: i < rows.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <span style={labelStyle}>{r.label}</span>
              <span style={valueStyle}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

const headingStyle: React.CSSProperties = { color: '#111827', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' };
const subStyle: React.CSSProperties     = { color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' };

const avatarCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '24px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '16px',
};
const avatarStyle: React.CSSProperties = {
  width: '56px', height: '56px', borderRadius: '50%',
  backgroundColor: '#111827', color: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '22px', fontWeight: '700', flexShrink: 0,
};
const infoCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  overflow: 'hidden',
};
const rowStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '14px 20px',
};
const labelStyle: React.CSSProperties = { color: '#6b7280', fontSize: '13px', fontWeight: '500' };
const valueStyle: React.CSSProperties = { color: '#111827', fontSize: '14px', fontWeight: '600' };

export default ProfilePage;
