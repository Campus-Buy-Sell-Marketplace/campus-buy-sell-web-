// ============================================================
// LAVSA / UniTrade — Privacy Policy Page
// Razorpay Compliance Requirement
// ============================================================

import React from 'react';
import PublicNavbar from '../../components/PublicNavbar/PublicNavbar';
import Footer from '../../components/Footer/Footer';
import { APP_NAME } from '../../config/appConfig';

const PrivacyPage: React.FC = () => {
  return (
    <div style={pageWrapStyle}>
      <PublicNavbar />

      <main style={mainContentStyle}>
        <div style={containerStyle}>
          <div style={headerStyle}>
            <span style={badgeStyle}>Privacy & Security</span>
            <h1 style={titleStyle}>Privacy Policy</h1>
            <p style={subtitleStyle}>
              Your privacy is of utmost importance to us. This policy details how {APP_NAME} collects,
              uses, and protects your information.
            </p>
          </div>

          <div style={contentCardStyle}>
            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>1. Information We Collect</h2>
              <p style={paragraphStyle}>
                To provide our campus marketplace services, we may collect the following information:
              </p>
              <ul style={listStyle}>
                <li><strong>Account Data:</strong> Name, university email address, role, and encrypted password.</li>
                <li><strong>Order & Transaction Records:</strong> Order items, selected meetup venue, transaction amount, and order status.</li>
                <li><strong>Communication:</strong> In-app chat messages exchanged between buyers and sellers regarding product questions or meetup timing.</li>
              </ul>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>2. Payment Information Security (Razorpay)</h2>
              <div style={highlightBoxStyle}>
                <strong>🛡️ Zero Cardholder Data Retention:</strong>
                <p style={{ margin: '6px 0 0 0', lineHeight: 1.6 }}>
                  {APP_NAME} does <strong>NOT</strong> collect, view, transmit, or store sensitive financial data
                  such as debit/credit card numbers, CVVs, netbanking passwords, or UPI PINs. All payment transactions
                  are handled directly within the encrypted, PCI-DSS Level 1 compliant interface of our payment partner,{' '}
                  <strong>Razorpay Software Private Limited</strong>.
                </p>
              </div>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>3. How We Use Your Information</h2>
              <ul style={listStyle}>
                <li>To authenticate accounts and restrict access to verified campus members.</li>
                <li>To facilitate marketplace transactions, generate delivery OTPs, and track order fulfillment.</li>
                <li>To send transactional notifications, order confirmations, and refund alerts.</li>
                <li>To prevent fraud, abuse, and illicit campus activities.</li>
              </ul>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>4. Data Sharing & Third Parties</h2>
              <p style={paragraphStyle}>
                We do not sell, rent, or trade your personal data to advertisers or third-party marketers.
                Information is disclosed only to:
              </p>
              <ul style={listStyle}>
                <li><strong>Payment Aggregator (Razorpay):</strong> Strictly for transaction initiation, status verification, and refund settlement.</li>
                <li><strong>Law Enforcement:</strong> Solely if required by applicable Indian laws or formal regulatory mandates.</li>
              </ul>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>5. Data Retention & User Rights</h2>
              <p style={paragraphStyle}>
                Users retain the right to view, update, or request deletion of their account profile by contacting
                our support desk at{' '}
                <a href="mailto:lavanyamyadawad@gmail.com" style={linkStyle}>
                  lavanyamyadawad@gmail.com
                </a>
                . Transaction records required for accounting and regulatory compliance are retained in accordance with statutory requirements.
              </p>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>6. Contacting the Grievance & Privacy Officer</h2>
              <p style={paragraphStyle}>
                If you have questions about our privacy practices, reach our Data Privacy desk:
                <br />
                <strong>Lavanya Mahantesh Yadawad</strong>
                <br />
                Email:{' '}
                <a href="mailto:lavanyamyadawad@gmail.com" style={linkStyle}>
                  lavanyamyadawad@gmail.com
                </a>
                <br />
                Phone: +91 90193 01641
              </p>
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
  backgroundColor: '#dcfce7',
  color: '#15803d',
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

const highlightBoxStyle: React.CSSProperties = {
  padding: '16px',
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  border: '1px solid #bfdbfe',
  fontSize: '13px',
  color: '#1e3a8a',
  marginTop: '10px',
};

const linkStyle: React.CSSProperties = {
  color: '#2563eb',
  textDecoration: 'none',
  fontWeight: 500,
};

export default PrivacyPage;
