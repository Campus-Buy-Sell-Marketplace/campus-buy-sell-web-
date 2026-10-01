// ============================================================
// LAVSA — Seller Sign-In Page (Light theme)
// Accessible from Settings → Start Selling.
// Once signed in, the seller submits their application for
// admin approval before they can upload products.
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME } from '../../config/appConfig';
import api from '../../services/api';

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

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {/* Back button */}
        <button onClick={() => navigate('/settings')} style={backBtnStyle} id="seller-back-btn">
          ← Back to Settings
        </button>

        {/* Logo */}
        <div style={logoAreaStyle}>
          <div style={logoStyle}>
            <span style={logoTextStyle}>{APP_NAME}</span>
            <span style={logoBadgeStyle}>Seller Portal</span>
          </div>
          <p style={logoSubStyle}>Manage your campus storefront</p>
        </div>

        {/* ── Step: Verify identity ── */}
        {step === 'verify' && (
          <div>
            <h2 style={stepTitleStyle}>Verify Your Identity</h2>
            <p style={stepSubStyle}>
              Re-enter your password to access the seller portal as{' '}
              <strong>{user?.email}</strong>
            </p>

            <form onSubmit={handleVerify}>
              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="seller-password">Password</label>
                <input
                  id="seller-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                  required
                  autoFocus
                />
              </div>

              {error && <div style={errorStyle}>{error}</div>}

              <button
                type="submit"
                style={primaryBtnStyle}
                disabled={isLoading}
                id="seller-verify-btn"
              >
                {isLoading ? 'Verifying...' : 'Verify & Continue →'}
              </button>
            </form>

            <p style={footNoteStyle}>
              This confirms it's really you before granting seller access.
            </p>
          </div>
        )}

        {/* ── Step: Apply as seller ── */}
        {step === 'apply' && (
          <div>
            <h2 style={stepTitleStyle}>Apply to Become a Seller</h2>
            <p style={stepSubStyle}>
              Fill in your shop details. An admin will review and approve your application.
            </p>

            {appStatus?.application?.status === 'REJECTED' && (
              <div style={rejectedBannerStyle}>
                ❌ Your previous application was rejected.
                {appStatus.application.admin_notes && (
                  <div style={{ marginTop: '6px', fontSize: '12px' }}>
                    Admin note: {appStatus.application.admin_notes}
                  </div>
                )}
                <div style={{ marginTop: '4px', fontSize: '12px' }}>You can apply again.</div>
              </div>
            )}

            <form onSubmit={handleApply}>
              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="business-name">Shop / Business Name</label>
                <input
                  id="business-name"
                  type="text"
                  placeholder="e.g. Rahul's Tech Store"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="business-desc">What will you sell?</label>
                <textarea
                  id="business-desc"
                  placeholder="Briefly describe what items you plan to sell on campus..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ ...inputStyle, height: '90px', resize: 'vertical' } as React.CSSProperties}
                  required
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="contact-number">Contact Number</label>
                <input
                  id="contact-number"
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              {error && <div style={errorStyle}>{error}</div>}

              <button
                type="submit"
                style={primaryBtnStyle}
                disabled={isLoading}
                id="seller-apply-btn"
              >
                {isLoading ? 'Submitting...' : 'Submit Application →'}
              </button>
            </form>
          </div>
        )}

        {/* ── Step: Pending ── */}
        {step === 'pending' && (
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '52px' }}>⏳</span>
            <h2 style={stepTitleStyle}>Application Under Review</h2>
            <p style={stepSubStyle}>
              Your seller application for{' '}
              <strong>{appStatus?.application?.business_name || 'your shop'}</strong> has been
              submitted. An admin will review it and approve you shortly.
            </p>
            <div style={pendingBoxStyle}>
              <div style={{ fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>Status: Pending Review</div>
              <div style={{ fontSize: '13px', color: '#78350f' }}>
                You will get seller access once an admin approves your application.
              </div>
            </div>
            <button
              onClick={() => navigate('/home')}
              style={{ ...primaryBtnStyle, marginTop: '20px' }}
              id="seller-go-home-btn"
            >
              Back to Home
            </button>
          </div>
        )}

        {/* ── Step: Approved ── */}
        {step === 'approved' && (
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '52px' }}>✅</span>
            <h2 style={stepTitleStyle}>You're an Approved Seller!</h2>
            <p style={stepSubStyle}>
              Your seller account is active. Start listing products from your seller dashboard.
            </p>
            <button
              onClick={handleGoToDashboard}
              style={primaryBtnStyle}
              id="seller-dashboard-btn"
            >
              Go to Seller Dashboard →
            </button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        #seller-verify-btn:hover:not(:disabled) { background-color: #374151 !important; }
        #seller-apply-btn:hover:not(:disabled) { background-color: #374151 !important; }
        #seller-go-home-btn:hover { background-color: #374151 !important; }
        #seller-dashboard-btn:hover { background-color: #374151 !important; }
        #seller-back-btn:hover { color: #111827 !important; }
        input:focus, textarea:focus { outline: none; border-color: #111827 !important; box-shadow: 0 0 0 3px rgba(17,24,39,0.08); }
      `}</style>
    </div>
  );
};

// ── Styles — light theme ──────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#f0f4f8',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 24px',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  padding: '40px',
  width: '100%',
  maxWidth: '480px',
};

const backBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#9ca3af',
  fontSize: '13px',
  cursor: 'pointer',
  padding: 0,
  marginBottom: '28px',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'color 0.15s ease',
};

const logoAreaStyle: React.CSSProperties = {
  marginBottom: '32px',
  paddingBottom: '24px',
  borderBottom: '1px solid #f3f4f6',
};

const logoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '6px',
};

const logoTextStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: '900',
  color: '#111827',
  letterSpacing: '0.08em',
};

const logoBadgeStyle: React.CSSProperties = {
  padding: '3px 10px',
  borderRadius: '6px',
  backgroundColor: '#111827',
  color: '#ffffff',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.05em',
};

const logoSubStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '13px',
  margin: 0,
};

const stepTitleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#111827',
  margin: '0 0 8px 0',
};

const stepSubStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0 0 24px 0',
  lineHeight: '1.6',
};

const fieldStyle: React.CSSProperties = {
  marginBottom: '16px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1.5px solid #e5e7eb',
  backgroundColor: '#f9fafb',
  color: '#111827',
  fontSize: '14px',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'border-color 0.15s ease',
  boxSizing: 'border-box',
};

const primaryBtnStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#111827',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '700',
  cursor: 'pointer',
  marginTop: '8px',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'background-color 0.15s ease',
};

const errorStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '8px',
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  color: '#dc2626',
  fontSize: '13px',
  marginBottom: '12px',
};

const footNoteStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#9ca3af',
  fontSize: '12px',
  marginTop: '16px',
};

const pendingBoxStyle: React.CSSProperties = {
  backgroundColor: '#fffbeb',
  border: '1px solid #fde68a',
  borderRadius: '10px',
  padding: '16px',
  marginTop: '16px',
};

const rejectedBannerStyle: React.CSSProperties = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '10px',
  padding: '14px',
  fontSize: '13px',
  color: '#dc2626',
  marginBottom: '16px',
};

export default SellerSignInPage;
