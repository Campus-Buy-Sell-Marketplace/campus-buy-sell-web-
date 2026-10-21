// ============================================================
// LAVSA / UniTrade — Shipping and Delivery Policy Page
// Razorpay Compliance Requirement
// ============================================================

import React from 'react';
import PublicNavbar from '../../components/PublicNavbar/PublicNavbar';
import Footer from '../../components/Footer/Footer';
import { APP_NAME } from '../../config/appConfig';

const ShippingPolicyPage: React.FC = () => {
  return (
    <div style={pageWrapStyle}>
      <PublicNavbar />

      <main style={mainContentStyle}>
        <div style={containerStyle}>
          <div style={headerStyle}>
            <span style={badgeStyle}>Handover & Delivery</span>
            <h1 style={titleStyle}>Shipping & Delivery Policy</h1>
            <p style={subtitleStyle}>
              How products are delivered, timelines, shipping fees, and campus meetup verification for {APP_NAME}.
            </p>
          </div>

          <div style={contentCardStyle}>
            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>1. Delivery Model: Verified Campus Handover</h2>
              <p style={paragraphStyle}>
                {APP_NAME} operates as an on-campus community marketplace. Instead of external third-party courier
                shipping, products are delivered directly between students and verified sellers through{' '}
                <strong>scheduled campus meetups</strong> at trusted campus hubs (e.g., University Library, Student Center,
                Canteen, or Department Foyers).
              </p>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>2. Delivery Charges / Shipping Cost</h2>
              <div style={highlightBoxStyle}>
                <strong>💰 Zero Delivery Charges (Free Delivery):</strong>
                <p style={{ margin: '4px 0 0 0', lineHeight: 1.5 }}>
                  Because deliveries take place in person on campus, <strong>no courier, parcel, or shipping fees</strong>{' '}
                  are charged. The price you see on the product page (in INR ₹) is the complete and final amount.
                </p>
              </div>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>3. Delivery Timeline & Scheduling</h2>
              <ul style={listStyle}>
                <li>
                  <strong>Standard Handover Window:</strong> Orders are typically fulfilled within{' '}
                  <strong>same-day or 1 to 3 working days</strong> from the moment of order placement.
                </li>
                <li>
                  <strong>Meetup Scheduling:</strong> During checkout, buyers select their preferred campus meetup location
                  and target timeframe.
                </li>
                <li>
                  <strong>In-App Communication:</strong> Buyers and sellers can coordinate precise meetup minutes using the built-in messaging chat.
                </li>
              </ul>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>4. Handover Verification (6-Digit Delivery OTP)</h2>
              <p style={paragraphStyle}>
                Every order generated on {APP_NAME} is protected by an OTP-based delivery handshake:
              </p>
              <ul style={listStyle}>
                <li>When an order is confirmed, a confidential <strong>6-digit Handover OTP</strong> is generated in the buyer&apos;s account.</li>
                <li>At the meetup, the buyer inspects the item to ensure it matches the listing description and is in working order.</li>
                <li>The buyer gives the OTP to the seller, who inputs it to confirm delivery. This completes the transaction securely.</li>
              </ul>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>5. Non-Delivery / Delayed Handover</h2>
              <p style={paragraphStyle}>
                If a seller fails to arrive for the scheduled meetup or cannot provide the item within 48 hours of the agreed time,
                the buyer may cancel the order. For online payments processed via Razorpay, the full purchase amount will be
                refunded automatically within 5 to 7 business days.
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
  backgroundColor: '#fef3c7',
  color: '#92400e',
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
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  border: '1px solid #bbf7d0',
  fontSize: '13px',
  color: '#166534',
  marginTop: '10px',
};

export default ShippingPolicyPage;
