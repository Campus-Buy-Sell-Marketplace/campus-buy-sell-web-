// ============================================================
// LAVSA — Admin Users & Seller Verification Page
// ============================================================

import React, { useEffect, useState } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import {
  fetchUsers,
  updateUserRole,
  fetchSellerApplications,
  updateSellerApplicationStatus,
  AdminUser,
  SellerApplication,
} from '../../services/adminService';

const ROLE_COLORS: Record<string, string> = {
  STUDENT:     '#2563eb',
  SELLER:      '#059669',
  ADMIN:       '#7c3aed',
  SUPER_ADMIN: '#dc2626',
};

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  PENDING:  { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  APPROVED: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  REJECTED: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
};

const AdminUsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'applications' | 'users'>('applications');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

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

      // Default to applications tab if there are pending applications, otherwise users
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

  // Quick toggle role directly on users table
  const handleToggleRole = async (user: AdminUser) => {
    const newRole = user.role === 'STUDENT' ? 'SELLER' : 'STUDENT';
    setUpdatingId(user.id);
    try {
      const updated = await updateUserRole(user.id, newRole);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, role: updated.role } : u)));
      // Also refresh applications list if affected
      const apps = await fetchSellerApplications();
      setApplications(apps);
    } catch {
      alert('Failed to update role. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle application decision (Approve or Reject)
  const handleApplicationDecision = async (appId: string, status: 'APPROVED' | 'REJECTED') => {
    let notes: string | undefined = undefined;
    if (status === 'REJECTED') {
      const promptNotes = window.prompt('Optional: Reason for rejecting this seller application:');
      if (promptNotes === null) return; // User cancelled prompt
      notes = promptNotes.trim() || undefined;
    }

    setUpdatingId(appId);
    try {
      const updatedApp = await updateSellerApplicationStatus(appId, status, notes);
      setApplications((prev) =>
        prev.map((a) => (a.id === updatedApp.id ? { ...a, ...updatedApp } : a))
      );
      // Reload users to reflect new role immediately
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (err) {
      alert('Failed to update application status.');
    } finally {
      setUpdatingId(null);
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
      <div style={{ maxWidth: '1080px', margin: '0 auto', fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h1 style={headingStyle}>User & Seller Management</h1>
            <p style={subStyle}>
              Verify seller applications and manage user permissions — live from PostgreSQL
            </p>
          </div>
          <button style={refreshBtnStyle} onClick={loadData} title="Refresh data">
            🔄 Refresh
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={tabContainerStyle}>
          <button
            style={tabButtonStyle(activeTab === 'applications')}
            onClick={() => setActiveTab('applications')}
          >
            📋 Seller Applications
            {pendingCount > 0 && (
              <span style={pendingBadgeStyle}>{pendingCount} Pending</span>
            )}
          </button>
          <button
            style={tabButtonStyle(activeTab === 'users')}
            onClick={() => setActiveTab('users')}
          >
            👥 All Users ({users.length})
          </button>
        </div>

        {/* Search bar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
          <input
            style={searchStyle}
            placeholder={
              activeTab === 'applications'
                ? 'Search by student name, shop name, email, phone…'
                : 'Search users by name or email…'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {activeTab === 'applications' && (
            <select
              style={selectStyle}
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

        {loading && <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading data from database…</p>}
        {error && <p style={{ color: '#dc2626', fontSize: '14px' }}>⚠️ {error}</p>}

        {/* ── TAB 1: SELLER APPLICATIONS ── */}
        {!loading && !error && activeTab === 'applications' && (
          <div>
            {filteredApplications.length === 0 ? (
              <div style={emptyCardStyle}>
                <span style={{ fontSize: '40px' }}>📭</span>
                <p style={{ color: '#6b7280', margin: '8px 0 0 0', fontWeight: '500' }}>
                  No seller applications found.
                </p>
                <p style={{ color: '#9ca3af', fontSize: '13px', margin: '4px 0 0 0' }}>
                  When students apply to become sellers on campus, their shop details and phone numbers will appear here for verification.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredApplications.map((app) => {
                  const statusStyle = STATUS_COLORS[app.status] || STATUS_COLORS.PENDING;
                  const isUpdating = updatingId === app.id;

                  return (
                    <div key={app.id} style={appCardStyle(app.status === 'PENDING')}>
                      {/* Top Header of Card */}
                      <div style={appCardHeaderStyle}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={shopNameStyle}>🏪 {app.business_name}</span>
                            <span
                              style={{
                                ...statusBadgeStyle,
                                backgroundColor: statusStyle.bg,
                                color: statusStyle.text,
                                border: `1px solid ${statusStyle.border}`,
                              }}
                            >
                              {app.status === 'PENDING' ? '⏳ PENDING REVIEW' : app.status}
                            </span>
                          </div>
                          <div style={applicantSubStyle}>
                            By <strong>{app.user_name}</strong> · 
                            <span style={{ color: '#6b7280' }}> {app.user_email}</span> · 
                            <span> Applied {new Date(app.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {app.status === 'PENDING' && (
                            <>
                              <button
                                style={approveBtnStyle}
                                disabled={isUpdating}
                                onClick={() => handleApplicationDecision(app.id, 'APPROVED')}
                              >
                                {isUpdating ? '…' : '✅ Verify & Approve'}
                              </button>
                              <button
                                style={rejectBtnStyle}
                                disabled={isUpdating}
                                onClick={() => handleApplicationDecision(app.id, 'REJECTED')}
                              >
                                {isUpdating ? '…' : '❌ Reject'}
                              </button>
                            </>
                          )}

                          {app.status === 'APPROVED' && (
                            <button
                              style={revokeBtnStyle}
                              disabled={isUpdating}
                              onClick={() => handleApplicationDecision(app.id, 'REJECTED')}
                            >
                              {isUpdating ? '…' : 'Revoke Seller'}
                            </button>
                          )}

                          {app.status === 'REJECTED' && (
                            <button
                              style={approveBtnStyle}
                              disabled={isUpdating}
                              onClick={() => handleApplicationDecision(app.id, 'APPROVED')}
                            >
                              {isUpdating ? '…' : 'Re-Approve'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Details Box */}
                      <div style={appDetailsBoxStyle}>
                        <div style={{ flex: 2 }}>
                          <span style={detailLabelStyle}>📦 WHAT THEY PLAN TO SELL:</span>
                          <p style={detailTextStyle}>{app.description}</p>
                        </div>
                        <div style={{ flex: 1, borderLeft: '1px solid #e5e7eb', paddingLeft: '16px' }}>
                          <span style={detailLabelStyle}>📞 CONTACT / WHATSAPP:</span>
                          <p style={{ ...detailTextStyle, fontWeight: '600', color: '#1f2937' }}>
                            {app.contact_number}
                          </p>
                        </div>
                      </div>

                      {/* Admin note (if rejected) */}
                      {app.admin_notes && (
                        <div style={adminNoteStyle}>
                          <strong>Admin Feedback:</strong> {app.admin_notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: ALL USERS ── */}
        {!loading && !error && activeTab === 'users' && (
          <div style={cardStyle}>
            {filteredUsers.length === 0 ? (
              <p style={{ color: '#9ca3af', margin: 0 }}>No users found.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>Joined</th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const userApp = applications.find((a) => a.user_id === user.id);

                    return (
                      <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: '600' }}>{user.name}</div>
                          {userApp && userApp.status === 'PENDING' && (
                            <span
                              style={smallPendingBadgeStyle}
                              onClick={() => {
                                setActiveTab('applications');
                                setSearch(user.email);
                              }}
                              title="Click to view seller application"
                            >
                              ⏳ App Pending
                            </span>
                          )}
                        </td>
                        <td style={{ ...tdStyle, color: '#6b7280' }}>{user.email}</td>
                        <td style={tdStyle}>
                          <span
                            style={{
                              backgroundColor: (ROLE_COLORS[user.role] || '#374151') + '18',
                              color: ROLE_COLORS[user.role] || '#374151',
                              padding: '2px 10px',
                              borderRadius: '999px',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, color: '#9ca3af' }}>
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td style={tdStyle}>
                          {/* Toggle for STUDENT ↔ SELLER */}
                          {(user.role === 'STUDENT' || user.role === 'SELLER') && (
                            <button
                              style={btnStyle(user.role === 'STUDENT' ? '#059669' : '#dc2626')}
                              disabled={updatingId === user.id}
                              onClick={() => handleToggleRole(user)}
                            >
                              {updatingId === user.id
                                ? '…'
                                : user.role === 'STUDENT'
                                ? 'Make Seller'
                                : 'Revoke Seller'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────
const headingStyle: React.CSSProperties = {
  color: '#111827', fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0', letterSpacing: '-0.02em',
};
const subStyle: React.CSSProperties = {
  color: '#6b7280', fontSize: '14px', margin: 0,
};
const refreshBtnStyle: React.CSSProperties = {
  padding: '8px 14px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb',
  borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#374151',
  cursor: 'pointer',
};
const tabContainerStyle: React.CSSProperties = {
  display: 'flex', gap: '8px', borderBottom: '1px solid #e5e7eb',
  marginBottom: '16px', paddingBottom: '2px',
};
const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
  padding: '10px 18px', background: 'transparent', border: 'none',
  borderBottom: isActive ? '2px solid #111827' : '2px solid transparent',
  color: isActive ? '#111827' : '#6b7280',
  fontWeight: isActive ? '700' : '500', fontSize: '14px',
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
});
const pendingBadgeStyle: React.CSSProperties = {
  backgroundColor: '#f59e0b', color: '#ffffff',
  fontSize: '11px', fontWeight: '700', padding: '2px 8px',
  borderRadius: '999px',
};
const searchStyle: React.CSSProperties = {
  flex: 1, padding: '10px 14px', border: '1px solid #e5e7eb',
  borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box',
  outline: 'none',
};
const selectStyle: React.CSSProperties = {
  padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '8px',
  fontSize: '13px', color: '#374151', backgroundColor: '#ffffff', cursor: 'pointer',
};
const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff', border: '1px solid #e5e7eb',
  borderRadius: '12px', padding: '24px', overflowX: 'auto',
  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
};
const appCardStyle = (isPending: boolean): React.CSSProperties => ({
  backgroundColor: '#ffffff',
  border: isPending ? '1.5px solid #fde68a' : '1px solid #e5e7eb',
  borderRadius: '12px', padding: '20px 24px',
  boxShadow: isPending ? '0 4px 12px rgba(245, 158, 11, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
});
const appCardHeaderStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  gap: '16px', marginBottom: '14px', flexWrap: 'wrap',
};
const shopNameStyle: React.CSSProperties = {
  fontSize: '17px', fontWeight: '700', color: '#111827',
};
const statusBadgeStyle: React.CSSProperties = {
  fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px',
};
const applicantSubStyle: React.CSSProperties = {
  fontSize: '13px', color: '#4b5563', marginTop: '4px',
};
const appDetailsBoxStyle: React.CSSProperties = {
  backgroundColor: '#f9fafb', border: '1px solid #e5e7eb',
  borderRadius: '8px', padding: '14px 16px', display: 'flex',
  gap: '16px', fontSize: '13px',
};
const detailLabelStyle: React.CSSProperties = {
  fontSize: '11px', fontWeight: '700', color: '#6b7280', letterSpacing: '0.04em',
};
const detailTextStyle: React.CSSProperties = {
  margin: '4px 0 0 0', color: '#374151', lineHeight: '1.4',
};
const adminNoteStyle: React.CSSProperties = {
  marginTop: '10px', fontSize: '12px', color: '#b91c1c',
  backgroundColor: '#fef2f2', padding: '8px 12px', borderRadius: '6px',
};
const emptyCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff', border: '1px solid #e5e7eb',
  borderRadius: '12px', padding: '48px 24px', textAlign: 'center',
};
const approveBtnStyle: React.CSSProperties = {
  padding: '7px 14px', fontSize: '12px', fontWeight: '700',
  color: '#ffffff', backgroundColor: '#059669', border: 'none',
  borderRadius: '6px', cursor: 'pointer',
};
const rejectBtnStyle: React.CSSProperties = {
  padding: '7px 14px', fontSize: '12px', fontWeight: '600',
  color: '#dc2626', backgroundColor: '#fee2e2', border: '1px solid #fecaca',
  borderRadius: '6px', cursor: 'pointer',
};
const revokeBtnStyle: React.CSSProperties = {
  padding: '6px 12px', fontSize: '12px', fontWeight: '600',
  color: '#6b7280', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb',
  borderRadius: '6px', cursor: 'pointer',
};
const smallPendingBadgeStyle: React.CSSProperties = {
  display: 'inline-block', backgroundColor: '#fef3c7', color: '#92400e',
  fontSize: '10px', fontWeight: '700', padding: '1px 6px', borderRadius: '4px',
  marginTop: '3px', cursor: 'pointer',
};
const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '10px 12px', color: '#6b7280',
  fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em',
};
const tdStyle: React.CSSProperties = { padding: '12px', fontSize: '14px', color: '#111827' };
const btnStyle = (color: string): React.CSSProperties => ({
  padding: '5px 12px', fontSize: '12px', fontWeight: '600',
  color: '#fff', backgroundColor: color, border: 'none',
  borderRadius: '6px', cursor: 'pointer',
});

export default AdminUsersPage;
