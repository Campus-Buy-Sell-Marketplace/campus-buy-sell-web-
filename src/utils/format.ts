// ============================================================
// LAVSA — Formatting Utilities
// ============================================================

/** Format a price in Indian Rupees: ₹1,250 */
export function formatPrice(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || Number.isNaN(amount)) return '₹—';
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

/** Compact price for tight spaces: ₹12.5k */
export function formatPriceCompact(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || Number.isNaN(amount)) return '₹—';
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1).replace(/\.0$/, '')}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return `₹${amount}`;
}

/** Relative time: "2h ago", "3d ago", "12 Jan" */
export function timeAgo(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  if (Number.isNaN(date.getTime())) return '';
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/** Full date: 12 Jan 2026 */
export function formatDate(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return '—';
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Date + time: 12 Jan 2026, 4:30 PM */
export function formatDateTime(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return '—';
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/** Member-since year from a created_at ISO string. */
export function memberSince(dateStr: string | undefined | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return date.getFullYear().toString();
}
