import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AdminStyles } from './AdminProducts';

const defaultForm = { categoryName: '', imageUrl: '', isActive: true };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/categories');
      setCategories(res.data);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => { setForm(defaultForm); setEditingId(null); setModalOpen(true); };
  const openEdit = (c) => { setForm({ categoryName: c.categoryName, imageUrl: c.imageUrl || '', isActive: c.isActive }); setEditingId(c.categoryId); setModalOpen(true); };

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
    if (!form.categoryName.trim()) return toast.error('Category name is required');
    setSaving(true);
    try {
      if (editingId) { await api.put(`/admin/categories/${editingId}`, form); toast.success('Category updated'); }
      else { await api.post('/admin/categories', form); toast.success('Category created'); }
      setModalOpen(false);
      fetchCategories();
    } catch { toast.error('Failed to save category'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await api.delete(`/admin/categories/${id}`); toast.success('Category deleted'); fetchCategories(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  const categoryIcons = {
    'Bangles': '⭕', 'Dollar Chains': '⛓️', 'Invisible Chains': '✨', 
    'Hair Clips': '🎀', 'Hair Accessories': '🌸', 'Gift Items': '🎁', 'Fancy Items': '💎'
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categories</h1>
          <p className="admin-page-subtitle">Manage product categories</p>
        </div>
        <button className="btn-primary" onClick={openCreate} id="add-category-btn">
          <Plus size={18} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '40px' }}>
          <div className="admin-loader" />
        </div>
      ) : (
        <div className="category-grid">
          {categories.map(c => (
            <div key={c.categoryId} className={`category-card ${!c.isActive ? 'category-inactive' : ''}`}>
              <div className="category-card-inner">
                <div className="category-icon-wrap">
                  {c.imageUrl ? (
                    <img src={c.imageUrl} alt={c.categoryName} className="category-img" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                  ) : null}
                  <span className="category-emoji">{categoryIcons[c.categoryName] || '🏷️'}</span>
                </div>
                <div className="category-info">
                  <h3 className="category-name">{c.categoryName}</h3>
                  <p className="category-count">{c.productCount} products</p>
                </div>
                <div className="category-status-row">
                  <span className={`status-badge ${c.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="category-actions">
                <button className="action-btn action-edit" onClick={() => openEdit(c)} title="Edit">
                  <Edit size={16} />
                </button>
                <button className="action-btn action-delete" onClick={() => handleDelete(c.categoryId)} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal-box modal-md">
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Edit Category' : 'Add Category'}</h2>
              <button className="modal-close" onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input name="categoryName" value={form.categoryName} onChange={(e) => setForm({...form, categoryName: e.target.value})} required className="form-input" placeholder="e.g. Bangles" id="cat-name" />
              </div>
              <div className="form-group">
                <label className="form-label">Category Image</label>
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
                    <label className="upload-file-btn" htmlFor="cat-image-file">
                      <span style={{marginRight: '8px', display: 'flex'}}>⬆</span>
                      {uploading ? 'Uploading...' : 'Upload Image'}
                      <input id="cat-image-file" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                    <span className="upload-or">or</span>
                    <input
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={(e) => setForm({...form, imageUrl: e.target.value})}
                      className="form-input"
                      placeholder="Paste image URL..."
                      id="cat-image-url"
                    />
                  </div>
                </div>
              </div>
              <label className="form-checkbox-label">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} className="form-checkbox" id="cat-active" />
                <span className={`checkbox-custom ${form.isActive ? 'checked' : ''}`}>{form.isActive && <Check size={12} />}</span>
                <span>Active</span>
              </label>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving} id="cat-save-btn">{saving ? 'Saving...' : editingId ? 'Update' : 'Add Category'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminStyles />
      <style>{`
        .category-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
        .category-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 14px; transition: all 0.2s; }
        .category-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); border-color: rgba(99,102,241,0.25); }
        .category-inactive { opacity: 0.55; }
        .category-card-inner { display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .category-icon-wrap { width: 56px; height: 56px; background: rgba(99,102,241,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
        .category-img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; }
        .category-name { font-size: 16px; font-weight: 600; color: #fff; margin: 0 0 2px; }
        .category-count { font-size: 13px; color: rgba(255,255,255,0.4); margin: 0; }
        .category-status-row { display: flex; }
        .category-actions { display: flex; gap: 8px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px; }
        .category-actions .action-btn { flex: 1; }
      `}</style>
    </div>
  );
};

export default AdminCategories;
