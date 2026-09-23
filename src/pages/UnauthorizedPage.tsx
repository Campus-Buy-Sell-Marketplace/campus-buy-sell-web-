// ============================================================
// LAVSA — 403 Unauthorized Page — Light Theme
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => (
  <div style={pageStyle}>
    <div style={contentStyle}>
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>🚫</div>
      <h1 style={headingStyle}>Access Restricted</h1>
      <p style={subStyle}>
        You do not have permission to view this page. If you believe this is an error, contact campus support.
      </p>
      <Link to="/home" style={btnStyle} id="back-home-btn">Return to Home</Link>
    </div>
  </div>
);

const pageStyle: React.CSSProperties    = { minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif", padding: '24px' };
const contentStyle: React.CSSProperties = { textAlign: 'center', maxWidth: '380px' };
const headingStyle: React.CSSProperties = { color: '#111827', fontSize: '22px', fontWeight: '700', margin: '0 0 8px 0' };
const subStyle: React.CSSProperties     = { color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0', lineHeight: '1.6' };
const btnStyle: React.CSSProperties     = { display: 'inline-block', padding: '10px 20px', backgroundColor: '#111827', color: '#ffffff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' };

export default UnauthorizedPage;
