// ============================================================
// LAVSA — Settings Page — Light Theme
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

const SettingsPage: React.FC = () => {
  const { user, isSeller } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);

  return (
    <AppLayout>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={headingStyle}>Settings</h1>
        <p style={subStyle}>Manage your account preferences</p>

        {/* Account Info */}
        <section style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>Account</h2>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Name</span>
            <span style={valueStyle}>{user?.name}</span>
          </div>
          <div style={{ ...infoRowStyle, borderBottom: 'none' }}>
            <span style={labelStyle}>Email</span>
            <span style={valueStyle}>{user?.email}</span>
          </div>
        </section>

        {/* Preferences */}
        <section style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>Preferences</h2>
          <div style={{ ...infoRowStyle, borderBottom: 'none' }}>
            <div>
              <div style={labelStyle}>Email Notifications</div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '2px' }}>Receive order updates by email</div>
            </div>
            <button
              onClick={() => setNotifications(v => !v)}
              style={toggleStyle(notifications)}
            >
              <div style={toggleKnobStyle(notifications)} />
            </button>
          </div>
        </section>

        {/* Become a Seller */}
        {!isSeller && (
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>Seller</h2>
            <div style={{ padding: '20px' }}>
              <p style={{ color: '#374151', fontSize: '14px', margin: '0 0 16px 0' }}>
                Want to sell items on LAVSA? Apply to become a seller and start listing products for your campus.
              </p>
              <button
                onClick={() => navigate('/seller/onboarding')}
                style={sellerBtnStyle}
                id="become-seller-btn"
              >
                Become a Seller →
              </button>
            </div>
          </section>
        )}

        {isSeller && (
          <section style={{ ...sectionStyle, borderColor: '#d1fae5' }}>
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>✅</span>
              <div>
                <div style={{ color: '#065f46', fontWeight: '600', fontSize: '14px' }}>You are an active seller</div>
                <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '2px' }}>Go to your seller dashboard to manage listings.</div>
              </div>
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
};

const headingStyle: React.CSSProperties = { color: '#111827', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' };
const subStyle: React.CSSProperties     = { color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' };

const sectionStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  marginBottom: '16px',
  overflow: 'hidden',
};
const sectionHeadingStyle: React.CSSProperties = {
  color: '#111827', fontSize: '13px', fontWeight: '600',
  padding: '14px 20px', margin: 0,
  borderBottom: '1px solid #f3f4f6',
  textTransform: 'uppercase', letterSpacing: '0.05em',
};
const infoRowStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '14px 20px', borderBottom: '1px solid #f3f4f6',
};
const labelStyle: React.CSSProperties  = { color: '#6b7280', fontSize: '13px', fontWeight: '500' };
const valueStyle: React.CSSProperties  = { color: '#111827', fontSize: '14px', fontWeight: '600' };

const toggleStyle = (on: boolean): React.CSSProperties => ({
  width: '40px', height: '22px', borderRadius: '11px',
  backgroundColor: on ? '#111827' : '#d1d5db',
  border: 'none', cursor: 'pointer', padding: '2px',
  display: 'flex', alignItems: 'center',
  transition: 'background-color 0.2s ease', flexShrink: 0,
  justifyContent: on ? 'flex-end' : 'flex-start',
});
const toggleKnobStyle = (on: boolean): React.CSSProperties => ({
  width: '18px', height: '18px', borderRadius: '50%',
  backgroundColor: '#ffffff',
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  transition: 'all 0.2s ease',
});
const sellerBtnStyle: React.CSSProperties = {
  padding: '10px 20px', borderRadius: '8px', border: '1.5px solid #111827',
  backgroundColor: '#111827', color: '#ffffff',
  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'all 0.15s ease',
};

export default SettingsPage;
