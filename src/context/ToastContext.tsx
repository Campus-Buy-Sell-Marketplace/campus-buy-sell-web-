// ============================================================
// LAVSA — Global In-Website Toast & Notification System
// Replaces browser popups with sleek, auto-dismissing notifications.
// ============================================================

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 3500) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }
    },
    [hideToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {/* Floating In-App Toast Container */}
      <div style={toastContainerStyle} role="region" aria-label="Notifications" id="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              ...toastItemStyle,
              ...getToastStyleByType(t.type),
            }}
            className="lavsa-toast-slide-in"
          >
            <span style={toastIconStyle}>{getToastIcon(t.type)}</span>
            <div style={toastMessageStyle}>{t.message}</div>
            <button
              onClick={() => hideToast(t.id)}
              style={toastCloseBtnStyle}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateY(-16px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .lavsa-toast-slide-in {
          animation: toastSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};

// ── Helpers & Styles ─────────────────────────────────────────────────────────

function getToastIcon(type: ToastType): string {
  switch (type) {
    case 'success': return '✅';
    case 'error':   return '❌';
    case 'warning': return '⚠️';
    case 'info':    return 'ℹ️';
  }
}

function getToastStyleByType(type: ToastType): React.CSSProperties {
  switch (type) {
    case 'success':
      return {
        backgroundColor: '#064e3b',
        color: '#ecfdf5',
        borderColor: '#059669',
      };
    case 'error':
      return {
        backgroundColor: '#7f1d1d',
        color: '#fef2f2',
        borderColor: '#dc2626',
      };
    case 'warning':
      return {
        backgroundColor: '#78350f',
        color: '#fffbeb',
        borderColor: '#d97706',
      };
    case 'info':
    default:
      return {
        backgroundColor: '#111827',
        color: '#f9fafb',
        borderColor: '#374151',
      };
  }
}

const toastContainerStyle: React.CSSProperties = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  zIndex: 999999,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  maxWidth: '400px',
  width: 'calc(100vw - 40px)',
  pointerEvents: 'none',
};

const toastItemStyle: React.CSSProperties = {
  pointerEvents: 'auto',
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1px solid',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  backdropFilter: 'blur(8px)',
  transition: 'all 0.2s ease',
};

const toastIconStyle: React.CSSProperties = {
  fontSize: '18px',
  marginRight: '10px',
  flexShrink: 0,
};

const toastMessageStyle: React.CSSProperties = {
  flex: 1,
  wordBreak: 'break-word',
};

const toastCloseBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'inherit',
  opacity: 0.7,
  fontSize: '14px',
  cursor: 'pointer',
  padding: '2px 6px',
  marginLeft: '10px',
  borderRadius: '4px',
  lineHeight: 1,
  flexShrink: 0,
};
