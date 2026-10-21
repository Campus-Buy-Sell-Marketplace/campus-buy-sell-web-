// ============================================================
// LAVSA / UniTrade — Universal Compliance Footer
// Compliant with Razorpay & RBI Merchant Website Guidelines
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, APP_TAGLINE } from '../../config/appConfig';

const Footer: React.FC = () => {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        {/* Column 1: Brand & About */}
        <div style={colStyle}>
          <div style={brandHeaderStyle}>
            <span style={logoTextStyle}>{APP_NAME}</span>
            <span style={dotStyle}>●</span>
          </div>
          <p style={taglineStyle}>{APP_TAGLINE}</p>
          <p style={descStyle}>
            A trusted student-to-student marketplace for textbooks, lab supplies,
            engineering equipment, and campus essentials. Verified student meetups
            and secure payments.
          </p>
          <div style={merchantBadgeStyle}>
            <span style={{ fontSize: '11px', color: '#9ca3af' }}>Operating Entity:</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#f3f4f6' }}>
              Lavanya Mahantesh Yadawad
            </span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div style={colStyle}>
          <h4 style={headingStyle}>Marketplace</h4>
          <ul style={listStyle}>
            <li>
              <Link to="/" style={linkStyle}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" style={linkStyle}>
                Browse Products
              </Link>
            </li>
            <li>
              <Link to="/login" style={linkStyle}>
                Sign In / Register
              </Link>
            </li>
            <li>
              <Link to="/seller/onboarding" style={linkStyle}>
                Sell on {APP_NAME}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal & Regulatory Policies (Razorpay Requirements) */}
        <div style={colStyle}>
          <h4 style={headingStyle}>Policies & Legal</h4>
          <ul style={listStyle}>
            <li>
              <Link to="/terms" style={linkStyle} id="footer-link-terms">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" style={linkStyle} id="footer-link-privacy">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" style={linkStyle} id="footer-link-refunds">
                Cancellation & Refund Policy
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" style={linkStyle} id="footer-link-shipping">
                Shipping & Delivery Policy
              </Link>
            </li>
            <li>
              <Link to="/contact-us" style={linkStyle} id="footer-link-contact">
                Contact Us & Grievance
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Payment Security */}
        <div style={colStyle}>
          <h4 style={headingStyle}>Customer Support</h4>
          <div style={contactItemStyle}>
            <span style={contactIconStyle}>📧</span>
            <div>
              <div style={contactLabelStyle}>Support Email</div>
              <a href="mailto:support.lavsa@gmail.com" style={contactLinkStyle}>
                support.lavsa@gmail.com
              </a>
            </div>
          </div>
          <div style={contactItemStyle}>
            <span style={contactIconStyle}>📞</span>
            <div>
              <div style={contactLabelStyle}>Helpdesk / Phone</div>
              <a href="tel:+919019301641" style={contactLinkStyle}>
                +91 90193 01641
              </a>
            </div>
          </div>
          <div style={contactItemStyle}>
            <span style={contactIconStyle}>⏰</span>
            <div>
              <div style={contactLabelStyle}>Support Hours</div>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                Mon – Sat: 9:00 AM – 6:00 PM IST
              </span>
            </div>
          </div>

          <div style={securityBoxStyle}>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>
              🔒 100% SECURE PAYMENTS
            </div>
            <div style={{ fontSize: '12px', color: '#e5e7eb', fontWeight: 600 }}>
              Powered by Razorpay
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
              UPI • Netbanking • Debit/Credit Cards
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={bottomBarStyle}>
        <div style={bottomInnerStyle}>
          <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
            © {new Date().getFullYear()} {APP_NAME} — Campus Marketplace. All rights reserved.
          </p>
          <div style={bottomPolicyLinksStyle}>
            <Link to="/terms" style={bottomSubLinkStyle}>
              Terms
            </Link>
            <span style={{ color: '#4b5563' }}>•</span>
            <Link to="/privacy" style={bottomSubLinkStyle}>
              Privacy
            </Link>
            <span style={{ color: '#4b5563' }}>•</span>
            <Link to="/refund-policy" style={bottomSubLinkStyle}>
              Refunds
            </Link>
            <span style={{ color: '#4b5563' }}>•</span>
            <Link to="/contact-us" style={bottomSubLinkStyle}>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const footerStyle: React.CSSProperties = {
  backgroundColor: '#0f172a',
  color: '#e2e8f0',
  borderTop: '1px solid #1e293b',
  marginTop: 'auto',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '48px 24px 36px 24px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '36px',
};

const colStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const brandHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const logoTextStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 800,
  letterSpacing: '-0.03em',
  color: '#ffffff',
};

const dotStyle: React.CSSProperties = {
  color: '#3b82f6',
  fontSize: '18px',
};

const taglineStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#93c5fd',
  margin: 0,
};

const descStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#94a3b8',
  lineHeight: 1.6,
  margin: 0,
};

const merchantBadgeStyle: React.CSSProperties = {
  marginTop: '8px',
  padding: '8px 12px',
  backgroundColor: 'rgba(30, 41, 59, 0.7)',
  borderRadius: '6px',
  border: '1px solid #334155',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};

const headingStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#f8fafc',
  margin: '0 0 4px 0',
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const linkStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#94a3b8',
  textDecoration: 'none',
  transition: 'color 0.15s ease',
};

const contactItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  marginBottom: '4px',
};

const contactIconStyle: React.CSSProperties = {
  fontSize: '16px',
  lineHeight: '1.4',
};

const contactLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  fontWeight: 600,
};

const contactLinkStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#38bdf8',
  textDecoration: 'none',
  fontWeight: 500,
};

const securityBoxStyle: React.CSSProperties = {
  marginTop: '12px',
  padding: '12px',
  backgroundColor: '#1e293b',
  borderRadius: '8px',
  border: '1px solid #334155',
};

const bottomBarStyle: React.CSSProperties = {
  borderTop: '1px solid #1e293b',
  backgroundColor: '#090d16',
  padding: '16px 24px',
};

const bottomInnerStyle: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '12px',
};

const bottomPolicyLinksStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const bottomSubLinkStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#94a3b8',
  textDecoration: 'none',
};

export default Footer;
