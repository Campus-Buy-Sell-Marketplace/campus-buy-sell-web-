// ============================================================
// LAVSA — Seller Onboarding Page — Light Theme
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { applyAsSeller } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const SellerOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [form, setForm] = useState({ businessName: '', description: '', contactNumber: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.businessName.trim())   { setError('Business name is required.');  return; }
    if (!form.description.trim())    { setError('Description is required.');     return; }
    if (!form.contactNumber.trim())  { setError('Contact number is required.');  return; }

    setSubmitting(true);
    try {
      await applyAsSeller(form);
      await refreshUser();
      setSuccess(true);
      setTimeout(() => navigate('/seller/dashboard'), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Application failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <AppLayout>
        <div style={successStyle}>
          <span style={{ fontSize: '64px' }}>🎉</span>
          <h2 style={{ color: '#111827', fontSize: '24px', fontWeight: '700', margin: '16px 0 8px' }}>
            You're now a seller!
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Redirecting to your seller dashboard…
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: '520px', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <h1 style={{ color: '#111827', fontSize: '24px', fontWeight: '700', margin: '0 0 6px 0' }}>
          Become a Seller
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 28px 0' }}>
          Fill in the details below to activate seller capability on your account.
        </p>

        {error && <div style={errorBoxStyle}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <Field label="Business / Shop Name" name="businessName" value={form.businessName} onChange={handleChange} placeholder="e.g. Riya's Campus Store" disabled={submitting} />
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What will you sell? e.g. Textbooks, electronics, stationery…"
              rows={4}
              disabled={submitting}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
          <Field label="Contact Number" name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="+91 XXXXX XXXXX" disabled={submitting} />

          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <button type="button" style={cancelBtnStyle} onClick={() => navigate('/settings')} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" style={submitBtnStyle(submitting)} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

const Field: React.FC<{
  label: string; name: string; value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder: string; disabled: boolean;
}> = ({ label, name, value, onChange, placeholder, disabled }) => (
  <div style={fieldGroupStyle}>
    <label style={labelStyle}>{label}</label>
    <input name={name} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} style={inputStyle} />
  </div>
);

const fieldGroupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle: React.CSSProperties = { color: '#374151', fontSize: '13px', fontWeight: '600' };
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: '8px',
  border: '1.5px solid #e5e7eb', backgroundColor: '#ffffff',
  color: '#111827', fontSize: '14px', outline: 'none',
  boxSizing: 'border-box', fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'border-color 0.2s ease',
};
const formStyle: React.CSSProperties = {
  backgroundColor: '#ffffff', border: '1px solid #e5e7eb',
  borderRadius: '12px', padding: '28px',
  display: 'flex', flexDirection: 'column', gap: '18px',
};
const errorBoxStyle: React.CSSProperties = {
  backgroundColor: '#fef2f2', border: '1px solid #fecaca',
  borderRadius: '8px', padding: '10px 14px',
  color: '#dc2626', fontSize: '13px', marginBottom: '16px',
};
const cancelBtnStyle: React.CSSProperties = {
  padding: '11px 20px', borderRadius: '8px',
  border: '1.5px solid #e5e7eb', background: 'transparent',
  color: '#6b7280', fontSize: '14px', cursor: 'pointer',
  fontFamily: "'Inter', system-ui, sans-serif",
};
const submitBtnStyle = (d: boolean): React.CSSProperties => ({
  flex: 1, padding: '11px', borderRadius: '8px', border: 'none',
  backgroundColor: d ? '#9ca3af' : '#111827',
  color: '#ffffff', fontSize: '14px', fontWeight: '600',
  cursor: d ? 'not-allowed' : 'pointer',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'background-color 0.2s ease',
});
const successStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', minHeight: '60vh', textAlign: 'center',
};

export default SellerOnboardingPage;
