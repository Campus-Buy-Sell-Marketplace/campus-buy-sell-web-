// ============================================================
// LAVSA / UniTrade — Contact Us & Grievance Redressal Page
// Razorpay Compliance Requirement
// ============================================================

import React from 'react';
import PublicNavbar from '../../components/PublicNavbar/PublicNavbar';
import Footer from '../../components/Footer/Footer';
import { APP_NAME } from '../../config/appConfig';

const ContactUsPage: React.FC = () => {
  return (
    <div style={pageWrapStyle}>
      <PublicNavbar />

      <main style={mainContentStyle}>
        <div style={containerStyle}>
          <div style={headerSectionStyle}>
            <span style={badgeStyle}>Get In Touch</span>
            <h1 style={titleStyle}>Contact Us & Grievance Support</h1>
            <p style={subtitleStyle}>
              We are here to assist campus buyers, sellers, and community members with any questions,
              order issues, or technical inquiries.
            </p>
          </div>

          <div style={gridStyle}>
            {/* Merchant Details Card */}
            <div style={cardStyle}>
              <h2 style={cardHeadingStyle}>🏢 Merchant / Operating Entity Details</h2>
              <p style={textStyle}>
                In accordance with Razorpay payment aggregator and regulatory guidelines, below are our verified
                business and operational particulars:
              </p>

              <table style={tableStyle}>
                <tbody>
                  <tr>
                    <td style={thStyle}>Legal Entity / Proprietor</td>
                    <td style={tdStyle}>Lavanya Mahantesh Yadawad</td>
                  </tr>
                  <tr>
                    <td style={thStyle}>Platform Name</td>
                    <td style={tdStyle}>{APP_NAME} — Campus Buy & Sell Marketplace</td>
                  </tr>
                  <tr>
                    <td style={thStyle}>Operational Address</td>
                    <td style={tdStyle}>
                      Campus Incubation Center, Student Marketplace Hub,
                      <br />
                      Hubballi - Dharwad, Karnataka 580031, India
                    </td>
                  </tr>
                  <tr>
                    <td style={thStyle}>Official Email</td>
                    <td style={tdStyle}>
                      <a href="mailto:support.lavsa@gmail.com" style={linkStyle}>
                        support.lavsa@gmail.com
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style={thStyle}>Contact / Helpdesk Phone</td>
                    <td style={tdStyle}>
                      <a href="tel:+919019301641" style={linkStyle}>
                        +91 90193 01641
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style={thStyle}>Operational Hours</td>
                    <td style={tdStyle}>Monday to Saturday: 9:00 AM – 6:00 PM IST</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Grievance & Dispute Resolution */}
            <div style={cardStyle}>
              <h2 style={cardHeadingStyle}>⚖️ Grievance Officer & Resolution Process</h2>
              <p style={textStyle}>
                If you encounter any payment discrepancy, delivery disagreement, or account issues:
              </p>

              <div style={grievanceStepStyle}>
                <strong>Step 1: In-App Support</strong>
                <p style={stepDescStyle}>
                  Contact our support team directly via email at{' '}
                  <a href="mailto:support.lavsa@gmail.com" style={linkStyle}>
                    support.lavsa@gmail.com
                  </a>{' '}
                  with your Order ID and payment transaction reference.
                </p>
              </div>

              <div style={grievanceStepStyle}>
                <strong>Step 2: Turnaround Time</strong>
                <p style={stepDescStyle}>
                  All payment and order grievances are acknowledged within <strong>24 business hours</strong>{' '}
                  and investigated/resolved within <strong>3 to 5 business days</strong>.
                </p>
              </div>

              <div style={grievanceStepStyle}>
                <strong>Step 3: Refund Assistance</strong>
                <p style={stepDescStyle}>
                  For orders paid via Razorpay where the physical meetup was cancelled or unfulfilled,
                  refunds are automatically processed to the source payment method within 5–7 business days.
                </p>
              </div>
            </div>
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
  maxWidth: '1000px',
  margin: '0 auto',
};

const headerSectionStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '40px',
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '20px',
  backgroundColor: '#e0e7ff',
  color: '#3730a3',
  fontSize: '12px',
  fontWeight: 600,
  marginBottom: '12px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: 800,
  color: '#0f172a',
  margin: '0 0 12px 0',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '15px',
  color: '#64748b',
  maxWidth: '650px',
  margin: '0 auto',
  lineHeight: 1.6,
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '24px',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '28px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  border: '1px solid #e2e8f0',
};

const cardHeadingStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 700,
  color: '#0f172a',
  margin: '0 0 16px 0',
};

const textStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#475569',
  lineHeight: 1.6,
  marginBottom: '20px',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle: React.CSSProperties = {
  padding: '10px 12px 10px 0',
  fontSize: '13px',
  fontWeight: 600,
  color: '#334155',
  borderBottom: '1px solid #f1f5f9',
  verticalAlign: 'top',
  width: '40%',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 0',
  fontSize: '13px',
  color: '#64748b',
  borderBottom: '1px solid #f1f5f9',
  lineHeight: 1.5,
};

const linkStyle: React.CSSProperties = {
  color: '#2563eb',
  textDecoration: 'none',
  fontWeight: 500,
};

const grievanceStepStyle: React.CSSProperties = {
  marginBottom: '16px',
  padding: '14px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  fontSize: '13px',
  color: '#1e293b',
};

const stepDescStyle: React.CSSProperties = {
  margin: '4px 0 0 0',
  color: '#64748b',
  lineHeight: 1.5,
};

export default ContactUsPage;
