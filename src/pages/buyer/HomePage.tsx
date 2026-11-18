// ============================================================
// LAVSA — Home Page
// Hero section, prominent search, category navigation,
// featured and recently added products using shared ProductCard.
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '../../components/Layout/AppLayout';
import { getProducts, Product } from '../../services/productService';
import { getWishlistIds, addToWishlist, removeFromWishlist } from '../../services/userService';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Button, PageHeader, EmptyState, Skeleton, SkeletonImage } from '../../components/UI/ui';
import { IconSearch, IconSparkles } from '../../components/UI/Icons';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Furniture', 'Sports', 'Other'];

const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [togglingWishId, setTogglingWishId] = useState<string | null>(null);

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    const q = searchParams.get('q') || '';
    setSelectedCategory(cat);
    setSearchQuery(q);
    setInputValue(q);
  }, [searchParams]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery.trim()) params.q = searchQuery.trim();
      const res = await getProducts(params);
      setProducts(res.products);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    getWishlistIds().then((ids) => setWishlistIds(new Set(ids))).catch(() => {});
  }, []);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputValue.trim());
    const newParams = new URLSearchParams(searchParams);
    if (inputValue.trim()) {
      newParams.set('q', inputValue.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const handleWishlistToggle = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (togglingWishId === productId) return;
    setTogglingWishId(productId);
    try {
      if (wishlistIds.has(productId)) {
        await removeFromWishlist(productId);
        setWishlistIds((prev) => {
          const s = new Set(prev);
          s.delete(productId);
          return s;
        });
      } else {
        await addToWishlist(productId);
        setWishlistIds((prev) => new Set(prev).add(productId));
      }
    } catch {
      /* silent */
    } finally {
      setTogglingWishId(null);
    }
  };

  return (
    <AppLayout>
      <div className="page home-page">
        {/* ── Hero Section ── */}
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-kicker">Campus Marketplace</span>
            <h1 className="hero-title">Buy &amp; Sell <span className="hero-title-accent">with fellow students</span></h1>
            <p className="hero-sub">
              Discover pre-owned and new products from your campus community. Textbooks, electronics, fashion, and more.
            </p>
            <form onSubmit={handleSearch} className="hero-search">
              <div className="hero-search-wrap">
                <IconSearch size={18} className="hero-search-icon" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="hero-search-input"
                />
                <button type="submit" className="btn btn-primary btn-lg hero-search-btn">
                  Search
                </button>
              </div>
            </form>
          </div>
          <div className="hero-visual">
            <div className="hero-badge">
              <IconSparkles size={20} />
              <span>Trusted by 5000+ students</span>
            </div>
          </div>
        </section>

        {/* ── Category Navigation ── */}
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

        {/* ── Section header ── */}
        <PageHeader
          title={selectedCategory === 'All' ? 'All Products' : selectedCategory}
          subtitle={
            !isLoading
              ? `${products.length} product${products.length !== 1 ? 's' : ''} available`
              : 'Loading products...'
          }
          icon="package"
        />

        {/* ── Loading ── */}
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

        {/* ── Empty ── */}
        {!isLoading && products.length === 0 && (
          <EmptyState
            icon="package"
            title="No products found"
            description="Try searching for something else or pick another category."
            action={
              <Button variant="ghost" size="sm" icon="refresh" onClick={() => {
                setInputValue('');
                setSearchQuery('');
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('q');
                newParams.delete('category');
                setSearchParams(newParams);
                setSelectedCategory('All');
              }}>
                Clear filters
              </Button>
            }
          />
        )}

        {/* ── Products Grid ── */}
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

export default HomePage;
