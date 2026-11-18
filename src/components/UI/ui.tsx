// ============================================================
// LAVSA — Reusable UI Primitives
// Button, Badge, EmptyState, PageHeader, Spinner, Skeleton.
// Built on the design tokens in src/styles/global.css.
// ============================================================

import React from 'react';
import { Icon, IconName } from './Icons';

// ── Button ───────────────────────────────────────────────────
type ButtonVariant =
  | 'primary'
  | 'dark'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'danger-soft'
  | 'success'
  | 'success-soft';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  icon?: IconName;
  iconRight?: IconName;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  block,
  icon,
  iconRight,
  loading,
  children,
  className = '',
  disabled,
  ...rest
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'md' ? `btn-${size}` : '',
    block ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="spinner" style={{ width: 15, height: 15, borderWidth: 2 }} />
      ) : (
        icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />
      )}
      {children}
      {iconRight && !loading && <Icon name={iconRight} size={size === 'sm' ? 14 : 16} />}
    </button>
  );
};

// ── Badge ────────────────────────────────────────────────────
export type BadgeColor =
  | 'gray'
  | 'dark'
  | 'brand'
  | 'green'
  | 'red'
  | 'amber'
  | 'blue'
  | (string & {});

export const Badge: React.FC<{
  color?: BadgeColor;
  children: React.ReactNode;
  icon?: IconName;
  className?: string;
  style?: React.CSSProperties;
}> = ({ color = 'gray', children, icon, className = '', style }) => (
  <span className={`badge badge-${color} ${className}`} style={style}>
    {icon && <Icon name={icon} size={11} strokeWidth={2.4} />}
    {children}
  </span>
);

// ── Input ────────────────────────────────────────────────────
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = '',
  type = 'text',
  ...rest
}) => (
  <input className={`input ${className}`} type={type} {...rest} />
);

// ── Textarea ─────────────────────────────────────────────────
export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className = '',
  ...rest
}) => (
  <textarea className={`textarea ${className}`} {...rest} />
);

// ── Select ───────────────────────────────────────────────────
export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({
  className = '',
  ...rest
}) => (
  <select className={`select ${className}`} {...rest} />
);

// ── Label ────────────────────────────────────────────────────
export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({
  children,
  className = '',
  ...rest
}) => (
  <label className={`label ${className}`} {...rest}>
    {children}
  </label>
);

// ── Card ─────────────────────────────────────────────────────
export const Card: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    hover?: boolean;
    padded?: boolean;
  }
> = ({ children, className = '', hover = false, padded = false, style, ...rest }) => (
  <div
    className={`card ${hover ? 'card-hover' : ''} ${padded ? 'card-pad' : ''} ${className}`}
    style={style}
    {...rest}
  >
    {children}
  </div>
);

// ── EmptyState ───────────────────────────────────────────────
export const EmptyState: React.FC<{
  icon?: IconName;
  title: string;
  description?: string;
  action?: React.ReactNode;
  compact?: boolean;
}> = ({ icon = 'package', title, description, action, compact }) => (
  <div className={`empty-state ${compact ? 'compact' : ''}`}>
    <div className="empty-icon" style={compact ? { width: 48, height: 48, borderRadius: 12 } : undefined}>
      <Icon name={icon} size={compact ? 22 : 26} />
    </div>
    <h3 className="empty-title" style={compact ? { fontSize: 15 } : undefined}>
      {title}
    </h3>
    {description && <p className="empty-desc">{description}</p>}
    {action && <div className="empty-action">{action}</div>}
  </div>
);

// ── PageHeader ───────────────────────────────────────────────
export const PageHeader: React.FC<{
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  icon?: IconName;
}> = ({ title, subtitle, actions, icon }) => (
  <div className="page-head">
    <div>
      <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {icon && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'var(--brand-soft)',
              color: 'var(--brand-active)',
              flexShrink: 0,
            }}
          >
            <Icon name={icon} size={19} />
          </span>
        )}
        {title}
      </h1>
      {subtitle && <p className="page-sub">{subtitle}</p>}
    </div>
    {actions && <div className="page-head-actions">{actions}</div>}
  </div>
);

// ── Avatar ───────────────────────────────────────────────────
export const Avatar: React.FC<{
  src?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ src, fallback = 'U', size = 'md', className = '' }) => {
  const sizes = { sm: 28, md: 40, lg: 56 };
  const dim = sizes[size];
  return (
    <div
      className={`avatar ${className}`}
      style={{ width: dim, height: dim, fontSize: dim * 0.4 }}
    >
      {src ? (
        <img src={src} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
      ) : (
        fallback
      )}
    </div>
  );
};

// ── Spinner (inline, sizes) ──────────────────────────────────
export const Spinner: React.FC<{ size?: number; thickness?: number }> = ({
  size = 20,
  thickness = 2.5,
}) => (
  <span
    className="spinner"
    style={{ width: size, height: size, borderWidth: thickness }}
    aria-label="Loading"
    role="status"
  />
);

// ── Full-page centered loader ────────────────────────────────
export const PageLoader: React.FC<{ label?: string }> = ({ label }) => (
  <div className="page-loader">
    <Spinner size={30} thickness={3} />
    {label && <span>{label}</span>}
  </div>
);

// ── Skeleton line ────────────────────────────────────────────
export const Skeleton: React.FC<{ w?: number | string; h?: number; r?: number; style?: React.CSSProperties }> = ({
  w = '100%',
  h = 14,
  r,
  style,
}) => (
  <div
    className="skeleton"
    style={{ width: w, height: h, borderRadius: r, ...style }}
  />
);

// ── Skeleton image block ─────────────────────────────────────
export const SkeletonImage: React.FC<{ w?: number | string; h?: number | string; r?: number; style?: React.CSSProperties }> = ({
  w = '100%',
  h = 200,
  r,
  style,
}) => (
  <div
    className="skeleton"
    style={{ width: w, height: h, borderRadius: r, ...style }}
  />
);

// ── Error banner ─────────────────────────────────────────────
export const ErrorBanner: React.FC<{
  message: string;
  onRetry?: () => void;
}> = ({ message, onRetry }) => (
  <div className="card card-pad fade-in error-banner" role="alert">
    <Icon name="alert-circle" size={18} color="var(--danger-strong)" />
    <span className="error-banner-message">{message}</span>
    {onRetry && (
      <button className="btn btn-danger-soft btn-sm" onClick={onRetry} type="button">
        Try again
      </button>
    )}
  </div>
);
