// ============================================================
// LAVSA — Settings Page
// Persists notification preferences to backend.
// Redesigned with the LAVSA design system (global.css + UI kit).
// ============================================================

import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { getPreferences, savePreferences } from '../../services/userService';
import { Card, PageHeader, Badge, PageLoader } from '../../components/UI/ui';
import {
  IconBell,
  IconUser,
  IconMail,
  IconShield,
  IconCheck,
} from '../../components/UI/Icons';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load preferences from backend on mount
  useEffect(() => {
    getPreferences()
      .then((prefs) => setNotifications(prefs.email_notifications))
      .catch(() => {}) // fallback to default true
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async () => {
    const newVal = !notifications;
    setNotifications(newVal);
    setSaving(true);
    setSaved(false);
    try {
      await savePreferences({ email_notifications: newVal });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Revert on error
      setNotifications(!newVal);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="page settings-page" style={{ maxWidth: 740, margin: '0 auto' }}>
        <PageHeader
          title="Account Settings"
          subtitle="Manage your notifications and account preferences"
          icon="settings"
        />

        {loading ? (
          <PageLoader label="Loading your settings..." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Account Information Card */}
            <Card padded>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px 0', color: 'var(--ink)' }}>
                Account Information
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--surface-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconUser size={16} color="var(--text-secondary)" />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Display Name</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{user?.name}</div>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--surface-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconMail size={16} color="var(--text-secondary)" />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Campus Email</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{user?.email}</div>
                    </div>
                  </div>
                  <Badge color="green">Verified</Badge>
                </div>
              </div>
            </Card>

            {/* Notification Preferences Card */}
            <Card padded>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px 0', color: 'var(--ink)' }}>
                Preferences
              </h2>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--brand-soft)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconBell size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                      Email Notifications
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      Receive order updates, buyer chats, and meetup reminders by email
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {saving && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Saving…</span>}
                  {saved && !saving && (
                    <span style={{ fontSize: 12, color: 'var(--success-strong)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IconCheck size={14} /> Saved
                    </span>
                  )}

                  <button
                    onClick={handleToggle}
                    disabled={saving}
                    id="settings-notification-toggle"
                    aria-label="Toggle notifications"
                    style={{
                      width: 46,
                      height: 26,
                      borderRadius: 13,
                      border: 'none',
                      background: notifications ? 'var(--brand)' : 'var(--border-strong)',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background 0.2s ease',
                      padding: 2,
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: '#ffffff',
                        boxShadow: 'var(--shadow-xs)',
                        transform: notifications ? 'translateX(20px)' : 'translateX(0)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </button>
                </div>
              </div>
            </Card>

            {/* Safety & Guidelines Card */}
            <Card padded style={{ background: 'var(--surface-soft)' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--brand-soft)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconShield size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px 0', color: 'var(--ink)' }}>
                    Campus Marketplace Safety
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    All transactions take place on campus. Always meet at public locations such as the library, canteen, or student activity centers. Never share your Delivery OTP until you have physically checked and received your item.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
