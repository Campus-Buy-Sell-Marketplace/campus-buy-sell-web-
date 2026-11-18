// ============================================================
// LAVSA — Shared Condition Mapping
// Maps the product `condition` enum to human labels + badge colors.
// Used by ProductCard, ProductDetailPage, SellerProductsPage, etc.
// ============================================================

export type ProductCondition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';

export interface ConditionMeta {
  label: string;
  /** CSS class from global.css badge variants */
  badgeClass: string;
  color: 'green' | 'brand' | 'blue' | 'amber' | 'gray';
}

const CONDITION_MAP: Record<ProductCondition, ConditionMeta> = {
  NEW: { label: 'New', badgeClass: 'badge-green', color: 'green' },
  LIKE_NEW: { label: 'Like New', badgeClass: 'badge-brand', color: 'brand' },
  GOOD: { label: 'Good', badgeClass: 'badge-blue', color: 'blue' },
  FAIR: { label: 'Fair', badgeClass: 'badge-amber', color: 'amber' },
  POOR: { label: 'Poor', badgeClass: 'badge-gray', color: 'gray' },
};

export function getConditionMeta(condition: string | undefined | null): ConditionMeta {
  if (!condition) return { label: 'Used', badgeClass: 'badge-gray', color: 'gray' };
  return (
    CONDITION_MAP[condition as ProductCondition] ?? {
      label: condition,
      badgeClass: 'badge-gray',
      color: 'gray',
    }
  );
}

/** All selectable conditions for seller forms. */
export const CONDITION_OPTIONS: Array<{ value: ProductCondition; label: string }> = [
  { value: 'NEW', label: 'New' },
  { value: 'LIKE_NEW', label: 'Like New' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' },
];
