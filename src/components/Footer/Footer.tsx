// ============================================================
// LAVSA / UniTrade — Universal Compliance Footer
// Compliant with Razorpay & RBI Merchant Website Guidelines
// Clean Minimalist White & Monochrome Theme — No Emojis, No Blue
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
            <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Operating Entity:</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>
              Lavanya Mahantesh Yadawad
            </span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div style={colStyle}>
          <h4 style={headingStyle}>Marketplace</h4>
          <ul style={listStyle}>
            <li>
              <Link to="/" style={linkStyle} className="footer-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" style={linkStyle} className="footer-link">
                Browse Products
              </Link>
            </li>
            <li>
              <Link to="/login" style={linkStyle} className="footer-link">
                Sign In / Register
              </Link>
            </li>
            <li>
              <Link to="/seller/onboarding" style={linkStyle} className="footer-link">
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
              <Link to="/terms" style={linkStyle} className="footer-link" id="footer-link-terms">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" style={linkStyle} className="footer-link" id="footer-link-privacy">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" style={linkStyle} className="footer-link" id="footer-link-refunds">
                Cancellation & Refund Policy
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" style={linkStyle} className="footer-link" id="footer-link-shipping">
                Shipping & Delivery Policy
              </Link>
            </li>
            <li>
              <Link to="/contact-us" style={linkStyle} className="footer-link" id="footer-link-contact">
                Contact Us & Grievance
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Payment Security */}
        <div style={colStyle}>
          <h4 style={headingStyle}>Customer Support</h4>
          <div style={contactItemStyle}>
            <span style={contactIconWrapStyle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <div>
              <div style={contactLabelStyle}>Support Email</div>
              <a href="mailto:lavanyamyadawad@gmail.com" style={contactLinkStyle}>
                lavanyamyadawad@gmail.com
              </a>
            </div>
          </div>

          <div style={contactItemStyle}>
            <span style={contactIconWrapStyle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </span>
            <div>
              <div style={contactLabelStyle}>Helpdesk / Phone</div>
              <a href="tel:+919019301641" style={contactLinkStyle}>
                +91 90193 01641
              </a>
            </div>
          </div>

          <div style={contactItemStyle}>
            <span style={contactIconWrapStyle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </span>
            <div>
              <div style={contactLabelStyle}>Support Hours</div>
              <span style={{ fontSize: '12px', color: '#4b5563', fontWeight: 500 }}>
                Mon – Sat: 9:00 AM – 6:00 PM IST
              </span>
            </div>
          </div>

          <div style={securityBoxStyle}>
            <div style={securityHeaderStyle}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>100% SECURE PAYMENTS</span>
            </div>
            <div style={{ fontSize: '12px', color: '#111827', fontWeight: 700 }}>
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
            <Link to="/terms" style={bottomSubLinkStyle} className="footer-sublink">
              Terms
            </Link>
            <span style={{ color: '#d1d5db' }}>•</span>
            <Link to="/privacy" style={bottomSubLinkStyle} className="footer-sublink">
              Privacy
            </Link>
            <span style={{ color: '#d1d5db' }}>•</span>
            <Link to="/refund-policy" style={bottomSubLinkStyle} className="footer-sublink">
              Refunds
            </Link>
            <span style={{ color: '#d1d5db' }}>•</span>
            <Link to="/contact-us" style={bottomSubLinkStyle} className="footer-sublink">
              Contact
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: #111827 !important; }
        .footer-sublink:hover { color: #111827 !important; text-decoration: underline !important; }
      `}</style>
    </footer>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const footerStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  color: '#111827',
  borderTop: '1px solid #e5e7eb',
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
  color: '#111827',
};

const dotStyle: React.CSSProperties = {
  color: '#111827',
  fontSize: '18px',
};

const taglineStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#6b7280',
  margin: 0,
};

const descStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#6b7280',
  lineHeight: 1.6,
  margin: 0,
};

const merchantBadgeStyle: React.CSSProperties = {
  marginTop: '8px',
  padding: '10px 14px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
};

const headingStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#111827',
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
  color: '#4b5563',
  textDecoration: 'none',
  transition: 'color 0.15s ease',
};

const contactItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  marginBottom: '4px',
};

const contactIconWrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '26px',
  height: '26px',
  borderRadius: '6px',
  backgroundColor: '#f3f4f6',
  flexShrink: 0,
  marginTop: '2px',
};

const contactLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  fontWeight: 600,
};

const contactLinkStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#111827',
  textDecoration: 'none',
  fontWeight: 600,
};

const securityBoxStyle: React.CSSProperties = {
  marginTop: '12px',
  padding: '12px 14px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
};

const securityHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '11px',
  fontWeight: 700,
  color: '#111827',
  letterSpacing: '0.04em',
  marginBottom: '4px',
};

const bottomBarStyle: React.CSSProperties = {
  borderTop: '1px solid #e5e7eb',
  backgroundColor: '#ffffff',
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
  color: '#6b7280',
  textDecoration: 'none',
};

export default Footer;
