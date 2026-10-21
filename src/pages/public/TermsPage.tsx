// ============================================================
// LAVSA / UniTrade — Terms and Conditions Page
// Razorpay Compliance Requirement
// ============================================================

import React from 'react';
import PublicNavbar from '../../components/PublicNavbar/PublicNavbar';
import Footer from '../../components/Footer/Footer';
import { APP_NAME } from '../../config/appConfig';

const TermsPage: React.FC = () => {
  return (
    <div style={pageWrapStyle}>
      <PublicNavbar />

      <main style={mainContentStyle}>
        <div style={containerStyle}>
          <div style={headerStyle}>
            <span style={badgeStyle}>Legal Terms</span>
            <h1 style={titleStyle}>Terms and Conditions</h1>
            <p style={subtitleStyle}>
              Last updated: October 2026. Please read these terms carefully before using the {APP_NAME} marketplace.
            </p>
          </div>

          <div style={contentCardStyle}>
            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>1. Introduction & Acceptance</h2>
              <p style={paragraphStyle}>
                Welcome to <strong>{APP_NAME} — Campus Marketplace</strong>, operated by{' '}
                <strong>Lavanya Mahantesh Yadawad</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;).
                By accessing or using our website, services, and online payment gateways, you agree to be bound
                by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our platform.
              </p>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>2. Nature of Platform & Services</h2>
              <p style={paragraphStyle}>
                {APP_NAME} provides a hyper-local campus marketplace connecting verified college students,
                faculty, and campus sellers to list, discover, buy, and sell second-hand academic textbooks,
                stationery, electronics, lab supplies, and dorm essentials.
              </p>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>3. User Eligibility & Account Responsibilities</h2>
              <ul style={listStyle}>
                <li>Users must be enrolled students, staff, or faculty members with valid university affiliation.</li>
                <li>Users are responsible for maintaining the confidentiality of their credentials and password.</li>
                <li>Each user agrees to provide accurate, up-to-date, and genuine contact and profile information.</li>
                <li>Accounts found engaging in abusive behavior, fraud, or spam will be suspended or permanently revoked.</li>
              </ul>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>4. Product Listings & Permitted Goods</h2>
              <p style={paragraphStyle}>
                All listings must comply with campus regulations and Indian laws. Specifically:
              </p>
              <ul style={listStyle}>
                <li><strong>Allowed Items:</strong> Pre-owned textbooks, calculators, stationery, engineering kits, lab aprons, dorm furniture, electronics in working order.</li>
                <li><strong>Prohibited Items:</strong> Stolen property, counterfeit goods, hazardous materials, prescription medications, alcohol/tobacco, examination cheat-sheets/leaks, weapons, and any illegal substances.</li>
                <li>All prices listed must be clearly stated in Indian Rupees (INR ₹) and accurately represent the item offered.</li>
              </ul>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>5. Payments & Transaction Processing</h2>
              <p style={paragraphStyle}>
                We support two secure checkout payment modes:
              </p>
              <ul style={listStyle}>
                <li>
                  <strong>Pay Online via Razorpay:</strong> Buyers can pay digitally using UPI (Google Pay, PhonePe, Paytm),
                  Netbanking, and Debit/Credit Cards. Payments are securely processed through Razorpay Payment Gateway.
                  Upon payment success, a 6-digit Handover OTP is generated for the buyer.
                </li>
                <li>
                  <strong>Pay at Meetup (Offline):</strong> Buyers and sellers settle payment directly during the physical meetup.
                </li>
              </ul>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>6. Campus Handover & OTP Delivery Mechanism</h2>
              <p style={paragraphStyle}>
                To safeguard buyers and sellers against fraud, items are delivered via mutual in-person campus meetups:
              </p>
              <ul style={listStyle}>
                <li>Buyers must physically inspect the product condition during the campus meetup.</li>
                <li>The 6-digit Handover OTP is shared with the seller <em>only after</em> the buyer is completely satisfied with the item.</li>
                <li>Once the seller enters the OTP into the application, the order is marked as completed and fulfilled.</li>
              </ul>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>7. Limitation of Liability</h2>
              <p style={paragraphStyle}>
                {APP_NAME} acts as a technological platform facilitator for student transactions. While we perform
                seller role verification and moderate product listings, we are not liable for direct quality discrepancies
                outside our verified OTP handover process.
              </p>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>8. Governing Law & Jurisdiction</h2>
              <p style={paragraphStyle}>
                These Terms and Conditions shall be governed by and construed in accordance with the laws of India.
                Any disputes arising under or in connection with these terms shall be subject to the exclusive
                jurisdiction of the courts of Karnataka, India.
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
  backgroundColor: '#e0e7ff',
  color: '#3730a3',
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

export default TermsPage;
