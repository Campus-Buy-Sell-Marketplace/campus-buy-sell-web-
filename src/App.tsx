// ============================================================
// LAVSA — Main App Entry Point
// ============================================================

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import IntroAnimation from './components/IntroAnimation/IntroAnimation';
import { GOOGLE_CLIENT_ID } from './config/appConfig';

// Fallback placeholder so GoogleOAuthProvider never crashes when no client ID is configured.
// The GoogleLogin button itself is hidden in LoginPage when GOOGLE_CLIENT_ID is empty.
const OAUTH_CLIENT_ID = GOOGLE_CLIENT_ID || 'placeholder-client-id.apps.googleusercontent.com';

function App(): React.JSX.Element {
  return (
    <GoogleOAuthProvider clientId={OAUTH_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <IntroAnimation />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
