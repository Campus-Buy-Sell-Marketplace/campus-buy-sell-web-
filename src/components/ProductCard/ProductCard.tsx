// ============================================================
// LAVSA — Shared ProductCard
// Consistent marketplace card used across Home, Products,
// Wishlist and seller listings. Wishlist heart is optional:
// pass `wishlisted` + `onToggleWishlist` to enable it.
// ============================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../services/productService';
import { getConditionMeta } from '../../utils/conditions';
import { formatPrice, timeAgo } from '../../utils/format';
import { IconHeart, IconHeartFilled, IconImage } from '../UI/Icons';

interface ProductCardProps {
  product: Product;
  /** Whether this product is in the viewer's wishlist (enables the heart). */
  wishlisted?: boolean;
  /** Called with the product id when the heart is clicked. Omit to hide the heart. */
  onToggleWishlist?: (productId: string) => void;
  /** Extra overlay badge (e.g. "Inactive" on seller pages). */
  overlayBadge?: React.ReactNode;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  wishlisted,
  onToggleWishlist,
  overlayBadge,
}) => {
  const [imgError, setImgError] = useState(false);
  const condition = getConditionMeta(product.condition);
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 2;

  return (
    <div className="card card-hover product-card">
      {/* Image */}
      <Link
        to={`/products/${product.id}`}
        className="product-card-image"
        aria-label={product.title}
      >
        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={product.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="product-card-img"
          />
        ) : (
          <div className="product-card-placeholder">
            <IconImage size={34} />
          </div>
        )}

        {/* Condition badge */}
        <span className={`badge ${condition.badgeClass} product-condition-badge`}>
          {condition.label}
        </span>

        {/* Optional extra overlay (seller pages etc.) */}
        {overlayBadge && (
          <span className="product-overlay-badge">{overlayBadge}</span>
        )}

        {/* Stock state */}
        {outOfStock && (
          <div className="product-sold-out">
            <span className="badge badge-dark">
              Sold out
            </span>
          </div>
        )}
      </Link>

      {/* Wishlist heart */}
      {onToggleWishlist && (
        <button
          className={`heart-btn ${wishlisted ? 'liked' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlisted ? (
            <IconHeartFilled size={18} color="#ef4444" />
          ) : (
            <IconHeart size={18} color="#374151" />
          )}
        </button>
      )}

      {/* Body */}
      <Link to={`/products/${product.id}`} className="product-card-body">
        <span className="product-card-title truncate-2">
          {product.title}
        </span>
        <span className="product-card-price">
          {formatPrice(product.price)}
        </span>
        <span className="product-card-meta">
          <span className="truncate-1">{product.seller_name}</span>
          <span className="product-card-time">{timeAgo(product.created_at)}</span>
        </span>
        {lowStock && !outOfStock && (
          <span className="badge badge-amber product-low-stock">
            Only {product.stock} left
          </span>
        )}
      </Link>
    </div>
  );
};

export default ProductCard;
