// ============================================================
// LAVSA — Super Admin Admins Page — Light Theme
// ============================================================

import React from 'react';
import AppLayout from '../../components/Layout/AppLayout';

const SuperAdminAdminsPage: React.FC = () => (
  <AppLayout>
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={headingStyle}>Admin Management</h1>
      <p style={subStyle}>Grant or revoke admin privileges across the platform</p>
      <div style={cardStyle}>
        <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>
          Admin delegation and permissions control — connect backend for live data.
        </p>
      </div>
    </div>
  </AppLayout>
);

const headingStyle: React.CSSProperties = { color: '#111827', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' };
const subStyle: React.CSSProperties     = { color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' };
const cardStyle: React.CSSProperties    = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' };

export default SuperAdminAdminsPage;
