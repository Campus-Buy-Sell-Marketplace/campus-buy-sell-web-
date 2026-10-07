// ============================================================
// LAVSA — In-Website Confirmation / Prompt Modal
// Replaces window.confirm & window.prompt with a sleek in-app UI.
// ============================================================

import React, { useState, useEffect } from 'react';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  requireInput?: boolean;
  inputPlaceholder?: string;
  initialValue?: string;
  onConfirm: (inputValue?: string) => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false,
  requireInput = false,
  inputPlaceholder = '',
  initialValue = '',
  onConfirm,
  onCancel,
}) => {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setInputValue(initialValue);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(requireInput ? inputValue : undefined);
  };

  return (
    <div style={overlayStyle} onClick={onCancel}>
      <div
        style={modalCardStyle}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>{isDanger ? '⚠️' : '❓'}</span>
            <h3 id="confirm-modal-title" style={titleStyle}>{title}</h3>
          </div>
          <button onClick={onCancel} style={closeBtnStyle} aria-label="Close modal">
            ✕
          </button>
        </div>

        <p style={messageStyle}>{message}</p>

        <form onSubmit={handleSubmit}>
          {requireInput && (
            <div style={{ marginTop: '14px', marginBottom: '18px' }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={inputPlaceholder}
                style={inputStyle}
                autoFocus
              />
            </div>
          )}

          <div style={buttonRowStyle}>
            <button
              type="button"
              onClick={onCancel}
              style={cancelBtnStyle}
              id="confirm-modal-cancel"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              style={{
                ...confirmBtnStyle,
                backgroundColor: isDanger ? '#dc2626' : '#111827',
              }}
              id="confirm-modal-action"
            >
              {confirmLabel}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes modalPopIn {
          from {
            opacity: 0;
            transform: scale(0.94) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        #confirm-modal-cancel:hover {
          background-color: #f3f4f6 !important;
        }
        #confirm-modal-action:hover {
          opacity: 0.9 !important;
        }
      `}</style>
    </div>
  );
};

export default ConfirmModal;

// ── Styles ────────────────────────────────────────────────────────────────────

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.55)',
  backdropFilter: 'blur(4px)',
  zIndex: 999998,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
};

const modalCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '440px',
  padding: '24px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
  animation: 'modalPopIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 700,
  color: '#111827',
  margin: 0,
};

const closeBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '16px',
  color: '#9ca3af',
  cursor: 'pointer',
  padding: '4px 8px',
  borderRadius: '6px',
};

const messageStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#4b5563',
  lineHeight: 1.5,
  margin: '0 0 18px 0',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '14px',
  color: '#111827',
  outline: 'none',
  boxSizing: 'border-box',
};

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '20px',
};

const cancelBtnStyle: React.CSSProperties = {
  padding: '10px 18px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  backgroundColor: '#ffffff',
  color: '#374151',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background-color 0.15s',
};

const confirmBtnStyle: React.CSSProperties = {
  padding: '10px 18px',
  borderRadius: '8px',
  border: 'none',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
};
