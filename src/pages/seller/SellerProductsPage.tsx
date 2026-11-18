// ============================================================
// LAVSA � Seller Products Page (manage & upload listings)
// Redesigned: clean listing creation, image upload, form sections,
// helpful validation and feedback.
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import { uploadService } from '../../services/uploadService';
import {
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
} from '../../services/productService';
import { Button, Card, Input, Textarea, Select, Label, EmptyState, ErrorBanner, Badge, PageHeader } from '../../components/UI/ui';
import { CONDITION_OPTIONS, getConditionMeta } from '../../utils/conditions';
import { IconImage, IconUpload } from '../../components/UI/Icons';

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
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Only JPEG, PNG, and WebP images are supported.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size exceeds 5MB limit.', 'error');
      return;
    }

    try {
      setUploadingImage(true);
      const url = await uploadService.uploadImage(file);
      setForm((prev) => ({ ...prev, image_url: url }));
      showToast('Image uploaded successfully.', 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to upload image.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) { setError('Product title is required.'); return; }
    if (!form.description.trim()) { setError('Description is required.'); return; }
    if (!form.price.trim() || Number(form.price) <= 0) { setError('Valid price is required.'); return; }
    if (!form.category) { setError('Please select a category.'); return; }
    if (!form.image_url) { setError('Please upload a product image.'); return; }
    if (!form.stock.trim() || Number(form.stock) < 1) { setError('Valid stock quantity is required.'); return; }

    setIsSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        condition: form.condition,
        image_url: form.image_url,
        stock: Number(form.stock),
      };

      if (editingId) {
        await updateProduct(editingId, payload);
        showToast('Product updated successfully.', 'success');
      } else {
        await createProduct(payload);
        showToast('Product listed successfully.', 'success');
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      await fetchMyProducts();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      description: product.description ?? '',
      price: String(product.price),
      category: product.category ?? 'Other',
      condition: product.condition ?? 'GOOD',
      image_url: product.image_url ?? '',
      stock: String(product.stock),
    });
    setShowForm(true);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;
    deleteProduct(productToDelete.id)
      .then(() => {
        showToast('Product deleted successfully.', 'success');
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete!.id));
      })
      .catch(() => showToast('Failed to delete product.', 'error'))
      .finally(() => setProductToDelete(null));
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="page-loader"><span>Loading your listings...</span></div>
        </div>
      </AppLayout>
    );
  }

  const conditionMeta = getConditionMeta(form.condition);

  return (
    <AppLayout>
      <div className="page seller-products-page">
        <PageHeader
          title="My Listings"
          subtitle="Manage your campus marketplace products"
          icon="store"
          actions={
            <Button variant="primary" size="md" icon="plus" onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}>
              New Listing
            </Button>
          }
        />

        {error && <ErrorBanner message={error} />}

        {!showForm && products.length === 0 && (
          <EmptyState
            icon="store"
            title="No listings yet"
            description="Start selling on campus by creating your first product listing."
            action={
              <Button variant="primary" size="md" icon="plus" onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}>
                Create Listing
              </Button>
            }
          />
        )}

        {!showForm && products.length > 0 && (
          <div className="listings-grid">
            {products.map((product) => {
              const condition = getConditionMeta(product.condition);
              const outOfStock = product.stock <= 0;
              return (
                <div key={product.id} className="listing-card">
                  <div className="listing-image">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.title} className="listing-img" />
                    ) : (
                      <div className="listing-placeholder"><IconImage size={32} /></div>
                    )}
                    <span className={`listing-condition-badge ${condition.badgeClass}`}>{condition.label}</span>
                    {outOfStock && (
                      <div className="listing-sold-out">
                        <span className="badge badge-dark">Sold out</span>
                      </div>
                    )}
                  </div>
                  <div className="listing-body">
                    <h3 className="listing-title">{product.title}</h3>
                    <span className="listing-price">?{product.price.toLocaleString('en-IN')}</span>
                    <div className="listing-meta">
                      <span className="listing-category">{product.category}</span>
                      <span className="listing-stock">{product.stock} in stock</span>
                    </div>
                  </div>
                  <div className="listing-actions">
                    <Button variant="ghost" size="sm" icon="edit" onClick={() => handleEdit(product)} />
                    <Button variant="danger-soft" size="sm" icon="trash" onClick={() => handleDelete(product)} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showForm && (
          <Card padded className="listing-form-card">
            <div className="form-header">
              <h2>{editingId ? 'Edit Listing' : 'Create New Listing'}</h2>
              <Button variant="ghost" size="sm" icon="x" onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(false); }} />
            </div>

            <form onSubmit={handleSubmit} className="listing-form">
              <div className="form-section">
                <h3 className="form-section-title">Product Details</h3>
                <div className="form-row full">
                  <label htmlFor="title" className="label">Product Title</label>
                  <Input id="title" name="title" value={form.title} onChange={handleFormChange} placeholder="e.g. iPhone 12, Calculus Textbook" required />
                </div>
                <div className="form-row full">
                  <label htmlFor="description" className="label">Description</label>
                  <Textarea id="description" name="description" value={form.description} onChange={handleFormChange} rows={4} placeholder="Describe the product condition, features, and any flaws..." required />
                </div>
                <div className="form-row two-col">
                  <div className="form-group">
                    <label htmlFor="price" className="label">Price (₹)</label>
                    <Input id="price" name="price" type="number" value={form.price} onChange={handleFormChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="stock" className="label">Stock Quantity</label>
                    <Input id="stock" name="stock" type="number" value={form.stock} onChange={handleFormChange} required />
                  </div>
                </div>
                <div className="form-row two-col">
                  <div className="form-group">
                    <Label htmlFor="category">Category</Label>
                    <Select id="category" name="category" value={form.category} onChange={handleFormChange} required>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="form-group">
                    <Label htmlFor="condition">Condition</Label>
                    <Select id="condition" name="condition" value={form.condition} onChange={handleFormChange} required>
                      {CONDITION_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="condition-preview">
                  <Badge color={conditionMeta.color}>{conditionMeta.label}</Badge>
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Product Image</h3>
                <div className="image-upload-section">
                  {form.image_url ? (
                    <div className="image-preview">
                      <img src={form.image_url} alt="Preview" className="preview-img" />
                      <Button variant="danger-soft" size="sm" icon="trash" onClick={() => setForm((prev) => ({ ...prev, image_url: '' }))} />
                    </div>
                  ) : (
                    <div className="image-dropzone" onClick={() => fileInputRef.current?.click()}>
                      <IconUpload size={28} />
                      <p>Click to upload product image</p>
                      <span className="dropzone-hint">JPEG, PNG, WebP � Max 5MB</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileUpload}
                    disabled={uploadingImage}
                    style={{ display: 'none' }}
                  />
                  {uploadingImage && <span className="uploading-hint">Uploading image...</span>}
                </div>
              </div>

              <div className="form-actions">
                <Button variant="ghost" size="md" onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(false); }} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit" disabled={isSubmitting} loading={isSubmitting}>
                  {editingId ? 'Update Listing' : 'Publish Listing'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        <ConfirmModal
          isOpen={!!productToDelete}
          title="Delete Listing"
          message={`Are you sure you want to delete "${productToDelete?.title}"? This cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          isDanger={true}
          onConfirm={confirmDelete}
          onCancel={() => setProductToDelete(null)}
        />
      </div>
    </AppLayout>
  );
};

export default SellerProductsPage;
