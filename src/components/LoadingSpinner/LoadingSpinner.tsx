// ============================================================
// LAVSA — Loading Spinner Component — Light Theme
// ============================================================

import React from 'react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = false,
  message,
}) => {
  const containerStyle: React.CSSProperties = fullScreen
    ? {
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        zIndex: 9999,
        gap: '16px',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        gap: '16px',
      };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} />
      {message && <p style={messageStyle}>{message}</p>}
      <style>{keyframes}</style>
    </div>
  );
};

const spinnerStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  border: '3px solid #e5e7eb',
  borderTop: '3px solid #111827',
  borderRadius: '50%',
  animation: 'lavsa-spin 0.75s linear infinite',
};

const messageStyle: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '14px',
  margin: 0,
  fontFamily: "'Inter', system-ui, sans-serif",
};

const keyframes = `
  @keyframes lavsa-spin {
    to { transform: rotate(360deg); }
  }
`;

export default LoadingSpinner;
