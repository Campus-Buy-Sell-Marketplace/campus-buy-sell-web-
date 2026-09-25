// ============================================================
// LAVSA — Seller Onboarding Page — Light Theme
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { applyAsSeller, fetchSellerApplicationStatus } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const SellerOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isSeller, refreshUser } = useAuth();

  const [form, setForm] = useState({ businessName: '', description: '', contactNumber: '' });
  const [submitting, setSubmitting] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [application, setApplication] = useState<any>(null);
  const [error, setError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchSellerApplicationStatus()
      .then((data) => {
        if (data.hasApplied && data.application) {
          setApplication(data.application);
          setForm({
            businessName: data.application.business_name || '',
            description: data.application.description || '',
            contactNumber: data.application.contact_number || '',
          });
        }
      })
      .catch((err) => console.error('Failed to load application status:', err))
      .finally(() => setLoadingStatus(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.businessName.trim())   { setError('Business / Shop name is required.');  return; }
    if (!form.description.trim())    { setError('Description is required.');          return; }
    if (!form.contactNumber.trim())  { setError('Contact number is required.');       return; }

    setSubmitting(true);
    try {
      const res = await applyAsSeller(form);
      setSubmittedSuccess(true);
      await refreshUser();
      // Reload status
      const updated = await fetchSellerApplicationStatus();
      if (updated.hasApplied && updated.application) {
        setApplication(updated.application);
      }
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Application failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // If user is already approved as SELLER
  if (isSeller || application?.status === 'APPROVED') {
    return (
      <AppLayout>
        <div style={statusCardContainer}>
          <div style={statusCard}>
            <span style={{ fontSize: '56px' }}>🎉</span>
            <h2 style={{ color: '#111827', fontSize: '22px', fontWeight: '700', margin: '14px 0 8px' }}>
              You're an Approved Seller!
            </h2>
            <p style={{ color: '#4b5563', fontSize: '14px', maxWidth: '380px', margin: '0 auto 20px' }}>
              Your seller account for <strong>{application?.business_name || 'your shop'}</strong> is active. You can now list and manage campus products.
            </p>
            <button
              style={primaryBtnStyle}
              onClick={() => navigate('/seller/dashboard')}
            >
              Go to Seller Dashboard →
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // If user has a pending application and not editing
  if (!loadingStatus && application?.status === 'PENDING' && !isEditing) {
    return (
      <AppLayout>
        <div style={statusCardContainer}>
          <div style={statusCard}>
            <span style={{ fontSize: '56px' }}>⏳</span>
            <span style={pendingBadgeStyle}>Under Admin Review</span>
            <h2 style={{ color: '#111827', fontSize: '22px', fontWeight: '700', margin: '14px 0 8px' }}>
              Application Submitted
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14px', maxWidth: '420px', margin: '0 auto 18px' }}>
              Your application to become a campus seller has been received and is waiting for review by the campus administrator.
            </p>

            <div style={summaryBoxStyle}>
              <div style={summaryRow}><strong style={{ color: '#374151' }}>Shop Name:</strong> <span>{application.business_name}</span></div>
              <div style={summaryRow}><strong style={{ color: '#374151' }}>Selling Items:</strong> <span>{application.description}</span></div>
              <div style={summaryRow}><strong style={{ color: '#374151' }}>Contact No:</strong> <span>{application.contact_number}</span></div>
              <div style={summaryRow}><strong style={{ color: '#374151' }}>Submitted On:</strong> <span>{new Date(application.created_at).toLocaleDateString()}</span></div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button style={outlineBtnStyle} onClick={() => setIsEditing(true)}>
                Edit Details ✏️
              </button>
              <button style={primaryBtnStyle} onClick={() => navigate('/home')}>
                Back to Home 🏠
              </button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: '540px', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <h1 style={{ color: '#111827', fontSize: '24px', fontWeight: '700', margin: '0 0 6px 0' }}>
          {application?.status === 'REJECTED' ? 'Re-Apply as Seller' : isEditing ? 'Edit Seller Application' : 'Become a Seller'}
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' }}>
          {application?.status === 'REJECTED'
            ? 'Your previous application was not approved. Update your shop information below to resubmit.'
            : 'Fill in your shop details below. The campus administrator will verify your application before approving seller privileges.'}
        </p>

        {application?.status === 'REJECTED' && application.admin_notes && (
          <div style={rejectNoticeStyle}>
            <strong>Admin Note:</strong> {application.admin_notes}
          </div>
        )}

        {submittedSuccess && (
          <div style={successNoticeStyle}>
            ✅ Application submitted successfully! It is now pending admin review.
          </div>
        )}

        {error && <div style={errorBoxStyle}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <Field
            label="Shop / Business Name"
            name="businessName"
            value={form.businessName}
            onChange={handleChange}
            placeholder="e.g. Mechanical Batch Books & Tools"
            disabled={submitting}
          />
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>What will you sell? (Description)</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Semester 3 engineering textbooks, lab manuals, calculator, and drafting equipment…"
              rows={4}
              disabled={submitting}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
          <Field
            label="Contact / WhatsApp Number"
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            disabled={submitting}
          />

          <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
            <button
              type="button"
              style={cancelBtnStyle}
              onClick={() => {
                if (application?.status === 'PENDING') {
                  setIsEditing(false);
                } else {
                  navigate('/settings');
                }
              }}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" style={submitBtnStyle(submitting)} disabled={submitting}>
              {submitting ? 'Submitting…' : application ? 'Update & Re-Submit' : 'Submit Application'}
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
const rejectNoticeStyle: React.CSSProperties = {
  backgroundColor: '#fef2f2', border: '1px solid #fca5a5',
  borderRadius: '8px', padding: '12px 16px',
  color: '#991b1b', fontSize: '13px', marginBottom: '16px',
};
const successNoticeStyle: React.CSSProperties = {
  backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
  borderRadius: '8px', padding: '12px 16px',
  color: '#166534', fontSize: '13px', marginBottom: '16px',
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
const statusCardContainer: React.CSSProperties = {
  display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh',
};
const statusCard: React.CSSProperties = {
  backgroundColor: '#ffffff', border: '1px solid #e5e7eb',
  borderRadius: '14px', padding: '36px 32px', textAlign: 'center',
  maxWidth: '480px', width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
};
const pendingBadgeStyle: React.CSSProperties = {
  display: 'inline-block', backgroundColor: '#fef3c7', color: '#92400e',
  padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '700',
  marginTop: '12px',
};
const summaryBoxStyle: React.CSSProperties = {
  backgroundColor: '#f9fafb', border: '1px solid #e5e7eb',
  borderRadius: '8px', padding: '14px 16px', textAlign: 'left',
  display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px',
};
const summaryRow: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', gap: '10px',
};
const primaryBtnStyle: React.CSSProperties = {
  padding: '10px 18px', backgroundColor: '#111827', color: '#ffffff',
  borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: '600',
  cursor: 'pointer',
};
const outlineBtnStyle: React.CSSProperties = {
  padding: '10px 18px', backgroundColor: '#ffffff', color: '#374151',
  borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px', fontWeight: '600',
  cursor: 'pointer',
};

export default SellerOnboardingPage;
