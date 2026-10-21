// ============================================================
// LAVSA / UniTrade — Cancellation and Refund Policy Page
// Razorpay Compliance Requirement
// ============================================================

import React from 'react';
import PublicNavbar from '../../components/PublicNavbar/PublicNavbar';
import Footer from '../../components/Footer/Footer';
import { APP_NAME } from '../../config/appConfig';

const RefundPolicyPage: React.FC = () => {
  return (
    <div style={pageWrapStyle}>
      <PublicNavbar />

      <main style={mainContentStyle}>
        <div style={containerStyle}>
          <div style={headerStyle}>
            <span style={badgeStyle}>Returns & Cancellations</span>
            <h1 style={titleStyle}>Cancellation & Refund Policy</h1>
            <p style={subtitleStyle}>
              Clear, transparent guidelines on order cancellation, returns, and automatic refund processing for {APP_NAME}.
            </p>
          </div>

          <div style={contentCardStyle}>
            {/* Quick Summary Highlights */}
            <div style={summaryGridStyle}>
              <div style={summaryCardStyle}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏱️</div>
                <div style={summaryTitleStyle}>Cancellation Window</div>
                <div style={summaryDescStyle}>Anytime before the physical campus handover OTP is shared</div>
              </div>

              <div style={summaryCardStyle}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>💳</div>
                <div style={summaryTitleStyle}>Refund Timeline</div>
                <div style={summaryDescStyle}>5 to 7 business days back to the original payment source</div>
              </div>

              <div style={summaryCardStyle}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛡️</div>
                <div style={summaryTitleStyle}>Buyer Protection</div>
                <div style={summaryDescStyle}>100% full refund if the item does not match description</div>
              </div>
            </div>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>1. Order Cancellation</h2>
              <p style={paragraphStyle}>
                We understand that schedules and study requirements change. You can cancel your order under the following terms:
              </p>
              <ul style={listStyle}>
                <li>
                  <strong>Before Meetup / Delivery:</strong> Buyers can cancel any pending order directly from their{' '}
                  <strong>&ldquo;My Orders&rdquo;</strong> page or by informing support prior to the physical meetup.
                </li>
                <li>
                  <strong>Seller Cancellation:</strong> If a seller is unable to attend the meetup or find the item,
                  the seller or system cancels the order immediately.
                </li>
                <li>
                  <strong>Post-Handover Restriction:</strong> Once the buyer inspects the product in person and gives
                  the 6-digit Handover OTP to the seller, the order is considered accepted and finalized, and cannot be cancelled.
                </li>
              </ul>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>2. Return Policy (In-Person Handover Verification)</h2>
              <p style={paragraphStyle}>
                Because {APP_NAME} operates on a student-to-student campus meetup model, every transaction includes
                built-in physical inspection:
              </p>
              <ul style={listStyle}>
                <li>
                  <strong>Physical Inspection on Campus:</strong> When meeting the seller, you have the full right to examine
                  the condition, completeness, and function of the textbook, calculator, or equipment.
                </li>
                <li>
                  <strong>Decline on Spot:</strong> If the item is defective, damaged, or does not match the photos/description,
                  simply do not share the Handover OTP. The order will be cancelled, and your payment will be refunded in full.
                </li>
              </ul>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>3. Refund Processing & Timelines</h2>
              <p style={paragraphStyle}>
                All eligible refunds for online payments are governed by standard banking and payment aggregator timelines:
              </p>
              <ul style={listStyle}>
                <li>
                  <strong>Initiation:</strong> When an online-paid order is cancelled, the refund is initiated through{' '}
                  <strong>Razorpay</strong> within <strong>24 business hours</strong>.
                </li>
                <li>
                  <strong>Credit to Account:</strong> The funds will be credited back to the original payment method
                  (UPI, Netbanking, or Debit/Credit Card) within <strong>5 to 7 working days</strong>, depending on your bank&apos;s settlement cycle.
                </li>
                <li>
                  <strong>No Hidden Deductions:</strong> 100% of the paid order amount will be refunded. No cancellation penalty or processing fee is deducted.
                </li>
              </ul>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>4. How to Request a Refund or Check Status</h2>
              <p style={paragraphStyle}>
                If you have not received your refund after 7 working days or need assistance with a disputed order:
              </p>
              <div style={contactBoxStyle}>
                <strong>Support Desk:</strong>{' '}
                <a href="mailto:lavanyamyadawad@gmail.com" style={linkStyle}>
                  lavanyamyadawad@gmail.com
                </a>
                <br />
                <strong>Helpline:</strong>{' '}
                <a href="tel:+919019301641" style={linkStyle}>
                  +91 90193 01641
                </a>
                <br />
                <em>Please provide your Order ID and Razorpay Payment ID for instant lookup.</em>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const pageWrapStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f8fafc',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const mainContentStyle: React.CSSProperties = {
  flex: 1,
  padding: '48px 24px',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '900px',
  margin: '0 auto',
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '36px',
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '20px',
  backgroundColor: '#fee2e2',
  color: '#b91c1c',
  fontSize: '12px',
  fontWeight: 600,
  marginBottom: '10px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: 800,
  color: '#0f172a',
  margin: '0 0 10px 0',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#64748b',
};

const contentCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '36px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  border: '1px solid #e2e8f0',
};

const summaryGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '16px',
  marginBottom: '32px',
};

const summaryCardStyle: React.CSSProperties = {
  padding: '18px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  textAlign: 'center',
};

const summaryTitleStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 700,
  color: '#0f172a',
  marginBottom: '4px',
};

const summaryDescStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#64748b',
  lineHeight: 1.5,
};

const sectionStyle: React.CSSProperties = {
  marginBottom: '28px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 700,
  color: '#0f172a',
  margin: '0 0 12px 0',
};

const paragraphStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#475569',
  lineHeight: 1.7,
  margin: 0,
};

const listStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#475569',
  lineHeight: 1.7,
  margin: '10px 0 0 0',
  paddingLeft: '24px',
};

const contactBoxStyle: React.CSSProperties = {
  marginTop: '12px',
  padding: '16px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  fontSize: '13px',
  color: '#334155',
  lineHeight: 1.6,
};

const linkStyle: React.CSSProperties = {
  color: '#2563eb',
  textDecoration: 'none',
  fontWeight: 500,
};

export default RefundPolicyPage;
