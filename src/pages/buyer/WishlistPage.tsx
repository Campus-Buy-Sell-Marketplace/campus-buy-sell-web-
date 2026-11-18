// ============================================================
// LAVSA — Wishlist Page
// Shows all saved/wishlisted products for the current user.
// Built on the shared design system (global.css + UI primitives).
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { getWishlist, removeFromWishlist, WishlistItem } from '../../services/userService';
import CartButton from '../../components/CartButton/CartButton';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Button, EmptyState, ErrorBanner, PageHeader, Skeleton } from '../../components/UI/ui';
import { Icon, IconTrash } from '../../components/UI/Icons';
import { useToast } from '../../context/ToastContext';

const WishlistPage: React.FC = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getWishlist();
      setItems(data);
    } catch {
      setError('Could not load wishlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRemove = async (productId: string) => {
    if (removingIds.has(productId)) return;
    const item = items.find((i) => i.id === productId);

    setRemovingIds((prev) => new Set(prev).add(productId));
    try {
      await removeFromWishlist(productId);
      setItems((prev) => prev.filter((i) => i.id !== productId));
      if (item) showToast(`Removed "${item.title}" from wishlist`, 'info');
    } catch {
      showToast('Failed to remove from wishlist.', 'error');
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const countLabel = isLoading
    ? 'Loading your saved items…'
    : `${items.length} saved item${items.length !== 1 ? 's' : ''}`;

  return (
    <AppLayout>
      <div className="page wl-page">
        <PageHeader
          title="Wishlist"
          subtitle={countLabel}
          icon="heart"
          actions={
            <Button
              variant="ghost"
              size="sm"
              icon="refresh"
              onClick={load}
              disabled={isLoading}
              id="wishlist-refresh-btn"
            >
              Refresh
            </Button>
          }
        />

        {error && (
          <div style={{ marginBottom: 18 }}>
            <ErrorBanner message={error} onRetry={load} />
          </div>
        )}

        {isLoading && !error && (
          <div className="product-grid" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card" style={{ overflow: 'hidden' }}>
                <Skeleton h={215} r={0} style={{ borderRadius: 0 }} />
                <div
                  style={{
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <Skeleton w="85%" h={13} />
                  <Skeleton w="55%" h={17} />
                  <Skeleton w="70%" h={11} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="card">
            <EmptyState
              icon="heart"
              title="Your wishlist is empty"
              description="Browse products and tap the heart icon to save items for later."
              action={
                <Link to="/home" className="btn btn-primary" id="wishlist-browse-btn">
                  <Icon name="shopping-bag" size={16} />
                  Browse products
                  <Icon name="arrow-right" size={15} />
                </Link>
              }
            />
          </div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <div className="product-grid">
            {items.map((item) => (
              <div key={item.id} id={`wish-${item.id}`} className="wl-cell">
                <ProductCard
                  product={item}
                  wishlisted
                  onToggleWishlist={handleRemove}
                />

                {/* Actions: add to cart + explicit remove-from-wishlist */}
                <div className="wl-action-row">
                  <CartButton
                    productId={item.id}
                    stock={item.stock}
                    productTitle={item.title}
                    id={`wish-cart-${item.id}`}
                  />
                  <button
                    type="button"
                    className="wl-remove-btn"
                    id={`remove-wish-${item.id}`}
                    title="Remove from wishlist"
                    aria-label="Remove from wishlist"
                    onClick={() => handleRemove(item.id)}
                    disabled={removingIds.has(item.id)}
                  >
                    {removingIds.has(item.id) ? (
                      <Icon name="loader" size={14} className="wl-spin" />
                    ) : (
                      <IconTrash size={14} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <style>{`
          .wl-cell {
            display: flex;
            flex-direction: column;
            gap: 8px;
            min-width: 0;
          }
          .wl-cell > .product-card {
            flex: 1;
          }
          .wl-action-row {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 8px;
            padding: 0 2px;
          }
          .wl-remove-btn {
            width: 34px;
            height: 34px;
            border-radius: 9999px;
            border: 1px solid var(--border);
            background: var(--surface);
            color: var(--text-secondary);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            flex-shrink: 0;
            transition: all 0.15s ease;
          }
          .wl-remove-btn:hover:not(:disabled) {
            color: var(--danger-strong);
            border-color: var(--danger-border);
            background: var(--danger-soft);
          }
          .wl-remove-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          .wl-spin {
            animation: wl-rotate 0.8s linear infinite;
          }
          @keyframes wl-rotate {
            to { transform: rotate(360deg); }
          }
          @media (max-width: 768px) {
            .wl-page {
              padding-top: 20px;
            }
            .wl-action-row {
              gap: 6px;
            }
          }
          @media (max-width: 560px) {
            .wl-action-row {
              justify-content: space-between;
            }
            .wl-remove-btn {
              width: 32px;
              height: 32px;
            }
          }
        `}</style>
      </div>
    </AppLayout>
  );
};

export default WishlistPage;
