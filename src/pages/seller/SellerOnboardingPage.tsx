// ============================================================
// LAVSA — Seller Onboarding Page
// Multi-step style onboarding form and verification status tracking.
// Redesigned with the LAVSA design system (global.css + UI kit).
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { applyAsSeller, fetchSellerApplicationStatus } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Badge, PageHeader, PageLoader, ErrorBanner, Input, Textarea, Label } from '../../components/UI/ui';
import {
  IconCheckCircle,
  IconClock,
  IconShield,
} from '../../components/UI/Icons';
import { formatDate } from '../../utils/format';

const SellerOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSeller, refreshUser } = useAuth();

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
    if (!form.businessName.trim()) { setError('Business / Shop name is required.'); return; }
    if (!form.description.trim()) { setError('Description is required.'); return; }
    if (!form.contactNumber.trim()) { setError('Contact number is required.'); return; }

    setSubmitting(true);
    try {
      await applyAsSeller(form);
      setSubmittedSuccess(true);
      await refreshUser();
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

  if (loadingStatus) {
    return (
      <AppLayout>
        <PageLoader label="Checking seller status..." />
      </AppLayout>
    );
  }

  // If already approved seller
  if (isSeller || application?.status === 'APPROVED') {
    return (
      <AppLayout>
        <div style={{ maxWidth: 520, margin: '60px auto 0', textAlign: 'center' }}>
          <Card padded style={{ padding: '40px 32px' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'var(--success-soft)',
                color: 'var(--success-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <IconCheckCircle size={36} />
            </div>

            <Badge color="green" style={{ marginBottom: 12 }}>
              Verified Campus Seller
            </Badge>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', margin: '0 0 8px 0' }}>
              You're an Approved Seller!
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Your campus seller account for <strong>{application?.business_name || 'your shop'}</strong> is active. You can list items, coordinate meetups, and earn on campus.
            </p>

            <Button
              variant="primary"
              size="lg"
              block
              iconRight="arrow-right"
              onClick={() => navigate('/seller/dashboard')}
            >
              Go to Seller Dashboard
            </Button>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // If pending application and not editing
  if (application?.status === 'PENDING' && !isEditing) {
    return (
      <AppLayout>
        <div style={{ maxWidth: 520, margin: '60px auto 0', textAlign: 'center' }}>
          <Card padded style={{ padding: '36px 32px' }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'var(--warning-soft)',
                color: 'var(--warning-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <IconClock size={32} />
            </div>

            <Badge color="amber" style={{ marginBottom: 12 }}>
              Under Admin Review
            </Badge>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', margin: '0 0 8px 0' }}>
              Application Submitted
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Your application to become a campus seller has been received and is waiting for review by the campus administrator.
            </p>

            <div
              style={{
                background: 'var(--surface-soft)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 18px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: 13,
                marginBottom: 24,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shop Name:</span>
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{application.business_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>What you sell:</span>
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{application.description}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Contact:</span>
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{application.contact_number}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Submitted:</span>
                <span style={{ color: 'var(--text-secondary)' }}>{formatDate(application.created_at)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <Button
                variant="secondary"
                block
                icon="edit"
                onClick={() => setIsEditing(true)}
              >
                Edit Details
              </Button>
              <Button
                variant="dark"
                block
                icon="home"
                onClick={() => navigate('/home')}
              >
                Back to Home
              </Button>
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // Application Form
  return (
    <AppLayout>
      <div className="page seller-onboarding-page" style={{ maxWidth: 580, margin: '0 auto' }}>
        <PageHeader
          title={application?.status === 'REJECTED' ? 'Re-Apply as Seller' : isEditing ? 'Edit Seller Application' : 'Become a Campus Seller'}
          subtitle={
            application?.status === 'REJECTED'
              ? 'Your previous application was not approved. Update your shop information below to resubmit.'
              : 'Start selling textbooks, tech, dorm essentials, and project kits to campus peers.'
          }
          icon="store"
        />

        {application?.status === 'REJECTED' && application.admin_notes && (
          <div
            style={{
              background: 'var(--danger-soft)',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px',
              fontSize: 13,
              color: 'var(--danger-strong)',
              marginBottom: 16,
            }}
          >
            <strong>Admin Feedback:</strong> {application.admin_notes}
          </div>
        )}

        {submittedSuccess && (
          <div
            style={{
              background: 'var(--success-soft)',
              border: '1px solid var(--success-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px',
              fontSize: 13,
              color: 'var(--success-strong)',
              marginBottom: 16,
            }}
          >
            ✓ Application submitted successfully! It is now pending admin review.
          </div>
        )}

        {error && (
          <div style={{ marginBottom: 16 }}>
            <ErrorBanner message={error} onRetry={() => setError('')} />
          </div>
        )}

        <Card padded>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <Label htmlFor="businessName">Shop / Student Profile Name *</Label>
              <Input
                id="businessName"
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                placeholder="e.g. Mechanical Batch Books &amp; Tools"
                disabled={submitting}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">What will you sell on campus? *</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. Semester 3 engineering textbooks, lab manuals, scientific calculators, and drafting equipment…"
                rows={4}
                disabled={submitting}
                required
              />
            </div>

            <div>
              <Label htmlFor="contactNumber">WhatsApp / Campus Phone Number *</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                value={form.contactNumber}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                disabled={submitting}
                required
              />
            </div>

            <div
              style={{
                background: 'var(--surface-soft)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                fontSize: 12,
                color: 'var(--text-secondary)',
                display: 'flex',
                gap: 8,
              }}
            >
              <IconShield size={16} color="var(--brand)" style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                Campus safety policy: all items must be legitimate, legal, and delivered in person on campus grounds.
              </span>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              <Button
                type="button"
                variant="secondary"
                disabled={submitting}
                onClick={() => {
                  if (application?.status === 'PENDING') {
                    setIsEditing(false);
                  } else {
                    navigate('/home');
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                block
              >
                {submitting ? 'Submitting…' : application ? 'Update & Re-Submit' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SellerOnboardingPage;
