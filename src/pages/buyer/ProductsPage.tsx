// ============================================================
// LAVSA � Products Page
// Full product browse with shared ProductCard, category chips,
// search, wishlist and add-to-cart.
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { getProducts, Product } from '../../services/productService';
import CartButton from '../../components/CartButton/CartButton';
import { getWishlistIds, addToWishlist, removeFromWishlist } from '../../services/userService';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Button, PageHeader, EmptyState, Skeleton, SkeletonImage } from '../../components/UI/ui';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Furniture', 'Sports', 'Other'];

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const [error, setError] = useState('');
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [togglingWishId, setTogglingWishId] = useState<string | null>(null);

  useEffect(() => {
    getWishlistIds().then((ids) => setWishlistIds(new Set(ids))).catch(() => {});
  }, []);

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

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSearchParams(cat !== 'All' ? { category: cat } : {});
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputValue);
    const p: Record<string, string> = {};
    if (selectedCategory !== 'All') p.category = selectedCategory;
    if (inputValue.trim()) p.q = inputValue.trim();
    setSearchParams(p);
  };

  const handleWishlistToggle = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (togglingWishId === productId) return;
    setTogglingWishId(productId);
    try {
      if (wishlistIds.has(productId)) {
        await removeFromWishlist(productId);
        setWishlistIds((prev) => { const s = new Set(prev); s.delete(productId); return s; });
      } else {
        await addToWishlist(productId);
        setWishlistIds((prev) => new Set(prev).add(productId));
      }
    } catch { /* silent */ } finally {
      setTogglingWishId(null);
    }
  };

  return (
    <AppLayout>
      <div className="page products-page">
        <div className="hero-search-bar">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-wrap">
              <div className="search-icon">??</div>
              <input
                type="text"
                placeholder="Search products..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="btn btn-primary search-btn">
                Search
              </button>
            </div>
          </form>
        </div>

        <section className="category-section">
          <div className="category-scroll">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`category-chip ${active ? 'active' : ''}`}
                  id={`cat-${cat.toLowerCase()}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        <PageHeader
          title={selectedCategory === 'All' ? 'All Products' : selectedCategory}
          subtitle={
            !isLoading
              ? `${products.length} product${products.length !== 1 ? 's' : ''} available`
              : 'Loading products...'
          }
          icon="package"
        />

        {error && (
          <div className="error-banner-wrapper">
            <Button variant="danger-soft" size="sm" onClick={() => fetchProducts()}>
              Try again
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="product-grid" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card-skeleton">
                <SkeletonImage h={260} r={12} />
                <Skeleton h={16} style={{ marginTop: 12, width: '60%' }} />
                <Skeleton h={14} style={{ marginTop: 8, width: '40%' }} />
                <Skeleton h={12} style={{ marginTop: 6, width: '30%' }} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <EmptyState
            icon="package"
            title="No products found"
            description={error || 'Try searching for something else or pick another category.'}
            action={
              <Button variant="ghost" size="sm" icon="refresh" onClick={() => {
                setInputValue('');
                setSearchQuery('');
                setSelectedCategory('All');
                setSearchParams({});
              }}>
                Clear filters
              </Button>
            }
          />
        )}

        {!isLoading && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => {
              const isWishlisted = wishlistIds.has(product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  wishlisted={isWishlisted}
                  onToggleWishlist={(productId) => handleWishlistToggle(
                    { preventDefault: () => {}, stopPropagation: () => {} } as React.MouseEvent,
                    productId
                  )}
                />
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ProductsPage;
