import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface CartButtonProps {
  productId: string;
  stock?: number;
  productTitle?: string;
  id?: string;
}

export const CartButton: React.FC<CartButtonProps> = ({
  productId,
  stock,
  productTitle,
  id,
}) => {
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [busy, setBusy] = useState(false);

  // Find if this product is already in the user's cart
  const cartItem = items.find((i) => i.product_id === productId);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  // Handle Initial "ADD" click
  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (busy) return;
    if (stock !== undefined && stock <= 0) {
      showToast('This item is currently out of stock.', 'info');
      return;
    }

    setBusy(true);
    try {
      await addToCart(productId, 1);
      showToast(`Added "${productTitle || 'item'}" to cart`, 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to add item to cart.', 'warning');
    } finally {
      setBusy(false);
    }
  };

  // Handle Increment (+)
  const handleIncrement = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!cartItem || busy) return;

    if (stock !== undefined && inCartQty >= stock) {
      showToast(`Only ${stock} items available in stock.`, 'info');
      return;
    }

    setBusy(true);
    try {
      await updateQuantity(cartItem.cart_item_id, inCartQty + 1);
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to update quantity.', 'warning');
    } finally {
      setBusy(false);
    }
  };

  // Handle Decrement (-) or Remove (Trash 🗑️)
  const handleDecrementOrRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!cartItem || busy) return;

    setBusy(true);
    try {
      if (inCartQty <= 1) {
        await removeFromCart(cartItem.cart_item_id);
        showToast(`Removed "${productTitle || 'item'}" from cart`, 'info');
      } else {
        await updateQuantity(cartItem.cart_item_id, inCartQty - 1);
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to update cart.', 'warning');
    } finally {
      setBusy(false);
    }
  };

  // ── Stepper Mode (Item in Cart) ──
  if (inCartQty > 0) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '34px',
          minWidth: '122px',
          borderRadius: '9999px',
          border: '2px solid #111827', // Crisp black outerline
          backgroundColor: '#ffffff',
          padding: '0 8px',
          boxSizing: 'border-box',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          userSelect: 'none',
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* Left icon button: Trash can when qty === 1, Minus when qty > 1 */}
        <button
          type="button"
          onClick={handleDecrementOrRemove}
          disabled={busy}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: busy ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#111827',
            borderRadius: '50%',
            transition: 'transform 0.1s, opacity 0.15s',
            opacity: busy ? 0.5 : 1,
          }}
          title={inCartQty === 1 ? 'Remove from cart' : 'Decrease quantity'}
          id={id ? `${id}-dec` : undefined}
        >
          {inCartQty === 1 ? (
            // Crisp trash can SVG matching media_1792564063579.png
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#111827"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          ) : (
            // Minus icon
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#111827"
              strokeWidth="2.6"
              strokeLinecap="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}
        </button>

        {/* Center: "X in cart" */}
        <span
          style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#111827',
            padding: '0 4px',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.01em',
          }}
        >
          {inCartQty} in cart
        </span>

        {/* Right icon button: Plus (+) */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={busy || (stock !== undefined && inCartQty >= stock)}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: busy || (stock !== undefined && inCartQty >= stock) ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#111827',
            borderRadius: '50%',
            transition: 'transform 0.1s, opacity 0.15s',
            opacity: busy || (stock !== undefined && inCartQty >= stock) ? 0.35 : 1,
          }}
          title="Increase quantity"
          id={id ? `${id}-inc` : undefined}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111827"
            strokeWidth="2.6"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    );
  }

  // ── Default "ADD" Button ──
  const isOutOfStock = stock !== undefined && stock <= 0;

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={busy || isOutOfStock}
      style={{
        height: '34px',
        minWidth: '78px',
        padding: '0 18px',
        borderRadius: '9999px',
        border: 'none',
        backgroundColor: '#111827',
        color: '#ffffff',
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '0.05em',
        cursor: busy || isOutOfStock ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.15s ease, transform 0.1s ease',
        fontFamily: "'Inter', system-ui, sans-serif",
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        opacity: busy ? 0.7 : isOutOfStock ? 0.5 : 1,
      }}
      className="cart-action-btn"
      id={id}
    >
      {busy ? '...' : isOutOfStock ? 'Out of stock' : 'ADD'}
    </button>
  );
};

export default CartButton;
