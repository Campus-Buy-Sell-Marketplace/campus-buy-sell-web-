// ============================================================
// LAVSA — Admin Payouts Management Page
// ============================================================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import AppLayout from '../../components/Layout/AppLayout';
import {
  fetchPayouts,
  markPayoutAsPaid,
  fetchStats,
  AdminPayout,
  AdminStats,
} from '../../services/adminService';

const AdminPayoutsPage: React.FC = () => {
  const [payouts, setPayouts] = useState<AdminPayout[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'PAID'>('PENDING');

  // Modal State for marking payout as paid
  const [selectedPayout, setSelectedPayout] = useState<AdminPayout | null>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, payoutsData] = await Promise.all([
        fetchStats(),
        fetchPayouts(filter),
      ]);
      setStats(statsData);
      setPayouts(payoutsData);
    } catch (err) {
      console.error('Failed to load admin payouts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleCopyUpi = (upiId: string, id: string) => {
    navigator.clipboard.writeText(upiId);
    setCopySuccess(id);
    setTimeout(() => setCopySuccess(null), 2500);
  };

  const openMarkPaidModal = (p: AdminPayout) => {
    setSelectedPayout(p);
    setUtrNumber('');
    setAdminNotes('');
    setModalError('');
  };

  const handleConfirmPaid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayout) return;
    if (!utrNumber.trim()) {
      setModalError('Please enter the UPI UTR or bank transaction reference number.');
      return;
    }

    setSubmitting(true);
    setModalError('');

    try {
      await markPayoutAsPaid(selectedPayout.id, utrNumber, adminNotes);
      setSelectedPayout(null);
      await loadData();
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Failed to mark payout as paid.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: '1050px', margin: '0 auto', fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={headingStyle}>Seller Payouts Management</h1>
            <p style={subStyle}>Review completed orders, transfer net funds via UPI, and mark payouts as settled</p>
          </div>
          <Link to="/admin/dashboard" style={secondaryLinkStyle}>
            ← Back to Dashboard
          </Link>
        </div>

        {/* Stats Grid */}
        <div style={gridStyle}>
          <div style={statCardStyle}>
            <div style={labelStyle}>Pending Transfers</div>
            <div style={{ ...valueStyle, color: (stats?.pendingPayoutsAmount || 0) > 0 ? '#d97706' : '#111827' }}>
              ₹{stats ? Number(stats.pendingPayoutsAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
            </div>
            <div style={subLabelStyle}>{stats?.pendingPayoutsCount || 0} seller(s) awaiting transfer</div>
          </div>

          <div style={statCardStyle}>
            <div style={labelStyle}>Platform 2% Fee Kept</div>
            <div style={{ ...valueStyle, color: '#059669' }}>
              ₹{stats ? Number(stats.platformCommissionEarned || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
            </div>
            <div style={subLabelStyle}>Net marketplace earnings</div>
          </div>

          <div style={statCardStyle}>
            <div style={labelStyle}>Total Users</div>
            <div style={{ ...valueStyle, color: '#2563eb' }}>
              {stats?.totalUsers || 0}
            </div>
            <div style={subLabelStyle}>{stats?.totalSellers || 0} approved sellers</div>
          </div>
        </div>

        {/* Payouts Table Card */}
        <div style={cardStyle}>
          {/* Filter Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={filter === 'PENDING' ? activeTabStyle : tabStyle}
                onClick={() => setFilter('PENDING')}
              >
                ⏳ Pending Payouts ({stats?.pendingPayoutsCount || 0})
              </button>
              <button
                style={filter === 'PAID' ? activeTabStyle : tabStyle}
                onClick={() => setFilter('PAID')}
              >
                ✓ Settled History
              </button>
              <button
                style={filter === 'ALL' ? activeTabStyle : tabStyle}
                onClick={() => setFilter('ALL')}
              >
                All Records
              </button>
            </div>

            <button
              style={refreshBtnStyle}
              onClick={loadData}
              title="Refresh payouts list"
            >
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading payouts...</p>
          ) : payouts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
              <span style={{ fontSize: '36px' }}>🎉</span>
              <p style={{ margin: '8px 0 0 0', fontSize: '15px', fontWeight: '600', color: '#374151' }}>
                {filter === 'PENDING' ? 'No pending payouts right now!' : 'No records found.'}
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                All completed orders have been settled to sellers.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f3f4f6', color: '#6b7280' }}>
                    <th style={{ padding: '12px 10px' }}>Order & Date</th>
                    <th style={{ padding: '12px 10px' }}>Seller</th>
                    <th style={{ padding: '12px 10px' }}>Seller UPI (VPA)</th>
                    <th style={{ padding: '12px 10px' }}>Sale Amount</th>
                    <th style={{ padding: '12px 10px' }}>2% Fee</th>
                    <th style={{ padding: '12px 10px' }}>Net Payable</th>
                    <th style={{ padding: '12px 10px' }}>Status</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '14px 10px' }}>
                        <div style={{ fontWeight: '600', color: '#111827', fontFamily: 'monospace' }}>
                          #{p.order_id.slice(0, 8)}
                        </div>
                        <div style={{ color: '#9ca3af', fontSize: '11px', marginTop: '2px' }}>
                          {new Date(p.created_at).toLocaleDateString()}
                        </div>
                      </td>

                      <td style={{ padding: '14px 10px' }}>
                        <div style={{ fontWeight: '600', color: '#111827' }}>{p.seller_name}</div>
                        <div style={{ color: '#6b7280', fontSize: '11px' }}>{p.seller_email}</div>
                      </td>

                      <td style={{ padding: '14px 10px' }}>
                        {p.seller_upi_id === 'NOT_SET' ? (
                          <span style={{ color: '#dc2626', fontWeight: '700', fontSize: '12px' }}>
                            ⚠️ UPI Not Added Yet
                          </span>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: '600', background: '#f3f4f6', padding: '3px 7px', borderRadius: '4px' }}>
                              {p.seller_upi_id}
                            </span>
                            <button
                              onClick={() => handleCopyUpi(p.seller_upi_id, p.id)}
                              style={copyBtnStyle}
                              title="Copy UPI ID"
                            >
                              {copySuccess === p.id ? '✓ Copied' : 'Copy'}
                            </button>
                          </div>
                        )}
                        {p.account_holder_name && (
                          <div style={{ color: '#6b7280', fontSize: '11px', marginTop: '2px' }}>
                            Name: {p.account_holder_name}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '14px 10px', fontWeight: '500' }}>
                        ₹{Number(p.order_amount).toFixed(2)}
                      </td>

                      <td style={{ padding: '14px 10px', color: '#059669', fontWeight: '600' }}>
                        ₹{Number(p.commission_amount).toFixed(2)}
                      </td>

                      <td style={{ padding: '14px 10px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '800', color: '#111827' }}>
                          ₹{Number(p.net_payout_amount).toFixed(2)}
                        </span>
                      </td>

                      <td style={{ padding: '14px 10px' }}>
                        {p.status === 'PAID' ? (
                          <div>
                            <span style={paidBadgeStyle}>✓ Paid</span>
                            {p.transaction_reference && (
                              <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                                Ref: {p.transaction_reference}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={pendingBadgeStyle}>⏳ Pending</span>
                        )}
                      </td>

                      <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                        {p.status === 'PENDING' ? (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            {p.seller_upi_id !== 'NOT_SET' ? (
                              <button
                                onClick={() => openMarkPaidModal(p)}
                                style={scanPayBtnStyle}
                                title="Show UPI QR Code to scan with Google Pay, PhonePe, or Paytm"
                              >
                                📸 Scan & Pay (₹{Number(p.net_payout_amount).toFixed(0)})
                              </button>
                            ) : (
                              <button
                                onClick={() => openMarkPaidModal(p)}
                                style={markPaidBtnStyle}
                              >
                                ✓ Mark Paid
                              </button>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#059669', fontSize: '12px', fontWeight: '600' }}>
                            Settled on {p.paid_at ? new Date(p.paid_at).toLocaleDateString() : '—'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: UPI QR Code & Mark as Paid */}
        {selectedPayout && (
          <div style={modalOverlayStyle}>
            <div style={{ ...modalCardStyle, maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#111827' }}>
                  Pay Seller via UPI
                </h3>
                <button
                  onClick={() => setSelectedPayout(null)}
                  style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9ca3af' }}
                >
                  ✕
                </button>
              </div>

              {/* Dynamic QR Code Section */}
              {selectedPayout.seller_upi_id !== 'NOT_SET' ? (
                <div style={qrContainerStyle}>
                  <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Scan with any UPI App
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                      Google Pay • PhonePe • Paytm • BHIM • Cred
                    </div>
                  </div>

                  <div style={qrBoxStyle}>
                    <QRCodeSVG
                      value={`upi://pay?pa=${selectedPayout.seller_upi_id}&pn=${encodeURIComponent(selectedPayout.account_holder_name || selectedPayout.seller_name)}&am=${Number(selectedPayout.net_payout_amount).toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Campus Order ${selectedPayout.order_id.slice(0, 8)} Payout`)}`}
                      size={180}
                      level="M"
                      includeMargin={true}
                    />
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#111827' }}>
                      ₹{Number(selectedPayout.net_payout_amount).toFixed(2)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                      Exact amount and payee will auto-fill on your phone!
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontWeight: '600' }}>
                      {selectedPayout.seller_upi_id}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyUpi(selectedPayout.seller_upi_id, 'modal')}
                      style={copyBtnStyle}
                    >
                      {copySuccess === 'modal' ? '✓ Copied' : 'Copy UPI'}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={warningBannerStyle}>
                  <strong>⚠️ Seller has not added a UPI ID yet.</strong>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>
                    Please ask {selectedPayout.seller_name} to enter their UPI ID in their Seller Dashboard under 'Earnings & UPI'.
                  </div>
                </div>
              )}

              <div style={modalDetailBoxStyle}>
                <div><strong>Seller:</strong> {selectedPayout.seller_name} ({selectedPayout.seller_email})</div>
                <div><strong>Order:</strong> #{selectedPayout.order_id.slice(0, 8)}</div>
                <div>
                  <strong>Gross Sale:</strong> ₹{Number(selectedPayout.order_amount).toFixed(2)} | 
                  <strong> 2% Fee Kept:</strong> ₹{Number(selectedPayout.commission_amount).toFixed(2)}
                </div>
              </div>

              {modalError && <div style={errorAlertStyle}>{modalError}</div>}

              {/* Step 2 Form: Confirm Payment */}
              <form onSubmit={handleConfirmPaid} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={formLabelStyle}>
                    Step 2: Enter UPI Transaction ID / UTR Number <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 523829104829 from your GPay/PhonePe receipt"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    style={inputStyle}
                  />
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                    Enter the 12-digit reference number shown on your UPI app after scanning and paying.
                  </div>
                </div>

                <div>
                  <label style={formLabelStyle}>Admin Notes (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Paid via GPay QR scan"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedPayout(null)}
                    style={secondaryBtnStyle}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={primaryBtnStyle}
                  >
                    {submitting ? 'Recording...' : '✓ Confirm & Mark as Paid'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

// Styles
const headingStyle: React.CSSProperties = { color: '#111827', fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0', letterSpacing: '-0.02em' };
const subStyle: React.CSSProperties     = { color: '#6b7280', fontSize: '14px', margin: '0' };
const secondaryLinkStyle: React.CSSProperties = { color: '#374151', textDecoration: 'none', fontSize: '13px', fontWeight: '600', padding: '8px 14px', border: '1px solid #d1d5db', borderRadius: '8px', background: '#fff' };
const gridStyle: React.CSSProperties    = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' };
const statCardStyle: React.CSSProperties = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' };
const labelStyle: React.CSSProperties   = { color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' };
const valueStyle: React.CSSProperties   = { fontSize: '26px', fontWeight: '800', marginTop: '6px' };
const subLabelStyle: React.CSSProperties = { color: '#9ca3af', fontSize: '11px', marginTop: '4px' };
const cardStyle: React.CSSProperties    = { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' };
const tabStyle: React.CSSProperties     = { padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', fontSize: '13px', fontWeight: '600', color: '#6b7280', cursor: 'pointer' };
const activeTabStyle: React.CSSProperties = { padding: '8px 14px', border: '1px solid #111827', borderRadius: '8px', background: '#111827', fontSize: '13px', fontWeight: '600', color: '#fff', cursor: 'pointer' };
const refreshBtnStyle: React.CSSProperties = { padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', fontSize: '12px', fontWeight: '600', color: '#374151', cursor: 'pointer' };
const copyBtnStyle: React.CSSProperties = { padding: '3px 8px', border: '1px solid #d1d5db', borderRadius: '4px', background: '#fff', fontSize: '11px', fontWeight: '600', color: '#374151', cursor: 'pointer' };
const scanPayBtnStyle: React.CSSProperties = { padding: '8px 14px', backgroundColor: '#059669', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', boxShadow: '0 1px 2px rgba(5, 150, 105, 0.2)' };
const markPaidBtnStyle: React.CSSProperties = { padding: '8px 14px', backgroundColor: '#111827', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' };
const paidBadgeStyle: React.CSSProperties = { backgroundColor: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' };
const pendingBadgeStyle: React.CSSProperties = { backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' };
const modalCardStyle: React.CSSProperties = { backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' };
const modalDetailBoxStyle: React.CSSProperties = { backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' };
const qrContainerStyle: React.CSSProperties = { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' };
const qrBoxStyle: React.CSSProperties = { backgroundColor: '#ffffff', padding: '12px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'inline-block' };
const warningBannerStyle: React.CSSProperties = { backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '12px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px' };
const formLabelStyle: React.CSSProperties = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' };
const inputStyle: React.CSSProperties   = { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' };
const primaryBtnStyle: React.CSSProperties = { padding: '10px 18px', backgroundColor: '#111827', color: '#ffffff', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer' };
const secondaryBtnStyle: React.CSSProperties = { padding: '10px 18px', backgroundColor: '#ffffff', color: '#374151', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px', fontWeight: '600', cursor: 'pointer' };
const errorAlertStyle: React.CSSProperties = { backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px' };

export default AdminPayoutsPage;
