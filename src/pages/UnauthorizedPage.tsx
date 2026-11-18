// ============================================================
// LAVSA — 403 Unauthorized Page
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/UI/ui';
import { IconShield, IconArrowLeft } from '../components/UI/Icons';

const UnauthorizedPage: React.FC = () => (
  <div
    style={{
      minHeight: '100vh',
      backgroundColor: 'var(--page-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}
  >
    <Card padded style={{ textAlign: 'center', maxWidth: 420, width: '100%', padding: '40px 32px' }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          background: 'var(--danger-soft)',
          color: 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}
      >
        <IconShield size={32} />
      </div>
      <h1 style={{ color: 'var(--ink)', fontSize: 24, fontWeight: 800, margin: '0 0 8px 0' }}>
        Access Restricted
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '0 0 24px 0', lineHeight: 1.5 }}>
        You do not have permission to access this campus portal area. If you believe this is an error, please contact your campus administrator.
      </p>
      <Link to="/home" className="btn btn-primary" id="back-home-btn">
        <IconArrowLeft size={14} /> Return to Home
      </Link>
    </Card>
  </div>
);

export default UnauthorizedPage;
