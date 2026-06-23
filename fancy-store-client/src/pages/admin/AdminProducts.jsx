import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Search, Upload, X, Check } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const defaultForm = {
  name: '', categoryId: '', description: '', price: '', discount: '0',
  stock: '0', imageUrl: '', isActive: true, isTrending: false,
  isBestSeller: false, isNewArrival: false
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async (p = page, s = search) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/products?page=${p}&pageSize=10&search=${s}`);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/admin/categories');
      setCategories(res.data);
    } catch {}
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const openCreate = () => {
    setForm(defaultForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name, categoryId: p.categoryId, description: p.description,
      price: p.price, discount: p.discount, stock: p.stock,
      imageUrl: p.imageUrl || '', isActive: p.isActive,
      isTrending: p.isTrending, isBestSeller: p.isBestSeller,
      isNewArrival: p.isNewArrival
    });
    setEditingId(p.productId);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/admin/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm(prev => ({ ...prev, imageUrl: res.data.url }));
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed. Using URL instead.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.categoryId || !form.price)
      return toast.error('Name, category and price are required');

    setSaving(true);
    try {
      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        price: Number(form.price),
        discount: Number(form.discount),
        stock: Number(form.stock),
      };
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/admin/products', payload);
        toast.success('Product created');
      }
      setModalOpen(false);
      fetchProducts();
    } catch {
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.patch(`/admin/products/${id}/toggle-status`);
      fetchProducts();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
    fetchProducts(1, e.target.value);
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">Manage your product catalog</p>
        </div>
        <button className="btn-primary" onClick={openCreate} id="add-product-btn">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="admin-card">
        <div className="filter-row">
          <div className="search-wrap">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={search}
              onChange={handleSearch}
              id="product-search"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="admin-table-empty"><div className="admin-loader" /></td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={7} className="admin-table-empty">No products found</td></tr>
              ) : products.map(p => (
                <tr key={p.productId}>
                  <td>
                    <div className="product-cell">
                      <img
                        src={p.imageUrl || 'https://via.placeholder.com/40'}
                        alt={p.name}
                        className="product-thumb"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                      />
                      <div>
                        <div className="product-name">{p.name}</div>
                        <div className="product-tags">
                          {p.isTrending && <span className="tag tag-gold">Trending</span>}
                          {p.isBestSeller && <span className="tag tag-green">Best Seller</span>}
                          {p.isNewArrival && <span className="tag tag-blue">New</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td><span className="text-muted">{p.categoryName}</span></td>
                  <td><span className="text-gold">{fmt(p.price)}</span></td>
                  <td><span className="text-green">{p.discount}%</span></td>
                  <td>
                    <span className={p.stock === 0 ? 'text-red' : p.stock < 10 ? 'text-orange' : 'text-muted'}>
                      {p.stock} units
                    </span>
                  </td>
                  <td>
                    <button className="toggle-btn" onClick={() => handleToggle(p.productId)}>
                      {p.isActive
                        ? <><ToggleRight size={22} className="text-green" /> <span className="text-green">Active</span></>
                        : <><ToggleLeft size={22} className="text-muted" /> <span className="text-muted">Inactive</span></>
                      }
                    </button>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn action-edit" onClick={() => openEdit(p)} title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="action-btn action-delete" onClick={() => handleDelete(p.productId)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" disabled={page === 1} onClick={() => { setPage(page - 1); fetchProducts(page - 1); }}>
              ← Prev
            </button>
            <span className="page-info">Page {page} of {totalPages}</span>
            <button className="page-btn" disabled={page === totalPages} onClick={() => { setPage(page + 1); fetchProducts(page + 1); }}>
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal-box modal-lg">
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <button className="modal-close" onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="form-input" placeholder="e.g. Elegant Bridal Bangles" id="prod-name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select name="categoryId" value={form.categoryId} onChange={handleChange} required className="form-input" id="prod-category">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required className="form-input form-textarea" rows={3} placeholder="Product description..." id="prod-desc" />
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01" className="form-input" placeholder="999" id="prod-price" />
                </div>
                <div className="form-group">
                  <label className="form-label">Discount (%)</label>
                  <input type="number" name="discount" value={form.discount} onChange={handleChange} min="0" max="99" className="form-input" placeholder="0" id="prod-discount" />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0" className="form-input" placeholder="100" id="prod-stock" />
                </div>
              </div>

              {/* Image */}
              <div className="form-group">
                <label className="form-label">Product Image</label>
                <div className="image-upload-area">
                  {form.imageUrl && (
                    <div className="image-preview-wrap">
                      <img src={form.imageUrl} alt="Preview" className="image-preview" onError={(e) => { e.target.src = 'https://via.placeholder.com/120'; }} />
                      <button type="button" className="image-remove" onClick={() => setForm({ ...form, imageUrl: '' })}>
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  <div className="image-upload-right">
                    <label className="upload-file-btn" htmlFor="prod-image-file">
                      <Upload size={16} />
                      {uploading ? 'Uploading...' : 'Upload Image'}
                      <input id="prod-image-file" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                    <span className="upload-or">or</span>
                    <input
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Paste image URL..."
                      id="prod-image-url"
                    />
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="form-checkboxes">
                {[
                  { name: 'isActive', label: 'Active' },
                  { name: 'isTrending', label: 'Trending' },
                  { name: 'isBestSeller', label: 'Best Seller' },
                  { name: 'isNewArrival', label: 'New Arrival' },
                ].map(({ name, label }) => (
                  <label key={name} className="form-checkbox-label">
                    <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="form-checkbox" id={`prod-${name}`} />
                    <span className={`checkbox-custom ${form[name] ? 'checked' : ''}`}>
                      {form[name] && <Check size={12} />}
                    </span>
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving} id="prod-save-btn">
                  {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminStyles />
    </div>
  );
};

export const AdminStyles = () => (
  <style>{`
    .admin-page { display: flex; flex-direction: column; gap: 20px; }
    .admin-page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
    .admin-page-title { font-size: 24px; font-weight: 700; color: #fff; margin: 0 0 4px; }
    .admin-page-subtitle { font-size: 14px; color: rgba(255,255,255,0.45); margin: 0; }
    .admin-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 20px; }
    .filter-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .search-wrap { position: relative; flex: 1; min-width: 200px; }
    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.3); }
    .search-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 12px 10px 38px; color: #fff; font-size: 14px; outline: none; transition: border-color 0.2s; }
    .search-input::placeholder { color: rgba(255,255,255,0.25); }
    .search-input:focus { border-color: rgba(99,102,241,0.4); }
    .admin-table-wrap { overflow-x: auto; }
    .admin-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .admin-table th { text-align: left; padding: 10px 12px; color: rgba(255,255,255,0.4); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .admin-table td { padding: 12px; color: rgba(255,255,255,0.8); border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
    .admin-table tr:last-child td { border-bottom: none; }
    .admin-table tr:hover td { background: rgba(99,102,241,0.03); }
    .admin-table-empty { text-align: center; color: rgba(255,255,255,0.3); padding: 32px; }
    .product-cell { display: flex; align-items: center; gap: 12px; }
    .product-thumb { width: 42px; height: 42px; border-radius: 8px; object-fit: cover; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.08); }
    .product-name { font-weight: 500; color: #fff; font-size: 14px; }
    .product-tags { display: flex; gap: 4px; margin-top: 3px; }
    .tag { font-size: 11px; padding: 2px 7px; border-radius: 4px; font-weight: 600; }
    .tag-gold { background: rgba(212,175,55,0.15); color: #d4af37; }
    .tag-green { background: rgba(16,185,129,0.15); color: #34d399; }
    .tag-blue { background: rgba(59,130,246,0.15); color: #60a5fa; }
    .text-muted { color: rgba(255,255,255,0.45); }
    .text-gold { color: #d4af37; font-weight: 600; }
    .text-green { color: #34d399; font-weight: 600; }
    .text-red { color: #f87171; font-weight: 600; }
    .text-orange { color: #fbbf24; font-weight: 600; }
    .toggle-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; font-size: 13px; padding: 4px 0; }
    .action-btns { display: flex; gap: 6px; }
    .action-btn { width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .action-edit { background: rgba(99,102,241,0.15); color: #a5b4fc; }
    .action-edit:hover { background: rgba(99,102,241,0.3); }
    .action-delete { background: rgba(239,68,68,0.12); color: #f87171; }
    .action-delete:hover { background: rgba(239,68,68,0.25); }
    .pagination { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 16px; }
    .page-btn { background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.2); color: #a5b4fc; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; transition: all 0.2s; }
    .page-btn:hover:not(:disabled) { background: rgba(99,102,241,0.3); }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-info { color: rgba(255,255,255,0.5); font-size: 14px; }
    .btn-primary { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; border-radius: 10px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .btn-secondary { padding: 10px 20px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .btn-secondary:hover { background: rgba(255,255,255,0.1); }
    /* Modal */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; backdrop-filter: blur(4px); }
    .modal-box { background: #0f111a; border: 1px solid rgba(99,102,241,0.2); border-radius: 20px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
    .modal-lg { max-width: 680px; }
    .modal-md { max-width: 460px; }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .modal-title { font-size: 18px; font-weight: 700; color: #fff; margin: 0; }
    .modal-close { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.4); padding: 4px; border-radius: 6px; display: flex; transition: all 0.2s; }
    .modal-close:hover { color: #fff; background: rgba(255,255,255,0.08); }
    .modal-form { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
    .modal-footer { display: flex; gap: 12px; justify-content: flex-end; padding-top: 8px; }
    .form-group { display: flex; flex-direction: column; gap: 7px; }
    .form-label { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.65); }
    .form-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 11px 14px; color: #fff; font-size: 14px; outline: none; transition: border-color 0.2s; width: 100%; }
    .form-input:focus { border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.04); }
    .form-input::placeholder { color: rgba(255,255,255,0.2); }
    select.form-input option { background: #1a1d2e; color: #fff; }
    .form-textarea { resize: vertical; min-height: 80px; font-family: inherit; }
    .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    @media (max-width: 600px) { .form-grid-2, .form-grid-3 { grid-template-columns: 1fr; } }
    .form-checkboxes { display: flex; gap: 16px; flex-wrap: wrap; }
    .form-checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; color: rgba(255,255,255,0.7); font-size: 14px; }
    .form-checkbox { display: none; }
    .checkbox-custom { width: 18px; height: 18px; border: 1.5px solid rgba(255,255,255,0.2); border-radius: 5px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
    .checkbox-custom.checked { background: #6366f1; border-color: #6366f1; color: #fff; }
    .image-upload-area { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
    .image-preview-wrap { position: relative; flex-shrink: 0; }
    .image-preview { width: 100px; height: 100px; object-fit: cover; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); }
    .image-remove { position: absolute; top: -8px; right: -8px; width: 22px; height: 22px; background: #ef4444; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; }
    .image-upload-right { flex: 1; display: flex; flex-direction: column; gap: 10px; }
    .upload-file-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.25); border-radius: 10px; color: #a5b4fc; font-size: 14px; cursor: pointer; transition: all 0.2s; }
    .upload-file-btn:hover { background: rgba(99,102,241,0.25); }
    .upload-or { color: rgba(255,255,255,0.3); font-size: 12px; text-align: center; }
    .admin-loader { width: 32px; height: 32px; border: 3px solid rgba(99,102,241,0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .status-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .status-pending  { background: rgba(245,158,11,0.15); color: #fbbf24; }
    .status-confirmed{ background: rgba(59,130,246,0.15); color: #60a5fa; }
    .status-packed   { background: rgba(139,92,246,0.15); color: #a78bfa; }
    .status-shipped  { background: rgba(16,185,129,0.15); color: #34d399; }
    .status-delivered{ background: rgba(34,197,94,0.15); color: #86efac; }
    .status-cancelled{ background: rgba(239,68,68,0.15); color: #f87171; }
    .status-placed   { background: rgba(245,158,11,0.15); color: #fbbf24; }
    .status-refunded { background: rgba(156,163,175,0.15); color: #9ca3af; }
  `}</style>
);

export default AdminProducts;
