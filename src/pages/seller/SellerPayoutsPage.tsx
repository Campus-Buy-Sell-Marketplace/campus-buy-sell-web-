// ============================================================
// LAVSA — Seller Payouts & Earnings Page
// ============================================================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import {
  getPayoutProfile,
  savePayoutProfile,
  getSellerEarnings,
  getSellerPayouts,
  SellerPayoutProfile,
  SellerEarnings,
  SellerPayoutRecord,
} from '../../services/sellerPayoutService';

const SellerPayoutsPage: React.FC = () => {
  const [profile, setProfile] = useState<SellerPayoutProfile | null>(null);
  const [earnings, setEarnings] = useState<SellerEarnings | null>(null);
  const [payouts, setPayouts] = useState<SellerPayoutRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Form state
  const [upiId, setUpiId] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [profData, earnData, payData] = await Promise.all([
        getPayoutProfile(),
        getSellerEarnings(),
        getSellerPayouts(),
      ]);

      setProfile(profData);
      if (profData) {
        setUpiId(profData.upi_id || '');
        setAccountHolderName(profData.account_holder_name || '');
        setPhoneNumber(profData.phone_number || '');
        setBankName(profData.bank_name || '');
        setBankAccountNumber(profData.bank_account_number || '');
        setBankIfsc(profData.bank_ifsc || '');
      }
      setEarnings(earnData);
      setPayouts(payData);
    } catch (err) {
      console.error('Failed to load seller payout data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess('');
    setSavingProfile(true);

    try {
      const updated = await savePayoutProfile({
        upiId,
        accountHolderName,
        phoneNumber,
        bankName,
        bankAccountNumber,
        bankIfsc,
      });
      setProfile(updated);
      setSaveSuccess('UPI payout details saved successfully! Future payouts will be sent to this ID.');
      // Refresh payouts list to reflect updated UPI
      const refreshedPayouts = await getSellerPayouts();
      setPayouts(refreshedPayouts);
    } catch (err: any) {
      setSaveError(err.response?.data?.message || 'Failed to save payout profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={headingStyle}>Earnings & Payouts</h1>
            <p style={subStyle}>Track your sales earnings and manage your UPI payout settings</p>
          </div>
          <Link to="/seller/dashboard" style={secondaryLinkStyle}>
            ← Back to Dashboard
          </Link>
        </div>

        {/* Missing UPI Notice */}
        {!loading && (!profile || !profile.upi_id) && (
          <div style={warningBannerStyle}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div>
              <strong>Action Required: Add your UPI ID below.</strong>
              <div style={{ fontSize: '13px', marginTop: '2px', opacity: 0.9 }}>
                When buyers complete orders with online payment, the campus admin will transfer your earnings to this UPI ID.
              </div>
            </div>
          </div>
        )}

        {/* Earnings Stats Grid */}
        <div style={gridStyle}>
          <div style={statCardStyle}>
            <div style={labelStyle}>Total Net Earnings</div>
            <div style={{ ...valueStyle, color: '#059669' }}>
              ₹{earnings ? earnings.totalNet.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
            </div>
            <div style={subLabelStyle}>After 2% platform fee</div>
          </div>

          <div style={statCardStyle}>
            <div style={labelStyle}>Pending Payout</div>
            <div style={{ ...valueStyle, color: (earnings?.pendingPayout || 0) > 0 ? '#d97706' : '#111827' }}>
              ₹{earnings ? earnings.pendingPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
            </div>
            <div style={subLabelStyle}>{earnings?.pendingCount || 0} order(s) awaiting transfer</div>
          </div>

          <div style={statCardStyle}>
            <div style={labelStyle}>Paid Out to UPI</div>
            <div style={{ ...valueStyle, color: '#2563eb' }}>
              ₹{earnings ? earnings.completedPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
            </div>
            <div style={subLabelStyle}>{earnings?.completedCount || 0} transfer(s) settled</div>
          </div>

          <div style={statCardStyle}>
            <div style={labelStyle}>Platform Fee (2%)</div>
            <div style={{ ...valueStyle, color: '#6b7280' }}>
              ₹{earnings ? earnings.totalCommission.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
            </div>
            <div style={subLabelStyle}>Gateway & maintenance</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {/* UPI Payout Settings Form */}
          <div style={cardStyle}>
            <h2 style={cardHeadingStyle}>💳 Your UPI Payout Settings</h2>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 16px 0', lineHeight: '1.4' }}>
              Provide your active UPI ID (Google Pay, PhonePe, Paytm, or BHIM). When a buyer verifies delivery OTP, your net earnings (98%) are scheduled for payout here.
            </p>

            {saveSuccess && <div style={successAlertStyle}>{saveSuccess}</div>}
            {saveError && <div style={errorAlertStyle}>{saveError}</div>}

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={formLabelStyle}>
                  UPI ID (VPA) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210@paytm or student@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  style={inputStyle}
                  id="seller-upi-input"
                />
              </div>

              <div>
                <label style={formLabelStyle}>
                  Account Holder Name <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full name as shown in banking app"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  style={inputStyle}
                  id="seller-holder-name-input"
                />
              </div>

              <div>
                <label style={formLabelStyle}>Contact Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                style={primaryBtnStyle}
                id="save-payout-profile-btn"
              >
                {savingProfile ? 'Saving...' : 'Save Payout Details'}
              </button>
            </form>
          </div>

          {/* How Payouts Work Card */}
          <div style={{ ...cardStyle, backgroundColor: '#f9fafb' }}>
            <h2 style={cardHeadingStyle}>ℹ️ How Payouts Work</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>
              <div>
                <strong>1. Buyer Pays Online:</strong> When a buyer pays via Razorpay, funds are held securely in platform escrow.
              </div>
              <div>
                <strong>2. Physical Meetup & OTP Verification:</strong> You and the buyer meet on campus. Once you verify their 6-digit delivery OTP, the order is completed.
              </div>
              <div>
                <strong>3. Automatic Net Calculation:</strong> A 2% platform transaction fee is deducted, and 98% is immediately queued for transfer to your UPI ID.
              </div>
              <div>
                <strong>4. Direct UPI Transfer:</strong> The campus administrator transfers the net amount directly to your Google Pay/PhonePe/Paytm and logs the UTR reference number.
              </div>
            </div>
          </div>
        </div>

        {/* Payout History Table */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={cardHeadingStyle}>📋 Payout History</h2>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              {payouts.length} total payout record(s)
            </span>
          </div>

          {loading ? (
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading payout records...</p>
          ) : payouts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af' }}>
              <span style={{ fontSize: '32px' }}>💸</span>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>No completed orders with online payments yet.</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>Once buyers pay online and you verify OTP delivery, payouts will appear here.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f3f4f6', color: '#6b7280' }}>
                    <th style={{ padding: '10px 8px' }}>Date</th>
                    <th style={{ padding: '10px 8px' }}>Order ID</th>
                    <th style={{ padding: '10px 8px' }}>Sale Gross</th>
                    <th style={{ padding: '10px 8px' }}>Fee (2%)</th>
                    <th style={{ padding: '10px 8px' }}>Net Payout</th>
                    <th style={{ padding: '10px 8px' }}>UPI ID</th>
                    <th style={{ padding: '10px 8px' }}>Status</th>
                    <th style={{ padding: '10px 8px' }}>Transfer UTR</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 8px', color: '#6b7280' }}>
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 8px', fontFamily: 'monospace', color: '#111827' }}>
                        #{p.order_id.slice(0, 8)}
                      </td>
                      <td style={{ padding: '12px 8px', fontWeight: '500' }}>
                        ₹{Number(p.order_amount).toFixed(2)}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#ef4444' }}>
                        -₹{Number(p.commission_amount).toFixed(2)}
                      </td>
                      <td style={{ padding: '12px 8px', fontWeight: '700', color: '#059669' }}>
                        ₹{Number(p.net_payout_amount).toFixed(2)}
                      </td>
                      <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>
                        {p.seller_upi_id === 'NOT_SET' ? (
                          <span style={{ color: '#d97706', fontWeight: '600' }}>⚠️ Not Set</span>
                        ) : (
                          p.seller_upi_id
                        )}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        {p.status === 'PAID' ? (
                          <span style={paidBadgeStyle}>✓ Paid</span>
                        ) : p.status === 'PENDING' ? (
                          <span style={pendingBadgeStyle}>⏳ Pending</span>
                        ) : (
                          <span style={{ color: '#6b7280' }}>{p.status}</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#374151' }}>
                        {p.transaction_reference ? (
                          <span style={{ fontFamily: 'monospace', fontSize: '12px', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>
                            {p.transaction_reference}
                          </span>
                        ) : (
                          <span style={{ color: '#9ca3af' }}>Awaiting transfer</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
const cardHeadingStyle: React.CSSProperties = { color: '#111827', fontSize: '16px', fontWeight: '700', margin: '0 0 8px 0' };
const formLabelStyle: React.CSSProperties = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' };
const inputStyle: React.CSSProperties   = { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' };
const primaryBtnStyle: React.CSSProperties = { padding: '12px 18px', backgroundColor: '#111827', color: '#ffffff', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' };
const warningBannerStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '14px 18px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' };
const successAlertStyle: React.CSSProperties = { backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px' };
const errorAlertStyle: React.CSSProperties = { backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px' };
const paidBadgeStyle: React.CSSProperties = { backgroundColor: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' };
const pendingBadgeStyle: React.CSSProperties = { backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' };

export default SellerPayoutsPage;
