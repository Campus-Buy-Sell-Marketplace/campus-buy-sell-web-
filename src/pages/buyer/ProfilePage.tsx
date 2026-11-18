// ============================================================
// LAVSA — Profile Page
// User account information, campus status, and quick shortcuts.
// Redesigned with the LAVSA design system (global.css + UI kit).
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { Card, Badge, PageHeader } from '../../components/UI/ui';
import {
  IconMail,
  IconStore,
  IconShoppingBag,
  IconHeart,
  IconSettings,
  IconBadgeCheck,
  IconArrowRight,
} from '../../components/UI/Icons';

const ProfilePage: React.FC = () => {
  const { user, role, isSeller } = useAuth();

  const roleLabel =
    role === 'SUPER_ADMIN'
      ? 'Super Admin'
      : role === 'ADMIN'
      ? 'Campus Admin'
      : isSeller
      ? 'Buyer & Seller'
      : 'Student Buyer';

  const roleColor =
    role === 'SUPER_ADMIN' ? 'red' : role === 'ADMIN' ? 'brand' : isSeller ? 'green' : 'blue';

  const initials = user?.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <AppLayout>
      <div className="page profile-page" style={{ maxWidth: 740, margin: '0 auto' }}>
        <PageHeader
          title="My Profile"
          subtitle="Manage your personal account details and campus status"
          icon="user"
          actions={
            <Link to="/settings" className="btn btn-secondary btn-sm">
              <IconSettings size={14} />
              Account Settings
            </Link>
          }
        />

        {/* Hero Identity Card */}
        <Card padded style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'var(--brand-gradient)',
              color: '#ffffff',
              fontSize: 28,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-brand)',
              flexShrink: 0,
            }}
          >
            {initials}
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--ink)' }}>
                {user?.name || 'Campus Student'}
              </h2>
              <Badge color={roleColor as any}>{roleLabel}</Badge>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconMail size={14} color="var(--text-faint)" />
              {user?.email}
            </div>
            <div style={{ fontSize: 12, color: 'var(--success-strong)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
              <IconBadgeCheck size={14} />
              Verified Campus Community Member
            </div>
          </div>
        </Card>

        {/* Quick Navigation Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
          <Link to="/orders" style={{ textDecoration: 'none' }}>
            <Card hover padded style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--brand-soft)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconShoppingBag size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>My Orders</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Track purchases</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--brand)', fontSize: 12, fontWeight: 600, marginTop: 12 }}>
                View Orders <IconArrowRight size={12} />
              </div>
            </Card>
          </Link>

          <Link to="/wishlist" style={{ textDecoration: 'none' }}>
            <Card hover padded style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--danger-soft)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconHeart size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>Wishlist</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Saved products</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--brand)', fontSize: 12, fontWeight: 600, marginTop: 12 }}>
                View Saved <IconArrowRight size={12} />
              </div>
            </Card>
          </Link>

          {isSeller ? (
            <Link to="/seller/dashboard" style={{ textDecoration: 'none' }}>
              <Card hover padded style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--success-soft)', color: 'var(--success-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconStore size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>Seller Hub</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Listings &amp; earnings</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--brand)', fontSize: 12, fontWeight: 600, marginTop: 12 }}>
                  Go to Hub <IconArrowRight size={12} />
                </div>
              </Card>
            </Link>
          ) : (
            <Link to="/seller/onboarding" style={{ textDecoration: 'none' }}>
              <Card hover padded style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px dashed var(--brand)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--brand-soft)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconStore size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>Start Selling</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>List your campus gear</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--brand)', fontSize: 12, fontWeight: 600, marginTop: 12 }}>
                  Apply Now <IconArrowRight size={12} />
                </div>
              </Card>
            </Link>
          )}
        </div>

        {/* Detailed Account Details Card */}
        <Card padded>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 14px 0', color: 'var(--ink)' }}>
            Account Information
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Full Name</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{user?.name ?? '—'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Campus Email</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{user?.email ?? '—'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Account Role</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{roleLabel}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Seller Privileges</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: isSeller ? 'var(--success-strong)' : 'var(--text-secondary)' }}>
                {isSeller ? 'Active Campus Seller' : 'Not registered as seller'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
