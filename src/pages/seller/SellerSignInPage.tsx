// ============================================================
// LAVSA — Seller Sign-In Page (Seller Portal entry)
// Accessible from Settings → Start Selling.
// Once signed in, the seller submits their application for
// admin approval before they can upload products.
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME } from '../../config/appConfig';
import api from '../../services/api';
import { Badge, Button } from '../../components/UI/ui';
import {
  IconArrowLeft,
  IconLock,
  IconEye,
  IconEyeOff,
  IconShield,
  IconStore,
  IconTag,
  IconPhone,
  IconClock,
  IconCheckCircle,
  IconXCircle,
  IconAlertTriangle,
  IconWallet,
  IconTrendingUp,
  IconMessageCircle,
} from '../../components/UI/Icons';

type Step = 'verify' | 'apply' | 'pending' | 'approved';

interface ApplicationStatus {
  hasApplied: boolean;
  application?: {
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    business_name: string;
    admin_notes?: string;
  };
}

const SellerSignInPage: React.FC = () => {
  const { user, isSeller, login, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('verify');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Seller application form
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const [appStatus, setAppStatus] = useState<ApplicationStatus | null>(null);

  // Check current status
  useEffect(() => {
    if (isSeller) {
      setStep('approved');
      return;
    }
    const checkStatus = async () => {
      try {
        const { data } = await api.get<ApplicationStatus>('/seller/application-status');
        setAppStatus(data);
        if (data.hasApplied) {
          if (data.application?.status === 'APPROVED') {
            setStep('approved');
          } else if (data.application?.status === 'PENDING') {
            setStep('pending');
          } else {
            // REJECTED — let them re-apply
            setStep('apply');
          }
        }
      } catch {
        // Not logged in yet — step stays at 'verify'
      }
    };
    if (user) {
      checkStatus();
    }
  }, [user, isSeller]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;
    setError('');
    setIsLoading(true);
    try {
      await login(user.email, password);
      // After re-auth check application status
      const { data } = await api.get<ApplicationStatus>('/seller/application-status');
      setAppStatus(data);
      if (data.hasApplied && data.application?.status === 'PENDING') {
        setStep('pending');
      } else if (isSeller) {
        setStep('approved');
      } else {
        setStep('apply');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Incorrect password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await api.post('/seller/apply', { businessName, description, contactNumber });
      setStep('pending');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit application.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToDashboard = async () => {
    await refreshUser();
    navigate('/seller/dashboard');
  };

  // ── Benefits strip ────────────────────────────────────────────────────────
  const benefits = (
    <div className="ss-benefits">
      <div className="ss-benefit">
        <span className="ss-benefit-icon"><IconStore size={16} color="var(--brand)" strokeWidth={2} /></span>
        <span className="ss-benefit-text">Your own campus storefront</span>
      </div>
      <div className="ss-benefit">
        <span className="ss-benefit-icon"><IconWallet size={16} color="var(--brand)" strokeWidth={2} /></span>
        <span className="ss-benefit-text">Keep 100% of every sale</span>
      </div>
      <div className="ss-benefit">
        <span className="ss-benefit-icon"><IconTrendingUp size={16} color="var(--brand)" strokeWidth={2} /></span>
        <span className="ss-benefit-text">Reach buyers across campus</span>
      </div>
      <div className="ss-benefit">
        <span className="ss-benefit-icon"><IconMessageCircle size={16} color="var(--brand)" strokeWidth={2} /></span>
        <span className="ss-benefit-text">Chat directly with students</span>
      </div>
    </div>
  );

  return (
    <div className="ss-page">
      <div className="ss-card slide-up">
        {/* Back button */}
        <button onClick={() => navigate('/settings')} className="ss-back" id="seller-back-btn" type="button">
          <IconArrowLeft size={15} strokeWidth={2} /> Back to Settings
        </button>

        {/* Logo */}
        <div className="ss-logo-area">
          <div className="ss-logo-row">
            <span className="ss-logo-mark"><IconStore size={18} color="#ffffff" strokeWidth={1.8} /></span>
            <span className="ss-logo-name">{APP_NAME}</span>
            <Badge color="dark" icon="store">Seller Portal</Badge>
          </div>
          <p className="ss-logo-sub">Manage your campus storefront</p>
        </div>

        {/* ── Step: Verify identity ── */}
        {step === 'verify' && (
          <div className="fade-in">
            <h2 className="ss-step-title">Verify Your Identity</h2>
            <p className="ss-step-sub">
              Re-enter your password to access the seller portal as{' '}
              <strong>{user?.email}</strong>
            </p>

            {benefits}

            <form onSubmit={handleVerify} className="ss-form">
              <div className="ss-field">
                <label className="label" htmlFor="seller-password">Password</label>
                <div className="input-icon-wrap">
                  <span className="input-icon"><IconLock size={16} /></span>
                  <input
                    id="seller-password"
                    className="input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: 42 }}
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    className="ss-eye"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="ss-alert" role="alert">
                  <IconAlertTriangle size={15} color="var(--danger-strong)" strokeWidth={2} />
                  <span className="error-text">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="dark"
                size="lg"
                block
                loading={isLoading}
                disabled={isLoading}
                iconRight="arrow-right"
                id="seller-verify-btn"
                style={{ marginTop: 4 }}
              >
                {isLoading ? 'Verifying…' : 'Verify & Continue'}
              </Button>
            </form>

            <p className="ss-footnote">
              <IconShield size={13} color="var(--text-faint)" strokeWidth={2} /> This confirms it's really you before granting seller access.
            </p>
          </div>
        )}

        {/* ── Step: Apply as seller ── */}
        {step === 'apply' && (
          <div className="fade-in">
            <h2 className="ss-step-title">Apply to Become a Seller</h2>
            <p className="ss-step-sub">
              Fill in your shop details. An admin will review and approve your application.
            </p>

            {appStatus?.application?.status === 'REJECTED' && (
              <div className="ss-alert ss-alert-rejected" role="alert">
                <div className="ss-alert-head">
                  <IconXCircle size={15} color="var(--danger-strong)" strokeWidth={2} />
                  <span className="error-text" style={{ fontWeight: 600 }}>
                    Your previous application was rejected.
                  </span>
                  <Badge color="red">REJECTED</Badge>
                </div>
                {appStatus.application.admin_notes && (
                  <div className="ss-alert-note">Admin note: {appStatus.application.admin_notes}</div>
                )}
                <div className="ss-alert-note">You can apply again.</div>
              </div>
            )}

            {benefits}

            <form onSubmit={handleApply} className="ss-form">
              <div className="ss-field">
                <label className="label" htmlFor="business-name">Shop / Business Name</label>
                <div className="input-icon-wrap">
                  <span className="input-icon"><IconStore size={16} /></span>
                  <input
                    id="business-name"
                    className="input"
                    type="text"
                    placeholder="e.g. Rahul's Tech Store"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="ss-field">
                <label className="label" htmlFor="business-desc">What will you sell?</label>
                <div className="ss-textarea-wrap">
                  <textarea
                    id="business-desc"
                    className="textarea"
                    placeholder="Briefly describe what items you plan to sell on campus…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <span className="hint"><IconTag size={12} strokeWidth={2} /> Textbooks, gadgets, cycles, notes — anything campus-ready.</span>
              </div>

              <div className="ss-field">
                <label className="label" htmlFor="contact-number">Contact Number</label>
                <div className="input-icon-wrap">
                  <span className="input-icon"><IconPhone size={16} /></span>
                  <input
                    id="contact-number"
                    className="input"
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="ss-alert" role="alert">
                  <IconAlertTriangle size={15} color="var(--danger-strong)" strokeWidth={2} />
                  <span className="error-text">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="dark"
                size="lg"
                block
                loading={isLoading}
                disabled={isLoading}
                iconRight="arrow-right"
                id="seller-apply-btn"
                style={{ marginTop: 4 }}
              >
                {isLoading ? 'Submitting…' : 'Submit Application'}
              </Button>
            </form>
          </div>
        )}

        {/* ── Step: Pending ── */}
        {step === 'pending' && (
          <div className="ss-center fade-in">
            <span className="ss-status-icon ss-status-pending"><IconClock size={28} color="var(--warning-strong)" strokeWidth={2} /></span>
            <Badge color="amber" icon="clock">PENDING · Under Review</Badge>
            <h2 className="ss-step-title" style={{ marginTop: 12 }}>Application Under Review</h2>
            <p className="ss-step-sub">
              Your seller application for{' '}
              <strong>{appStatus?.application?.business_name || 'your shop'}</strong> has been
              submitted. An admin will review it and approve you shortly.
            </p>
            <div className="ss-pending-box">
              <div className="ss-pending-title">Status: Pending Review</div>
              <div className="ss-pending-text">
                You will get seller access once an admin approves your application.
              </div>
            </div>
            <Button
              variant="dark"
              size="lg"
              block
              icon="home"
              onClick={() => navigate('/home')}
              id="seller-go-home-btn"
              style={{ marginTop: 20 }}
            >
              Back to Home
            </Button>
          </div>
        )}

        {/* ── Step: Approved ── */}
        {step === 'approved' && (
          <div className="ss-center fade-in">
            <span className="ss-status-icon ss-status-approved"><IconCheckCircle size={28} color="var(--success-strong)" strokeWidth={2} /></span>
            <Badge color="green" icon="badge-check">APPROVED</Badge>
            <h2 className="ss-step-title" style={{ marginTop: 12 }}>You're an Approved Seller!</h2>
            <p className="ss-step-sub">
              Your seller account is active. Start listing products from your seller dashboard.
            </p>
            <Button
              variant="dark"
              size="lg"
              block
              iconRight="arrow-right"
              onClick={handleGoToDashboard}
              id="seller-dashboard-btn"
            >
              Go to Seller Dashboard
            </Button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .ss-page {
          min-height: 100vh;
          background:
            radial-gradient(800px 420px at 100% 0%, rgba(79, 70, 229, 0.07), transparent 60%),
            var(--page-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          font-family: var(--font);
        }
        .ss-card {
          background: var(--surface);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-lg);
          padding: 36px;
          width: 100%;
          max-width: 500px;
        }

        .ss-back {
          display: inline-flex; align-items: center; gap: 6px;
          background: none; border: none; padding: 0;
          color: var(--text-faint); font-size: 13px; font-weight: 500;
          font-family: var(--font); cursor: pointer;
          margin-bottom: 26px; transition: color 0.15s ease;
        }
        .ss-back:hover { color: var(--ink); }

        .ss-logo-area {
          margin-bottom: 26px; padding-bottom: 22px;
          border-bottom: 1px solid var(--border);
        }
        .ss-logo-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
        .ss-logo-mark {
          width: 34px; height: 34px; border-radius: 10px;
          background: var(--brand-gradient);
          display: inline-flex; align-items: center; justify-content: center;
          box-shadow: var(--shadow-brand); flex-shrink: 0;
        }
        .ss-logo-name { font-size: 21px; font-weight: 800; letter-spacing: 0.06em; color: var(--ink); }
        .ss-logo-sub { color: var(--text-muted); font-size: 13px; margin: 0; }

        .ss-step-title { font-size: 19px; font-weight: 700; color: var(--ink); margin: 0 0 8px 0; }
        .ss-step-sub { font-size: 14px; color: var(--text-muted); margin: 0 0 18px 0; line-height: 1.6; }

        /* Benefits strip */
        .ss-benefits {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
          margin-bottom: 20px;
        }
        .ss-benefit {
          display: flex; align-items: center; gap: 9px;
          background: var(--brand-softer);
          border: 1px solid var(--brand-border);
          border-radius: var(--radius-sm);
          padding: 9px 12px;
        }
        .ss-benefit-icon {
          width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
          background: var(--surface);
          display: inline-flex; align-items: center; justify-content: center;
        }
        .ss-benefit-text { font-size: 12.5px; font-weight: 600; color: var(--brand-active); line-height: 1.35; }

        /* Form */
        .ss-form { display: flex; flex-direction: column; gap: 15px; }
        .ss-field { display: flex; flex-direction: column; gap: 6px; }
        .ss-field .hint { display: inline-flex; align-items: center; gap: 5px; margin: 0; }
        .ss-textarea-wrap { position: relative; display: flex; }
        .ss-eye {
          position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
          width: 30px; height: 30px; border: none; border-radius: 7px;
          background: transparent; color: var(--text-faint);
          display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer; transition: color 0.15s ease, background 0.15s ease;
        }
        .ss-eye:hover { color: var(--text-secondary); background: var(--surface-muted); }

        /* Alert boxes */
        .ss-alert {
          display: flex; align-items: flex-start; gap: 8px;
          background: var(--danger-soft); border: 1px solid var(--danger-border);
          border-radius: var(--radius-sm); padding: 10px 13px; margin-bottom: 14px;
          flex-direction: column;
        }
        .ss-alert-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .ss-alert-note { font-size: 12px; color: var(--danger-strong); margin-top: 2px; padding-left: 23px; }
        .ss-alert-rejected { display: block; }
        .ss-alert-rejected .error-text { display: inline-flex; }

        /* Footnote */
        .ss-footnote {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          color: var(--text-faint); font-size: 12px;
          margin: 16px 0 0; text-align: center;
        }

        /* Status steps */
        .ss-center { display: flex; flex-direction: column; align-items: center; text-align: center; }
        .ss-status-icon {
          width: 64px; height: 64px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          margin-bottom: 14px;
        }
        .ss-status-pending { background: var(--warning-soft); border: 1px solid var(--warning-border); }
        .ss-status-approved { background: var(--success-soft); border: 1px solid var(--success-border); }
        .ss-pending-box {
          width: 100%; background: var(--warning-soft);
          border: 1px solid var(--warning-border); border-radius: var(--radius-sm);
          padding: 14px 16px; margin-top: 6px; text-align: left;
        }
        .ss-pending-title { font-weight: 600; color: var(--warning-strong); font-size: 13.5px; margin-bottom: 3px; }
        .ss-pending-text { font-size: 13px; color: #78350f; line-height: 1.55; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .ss-page { padding: 32px 16px; align-items: flex-start; }
          .ss-card { padding: 28px 24px; }
        }
        @media (max-width: 560px) {
          .ss-page { padding: 20px 12px; }
          .ss-card { padding: 22px 18px; border-radius: var(--radius-md); }
          .ss-benefits { grid-template-columns: 1fr; }
          .ss-logo-name { font-size: 19px; }
        }
      `}</style>
    </div>
  );
};

export default SellerSignInPage;
