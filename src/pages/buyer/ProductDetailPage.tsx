// ============================================================
// LAVSA — Product Detail Page
// Shows full product info, seller info, and add-to-cart.
// Redesigned with the LAVSA design system (global.css + UI kit).
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import PublicNavbar from '../../components/PublicNavbar/PublicNavbar';
import { getProductById, getProducts, Product } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getWishlistIds, addToWishlist, removeFromWishlist } from '../../services/userService';
import { Button, EmptyState, PageLoader, Skeleton, ErrorBanner } from '../../components/UI/ui';
import {
  IconChevronRight,
  IconHeart,
  IconHeartFilled,
  IconMinus,
  IconPlus,
  IconBadgeCheck,
  IconMapPin,
  IconShield,
  IconCalendar,
  IconStore,
  IconInfo,
  IconImage,
} from '../../components/UI/Icons';
import { formatPrice, formatDate } from '../../utils/format';
import { getConditionMeta } from '../../utils/conditions';
import ProductCard from '../../components/ProductCard/ProductCard';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [related, setRelated] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const isWishlisted = !!id && wishlistIds.includes(id);

  // Auto-dismiss action error after 4 seconds
  useEffect(() => {
    if (actionError) {
      const timer = setTimeout(() => setActionError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionError]);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError('');
    setProduct(null);
    setQuantity(1);
    getProductById(id)
      .then((data) => setProduct(data))
      .catch(() => setError('Product not found or unavailable.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  // Load wishlist state (also powers hearts on the related grid)
  useEffect(() => {
    getWishlistIds()
      .then((ids) => setWishlistIds(ids))
      .catch(() => {});
  }, [id, isAuthenticated]);

  const toggleWishlist = async (productId: string) => {
    if (wishlistLoading) return;
    setWishlistLoading(true);
    try {
      if (wishlistIds.includes(productId)) {
        await removeFromWishlist(productId);
        setWishlistIds((prev) => prev.filter((w) => w !== productId));
      } else {
        await addToWishlist(productId);
        setWishlistIds((prev) => [...prev, productId]);
      }
    } catch {
      showToast('Could not update wishlist. Please try again.', 'warning');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (!isAuthenticated) { navigate('/login'); return; }
    setActionError('');
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
      setAdded(true);
      showToast(`Added ${quantity} × "${product.title}" to cart!`, 'success');
      setTimeout(() => setAdded(false), 2000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to add item to cart.';
      setActionError(msg);
      showToast(msg, 'warning');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (!isAuthenticated) { navigate('/login'); return; }
    setActionError('');
    try {
      await addToCart(product.id, quantity);
      navigate('/cart');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to add item to cart.';
      setActionError(msg);
      showToast(msg, 'warning');
      if (err?.response?.status === 409) {
        navigate('/cart');
      }
    }
  };

  // Related products from the same category
  useEffect(() => {
    if (!product?.category) {
      setRelated([]);
      return;
    }
    let cancelled = false;
    setRelatedLoading(true);
    getProducts({ category: product.category, limit: 8 })
      .then((res) => {
        if (cancelled) return;
        setRelated(res.products.filter((p) => p.id !== product.id).slice(0, 4));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setRelatedLoading(false);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, product?.category]);

  // Determine which layout to use based on auth state
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    isAuthenticated
      ? <AppLayout>{children}</AppLayout>
      : (
          <div style={{ minHeight: '100vh', backgroundColor: 'var(--page-bg)', fontFamily: 'var(--font)' }}>
            <PublicNavbar />
            <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px 20px 48px' }}>{children}</div>
          </div>
        );

  if (isLoading) {
    return (
      <Wrapper>
        <PageLoader label="Loading product..." />
      </Wrapper>
    );
  }

  if (error || !product) {
    return (
      <Wrapper>
        <div className="pd-page">
          {error && <ErrorBanner message={error} />}
          <EmptyState
            icon="package"
            title="Product not found"
            description="This listing may have been removed or is no longer available."
            action={
              <Link to="/home" className="btn btn-primary">
                Browse Products
              </Link>
            }
          />
        </div>
      </Wrapper>
    );
  }

  const stock = Number(product.stock) || 0;
  const outOfStock = stock <= 0;
  const lowStock = !outOfStock && stock <= 5;
  const condition = getConditionMeta(product.condition);
  const inWishlist = isWishlisted;

  return (
    <Wrapper>
      <div className="pd-page">
        {/* ── Breadcrumb ─────────────────────────────────────── */}
        <nav className="pd-breadcrumb" aria-label="Breadcrumb">
          <Link to="/home" className="pd-crumb-link">Home</Link>
          <IconChevronRight size={13} color="var(--text-faint)" />
          {product.category && (
            <>
              <Link to={`/home?category=${encodeURIComponent(product.category)}`} className="pd-crumb-link">
                {product.category}
              </Link>
              <IconChevronRight size={13} color="var(--text-faint)" />
            </>
          )}
          <span className="pd-crumb-current truncate-1">{product.title}</span>
        </nav>

        {/* ── Main two-column layout ─────────────────────────── */}
        <div className="pd-grid">
          {/* Left: image card */}
          <div className="pd-left">
            <div className="pd-image-card">
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} className="pd-img" />
              ) : (
                <div className="pd-no-image">
                  <IconImage size={44} color="var(--text-faint)" />
                  <span>No image available</span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <section className="pd-section">
                <h2 className="section-title">Description</h2>
                <div className="pd-desc-card">
                  <p className="pd-desc-text">{product.description}</p>
                </div>
              </section>
            )}
          </div>

          {/* Right: info column */}
          <div className="pd-right">
            {/* Category + condition badges */}
            <div className="pd-tags-row">
              {product.category && (
                <Link
                  to={`/home?category=${encodeURIComponent(product.category)}`}
                  className="badge badge-gray pd-category-badge"
                >
                  {product.category}
                </Link>
              )}
              <span className={`badge ${condition.badgeClass}`}>{condition.label}</span>
            </div>

            <h1 className="pd-title">{product.title}</h1>

            {/* Price + stock */}
            <div className="pd-price-row">
              <span className="pd-price">{formatPrice(product.price)}</span>
              {outOfStock ? (
                <span className="badge badge-gray pd-stock-badge">Sold out</span>
              ) : lowStock ? (
                <span className="badge badge-amber pd-stock-badge">Only {stock} left</span>
              ) : (
                <span className="badge badge-green pd-stock-badge">In stock</span>
              )}
            </div>

            <div className="divider" />

            {/* Seller trust card */}
            <div className="pd-seller-card">
              <div className="pd-seller-avatar">
                {product.seller_name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div className="pd-seller-info">
                <span className="pd-seller-label">Sold by</span>
                <span className="pd-seller-name truncate-1">{product.seller_name}</span>
                <span className="pd-seller-verified">
                  <IconBadgeCheck size={13} color="var(--brand-active)" />
                  Verified Campus Seller
                </span>
              </div>
              <IconStore size={18} color="var(--text-faint)" className="pd-seller-icon" />
            </div>

            {/* Quantity selector */}
            {!outOfStock && (
              <div className="pd-qty-row">
                <span className="pd-qty-label">Quantity</span>
                <div className="pd-stepper">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="pd-step-btn"
                    id="qty-dec"
                    aria-label="Decrease quantity"
                  >
                    <IconMinus size={14} />
                  </button>
                  <span className="pd-qty-value">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    disabled={quantity >= stock}
                    className="pd-step-btn"
                    id="qty-inc"
                    aria-label="Increase quantity"
                  >
                    <IconPlus size={14} />
                  </button>
                </div>
                <span className="pd-qty-max text-muted">{stock} available</span>
              </div>
            )}

            {/* Action error */}
            {actionError && (
              <div style={{ marginBottom: 14 }}>
                <ErrorBanner message={actionError} onRetry={() => setActionError('')} />
              </div>
            )}

            {/* Action buttons (authed) */}
            {isAuthenticated ? (
              <div className="pd-actions">
                <div className="pd-actions-row">
                  <Button
                    variant={added ? 'success' : 'primary'}
                    size="lg"
                    block
                    loading={isAdding}
                    icon={added ? 'check' : 'cart'}
                    onClick={handleAddToCart}
                    disabled={isAdding || outOfStock}
                    id="detail-add-to-cart-btn"
                  >
                    {isAdding ? 'Adding…' : added ? 'Added to Cart' : 'Add to Cart'}
                  </Button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    disabled={wishlistLoading}
                    className={`pd-wish-btn ${inWishlist ? 'liked' : ''}`}
                    id="detail-wishlist-btn"
                    title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
                    aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    {inWishlist ? (
                      <IconHeartFilled size={18} color="#ef4444" />
                    ) : (
                      <IconHeart size={18} color="var(--text-secondary)" />
                    )}
                  </button>
                </div>

                <Button
                  variant="dark"
                  size="lg"
                  block
                  iconRight="arrow-right"
                  onClick={handleBuyNow}
                  disabled={outOfStock}
                  id="detail-buy-now-btn"
                >
                  Buy Now
                </Button>
              </div>
            ) : (
              <div className="pd-actions">
                <p className="pd-signin-hint">Sign in to add this item to your cart or buy it.</p>
                <Link to="/login" className="btn btn-dark btn-lg btn-block" id="detail-signin-btn">
                  Sign in to Buy
                </Link>
              </div>
            )}

            {/* Listed date */}
            <p className="pd-listed">
              <IconCalendar size={13} color="var(--text-faint)" />
              Listed on {formatDate(product.created_at)}
            </p>

            {/* Meetup / safety info */}
            <div className="pd-safety-card">
              <div className="pd-safety-head">
                <IconMapPin size={16} color="var(--brand-active)" />
                <span>Campus Meetup &amp; Safety</span>
              </div>
              <ul className="pd-safety-list">
                <li>
                  <IconShield size={13} color="var(--success-strong)" />
                  Meet the seller in person at a public campus spot — no shipping, no online strangers.
                </li>
                <li>
                  <IconInfo size={13} color="var(--brand-active)" />
                  Handovers are confirmed with a 6-digit OTP that only you receive.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Related products ───────────────────────────────── */}
        {(relatedLoading || related.length > 0) && (
          <section className="pd-related">
            <h2 className="section-title">More from this category</h2>
            {relatedLoading ? (
              <div className="product-grid">
                {[0, 1, 2, 3].map((i) => (
                  <div className="card pd-related-skeleton" key={i}>
                    <Skeleton w="100%" h={0} style={{ aspectRatio: '1 / 1', borderRadius: 0 }} />
                    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <Skeleton w="85%" h={13} />
                      <Skeleton w="55%" h={16} />
                      <Skeleton w="70%" h={11} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="product-grid">
                {related.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    wishlisted={wishlistIds.includes(p.id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* ── Sticky mobile action bar (<768px) ───────────────── */}
      <div className="mobile-action-bar">
        <div className="pd-mobile-bar">
          <div className="pd-mobile-info">
            <span className="pd-mobile-price">{formatPrice(product.price)}</span>
            {outOfStock ? (
              <span className="pd-mobile-stock pd-out">Sold out</span>
            ) : (
              <span className="pd-mobile-stock">Qty {quantity}</span>
            )}
          </div>
          <button
            onClick={() => toggleWishlist(product.id)}
            disabled={wishlistLoading}
            className={`pd-wish-btn pd-wish-mobile ${inWishlist ? 'liked' : ''}`}
            id="product-wishlist-mb-btn"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            {inWishlist ? <IconHeartFilled size={18} color="#ef4444" /> : <IconHeart size={18} color="var(--text-secondary)" />}
          </button>
          <Button
            variant="primary"
            size="lg"
            loading={isAdding}
            icon={added ? 'check' : 'cart'}
            onClick={handleAddToCart}
            disabled={isAdding || outOfStock}
            id="product-add-btn"
          >
            {isAdding ? 'Adding…' : added ? 'Added' : 'Add to Cart'}
          </Button>
        </div>
      </div>

      <style>{`
        .pd-page {
          display: flex;
          flex-direction: column;
          gap: 28px;
          font-family: var(--font);
          color: var(--text);
        }
        @media (max-width: 768px) {
          .pd-page { padding-bottom: 92px; gap: 20px; }
        }

        /* Breadcrumb */
        .pd-breadcrumb {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          min-width: 0;
        }
        .pd-crumb-link {
          color: var(--text-muted);
          text-decoration: none;
          font-weight: 500;
          flex-shrink: 0;
        }
        .pd-crumb-link:hover { color: var(--brand-active); }
        .pd-crumb-current {
          color: var(--text-secondary);
          font-weight: 600;
          min-width: 0;
        }

        /* Two-column grid */
        .pd-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          gap: 36px;
          align-items: start;
        }
        .pd-left { display: flex; flex-direction: column; gap: 20px; min-width: 0; }
        .pd-right { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
        @media (max-width: 768px) {
          .pd-grid { grid-template-columns: 1fr; gap: 22px; }
        }

        /* Image card with zoom-on-hover */
        .pd-image-card {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          background: var(--surface-muted);
          box-shadow: var(--shadow-sm);
          aspect-ratio: 1 / 1;
        }
        .pd-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pd-image-card:hover .pd-img { transform: scale(1.045); }
        .pd-no-image {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: var(--text-faint);
          font-size: 13px;
        }

        /* Tags, title, price */
        .pd-tags-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .pd-category-badge { text-decoration: none; }
        .pd-category-badge:hover { background: var(--surface-muted); }
        .pd-title {
          font-size: 26px;
          font-weight: 800;
          line-height: 1.3;
          margin: 0;
          color: var(--ink);
          letter-spacing: -0.02em;
        }
        @media (max-width: 560px) {
          .pd-title { font-size: 21px; }
        }
        .pd-price-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .pd-price {
          font-size: 32px;
          font-weight: 800;
          color: var(--ink);
          letter-spacing: -0.03em;
        }
        .pd-stock-badge { font-size: 12px; }

        /* Seller trust card */
        .pd-seller-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: var(--radius-md);
          background: var(--surface-soft);
          border: 1px solid var(--border);
        }
        .pd-seller-avatar {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full, 50%);
          background: linear-gradient(135deg, var(--brand), var(--brand-active));
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .pd-seller-info { display: flex; flex-direction: column; gap: 1px; min-width: 0; flex: 1; }
        .pd-seller-label { font-size: 11px; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
        .pd-seller-name { font-size: 14px; font-weight: 700; color: var(--ink); }
        .pd-seller-verified {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          color: var(--brand-active);
        }
        .pd-seller-icon { flex-shrink: 0; }

        /* Quantity stepper */
        .pd-qty-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .pd-qty-label { font-size: 14px; font-weight: 600; color: var(--text); }
        .pd-stepper {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--surface);
          overflow: hidden;
        }
        .pd-step-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: var(--surface);
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .pd-step-btn:hover:not(:disabled) { background: var(--brand-soft); color: var(--brand-active); }
        .pd-step-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .pd-qty-value {
          min-width: 34px;
          text-align: center;
          font-size: 15px;
          font-weight: 700;
          color: var(--ink);
          font-variant-numeric: tabular-nums;
        }
        .pd-qty-max { font-size: 12px; }

        /* Actions */
        .pd-actions { display: flex; flex-direction: column; gap: 10px; }
        .pd-actions-row { display: flex; gap: 10px; align-items: stretch; }
        .pd-wish-btn {
          width: 50px;
          flex-shrink: 0;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          background: var(--surface);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
        }
        .pd-wish-btn:hover:not(:disabled) { background: var(--danger-soft); border-color: var(--danger-border); }
        .pd-wish-btn:active:not(:disabled) { transform: scale(0.94); }
        .pd-wish-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .pd-wish-btn.liked { border-color: var(--danger-border); background: var(--danger-soft); }
        .pd-signin-hint { font-size: 13px; color: var(--text-muted); margin: 0; }
        .pd-listed {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: var(--text-faint);
          margin: 0;
        }

        /* Safety card */
        .pd-safety-card {
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--brand-soft);
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .pd-safety-head {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: var(--ink);
        }
        .pd-safety-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pd-safety-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12.5px;
          line-height: 1.5;
          color: var(--text-secondary);
        }
        .pd-safety-list li svg { flex-shrink: 0; margin-top: 2px; }

        /* Description */
        .pd-section { display: flex; flex-direction: column; gap: 10px; }
        .pd-desc-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px 18px;
          box-shadow: var(--shadow-xs);
        }
        .pd-desc-text {
          margin: 0;
          font-size: 14px;
          line-height: 1.75;
          color: var(--text);
          white-space: pre-wrap;
        }

        /* Related products */
        .pd-related { display: flex; flex-direction: column; gap: 14px; }
        .pd-related-skeleton { overflow: hidden; }
        .pd-related-skeleton .skeleton { border-radius: 0; }

        /* Sticky mobile action bar content */
        .pd-mobile-bar {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pd-mobile-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }
        .pd-mobile-price {
          font-size: 17px;
          font-weight: 800;
          color: var(--ink);
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .pd-mobile-stock { font-size: 11px; color: var(--text-muted); }
        .pd-mobile-stock.pd-out { color: var(--danger-strong); font-weight: 600; }
        .pd-wish-mobile { width: 44px; height: 44px; }

        @media (max-width: 768px) {
          .pd-price { font-size: 27px; }
          .pd-image-card { box-shadow: none; }
        }
        @media (max-width: 560px) {
          .pd-actions-row { flex-direction: row; }
          .pd-seller-card { padding: 12px 14px; }
        }
      `}</style>
    </Wrapper>
  );
};

export default ProductDetailPage;
