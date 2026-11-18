// ============================================================
// LAVSA — Public Landing Page
// Campus marketplace entry page for visitors and prospective users.
// Shows hero section, category filters, product discovery, and safety features.
// Redesigned with the LAVSA design system (global.css + UI kit).
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar/PublicNavbar';
import Footer from '../../components/Footer/Footer';
import { getProducts, Product } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Button, EmptyState, Skeleton, SkeletonImage } from '../../components/UI/ui';
import {
  IconSearch,
  IconSparkles,
  IconShield,
  IconMapPin,
  IconZap,
  IconArrowRight,
  IconStore,
} from '../../components/UI/Icons';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Furniture', 'Sports', 'Other'];

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    const q = searchParams.get('q') || '';
    setSelectedCategory(cat);
    setSearchQuery(q);
    setInputValue(q);
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery.trim()) params.q = searchQuery.trim();
      const res = await getProducts(params);
      setProducts(res.products || []);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--page-bg)' }}>
      <PublicNavbar />

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 20px 60px' }}>
          {/* ── Hero Section ── */}
          <section className="hero-section" style={{ marginTop: 24, marginBottom: 32 }}>
            <div className="hero-content">
              <span className="hero-kicker">
                <IconSparkles size={14} /> Campus Marketplace
              </span>
              <h1 className="hero-title">
                Buy &amp; Sell <span className="hero-title-accent">with fellow students</span>
              </h1>
              <p className="hero-sub">
                The smart, affordable marketplace for college students. Save on textbooks, electronics, cycles, and dorm gear with safe in-person campus meetups.
              </p>

              <form onSubmit={handleSearch} className="hero-search">
                <div className="hero-search-wrap">
                  <IconSearch size={18} className="hero-search-icon" />
                  <input
                    type="text"
                    placeholder="Search for textbooks, laptops, lab kits..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="hero-search-input"
                    id="lp-search-input"
                  />
                  <button type="submit" className="btn btn-primary btn-lg hero-search-btn">
                    Search
                  </button>
                </div>
              </form>

              {/* Trust highlights */}
              <div style={{ display: 'flex', gap: 20, marginTop: 24, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <IconMapPin size={16} color="var(--brand)" />
                  <span>Meet on Campus (No Shipping)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <IconShield size={16} color="var(--success-strong)" />
                  <span>OTP Handover Protection</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <IconZap size={16} color="var(--warning-strong)" />
                  <span>Direct Student-to-Student</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-badge">
                <IconSparkles size={20} />
                <span>Zero Delivery Charges</span>
              </div>
            </div>
          </section>

          {/* ── Category Navigation ── */}
          <section className="category-section" style={{ marginBottom: 24 }}>
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

          {/* ── Products Header ── */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 18,
            }}
          >
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
                {selectedCategory === 'All' ? 'Explore Campus Listings' : selectedCategory}
              </h2>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                {!isLoading ? `${products.length} item${products.length !== 1 ? 's' : ''} available` : 'Loading products...'}
              </div>
            </div>

            {!isAuthenticated && (
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign in to Buy <IconArrowRight size={13} />
              </Link>
            )}
          </div>

          {/* ── Loading Skeleton ── */}
          {isLoading && (
            <div className="product-grid" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card-skeleton">
                  <SkeletonImage h={220} r={12} />
                  <Skeleton h={16} style={{ marginTop: 12, width: '60%' }} />
                  <Skeleton h={14} style={{ marginTop: 8, width: '40%' }} />
                  <Skeleton h={12} style={{ marginTop: 6, width: '30%' }} />
                </div>
              ))}
            </div>
          )}

          {/* ── Empty State ── */}
          {!isLoading && products.length === 0 && (
            <EmptyState
              icon="package"
              title="No products found"
              description="Try adjusting your search keywords or select a different category."
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  icon="refresh"
                  onClick={() => {
                    setInputValue('');
                    setSearchQuery('');
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('q');
                    newParams.delete('category');
                    setSearchParams(newParams);
                    setSelectedCategory('All');
                  }}
                >
                  Reset filters
                </Button>
              }
            />
          )}

          {/* ── Products Grid ── */}
          {!isLoading && products.length > 0 && (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}

          {/* ── Call to action for Sellers ── */}
          <section
            style={{
              marginTop: 48,
              padding: '36px 32px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--ink)',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 24,
            }}
          >
            <div style={{ maxWidth: 520 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--brand-border)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                <IconStore size={14} /> Sell on LAVSA
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px 0', color: '#ffffff' }}>
                Done with your semester books or tech?
              </h3>
              <p style={{ fontSize: 14, color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>
                Turn your unused electronics, textbooks, and hostel essentials into cash. List in 60 seconds with camera upload and hand over directly on campus.
              </p>
            </div>

            <div>
              <Link
                to={isAuthenticated ? '/seller/products' : '/seller/sign-in'}
                className="btn btn-primary btn-lg"
                style={{ fontSize: 15, padding: '12px 24px' }}
              >
                Start Selling Today <IconArrowRight size={16} />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
