// ============================================================
// LAVSA — Admin Users & Seller Verification Page
// Review seller applications, moderate status, and manage roles.
// Redesigned with the LAVSA design system (global.css + UI kit).
// ============================================================

import React, { useEffect, useState } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import {
  fetchUsers,
  updateUserRole,
  fetchSellerApplications,
  updateSellerApplicationStatus,
  AdminUser,
  SellerApplication,
} from '../../services/adminService';
import { Button, Card, Badge, PageHeader, PageLoader, ErrorBanner } from '../../components/UI/ui';
import {
  IconUsers,
  IconStore,
  IconSearch,
} from '../../components/UI/Icons';
import { formatDate } from '../../utils/format';

const ROLE_COLORS: Record<string, 'blue' | 'green' | 'brand' | 'red'> = {
  STUDENT: 'blue',
  SELLER: 'green',
  ADMIN: 'brand',
  SUPER_ADMIN: 'red',
};

const AdminUsersPage: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'applications' | 'users'>('applications');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [fetchedUsers, fetchedApps] = await Promise.all([
        fetchUsers(),
        fetchSellerApplications(),
      ]);
      setUsers(fetchedUsers);
      setApplications(fetchedApps);

      const hasPending = fetchedApps.some((a) => a.status === 'PENDING');
      if (!hasPending && fetchedApps.length === 0) {
        setActiveTab('users');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load user and application data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleRole = async (user: AdminUser) => {
    const newRole = user.role === 'STUDENT' ? 'SELLER' : 'STUDENT';
    setUpdatingId(user.id);
    try {
      const updated = await updateUserRole(user.id, newRole);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, role: updated.role } : u)));
      showToast(`Role updated to ${newRole} for ${user.name}.`, 'success');
      const apps = await fetchSellerApplications();
      setApplications(apps);
    } catch {
      showToast('Failed to update role. Please try again.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleApplicationDecision = async (appId: string, status: 'APPROVED' | 'REJECTED', notes?: string) => {
    setUpdatingId(appId);
    try {
      const updatedApp = await updateSellerApplicationStatus(appId, status, notes);
      setApplications((prev) =>
        prev.map((a) => (a.id === updatedApp.id ? { ...a, ...updatedApp } : a))
      );
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
      showToast(`Application ${status.toLowerCase()} successfully.`, 'success');
    } catch (err) {
      showToast('Failed to update application status.', 'error');
    } finally {
      setUpdatingId(null);
      setRejectingAppId(null);
    }
  };

  const pendingCount = applications.filter((a) => a.status === 'PENDING').length;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredApplications = applications.filter((a) => {
    const matchesSearch =
      a.user_name.toLowerCase().includes(search.toLowerCase()) ||
      a.user_email.toLowerCase().includes(search.toLowerCase()) ||
      a.business_name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.contact_number.includes(search);
    const matchesFilter = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout>
      <div className="page admin-users-page" style={{ maxWidth: 1080, margin: '0 auto' }}>
        <PageHeader
          title="User &amp; Seller Management"
          subtitle="Review seller applications and manage user permissions in PostgreSQL"
          icon="users"
          actions={
            <Button variant="secondary" size="sm" icon="refresh" onClick={loadData}>
              Refresh
            </Button>
          }
        />

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--border)', marginBottom: 18, paddingBottom: 2 }}>
          <button
            type="button"
            className={`nav-pill ${activeTab === 'applications' ? 'nav-pill-active' : ''}`}
            onClick={() => setActiveTab('applications')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: 'none', background: 'transparent' }}
          >
            <IconStore size={15} />
            Seller Applications
            {pendingCount > 0 && (
              <Badge color="amber">{pendingCount} Pending</Badge>
            )}
          </button>
          <button
            type="button"
            className={`nav-pill ${activeTab === 'users' ? 'nav-pill-active' : ''}`}
            onClick={() => setActiveTab('users')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: 'none', background: 'transparent' }}
          >
            <IconUsers size={15} />
            All Users ({users.length})
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <IconSearch size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-faint)' }} />
            <input
              className="input"
              style={{ paddingLeft: 36 }}
              placeholder={
                activeTab === 'applications'
                  ? 'Search by student name, shop name, email, phone…'
                  : 'Search users by name or email…'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {activeTab === 'applications' && (
            <select
              className="select"
              style={{ width: 'auto', minWidth: 150 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Only</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          )}
        </div>

        {loading && <PageLoader label="Loading administrative records..." />}
        {error && <ErrorBanner message={error} onRetry={loadData} />}

        {/* ── TAB 1: SELLER APPLICATIONS ── */}
        {!loading && !error && activeTab === 'applications' && (
          <div>
            {filteredApplications.length === 0 ? (
              <Card padded style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>No seller applications found</div>
                <p style={{ margin: '4px 0 0', fontSize: 13 }}>
                  When students apply to sell on campus, their shop details and phone numbers appear here for review.
                </p>
              </Card>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {filteredApplications.map((app) => {
                  const isUpdating = updatingId === app.id;
                  const isPending = app.status === 'PENDING';

                  return (
                    <Card
                      key={app.id}
                      padded
                      style={{
                        border: isPending ? '1.5px solid var(--warning-border)' : '1px solid var(--border)',
                        background: isPending ? 'var(--warning-soft)' : 'var(--surface)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: 16,
                          marginBottom: 14,
                          flexWrap: 'wrap',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>
                              {app.business_name}
                            </span>
                            <Badge
                              color={
                                app.status === 'APPROVED' ? 'green' : app.status === 'REJECTED' ? 'red' : 'amber'
                              }
                            >
                              {app.status}
                            </Badge>
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                            By <strong>{app.user_name}</strong> · {app.user_email} · Applied on {formatDate(app.created_at)}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          {app.status === 'PENDING' && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                icon="check"
                                disabled={isUpdating}
                                onClick={() => handleApplicationDecision(app.id, 'APPROVED')}
                              >
                                Approve
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
                            </>
                          )}

                          {app.status === 'APPROVED' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled={isUpdating}
                              onClick={() => setRejectingAppId(app.id)}
                            >
                              Revoke Seller
                            </Button>
                          )}

                          {app.status === 'REJECTED' && (
                            <Button
                              variant="success"
                              size="sm"
                              disabled={isUpdating}
                              onClick={() => handleApplicationDecision(app.id, 'APPROVED')}
                            >
                              Re-Approve
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Details Box */}
                      <div
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '12px 16px',
                          display: 'flex',
                          gap: 16,
                          fontSize: 13,
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ flex: 2, minWidth: 200 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Items to Sell:
                          </span>
                          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {app.description}
                          </p>
                        </div>
                        <div style={{ flex: 1, minWidth: 150, borderLeft: '1px solid var(--border)', paddingLeft: 16 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Contact:
                          </span>
                          <p style={{ margin: '4px 0 0', fontWeight: 600, color: 'var(--ink)' }}>
                            {app.contact_number}
                          </p>
                        </div>
                      </div>

                      {app.admin_notes && (
                        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--danger-strong)', background: 'var(--danger-soft)', padding: '8px 12px', borderRadius: 6 }}>
                          <strong>Admin Feedback:</strong> {app.admin_notes}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: ALL USERS ── */}
        {!loading && !error && activeTab === 'users' && (
          <Card padded>
            {filteredUsers.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>No users found matching query.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '10px 12px' }}>Name</th>
                      <th style={{ padding: '10px 12px' }}>Email</th>
                      <th style={{ padding: '10px 12px' }}>Role</th>
                      <th style={{ padding: '10px 12px' }}>Joined</th>
                      <th style={{ padding: '10px 12px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => {
                      const userApp = applications.find((a) => a.user_id === user.id);
                      const roleColor = ROLE_COLORS[user.role] || 'gray';

                      return (
                        <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{user.name}</div>
                            {userApp && userApp.status === 'PENDING' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab('applications');
                                  setSearch(user.email);
                                }}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  padding: 0,
                                  cursor: 'pointer',
                                  marginTop: 2,
                                }}
                              >
                                <Badge color="amber">App Pending</Badge>
                              </button>
                            )}
                          </td>
                          <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{user.email}</td>
                          <td style={{ padding: '12px' }}>
                            <Badge color={roleColor as any}>{user.role}</Badge>
                          </td>
                          <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                            {formatDate(user.created_at)}
                          </td>
                          <td style={{ padding: '12px' }}>
                            {(user.role === 'STUDENT' || user.role === 'SELLER') && (
                              <Button
                                variant={user.role === 'STUDENT' ? 'success' : 'danger-soft'}
                                size="sm"
                                disabled={updatingId === user.id}
                                onClick={() => handleToggleRole(user)}
                              >
                                {updatingId === user.id
                                  ? '…'
                                  : user.role === 'STUDENT'
                                  ? 'Make Seller'
                                  : 'Revoke Seller'}
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* Rejection Modal */}
        <ConfirmModal
          isOpen={!!rejectingAppId}
          title="Reject / Revoke Application"
          message="Provide optional feedback or reason for rejecting or revoking this seller application:"
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

export default AdminUsersPage;
