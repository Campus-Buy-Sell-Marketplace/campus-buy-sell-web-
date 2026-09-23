// ============================================================
// LAVSA — Centralized Application Configuration
// ============================================================
// Change APP_NAME here to rename the app everywhere in one go.

/** The application name. Change this value to rename the entire app. */
export const APP_NAME = 'LAVSA';

/** The application tagline shown on the login page. */
export const APP_TAGLINE = 'Campus Buy & Sell Marketplace';

/** Backend REST API base URL. */
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

/** Google OAuth Client ID. */
export const GOOGLE_CLIENT_ID =
  process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

/** localStorage key for the JWT token. */
export const AUTH_TOKEN_KEY = 'lavsa_auth_token';

/** sessionStorage key for intro animation tracking. */
export const INTRO_SHOWN_KEY = 'lavsa_intro_shown';
