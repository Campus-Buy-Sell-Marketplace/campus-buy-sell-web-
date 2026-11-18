// ============================================================
// LAVSA / UniTrade — Universal Compliance Footer
// Compliant with Razorpay & RBI Merchant Website Guidelines
// Clean Minimalist White & Monochrome Theme — No Emojis, No Blue
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, APP_TAGLINE } from '../../config/appConfig';
import { IconMail, IconPhone, IconClock, IconLock } from '../UI/Icons';

const Footer: React.FC = () => {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        {/* Column 1: Brand & About */}
        <div style={colStyle}>
          <div style={brandHeaderStyle}>
            <span style={logoMarkStyle}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <span style={logoTextStyle}>{APP_NAME}</span>
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
            <span style={contactIconWrapStyle}><IconMail size={13} color="var(--text-muted)" /></span>
            <div>
              <div style={contactLabelStyle}>Support Email</div>
              <a href="mailto:lavanyamyadawad@gmail.com" style={contactLinkStyle}>
                lavanyamyadawad@gmail.com
              </a>
            </div>
          </div>

          <div style={contactItemStyle}>
            <span style={contactIconWrapStyle}><IconPhone size={13} color="var(--text-muted)" /></span>
            <div>
              <div style={contactLabelStyle}>Helpdesk / Phone</div>
              <a href="tel:+919019301641" style={contactLinkStyle}>
                +91 90193 01641
              </a>
            </div>
          </div>

          <div style={contactItemStyle}>
            <span style={contactIconWrapStyle}><IconClock size={13} color="var(--text-muted)" /></span>
            <div>
              <div style={contactLabelStyle}>Support Hours</div>
              <span style={{ fontSize: '12px', color: '#4b5563', fontWeight: 500 }}>
                Mon – Sat: 9:00 AM – 6:00 PM IST
              </span>
            </div>
          </div>

          <div style={securityBoxStyle}>
            <div style={securityHeaderStyle}>
              <IconLock size={12} color="var(--text)" strokeWidth={2.2} />
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
  gap: '8px',
};

const logoMarkStyle: React.CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: 7,
  background: 'var(--brand-gradient, linear-gradient(135deg, #4f46e5, #7c3aed))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const logoTextStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 800,
  letterSpacing: '-0.03em',
  color: '#111827',
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
