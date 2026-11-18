// ============================================================
// LAVSA — Admin Dashboard — Real Stats from PostgreSQL
// ============================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import {
  Button,
  Badge,
  PageHeader,
  Skeleton,
  ErrorBanner,
  EmptyState,
} from '../../components/UI/ui';
import {
  IconUsers,
  IconShield,
  IconWallet,
  IconBadgeCheck,
  IconRupee,
  IconStore,
  IconUser,
  IconKey,
  IconArrowRight,
} from '../../components/UI/Icons';
import {
  fetchStats,
  fetchSellerApplications,
  updateSellerApplicationStatus,
  AdminStats,
  SellerApplication,
} from '../../services/adminService';
import { formatPrice, formatDate } from '../../utils/format';
import { useToast } from '../../context/ToastContext';

const KPI_ICONS = {
  users: <IconUsers size={18} />,
  escrow: <IconShield size={18} />,
  payouts: <IconWallet size={18} />,
  apps: <IconBadgeCheck size={18} />,
  commission: <IconRupee size={18} />,
  sellers: <IconStore size={18} />,
  students: <IconUser size={18} />,
  admins: <IconKey size={18} />,
};

interface KpiCard {
  key: string;
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tone: 'ink' | 'brand' | 'amber' | 'green' | 'blue' | 'violet';
  link?: string;
  alert?: boolean;
  sub?: string;
}

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [actingId, setActingId] = useState<string | null>(null);
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsData, appsData] = await Promise.all([
        fetchStats(),
        fetchSellerApplications(),
      ]);
      setStats(statsData);
      setApplications(appsData);
    } catch {
      setError('Failed to load stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Approve / reject seller application (exact service payloads) ──
  const handleApplicationDecision = async (
    appId: string,
    status: 'APPROVED' | 'REJECTED',
    notes?: string
  ) => {
    setActingId(appId);
    try {
      const updatedApp = await updateSellerApplicationStatus(appId, status, notes);
      setApplications((prev) =>
        prev.map((a) => (a.id === updatedApp.id ? { ...a, ...updatedApp } : a))
      );
      showToast(`Application ${status.toLowerCase()} successfully.`, 'success');
    } catch {
      showToast('Failed to update application status.', 'error');
    } finally {
      setActingId(null);
      setRejectingAppId(null);
    }
  };

  // ── KPI cards — only metrics computed from real API data ──
  const cards: KpiCard[] = stats
    ? [
        {
          key: 'total-users',
          label: 'Total Users',
          value: stats.totalUsers,
          icon: KPI_ICONS.users,
          tone: 'ink',
          sub: `${stats.totalStudents ?? 0} students · ${stats.totalSellers ?? 0} sellers`,
        },
        {
          key: 'escrow-orders',
          label: 'Orders in Escrow',
          value: stats.escrowOrdersCount ?? 0,
          icon: KPI_ICONS.escrow,
          tone: 'brand',
          link: '/admin/payouts',
          alert: (stats.escrowOrdersCount ?? 0) > 0,
        },
        {
          key: 'pending-payouts',
          label: 'Pending Payouts',
          value: stats.pendingPayoutsCount ?? 0,
          icon: KPI_ICONS.payouts,
          tone: 'amber',
          link: '/admin/payouts',
          alert: (stats.pendingPayoutsCount ?? 0) > 0,
        },
        {
          key: 'pending-apps',
          label: 'Pending Seller Apps',
          value: stats.pendingApplications ?? 0,
          icon: KPI_ICONS.apps,
          tone: 'amber',
          link: '/admin/users',
          alert: (stats.pendingApplications ?? 0) > 0,
        },
        {
          key: 'platform-fee',
          label: 'Platform 2% Kept',
          value: formatPrice(Number(stats.platformCommissionEarned ?? 0)),
          icon: KPI_ICONS.commission,
          tone: 'green',
          link: '/admin/payouts',
        },
        {
          key: 'active-sellers',
          label: 'Active Sellers',
          value: stats.totalSellers,
          icon: KPI_ICONS.sellers,
          tone: 'green',
        },
        {
          key: 'students-buyers',
          label: 'Students / Buyers',
          value: stats.totalStudents,
          icon: KPI_ICONS.students,
          tone: 'blue',
        },
        {
          key: 'admins',
          label: 'Admins',
          value: stats.totalAdmins,
          icon: KPI_ICONS.admins,
          tone: 'violet',
        },
      ]
    : [];

  const pendingApps = applications.filter((a) => a.status === 'PENDING');
  const recentActivity = [...applications]
    .sort(
      (a, b) =>
        new Date(b.updated_at || b.created_at).getTime() -
        new Date(a.updated_at || a.created_at).getTime()
    )
    .slice(0, 6);

  const statusBadge = (status: SellerApplication['status']) => {
    if (status === 'APPROVED') return <Badge color="green" icon="check-circle">APPROVED</Badge>;
    if (status === 'REJECTED') return <Badge color="red" icon="x-circle">REJECTED</Badge>;
    return <Badge color="amber" icon="clock">PENDING</Badge>;
  };

  return (
    <AppLayout>
      <div className="page" id="admin-dashboard" style={{ maxWidth: 1120 }}>
        <style>{`
          .ad-kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
            gap: 16px;
          }
          .ad-kpi-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: 18px 20px;
            box-shadow: var(--shadow-xs);
            transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .ad-kpi-card.linked { cursor: pointer; }
          .ad-kpi-card.linked:hover {
            box-shadow: var(--shadow-md);
            transform: translateY(-2px);
            border-color: var(--border-strong);
          }
          .ad-kpi-top {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .ad-kpi-icon {
            width: 34px;
            height: 34px;
            border-radius: var(--radius-sm);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .ad-kpi-label {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            line-height: 1.3;
          }
          .ad-kpi-value {
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: var(--text);
            margin-top: 6px;
          }
          .ad-kpi-sub {
            font-size: 12px;
            color: var(--text-faint);
            margin-top: 2px;
          }
          .ad-app-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: 16px 18px;
            box-shadow: var(--shadow-xs);
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 14px;
            flex-wrap: wrap;
          }
          .ad-app-card.pending {
            border-color: var(--warning-border);
            background: linear-gradient(0deg, var(--warning-soft), var(--warning-soft));
          }
          .ad-activity-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0;
            border-bottom: 1px solid var(--surface-muted);
          }
          .ad-activity-item:last-child { border-bottom: none; }
          @media (max-width: 768px) {
            .ad-kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
            .ad-kpi-card { padding: 14px; }
            .ad-kpi-value { font-size: 20px; }
            .ad-app-card { flex-direction: column; align-items: stretch; }
            .ad-app-actions { justify-content: flex-start !important; }
          }
          @media (max-width: 420px) {
            .ad-kpi-grid { grid-template-columns: 1fr; }
          }
        `}</style>

        <PageHeader
          title="Admin Dashboard"
          subtitle="Live overview of platform users, applications and payouts from PostgreSQL"
          icon="dashboard"
          actions={
            <Button variant="secondary" icon="refresh" onClick={loadData} id="admin-dashboard-refresh">
              Refresh
            </Button>
          }
        />

        {error && <ErrorBanner message={error} onRetry={loadData} />}

        {loading ? (
          <div className="ad-kpi-grid" id="admin-stats-grid" aria-busy="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="ad-kpi-card">
                <Skeleton w={120} h={12} />
                <Skeleton w={90} h={26} style={{ marginTop: 10 }} />
              </div>
            ))}
          </div>
        ) : (
          !error && (
            <>
              {/* ── KPI Stat Cards ── */}
              <div className="ad-kpi-grid" id="admin-stats-grid">
                {cards.map((c) => (
                  <div
                    key={c.key}
                    className={`ad-kpi-card ${c.link ? 'linked' : ''}`}
                    onClick={() => c.link && navigate(c.link)}
                    title={c.link ? 'Click to review' : undefined}
                  >
                    <div className="ad-kpi-top">
                      <span
                        className="ad-kpi-icon"
                        style={{
                          background:
                            c.tone === 'brand'
                              ? 'var(--brand-soft)'
                              : c.tone === 'amber'
                              ? 'var(--warning-soft)'
                              : c.tone === 'green'
                              ? 'var(--success-soft)'
                              : c.tone === 'blue'
                              ? 'var(--info-soft)'
                              : c.tone === 'violet'
                              ? '#f5f3ff'
                              : 'var(--surface-muted)',
                          color:
                            c.tone === 'brand'
                              ? 'var(--brand)'
                              : c.tone === 'amber'
                              ? 'var(--warning-strong)'
                              : c.tone === 'green'
                              ? 'var(--success-strong)'
                              : c.tone === 'blue'
                              ? 'var(--info)'
                              : c.tone === 'violet'
                              ? '#7c3aed'
                              : 'var(--text-secondary)',
                        }}
                      >
                        {c.icon}
                      </span>
                      <span className="ad-kpi-label">{c.label}</span>
                    </div>
                    <div
                      className="ad-kpi-value"
                      style={{ color: c.alert ? 'var(--warning-strong)' : 'var(--text)' }}
                    >
                      {c.value}
                    </div>
                    {c.sub && <span className="ad-kpi-sub">{c.sub}</span>}
                    {c.link && c.alert && (
                      <span
                        style={{
                          fontSize: 11,
                          color: 'var(--warning-strong)',
                          fontWeight: 700,
                          marginTop: 4,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        Review now <IconArrowRight size={12} />
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* ── Quick Actions ── */}
              <div className="card card-pad" id="admin-quick-actions" style={{ marginTop: 20 }}>
                <h2 className="section-title" style={{ marginBottom: 4 }}>
                  Platform Management
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 16px' }}>
                  Jump straight into payouts, user verification or listing moderation.
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Button variant="dark" iconRight="arrow-right" onClick={() => navigate('/admin/payouts')}>
                    Manage Seller Payouts
                  </Button>
                  <Button variant="secondary" iconRight="arrow-right" onClick={() => navigate('/admin/users')}>
                    Manage Users &amp; Seller Apps
                  </Button>
                  <Button variant="secondary" iconRight="arrow-right" onClick={() => navigate('/admin/listings')}>
                    View Listings
                  </Button>
                </div>
              </div>

              {/* ── Pending Seller Applications Queue ── */}
              <div className="card card-pad" id="admin-apps-queue" style={{ marginTop: 20 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                    flexWrap: 'wrap',
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      Seller Applications
                      {pendingApps.length > 0 && (
                        <Badge color="amber" icon="clock">
                          {pendingApps.length} pending
                        </Badge>
                      )}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '4px 0 0' }}>
                      Verify campus sellers before they can list products.
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" iconRight="arrow-right" onClick={() => navigate('/admin/users')}>
                    View all
                  </Button>
                </div>

                {pendingApps.length === 0 ? (
                  <EmptyState
                    compact
                    icon="badge-check"
                    title="Queue is clear"
                    description="No seller applications are waiting for review right now."
                    action={
                      <Button variant="secondary" size="sm" onClick={() => navigate('/admin/users')}>
                        Open user management
                      </Button>
                    }
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {pendingApps.slice(0, 5).map((app) => {
                      const isUpdating = actingId === app.id;
                      return (
                        <div key={app.id} className="ad-app-card pending">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                            <span className="avatar" style={{ width: 38, height: 38, fontSize: 15 }}>
                              {app.business_name.charAt(0).toUpperCase()}
                            </span>
                            <div style={{ minWidth: 0 }}>
                              <div className="truncate-1" style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>
                                {app.business_name}
                              </div>
                              <div className="truncate-1" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                {app.user_name} · {app.user_email} · {formatDate(app.created_at)}
                              </div>
                            </div>
                          </div>
                          <div className="ad-app-actions" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <Button
                              variant="success"
                              size="sm"
                              icon="check"
                              loading={isUpdating}
                              disabled={isUpdating}
                              onClick={() => handleApplicationDecision(app.id, 'APPROVED')}
                            >
                              Verify &amp; Approve
                            </Button>
                            <Button
                              variant="danger-soft"
                              size="sm"
                              icon="x"
                              disabled={isUpdating}
                              onClick={() => setRejectingAppId(app.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Recent Activity ── */}
              <div className="card card-pad" id="admin-recent-activity" style={{ marginTop: 20 }}>
                <h2 className="section-title" style={{ marginBottom: 6 }}>
                  Recent Activity
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '0 0 8px' }}>
                  Latest seller application decisions and submissions.
                </p>
                {recentActivity.length === 0 ? (
                  <EmptyState compact icon="clock" title="No activity yet" description="Application submissions and decisions will appear here." />
                ) : (
                  <div>
                    {recentActivity.map((app) => (
                      <div key={app.id} className="ad-activity-item">
                        <span className="avatar" style={{ width: 32, height: 32, fontSize: 13 }}>
                          {app.user_name.charAt(0).toUpperCase()}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="truncate-1" style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>
                            {app.user_name} applied to become a seller
                          </div>
                          <div className="truncate-1" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {app.business_name} · {formatDate(app.updated_at || app.created_at)}
                          </div>
                        </div>
                        {statusBadge(app.status)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )
        )}

        {/* ── Rejection reason modal (same decision flow) ── */}
        <ConfirmModal
          isOpen={!!rejectingAppId}
          title="Reject Application"
          message="Provide optional feedback or reason for rejecting this seller application:"
          confirmLabel="Confirm Decision"
          cancelLabel="Cancel"
          isDanger={true}
          requireInput={true}
          inputPlaceholder="e.g. Incomplete description or duplicate listing"
          onConfirm={(notes) => {
            if (rejectingAppId) {
              handleApplicationDecision(rejectingAppId, 'REJECTED', notes);
            }
          }}
          onCancel={() => setRejectingAppId(null)}
        />
      </div>
    </AppLayout>
  );
};

export default AdminDashboardPage;
