// ============================================================
// LAVSA — Seller Payouts & Earnings Page
// Track sales earnings, manage UPI payout settings, view settlements.
// Redesigned with the LAVSA design system (global.css + UI kit).
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
import { Button, Card, Badge, PageHeader, PageLoader } from '../../components/UI/ui';
import {
  IconArrowLeft,
  IconAlertTriangle,
} from '../../components/UI/Icons';
import { formatPrice, formatDate } from '../../utils/format';

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
      <div className="page seller-payouts-page" style={{ maxWidth: 1000, margin: '0 auto' }}>
        <PageHeader
          title="Earnings & Payouts"
          subtitle="Track sales earnings and configure your campus UPI settlement destination"
          icon="wallet"
          actions={
            <Link to="/seller/dashboard" className="btn btn-secondary btn-sm">
              <IconArrowLeft size={14} /> Back to Hub
            </Link>
          }
        />

        {/* Missing UPI Notice */}
        {!loading && (!profile || !profile.upi_id) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--warning-soft)',
              border: '1px solid var(--warning-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 18px',
              marginBottom: 20,
              fontSize: 13,
              color: 'var(--warning-strong)',
            }}
          >
            <IconAlertTriangle size={20} color="var(--warning-strong)" style={{ flexShrink: 0 }} />
            <div>
              <strong>Action Required: Add your UPI ID below.</strong>
              <div style={{ fontSize: 12, marginTop: 2, opacity: 0.9 }}>
                When buyers pay online for your items, platform earnings will be transferred directly to this UPI address.
              </div>
            </div>
          </div>
        )}

        {/* Earnings Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
          <Card padded>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Total Net Earnings
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--success-strong)', marginTop: 6 }}>
              {formatPrice(earnings?.totalNet ?? 0)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              After 2% platform transaction fee
            </div>
          </Card>

          <Card padded>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Pending Payout
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: (earnings?.pendingPayout || 0) > 0 ? 'var(--warning-strong)' : 'var(--ink)',
                marginTop: 6,
              }}
            >
              {formatPrice(earnings?.pendingPayout ?? 0)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              {earnings?.pendingCount || 0} order(s) awaiting transfer
            </div>
          </Card>

          <Card padded>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Settled Payouts
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--brand)', marginTop: 6 }}>
              {formatPrice(earnings?.completedPayout ?? 0)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              {earnings?.completedCount || 0} transfer(s) settled
            </div>
          </Card>

          <Card padded>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Platform Fee (2%)
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-secondary)', marginTop: 6 }}>
              {formatPrice(earnings?.totalCommission ?? 0)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              Escrow hosting &amp; gateway support
            </div>
          </Card>
        </div>

        {/* Two-Column Form & Explainer */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
          {/* UPI Settings Form */}
          <Card padded>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--ink)' }}>
              Your UPI Payout Destination
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              Enter your active UPI ID (Google Pay, PhonePe, Paytm, or BHIM). Once you verify delivery with the buyer's OTP, net earnings (98%) are queued for settlement here.
            </p>

            {saveSuccess && (
              <div style={{ background: 'var(--success-soft)', border: '1px solid var(--success-border)', color: 'var(--success-strong)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: 13, marginBottom: 14 }}>
                ✓ {saveSuccess}
              </div>
            )}
            {saveError && (
              <div style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger-border)', color: 'var(--danger-strong)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: 13, marginBottom: 14 }}>
                ⚠️ {saveError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label" style={{ marginBottom: 4 }}>
                  UPI ID (VPA) <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210@paytm or student@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="input"
                  id="seller-upi-input"
                />
              </div>

              <div>
                <label className="label" style={{ marginBottom: 4 }}>
                  Account Holder Name <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full name as shown in banking app"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  className="input"
                  id="seller-holder-name-input"
                />
              </div>

              <div>
                <label className="label" style={{ marginBottom: 4 }}>
                  Contact Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={savingProfile}
                id="save-payout-profile-btn"
              >
                Save Payout Details
              </Button>
            </form>
          </Card>

          {/* How Payouts Work */}
          <Card padded style={{ background: 'var(--surface-soft)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 14px 0', color: 'var(--ink)' }}>
              How Campus Payouts Work
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <div>
                <strong style={{ color: 'var(--ink)' }}>1. Buyer Pays Online:</strong> When a buyer pays via Razorpay, funds are held securely in platform escrow.
              </div>
              <div>
                <strong style={{ color: 'var(--ink)' }}>2. Physical Meetup &amp; OTP Verification:</strong> You and the buyer meet on campus. Once you enter their 6-digit delivery OTP, the order completes.
              </div>
              <div>
                <strong style={{ color: 'var(--ink)' }}>3. Automatic Net Calculation:</strong> A 2% platform fee is deducted, and 98% is immediately queued for transfer to your UPI ID.
              </div>
              <div>
                <strong style={{ color: 'var(--ink)' }}>4. Direct UPI Transfer:</strong> The campus administrator transfers the net amount to your UPI and records the UTR reference number.
              </div>
            </div>
          </Card>
        </div>

        {/* Payout History Table */}
        <Card padded>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
              Payout History
            </h2>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {payouts.length} total payout record(s)
            </span>
          </div>

          {loading ? (
            <PageLoader label="Loading payout records..." />
          ) : payouts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>No online payout records yet</div>
              <p style={{ margin: '4px 0 0', fontSize: 12 }}>
                Once buyers purchase with online payment and you confirm OTP delivery, records will appear here.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 8px' }}>Date</th>
                    <th style={{ padding: '10px 8px' }}>Order ID</th>
                    <th style={{ padding: '10px 8px' }}>Gross</th>
                    <th style={{ padding: '10px 8px' }}>Fee (2%)</th>
                    <th style={{ padding: '10px 8px' }}>Net Payout</th>
                    <th style={{ padding: '10px 8px' }}>UPI ID</th>
                    <th style={{ padding: '10px 8px' }}>Status</th>
                    <th style={{ padding: '10px 8px' }}>Transfer UTR</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>
                        {formatDate(p.created_at)}
                      </td>
                      <td style={{ padding: '12px 8px', fontFamily: 'monospace', color: 'var(--ink)' }}>
                        #{p.order_id.slice(0, 8).toUpperCase()}
                      </td>
                      <td style={{ padding: '12px 8px', fontWeight: 500 }}>
                        {formatPrice(Number(p.order_amount))}
                      </td>
                      <td style={{ padding: '12px 8px', color: 'var(--danger)' }}>
                        -{formatPrice(Number(p.commission_amount))}
                      </td>
                      <td style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--success-strong)' }}>
                        {formatPrice(Number(p.net_payout_amount))}
                      </td>
                      <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>
                        {p.seller_upi_id === 'NOT_SET' ? (
                          <Badge color="amber">Not Set</Badge>
                        ) : (
                          p.seller_upi_id
                        )}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        {p.status === 'PAID' ? (
                          <Badge color="green" icon="check">Paid</Badge>
                        ) : p.status === 'PENDING' ? (
                          <Badge color="amber" icon="clock">Pending</Badge>
                        ) : (
                          <Badge color="gray">{p.status}</Badge>
                        )}
                      </td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>
                        {p.transaction_reference ? (
                          <span style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--surface-muted)', padding: '2px 6px', borderRadius: 4 }}>
                            {p.transaction_reference}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-faint)' }}>Awaiting transfer</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default SellerPayoutsPage;
