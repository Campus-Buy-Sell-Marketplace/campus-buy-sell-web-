// ============================================================
// LAVSA — Buyer Home Page — Light Theme
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  const cards = [
    { to: '/products', icon: '🛍️', title: 'Browse Products', desc: 'Find items listed by fellow students on campus.' },
    { to: '/orders',   icon: '📦', title: 'My Orders',        desc: 'Track purchases you have made.' },
    { to: '/settings', icon: '⚙️', title: 'Become a Seller',  desc: 'Start listing your own items for sale.' },
  ];

  return (
    <AppLayout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={headingStyle}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={subStyle}>Here is what is happening on campus today.</p>

        <div style={gridStyle}>
          {cards.map((c) => (
            <Link key={c.to} to={c.to} style={cardStyle}>
              <div style={iconBoxStyle}>{c.icon}</div>
              <div style={cardTitleStyle}>{c.title}</div>
              <div style={cardDescStyle}>{c.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

const headingStyle: React.CSSProperties = { color: '#111827', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' };
const subStyle: React.CSSProperties     = { color: '#6b7280', fontSize: '14px', margin: '0 0 32px 0' };
const gridStyle: React.CSSProperties   = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' };

const cardStyle: React.CSSProperties = {
  display: 'block',
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '24px',
  textDecoration: 'none',
  transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
};
const iconBoxStyle: React.CSSProperties  = { fontSize: '28px', marginBottom: '12px' };
const cardTitleStyle: React.CSSProperties = { color: '#111827', fontSize: '15px', fontWeight: '600', marginBottom: '6px' };
const cardDescStyle: React.CSSProperties  = { color: '#6b7280', fontSize: '13px', lineHeight: '1.5' };

export default HomePage;
