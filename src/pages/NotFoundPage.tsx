// ============================================================
// LAVSA — 404 Not Found Page
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/UI/ui';
import { IconSearch, IconArrowLeft } from '../components/UI/Icons';

const NotFoundPage: React.FC = () => (
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
          background: 'var(--brand-soft)',
          color: 'var(--brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}
      >
        <IconSearch size={32} />
      </div>
      <h1 style={{ color: 'var(--ink)', fontSize: 24, fontWeight: 800, margin: '0 0 8px 0' }}>
        404 — Page Not Found
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '0 0 24px 0', lineHeight: 1.5 }}>
        The campus page you are looking for does not exist or has been moved.
      </p>
      <Link to="/home" className="btn btn-primary" id="back-home-404-btn">
        <IconArrowLeft size={14} /> Return to Marketplace
      </Link>
    </Card>
  </div>
);

export default NotFoundPage;
