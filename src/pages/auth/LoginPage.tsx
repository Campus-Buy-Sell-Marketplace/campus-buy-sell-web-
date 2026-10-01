// ============================================================
// LAVSA — Login / Register Page  (clean white theme)
// ============================================================

import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { APP_NAME, APP_TAGLINE, GOOGLE_CLIENT_ID } from '../../config/appConfig';

type Tab = 'login' | 'register';

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
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    setName(''); setEmail(''); setPassword(''); setConfirm('');
  };

  // ── Sign In submit ────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Email is required.'); return; }
    if (!password)     { setError('Password is required.'); return; }

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
    if (!name.trim())  { setError('Name is required.'); return; }
    if (!email.trim()) { setError('Email is required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>

        {/* Brand */}
        <div style={brandContainerStyle}>
          <h1 style={brandStyle}>{APP_NAME}</h1>
          <p style={taglineStyle}>{APP_TAGLINE}</p>
        </div>

        {/* Tabs */}
        <div style={tabRowStyle}>
          <button
            id="tab-login-btn"
            style={tabBtnStyle(tab === 'login')}
            onClick={() => switchTab('login')}
            type="button"
          >
            Sign In
          </button>
          <button
            id="tab-register-btn"
            style={tabBtnStyle(tab === 'register')}
            onClick={() => switchTab('register')}
            type="button"
          >
            Create Account
          </button>
        </div>

        {/* Error */}
        {error && <div style={errorBoxStyle}>⚠️ {error}</div>}

        {/* ── SIGN IN FORM ── */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} style={formStyle} noValidate>
            <div style={fieldGroupStyle}>
              <label style={labelStyle} htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                style={inputStyle}
                disabled={submitting}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle} htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  disabled={submitting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={eyeBtnStyle}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              style={submitBtnStyle(submitting)}
              disabled={submitting}
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        )}

        {/* ── SIGN UP FORM ── */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} style={formStyle} noValidate>
            <div style={fieldGroupStyle}>
              <label style={labelStyle} htmlFor="reg-name">Full name</label>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                style={inputStyle}
                disabled={submitting}
                autoComplete="name"
                autoFocus
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle} htmlFor="reg-email">Email address</label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                style={inputStyle}
                disabled={submitting}
                autoComplete="email"
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle} htmlFor="reg-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  disabled={submitting}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={eyeBtnStyle}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle} htmlFor="reg-confirm">Confirm password</label>
              <input
                id="reg-confirm"
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                disabled={submitting}
                autoComplete="new-password"
              />
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              style={submitBtnStyle(submitting)}
              disabled={submitting}
            >
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Google login — only when OAuth is configured */}
        {GOOGLE_CLIENT_ID && (
          <>
            <div style={dividerStyle}>
              <span style={dividerLineStyle} />
              <span style={dividerTextStyle}>or continue with</span>
              <span style={dividerLineStyle} />
            </div>
            <div style={googleWrapperStyle}>
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

        <p style={footerStyle}>By continuing you agree to our Terms of Service.</p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        #login-email:focus, #login-password:focus,
        #reg-name:focus, #reg-email:focus, #reg-password:focus, #reg-confirm:focus {
          outline: none;
          border-color: #111827;
          box-shadow: 0 0 0 3px rgba(17,24,39,0.08);
        }
        #login-submit-btn:hover:not(:disabled),
        #register-submit-btn:hover:not(:disabled) { background: #1f2937; }
        #tab-login-btn:hover, #tab-register-btn:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#ffffff',
  fontFamily: "'Inter', system-ui, sans-serif",
  padding: '24px',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '420px',
};

const brandContainerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '28px',
};

const brandStyle: React.CSSProperties = {
  fontSize: '38px',
  fontWeight: '900',
  letterSpacing: '0.12em',
  color: '#111827',
  margin: '0 0 6px 0',
};

const taglineStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '12px',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  margin: 0,
  fontWeight: '500',
};

const tabRowStyle: React.CSSProperties = {
  display: 'flex',
  borderBottom: '2px solid #f3f4f6',
  marginBottom: '24px',
};

const tabBtnStyle = (active: boolean): React.CSSProperties => ({
  flex: 1,
  padding: '10px 0',
  background: 'none',
  border: 'none',
  borderBottom: active ? '2px solid #111827' : '2px solid transparent',
  marginBottom: '-2px',
  color: active ? '#111827' : '#9ca3af',
  fontWeight: active ? '700' : '500',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontFamily: "'Inter', system-ui, sans-serif",
  letterSpacing: '0.01em',
});

const errorBoxStyle: React.CSSProperties = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '8px',
  padding: '10px 14px',
  color: '#dc2626',
  fontSize: '13px',
  marginBottom: '16px',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
};

const fieldGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
};

const labelStyle: React.CSSProperties = {
  color: '#374151',
  fontSize: '13px',
  fontWeight: '600',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '8px',
  border: '1.5px solid #e5e7eb',
  backgroundColor: '#ffffff',
  color: '#111827',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const eyeBtnStyle: React.CSSProperties = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  padding: 0,
  lineHeight: 1,
};

const submitBtnStyle = (disabled: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: disabled ? '#9ca3af' : '#111827',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600',
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'background-color 0.2s ease',
  marginTop: '4px',
  letterSpacing: '0.02em',
  fontFamily: "'Inter', system-ui, sans-serif",
});

const dividerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  margin: '22px 0',
};

const dividerLineStyle: React.CSSProperties = {
  flex: 1,
  height: '1px',
  backgroundColor: '#e5e7eb',
};

const dividerTextStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '12px',
  whiteSpace: 'nowrap',
};

const googleWrapperStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#9ca3af',
  fontSize: '11px',
  marginTop: '24px',
  marginBottom: 0,
};

export default LoginPage;
