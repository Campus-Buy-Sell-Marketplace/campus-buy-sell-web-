// ============================================================
// LAVSA — Products Page (authenticated buyers)
// Shows all active products with cart functionality.
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { getProducts, Product } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Furniture', 'Sports', 'Other'];
const CONDITIONS: Record<string, string> = {
  NEW: '#065f46',
  LIKE_NEW: '#1e40af',
  GOOD: '#374151',
  FAIR: '#92400e',
  POOR: '#991b1b',
};

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [addingId, setAddingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [addedId, setAddedId] = useState<string | null>(null);

  // Auto-dismiss error after 4 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
      setError('Could not load products. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSearchParams(cat !== 'All' ? { category: cat } : {});
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    setAddingId(productId);
    try {
      await addToCart(productId, 1);
      setAddedId(productId);
      const prod = products.find((p) => p.id === productId);
      showToast(`Added "${prod?.title || 'Product'}" to cart!`, 'success');
      setTimeout(() => setAddedId(null), 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to add item to cart.';
      showToast(msg, 'warning');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={headerRowStyle}>
          <div>
            <h1 style={headingStyle}>Products</h1>
            <p style={subStyle}>
              {isLoading ? 'Loading...' : `${products.length} item${products.length !== 1 ? 's' : ''} available`}
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} style={searchFormStyle}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={searchInputStyle}
              id="products-search-input"
            />
            <button type="submit" style={searchBtnStyle} id="products-search-btn">
              Search
            </button>
          </form>
        </div>

        {/* Category pills */}
        <div style={categoryRowStyle}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              style={catPillStyle(selectedCategory === cat)}
              id={`products-cat-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={errorBoxStyle}>⚠️ {error}</div>
        )}

        {/* Loading */}
        {isLoading && (
          <div style={centerStyle}>
            <div style={spinnerStyle} />
            <p style={{ color: '#6b7280', marginTop: '12px' }}>Loading products...</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && products.length === 0 && (
          <div style={emptyStyle}>
            <span style={{ fontSize: '48px' }}>🛍️</span>
            <h3 style={{ color: '#374151', margin: '12px 0 8px 0' }}>No products found</h3>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              Try a different category or search term.
            </p>
          </div>
        )}

        {/* Products grid */}
        {!isLoading && !error && products.length > 0 && (
          <div style={gridStyle}>
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                style={cardStyle}
                className="product-card"
                id={`product-${product.id}`}
              >
                <div style={cardImageWrapStyle}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.title} style={cardImageStyle} loading="lazy" />
                  ) : (
                    <div style={cardNoImageStyle}><span style={{ fontSize: '36px' }}>📦</span></div>
                  )}
                  {product.condition && (
                    <span style={{ ...condBadgeStyle, backgroundColor: CONDITIONS[product.condition] || '#374151' }}>
                      {product.condition.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <div style={cardBodyStyle}>
                  <div style={cardCatStyle}>{product.category || 'General'}</div>
                  <h3 style={cardTitleStyle}>{product.title}</h3>
                  {product.description && (
                    <p style={cardDescStyle}>
                      {product.description.slice(0, 70)}{product.description.length > 70 ? '…' : ''}
                    </p>
                  )}
                  <div style={cardFootStyle}>
                    <div>
                      <div style={cardPriceStyle}>₹{Number(product.price).toFixed(2)}</div>
                      <div style={cardSellerStyle}>by {product.seller_name}</div>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product.id)}
                      style={{
                        ...cartBtnStyle,
                        backgroundColor: addedId === product.id ? '#065f46' : '#111827',
                      }}
                      disabled={addingId === product.id}
                      id={`add-cart-${product.id}`}
                    >
                      {addingId === product.id ? '...' : addedId === product.id ? '✓ Added' : '+ Cart'}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .product-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
        #products-search-input:focus { outline: none; border-color: #111827 !important; }
      `}</style>
    </AppLayout>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const headingStyle: React.CSSProperties = { color: '#111827', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' };
const subStyle: React.CSSProperties = { color: '#6b7280', fontSize: '14px', margin: 0 };

const headerRowStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px',
};

const searchFormStyle: React.CSSProperties = { display: 'flex', gap: '0' };

const searchInputStyle: React.CSSProperties = {
  height: '36px', padding: '0 12px', borderRadius: '6px 0 0 6px',
  border: '1.5px solid #e5e7eb', borderRight: 'none', backgroundColor: '#ffffff',
  color: '#111827', fontSize: '13px', fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'border-color 0.15s ease', width: '200px',
};

const searchBtnStyle: React.CSSProperties = {
  height: '36px', padding: '0 16px', borderRadius: '0 6px 6px 0',
  border: '1.5px solid #111827', backgroundColor: '#111827', color: '#ffffff',
  cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: "'Inter', system-ui, sans-serif",
};

const categoryRowStyle: React.CSSProperties = {
  display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px',
};

const catPillStyle = (active: boolean): React.CSSProperties => ({
  padding: '5px 14px', borderRadius: '20px', border: `1.5px solid ${active ? '#111827' : '#e5e7eb'}`,
  backgroundColor: active ? '#111827' : '#ffffff', color: active ? '#ffffff' : '#6b7280',
  fontSize: '13px', fontWeight: active ? '600' : '400', cursor: 'pointer',
  transition: 'all 0.15s ease', fontFamily: "'Inter', system-ui, sans-serif",
});

const errorBoxStyle: React.CSSProperties = {
  padding: '16px', borderRadius: '10px', backgroundColor: '#fffbeb',
  border: '1px solid #fde68a', color: '#92400e', fontSize: '14px', marginBottom: '16px',
};

const centerStyle: React.CSSProperties = { textAlign: 'center', padding: '60px 0' };

const spinnerStyle: React.CSSProperties = {
  width: '32px', height: '32px', border: '3px solid #e5e7eb',
  borderTop: '3px solid #111827', borderRadius: '50%', margin: '0 auto',
  animation: 'spin 0.8s linear infinite',
};

const emptyStyle: React.CSSProperties = { textAlign: 'center', padding: '60px 0' };

const gridStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '16px',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px',
  overflow: 'hidden', textDecoration: 'none', display: 'flex', flexDirection: 'column',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease', cursor: 'pointer',
};

const cardImageWrapStyle: React.CSSProperties = { position: 'relative', height: '170px', overflow: 'hidden' };
const cardImageStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const cardNoImageStyle: React.CSSProperties = {
  width: '100%', height: '100%', backgroundColor: '#f3f4f6', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
};

const condBadgeStyle: React.CSSProperties = {
  position: 'absolute', top: '8px', left: '8px', padding: '2px 8px', borderRadius: '4px',
  color: '#ffffff', fontSize: '10px', fontWeight: '700', letterSpacing: '0.05em',
};

const cardBodyStyle: React.CSSProperties = {
  padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, gap: '4px',
};

const cardCatStyle: React.CSSProperties = {
  fontSize: '11px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: '14px', fontWeight: '600', color: '#111827', margin: '2px 0 4px 0', lineHeight: '1.4',
};

const cardDescStyle: React.CSSProperties = { fontSize: '12px', color: '#6b7280', margin: 0, lineHeight: '1.5' };

const cardFootStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
  marginTop: 'auto', paddingTop: '10px',
};

const cardPriceStyle: React.CSSProperties = { fontSize: '16px', fontWeight: '800', color: '#111827' };
const cardSellerStyle: React.CSSProperties = { fontSize: '11px', color: '#9ca3af', marginTop: '2px' };

const cartBtnStyle: React.CSSProperties = {
  padding: '6px 12px', borderRadius: '6px', border: 'none', color: '#ffffff',
  fontSize: '12px', fontWeight: '600', cursor: 'pointer',
  transition: 'background-color 0.15s ease', fontFamily: "'Inter', system-ui, sans-serif", flexShrink: 0,
};

export default ProductsPage;
