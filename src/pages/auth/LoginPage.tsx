// ============================================================
// LAVSA — Login / Register Page  (premium split auth screen)
// Left: brand story panel (desktop only) · Right: sign in / up card
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { Button } from '../../components/UI/ui';
import {
  IconStore,
  IconBadgeCheck,
  IconMapPin,
  IconZap,
  IconMail,
  IconLock,
  IconUser,
  IconEye,
  IconEyeOff,
  IconAlertTriangle,
} from '../../components/UI/Icons';
import { APP_NAME, APP_TAGLINE, GOOGLE_CLIENT_ID } from '../../config/appConfig';

type Tab = 'login' | 'register';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

const LoginPage: React.FC = () => {
  const { login, register, googleLogin, isAuthenticated, isLoading, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [tab, setTab]               = useState<Tab>('login');
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [error, setError]           = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // ── Redirect destination after auth ──────────────────────────────────────
  const from = (location.state as { from?: Location })?.from?.pathname;

  const getDefaultRedirect = useCallback((): string => {
    if (from && from !== '/login') return from;
    if (role === 'SUPER_ADMIN') return '/super-admin/dashboard';
    if (role === 'ADMIN')       return '/admin/dashboard';
    return '/home';
  }, [from, role]);

  if (!isLoading && isAuthenticated) {
    return <Navigate to={getDefaultRedirect()} replace />;
  }
  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading…" />;
  }

  // ── Tab switch ────────────────────────────────────────────────────────────
  const switchTab = (t: Tab) => {
    setTab(t);
    setError('');
    setFieldErrors({});
    setName(''); setEmail(''); setPassword(''); setConfirm('');
  };

  // ── Sign In submit ────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const errs: FieldErrors = {};
    if (!email.trim()) errs.email = 'Email is required.';
    if (!password)     errs.password = 'Password is required.';
    setFieldErrors(errs);
    if (errs.email || errs.password) return;

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(getDefaultRedirect(), { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Sign Up submit ────────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const errs: FieldErrors = {};
    if (!name.trim())  errs.name = 'Name is required.';
    if (!email.trim()) errs.email = 'Email is required.';
    if (password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (password !== confirm) errs.confirm = 'Passwords do not match.';
    setFieldErrors(errs);
    if (errs.name || errs.email || errs.password || errs.confirm) return;

    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate(getDefaultRedirect(), { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Google login ──────────────────────────────────────────────────────────
  const handleGoogleSuccess = async (res: CredentialResponse) => {
    if (!res.credential) { setError('Google login failed. Try again.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await googleLogin(res.credential);
      navigate(getDefaultRedirect(), { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Google login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleError = () => setError('Google login was cancelled or failed.');

  // ── Shared field renderers ────────────────────────────────────────────────
  const emailField = (id: string, autoFocus: boolean) => (
    <div className="lp-field">
      <label className="label" htmlFor={id}>Email address</label>
      <div className="input-icon-wrap">
        <span className="input-icon"><IconMail size={16} /></span>
        <input
          id={id}
          className={`input${fieldErrors.email ? ' input-invalid' : ''}`}
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined })); }}
          placeholder="you@college.edu"
          disabled={submitting}
          autoComplete="email"
          autoFocus={autoFocus}
        />
      </div>
      {fieldErrors.email && <span className="error-text">{fieldErrors.email}</span>}
    </div>
  );

  const passwordField = (
    id: string,
    value: string,
    onChange: (v: string) => void,
    placeholder: string,
    autoComplete: string,
    autoFocus = false,
    errorKey: 'password' | 'confirm' = 'password',
    label = 'Password',
  ) => (
    <div className="lp-field">
      <label className="label" htmlFor={id}>{label}</label>
      <div className="input-icon-wrap lp-pass-wrap">
        <span className="input-icon"><IconLock size={16} /></span>
        <input
          id={id}
          className={`input${fieldErrors[errorKey] ? ' input-invalid' : ''}`}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (fieldErrors[errorKey]) setFieldErrors((p) => ({ ...p, [errorKey]: undefined }));
          }}
          placeholder={placeholder}
          style={{ paddingRight: 42 }}
          disabled={submitting}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
        />
        <button
          type="button"
          className="lp-eye"
          onClick={() => setShowPassword((v) => !v)}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
        </button>
      </div>
      {fieldErrors[errorKey] && <span className="error-text">{fieldErrors[errorKey]}</span>}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="lp-page">
      {/* ── Left: brand story (desktop only) ── */}
      <aside className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-brand">
            <span className="lp-hero-mark"><IconStore size={22} color="#ffffff" strokeWidth={1.8} /></span>
            <div>
              <div className="lp-hero-name">{APP_NAME}</div>
              <div className="lp-hero-tag">{APP_TAGLINE}</div>
            </div>
          </div>

          <h1 className="lp-hero-title">
            Everything you need,<br />from students around you.
          </h1>
          <p className="lp-hero-sub">
            Buy, sell and discover within your campus — safe, simple and completely free.
          </p>

          <div className="lp-hero-features">
            <div className="lp-feature">
              <span className="lp-feature-icon"><IconBadgeCheck size={18} color="var(--brand)" strokeWidth={2} /></span>
              <div>
                <div className="lp-feature-title">Verified students only</div>
                <div className="lp-feature-desc">Every account is tied to a real campus email.</div>
              </div>
            </div>
            <div className="lp-feature">
              <span className="lp-feature-icon"><IconMapPin size={18} color="var(--brand)" strokeWidth={2} /></span>
              <div>
                <div className="lp-feature-title">Safe in-person campus meetups</div>
                <div className="lp-feature-desc">Meet inside campus — no shipping, no strangers.</div>
              </div>
            </div>
            <div className="lp-feature">
              <span className="lp-feature-icon"><IconZap size={18} color="var(--brand)" strokeWidth={2} /></span>
              <div>
                <div className="lp-feature-title">Zero platform fee</div>
                <div className="lp-feature-desc">Keep 100% of what you earn on every sale.</div>
              </div>
            </div>
          </div>

          <div className="lp-hero-foot">{APP_NAME} · {APP_TAGLINE}</div>
        </div>
      </aside>

      {/* ── Right: auth card ── */}
      <main className="lp-right">
        <div className="lp-card slide-up">
          {/* Compact brand for mobile / stacked view */}
          <div className="lp-card-brand">
            <span className="lp-card-mark"><IconStore size={16} color="#ffffff" strokeWidth={1.8} /></span>
            <span className="lp-card-name">{APP_NAME}</span>
          </div>

          {/* Tabs */}
          <div className="lp-tabs">
            <button
              id="tab-login-btn"
              className={`lp-tab${tab === 'login' ? ' lp-tab-active' : ''}`}
              onClick={() => switchTab('login')}
              type="button"
            >
              Sign In
            </button>
            <button
              id="tab-register-btn"
              className={`lp-tab${tab === 'register' ? ' lp-tab-active' : ''}`}
              onClick={() => switchTab('register')}
              type="button"
            >
              Create Account
            </button>
          </div>

          {/* Server-level error */}
          {error && (
            <div className="lp-alert fade-in" role="alert">
              <IconAlertTriangle size={16} color="var(--danger-strong)" strokeWidth={2} />
              <span className="error-text">{error}</span>
            </div>
          )}

          {/* ── SIGN IN FORM ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="lp-form" noValidate>
              {emailField('login-email', true)}
              {passwordField(
                'login-password', password, setPassword, '••••••••', 'current-password', false,
              )}

              <Button
                id="login-submit-btn"
                type="submit"
                variant="dark"
                size="lg"
                block
                loading={submitting}
                disabled={submitting}
                iconRight="arrow-right"
                style={{ marginTop: 6 }}
              >
                {submitting ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>
          )}

          {/* ── SIGN UP FORM ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="lp-form" noValidate>
              <div className="lp-field">
                <label className="label" htmlFor="reg-name">Full name</label>
                <div className="input-icon-wrap">
                  <span className="input-icon"><IconUser size={16} /></span>
                  <input
                    id="reg-name"
                    className={`input${fieldErrors.name ? ' input-invalid' : ''}`}
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined })); }}
                    placeholder="Your Name"
                    disabled={submitting}
                    autoComplete="name"
                    autoFocus
                  />
                </div>
                {fieldErrors.name && <span className="error-text">{fieldErrors.name}</span>}
              </div>

              {emailField('reg-email', false)}
              {passwordField(
                'reg-password', password, setPassword, 'Min. 6 characters', 'new-password', false,
                'password',
              )}
              {passwordField(
                'reg-confirm', confirm, setConfirm, '••••••••', 'new-password', false,
                'confirm', 'Confirm password',
              )}

              <Button
                id="register-submit-btn"
                type="submit"
                variant="dark"
                size="lg"
                block
                loading={submitting}
                disabled={submitting}
                iconRight="arrow-right"
                style={{ marginTop: 6 }}
              >
                {submitting ? 'Creating account…' : 'Create Account'}
              </Button>
            </form>
          )}

          {/* Google login — only when OAuth is configured */}
          {GOOGLE_CLIENT_ID && (
            <>
              <div className="lp-divider">
                <span className="lp-divider-line" />
                <span className="lp-divider-text">or continue with</span>
                <span className="lp-divider-line" />
              </div>
              <div className="lp-google" id="google-login-container">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  width="100%"
                  theme="outline"
                  shape="rectangular"
                  text="signin_with"
                  useOneTap={false}
                />
              </div>
            </>
          )}

          <p className="lp-legal">
            By continuing you agree to our{' '}
            <Link to="/terms" className="lp-legal-link">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="lp-legal-link">Privacy Policy</Link>.
          </p>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .lp-page {
          min-height: 100vh;
          display: flex;
          align-items: stretch;
          background: var(--page-bg);
          font-family: var(--font);
        }

        /* ── Left hero panel ── */
        .lp-hero {
          flex: 1 1 52%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 56px;
          background:
            radial-gradient(900px 500px at -10% -10%, rgba(79, 70, 229, 0.10), transparent 60%),
            radial-gradient(700px 420px at 110% 110%, rgba(124, 58, 237, 0.08), transparent 55%),
            linear-gradient(165deg, var(--brand-soft) 0%, #fdfdff 58%, var(--surface) 100%);
          border-right: 1px solid var(--border);
        }
        .lp-hero-inner { width: 100%; max-width: 460px; }
        .lp-hero-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; }
        .lp-hero-mark {
          width: 44px; height: 44px; border-radius: 12px;
          background: var(--brand-gradient);
          display: inline-flex; align-items: center; justify-content: center;
          box-shadow: var(--shadow-brand);
          flex-shrink: 0;
        }
        .lp-hero-name {
          font-size: 20px; font-weight: 800; letter-spacing: 0.06em; color: var(--ink);
        }
        .lp-hero-tag {
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--text-faint); margin-top: 2px;
        }
        .lp-hero-title {
          font-size: 34px; font-weight: 800; letter-spacing: -0.02em;
          color: var(--ink); line-height: 1.2; margin: 0 0 12px 0;
        }
        .lp-hero-sub {
          font-size: 15px; color: var(--text-muted); line-height: 1.6; margin: 0 0 36px 0;
        }
        .lp-hero-features { display: flex; flex-direction: column; gap: 18px; }
        .lp-feature { display: flex; align-items: flex-start; gap: 14px; }
        .lp-feature-icon {
          width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
          background: var(--surface); border: 1px solid var(--brand-border);
          display: inline-flex; align-items: center; justify-content: center;
          box-shadow: var(--shadow-xs);
        }
        .lp-feature-title { font-size: 14px; font-weight: 600; color: var(--ink); }
        .lp-feature-desc { font-size: 13px; color: var(--text-muted); margin-top: 2px; line-height: 1.5; }
        .lp-hero-foot {
          margin-top: 44px; padding-top: 18px; border-top: 1px solid var(--brand-border);
          font-size: 11px; font-weight: 600; letter-spacing: 0.07em;
          text-transform: uppercase; color: var(--text-faint);
        }

        /* ── Right panel ── */
        .lp-right {
          flex: 1 1 48%;
          display: flex; align-items: center; justify-content: center;
          padding: 40px 24px;
        }
        .lp-card {
          width: 100%; max-width: 400px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 36px 32px;
          box-shadow: var(--shadow-lg);
        }
        .lp-card-brand { display: none; align-items: center; gap: 10px; margin-bottom: 22px; }
        .lp-card-mark {
          width: 32px; height: 32px; border-radius: 9px;
          background: var(--brand-gradient);
          display: inline-flex; align-items: center; justify-content: center;
        }
        .lp-card-name { font-size: 18px; font-weight: 800; letter-spacing: 0.06em; color: var(--ink); }

        /* Tabs */
        .lp-tabs {
          display: flex; gap: 4px;
          background: var(--surface-soft);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 4px;
          margin-bottom: 22px;
        }
        .lp-tab {
          flex: 1; padding: 8px 0; border: none; border-radius: var(--radius-xs);
          background: transparent; color: var(--text-muted);
          font-family: var(--font); font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.15s ease;
        }
        .lp-tab:hover { color: var(--text); }
        .lp-tab-active {
          background: var(--surface); color: var(--ink); font-weight: 700;
          box-shadow: var(--shadow-sm);
        }

        /* Error alert */
        .lp-alert {
          display: flex; align-items: flex-start; gap: 9px;
          background: var(--danger-soft); border: 1px solid var(--danger-border);
          border-radius: var(--radius-sm); padding: 10px 13px; margin-bottom: 16px;
        }
        .lp-alert svg { flex-shrink: 0; margin-top: 1px; }

        /* Form */
        .lp-form { display: flex; flex-direction: column; gap: 15px; }
        .lp-field { display: flex; flex-direction: column; gap: 6px; }
        .lp-pass-wrap { position: relative; }
        .lp-eye {
          position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
          width: 30px; height: 30px; border: none; border-radius: 7px;
          background: transparent; color: var(--text-faint);
          display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer; transition: color 0.15s ease, background 0.15s ease;
        }
        .lp-eye:hover { color: var(--text-secondary); background: var(--surface-muted); }

        /* Divider + Google */
        .lp-divider { display: flex; align-items: center; gap: 12px; margin: 22px 0 14px; }
        .lp-divider-line { flex: 1; height: 1px; background: var(--border); }
        .lp-divider-text { color: var(--text-faint); font-size: 11px; font-weight: 500; white-space: nowrap; }
        .lp-google { display: flex; justify-content: center; }
        .lp-google > div { width: 100% !important; }

        /* Legal footer */
        .lp-legal {
          text-align: center; color: var(--text-faint); font-size: 11.5px;
          line-height: 1.6; margin: 20px 0 0;
        }
        .lp-legal-link {
          color: var(--text-muted); font-weight: 600;
          text-decoration: none; border-bottom: 1px solid var(--border-strong);
        }
        .lp-legal-link:hover { color: var(--brand-active); border-color: var(--brand-border); }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .lp-hero { display: none; }
          .lp-right { padding: 32px 20px; }
          .lp-card-brand { display: flex; justify-content: center; }
          .lp-card-name { margin-right: 6px; }
          .lp-card { border: none; box-shadow: none; background: transparent; padding: 8px 4px 24px; }
          .lp-tabs { background: var(--surface); box-shadow: var(--shadow-xs); }
        }
        @media (max-width: 560px) {
          .lp-page { background: var(--surface); }
          .lp-right { align-items: flex-start; padding: 28px 16px; }
          .lp-hero-title { font-size: 28px; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
