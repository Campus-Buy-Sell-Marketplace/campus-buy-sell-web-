// ============================================================
// LAVSA — Seller Products Page (manage & upload listings)
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import {
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
} from '../../services/productService';

const CONDITIONS = ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR'];
const CATEGORIES = ['Electronics', 'Books', 'Clothing', 'Furniture', 'Sports', 'Other'];

interface ProductForm {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  image_url: string;
  stock: string;
}

const emptyForm: ProductForm = {
  title: '',
  description: '',
  price: '',
  category: 'Other',
  condition: 'GOOD',
  image_url: '',
  stock: '1',
};

const SellerProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchMyProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMyProducts();
      setProducts(data);
    } catch {
      setError('Failed to load your products.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyProducts();
  }, [fetchMyProducts]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
    setSuccessMsg('');
  };

  const openEditForm = (product: Product) => {
    setForm({
      title: product.title,
      description: product.description || '',
      price: String(product.price),
      category: product.category || 'Other',
      condition: product.condition || 'GOOD',
      image_url: product.image_url || '',
      stock: String(product.stock),
    });
    setEditingId(product.id);
    setShowForm(true);
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        price: parseFloat(form.price),
        category: form.category || undefined,
        condition: form.condition || undefined,
        image_url: form.image_url.trim() || undefined,
        stock: parseInt(form.stock, 10) || 1,
      };

      if (editingId) {
        await updateProduct(editingId, payload);
        setSuccessMsg('Product updated!');
      } else {
        await createProduct(payload);
        setSuccessMsg('Product listed successfully!');
      }

      setShowForm(false);
      setEditingId(null);
      fetchMyProducts();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSuccessMsg('Product deleted.');
    } catch {
      setError('Failed to delete product.');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await updateProduct(product.id, { is_active: !product.is_active });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: !p.is_active } : p))
      );
    } catch {
      setError('Failed to update listing status.');
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={headerRowStyle}>
          <div>
            <h1 style={headingStyle}>My Listings</h1>
            <p style={subStyle}>
              {products.length} product{products.length !== 1 ? 's' : ''} listed
            </p>
          </div>
          <button onClick={openAddForm} style={addBtnStyle} id="add-product-btn">
            + Add Product
          </button>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div style={successAlertStyle}>
            ✅ {successMsg}
            <button onClick={() => setSuccessMsg('')} style={alertCloseStyle}>✕</button>
          </div>
        )}
        {error && (
          <div style={errorAlertStyle}>
            ⚠️ {error}
            <button onClick={() => setError('')} style={alertCloseStyle}>✕</button>
          </div>
        )}

        {/* Add / Edit Form */}
        {showForm && (
          <div style={formOverlayStyle}>
            <div style={formCardStyle}>
              <div style={formHeaderStyle}>
                <h2 style={formTitleStyle}>
                  {editingId ? 'Edit Product' : 'List a New Product'}
                </h2>
                <button onClick={() => setShowForm(false)} style={formCloseStyle} id="close-product-form">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} style={formBodyStyle}>
                <div style={formGridStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Title *</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleFormChange}
                      placeholder="Product title"
                      style={inputStyle}
                      required
                      id="product-title"
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Price (₹) *</label>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={handleFormChange}
                      placeholder="0.00"
                      style={inputStyle}
                      required
                      id="product-price"
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleFormChange}
                      style={inputStyle}
                      id="product-category"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Condition</label>
                    <select
                      name="condition"
                      value={form.condition}
                      onChange={handleFormChange}
                      style={inputStyle}
                      id="product-condition"
                    >
                      {CONDITIONS.map((c) => (
                        <option key={c} value={c}>{c.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Stock Quantity</label>
                    <input
                      name="stock"
                      type="number"
                      min="1"
                      value={form.stock}
                      onChange={handleFormChange}
                      style={inputStyle}
                      id="product-stock"
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Image URL (optional)</label>
                    <input
                      name="image_url"
                      type="url"
                      value={form.image_url}
                      onChange={handleFormChange}
                      placeholder="https://..."
                      style={inputStyle}
                      id="product-image-url"
                    />
                  </div>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    placeholder="Describe your product..."
                    style={{ ...inputStyle, height: '80px', resize: 'vertical' } as React.CSSProperties}
                    id="product-description"
                  />
                </div>

                {error && <div style={formErrorStyle}>{error}</div>}

                <div style={formActionsStyle}>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={cancelBtnStyle}
                    id="cancel-product-form"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={submitBtnStyle}
                    disabled={isSubmitting}
                    id="submit-product-form"
                  >
                    {isSubmitting ? 'Saving...' : editingId ? 'Save Changes' : 'List Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div style={centerStyle}>
            <div style={spinnerStyle} />
            <p style={{ color: '#6b7280', marginTop: '12px' }}>Loading your listings...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && products.length === 0 && (
          <div style={emptyStyle}>
            <span style={{ fontSize: '48px' }}>🏷️</span>
            <h3 style={{ color: '#374151', margin: '12px 0 8px 0' }}>No products listed yet</h3>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px' }}>
              Start by adding your first product listing!
            </p>
            <button onClick={openAddForm} style={addBtnStyle} id="add-first-product-btn">
              + Add Your First Product
            </button>
          </div>
        )}

        {/* Products table */}
        {!isLoading && products.length > 0 && (
          <div style={tableWrapStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  {['Product', 'Category', 'Condition', 'Price', 'Stock', 'Status', 'Actions'].map(
                    (h) => (
                      <th key={h} style={thStyle}>{h}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={trStyle} id={`product-row-${product.id}`}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.title} style={thumbStyle} />
                        ) : (
                          <div style={thumbPlaceholderStyle}>📦</div>
                        )}
                        <div>
                          <div style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>
                            {product.title}
                          </div>
                          {product.description && (
                            <div style={{ color: '#9ca3af', fontSize: '11px' }}>
                              {product.description.slice(0, 50)}{product.description.length > 50 ? '…' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={categoryChipStyle}>{product.category || '—'}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        {product.condition?.replace('_', ' ') || '—'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: '700', color: '#111827' }}>
                        ₹{Number(product.price).toFixed(2)}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: '13px', color: Number(product.stock) < 3 ? '#dc2626' : '#111827' }}>
                        {product.stock}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleToggleActive(product)}
                        style={statusToggleStyle(product.is_active !== false)}
                        id={`toggle-active-${product.id}`}
                      >
                        {product.is_active !== false ? '● Active' : '○ Hidden'}
                      </button>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => openEditForm(product)}
                          style={editBtnStyle}
                          id={`edit-product-${product.id}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          style={deleteBtnStyle}
                          id={`delete-product-${product.id}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        #add-product-btn:hover, #add-first-product-btn:hover { background-color: #374151 !important; }
        #submit-product-form:hover:not(:disabled) { background-color: #374151 !important; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: #111827 !important; box-shadow: 0 0 0 3px rgba(17,24,39,0.08); }
      `}</style>
    </AppLayout>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const headingStyle: React.CSSProperties = { color: '#111827', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' };
const subStyle: React.CSSProperties = { color: '#6b7280', fontSize: '14px', margin: 0 };

const headerRowStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px',
};

const addBtnStyle: React.CSSProperties = {
  padding: '10px 20px', borderRadius: '8px', border: 'none',
  backgroundColor: '#111827', color: '#ffffff', fontSize: '14px', fontWeight: '600',
  cursor: 'pointer', transition: 'background-color 0.15s ease',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const successAlertStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '12px 16px', borderRadius: '8px', backgroundColor: '#f0fdf4',
  border: '1px solid #bbf7d0', color: '#166534', fontSize: '13px', marginBottom: '16px',
};

const errorAlertStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '12px 16px', borderRadius: '8px', backgroundColor: '#fef2f2',
  border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px', marginBottom: '16px',
};

const alertCloseStyle: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'inherit',
};

const formOverlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
  padding: '20px',
};

const formCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff', borderRadius: '16px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)', width: '100%', maxWidth: '680px',
  maxHeight: '90vh', overflowY: 'auto',
};

const formHeaderStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '20px 24px', borderBottom: '1px solid #f3f4f6',
};

const formTitleStyle: React.CSSProperties = {
  fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0,
};

const formCloseStyle: React.CSSProperties = {
  background: 'none', border: 'none', color: '#9ca3af', fontSize: '16px', cursor: 'pointer',
};

const formBodyStyle: React.CSSProperties = { padding: '24px' };

const formGridStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px',
};

const fieldStyle: React.CSSProperties = { marginBottom: '0' };

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: '8px',
  border: '1.5px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#111827',
  fontSize: '14px', fontFamily: "'Inter', system-ui, sans-serif", boxSizing: 'border-box',
  transition: 'border-color 0.15s ease',
};

const formErrorStyle: React.CSSProperties = {
  padding: '10px 14px', borderRadius: '8px', backgroundColor: '#fef2f2',
  border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px', marginBottom: '12px',
};

const formActionsStyle: React.CSSProperties = {
  display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px',
};

const cancelBtnStyle: React.CSSProperties = {
  padding: '10px 20px', borderRadius: '8px', border: '1px solid #e5e7eb',
  backgroundColor: '#ffffff', color: '#6b7280', fontSize: '14px', cursor: 'pointer',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const submitBtnStyle: React.CSSProperties = {
  padding: '10px 24px', borderRadius: '8px', border: 'none',
  backgroundColor: '#111827', color: '#ffffff', fontSize: '14px', fontWeight: '600',
  cursor: 'pointer', transition: 'background-color 0.15s ease',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const centerStyle: React.CSSProperties = { textAlign: 'center', padding: '60px 0' };

const spinnerStyle: React.CSSProperties = {
  width: '32px', height: '32px', border: '3px solid #e5e7eb',
  borderTop: '3px solid #111827', borderRadius: '50%', margin: '0 auto',
  animation: 'spin 0.8s linear infinite',
};

const emptyStyle: React.CSSProperties = { textAlign: 'center', padding: '60px 0' };

const tableWrapStyle: React.CSSProperties = {
  backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden',
};

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' };

const thStyle: React.CSSProperties = {
  padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600',
  color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em',
  borderBottom: '1px solid #f3f4f6', backgroundColor: '#f9fafb',
};

const trStyle: React.CSSProperties = { borderBottom: '1px solid #f9fafb' };

const tdStyle: React.CSSProperties = {
  padding: '14px 16px', fontSize: '13px', verticalAlign: 'middle',
};

const thumbStyle: React.CSSProperties = {
  width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0,
};

const thumbPlaceholderStyle: React.CSSProperties = {
  width: '40px', height: '40px', borderRadius: '6px', backgroundColor: '#f3f4f6',
  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0,
};

const categoryChipStyle: React.CSSProperties = {
  display: 'inline-block', padding: '2px 8px', borderRadius: '4px',
  backgroundColor: '#f3f4f6', color: '#6b7280', fontSize: '11px',
};

const statusToggleStyle = (active: boolean): React.CSSProperties => ({
  padding: '3px 10px', borderRadius: '12px', border: 'none', cursor: 'pointer',
  backgroundColor: active ? '#f0fdf4' : '#f3f4f6',
  color: active ? '#166534' : '#6b7280',
  fontSize: '11px', fontWeight: '600',
  fontFamily: "'Inter', system-ui, sans-serif",
});

const editBtnStyle: React.CSSProperties = {
  padding: '5px 12px', borderRadius: '6px', border: '1px solid #e5e7eb',
  backgroundColor: '#ffffff', color: '#374151', fontSize: '12px', cursor: 'pointer',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const deleteBtnStyle: React.CSSProperties = {
  padding: '5px 12px', borderRadius: '6px', border: 'none',
  backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '12px', cursor: 'pointer',
  fontFamily: "'Inter', system-ui, sans-serif",
};

export default SellerProductsPage;
