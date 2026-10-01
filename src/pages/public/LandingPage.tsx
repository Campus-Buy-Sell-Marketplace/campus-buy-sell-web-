// ============================================================
// LAVSA — Public Landing Page
// Shown to everyone (no login required).
// Shows featured products + hero section like Amazon.
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar/PublicNavbar';
import { getProducts, Product } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME, APP_TAGLINE } from '../../config/appConfig';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Furniture', 'Sports', 'Other'];

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addingId, setAddingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery.trim()) params.q = searchQuery.trim();
      const data = await getProducts(params);
      setProducts(data.products);
    } catch {
      setError('Could not load products right now. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setAddingId(productId);
    try {
      await addToCart(productId, 1);
    } finally {
      setAddingId(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div style={pageStyle}>
      <PublicNavbar />

      {/* ── Hero Banner ── */}
      <section style={heroStyle}>
        <div style={heroInnerStyle}>
          <div style={heroBadgeStyle}>🎓 Campus Marketplace</div>
          <h1 style={heroHeadingStyle}>{APP_NAME}</h1>
          <p style={heroSubStyle}>{APP_TAGLINE} — Buy and sell with fellow students on campus</p>
          <div style={heroActionsStyle}>
            <Link to="/products" style={heroPrimaryBtnStyle} id="hero-browse-btn">
              Browse All Products
            </Link>
            {!isAuthenticated && (
              <Link to="/login" style={heroSecondaryBtnStyle} id="hero-signin-btn">
                Sign In to Buy
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Category Pills + Search ── */}
      <div style={filterBarStyle}>
        <div style={filterInnerStyle}>
          <form onSubmit={handleSearch} style={filterSearchFormStyle}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={filterSearchInputStyle}
              id="landing-search-input"
            />
            <button type="submit" style={filterSearchBtnStyle} id="landing-search-btn">
              Search
            </button>
          </form>
          <div style={categoryPillsStyle}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={categoryPillStyle(selectedCategory === cat)}
                id={`cat-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products Grid ── */}
      <main style={mainStyle}>
        <div style={mainInnerStyle}>
          {/* Section header */}
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle}>
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
              {products.length > 0 && (
                <span style={sectionCountStyle}>{products.length} items</span>
              )}
            </h2>
          </div>

          {isLoading && (
            <div style={centerStyle}>
              <div style={spinnerStyle} />
              <p style={{ color: '#6b7280', marginTop: '12px' }}>Loading products...</p>
            </div>
          )}

          {error && (
            <div style={errorBoxStyle}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
              <p style={{ margin: 0, color: '#92400e' }}>{error}</p>
            </div>
          )}

          {!isLoading && !error && products.length === 0 && (
            <div style={emptyStyle}>
              <span style={{ fontSize: '48px' }}>🛍️</span>
              <h3 style={{ color: '#374151', margin: '12px 0 8px 0' }}>No products yet</h3>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                Be the first to list something! Sign in and go to Settings → Start Selling.
              </p>
            </div>
          )}

          {!isLoading && !error && products.length > 0 && (
            <div style={gridStyle}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAuthenticated={isAuthenticated}
                  onAddToCart={handleAddToCart}
                  isAdding={addingId === product.id}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={footerStyle}>
        <p style={{ margin: 0, color: '#9ca3af', fontSize: '13px' }}>
          © {new Date().getFullYear()} {APP_NAME} · {APP_TAGLINE}
        </p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        #hero-browse-btn:hover { background-color: #374151 !important; }
        #hero-signin-btn:hover { background-color: rgba(255,255,255,0.15) !important; }
        #landing-search-input:focus { outline: none; border-color: #111827 !important; }
        .product-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important; }
        .add-to-cart-btn:hover { background-color: #374151 !important; }
        .buy-now-btn:hover { background-color: #1e3a5f !important; }
      `}</style>
    </div>
  );
};

// ── ProductCard sub-component ──────────────────────────────────────────────────
interface ProductCardProps {
  product: Product;
  isAuthenticated: boolean;
  onAddToCart: (e: React.MouseEvent, id: string) => void;
  isAdding: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isAuthenticated,
  onAddToCart,
  isAdding,
}) => {
  const conditionColors: Record<string, string> = {
    NEW: '#065f46',
    LIKE_NEW: '#1e40af',
    GOOD: '#374151',
    FAIR: '#92400e',
    POOR: '#991b1b',
  };

  return (
    <Link
      to={`/products/${product.id}`}
      style={cardStyle}
      className="product-card"
      id={`product-card-${product.id}`}
    >
      {/* Product image */}
      <div style={cardImageWrapStyle}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            style={cardImageStyle}
            loading="lazy"
          />
        ) : (
          <div style={cardNoImageStyle}>
            <span style={{ fontSize: '36px' }}>📦</span>
          </div>
        )}
        {product.condition && (
          <span
            style={{
              ...conditionBadgeStyle,
              backgroundColor: conditionColors[product.condition] || '#374151',
            }}
          >
            {product.condition.replace('_', ' ')}
          </span>
        )}
      </div>

      {/* Product info */}
      <div style={cardBodyStyle}>
        <div style={cardCategoryStyle}>{product.category || 'General'}</div>
        <h3 style={cardTitleStyle}>{product.title}</h3>
        {product.description && (
          <p style={cardDescStyle}>{product.description.slice(0, 80)}{product.description.length > 80 ? '…' : ''}</p>
        )}

        <div style={cardFooterStyle}>
          <div>
            <span style={cardPriceStyle}>₹{Number(product.price).toFixed(2)}</span>
            <div style={cardSellerStyle}>by {product.seller_name}</div>
          </div>
          <button
            onClick={(e) => onAddToCart(e, product.id)}
            style={addToCartBtnStyle}
            className="add-to-cart-btn"
            disabled={isAdding}
            id={`add-to-cart-${product.id}`}
          >
            {isAdding ? '...' : isAuthenticated ? '+ Cart' : 'Sign in'}
          </button>
        </div>
      </div>
    </Link>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#f9fafb',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const heroStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #111827 0%, #1f2937 60%, #374151 100%)',
  padding: '64px 24px',
  textAlign: 'center',
};

const heroInnerStyle: React.CSSProperties = {
  maxWidth: '700px',
  margin: '0 auto',
};

const heroBadgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 14px',
  borderRadius: '20px',
  backgroundColor: 'rgba(255,255,255,0.1)',
  color: '#d1d5db',
  fontSize: '13px',
  fontWeight: '500',
  marginBottom: '16px',
  letterSpacing: '0.05em',
};

const heroHeadingStyle: React.CSSProperties = {
  fontSize: '52px',
  fontWeight: '900',
  color: '#ffffff',
  margin: '0 0 12px 0',
  letterSpacing: '0.05em',
};

const heroSubStyle: React.CSSProperties = {
  fontSize: '17px',
  color: '#9ca3af',
  margin: '0 0 32px 0',
  lineHeight: '1.6',
};

const heroActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
  flexWrap: 'wrap',
};

const heroPrimaryBtnStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '12px 28px',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  color: '#111827',
  fontSize: '15px',
  fontWeight: '700',
  textDecoration: 'none',
  transition: 'background-color 0.15s ease',
};

const heroSecondaryBtnStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '12px 28px',
  borderRadius: '8px',
  border: '1.5px solid rgba(255,255,255,0.3)',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  transition: 'background-color 0.15s ease',
};

const filterBarStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e5e7eb',
  padding: '12px 24px',
};

const filterInnerStyle: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const filterSearchFormStyle: React.CSSProperties = {
  display: 'flex',
  maxWidth: '500px',
};

const filterSearchInputStyle: React.CSSProperties = {
  flex: 1,
  height: '36px',
  padding: '0 12px',
  borderRadius: '6px 0 0 6px',
  border: '1.5px solid #e5e7eb',
  borderRight: 'none',
  backgroundColor: '#f9fafb',
  color: '#111827',
  fontSize: '13px',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'border-color 0.15s ease',
};

const filterSearchBtnStyle: React.CSSProperties = {
  height: '36px',
  padding: '0 16px',
  borderRadius: '0 6px 6px 0',
  border: '1.5px solid #111827',
  backgroundColor: '#111827',
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '600',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const categoryPillsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
};

const categoryPillStyle = (active: boolean): React.CSSProperties => ({
  padding: '5px 14px',
  borderRadius: '20px',
  border: `1.5px solid ${active ? '#111827' : '#e5e7eb'}`,
  backgroundColor: active ? '#111827' : '#ffffff',
  color: active ? '#ffffff' : '#6b7280',
  fontSize: '13px',
  fontWeight: active ? '600' : '400',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  fontFamily: "'Inter', system-ui, sans-serif",
});

const mainStyle: React.CSSProperties = {
  padding: '32px 24px',
};

const mainInnerStyle: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto',
};

const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '12px',
  marginBottom: '20px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#111827',
  margin: 0,
};

const sectionCountStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#9ca3af',
  fontWeight: '400',
  marginLeft: '8px',
};

const centerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 0',
};

const spinnerStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  border: '3px solid #e5e7eb',
  borderTop: '3px solid #111827',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
  margin: '0 auto',
};

const errorBoxStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: '#fffbeb',
  border: '1px solid #fde68a',
  borderRadius: '10px',
  marginBottom: '24px',
};

const emptyStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 0',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: '20px',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  overflow: 'hidden',
  textDecoration: 'none',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  cursor: 'pointer',
};

const cardImageWrapStyle: React.CSSProperties = {
  position: 'relative',
  height: '180px',
  overflow: 'hidden',
};

const cardImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const cardNoImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: '#f3f4f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const conditionBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '8px',
  left: '8px',
  padding: '2px 8px',
  borderRadius: '4px',
  color: '#ffffff',
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.05em',
};

const cardBodyStyle: React.CSSProperties = {
  padding: '14px',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: '4px',
};

const cardCategoryStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '600',
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#111827',
  margin: '2px 0 4px 0',
  lineHeight: '1.4',
};

const cardDescStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#6b7280',
  margin: 0,
  lineHeight: '1.5',
};

const cardFooterStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginTop: 'auto',
  paddingTop: '10px',
};

const cardPriceStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '800',
  color: '#111827',
};

const cardSellerStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#9ca3af',
  marginTop: '2px',
};

const addToCartBtnStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#111827',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  fontFamily: "'Inter', system-ui, sans-serif",
  flexShrink: 0,
};

const footerStyle: React.CSSProperties = {
  backgroundColor: '#111827',
  padding: '24px',
  textAlign: 'center',
  marginTop: '40px',
};

export default LandingPage;
