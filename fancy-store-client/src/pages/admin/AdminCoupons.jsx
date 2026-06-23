import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AdminStyles } from './AdminProducts';

const defaultForm = { code: '', discountPercent: '', minOrderAmount: '', maxDiscount: '', usageLimit: '100', validUntil: '' };

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try { const res = await api.get('/admin/coupons'); setCoupons(res.data); }
    catch { toast.error('Failed to load coupons'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm(defaultForm); setEditingId(null); setModalOpen(true); };
  const openEdit = (c) => {
    setForm({ code: c.code, discountPercent: c.discountPercent, minOrderAmount: c.minOrderAmount || '', maxDiscount: c.maxDiscount || '', usageLimit: c.usageLimit, validUntil: c.validUntil?.split('T')[0] || '' });
    setEditingId(c.couponId);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, discountPercent: Number(form.discountPercent), minOrderAmount: Number(form.minOrderAmount) || null, maxDiscount: Number(form.maxDiscount) || null, usageLimit: Number(form.usageLimit), validUntil: new Date(form.validUntil).toISOString() };
      if (editingId) { await api.put(`/admin/coupons/${editingId}`, payload); toast.success('Coupon updated'); }
      else { await api.post('/admin/coupons', payload); toast.success('Coupon created'); }
      setModalOpen(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const toggleCoupon = async (id) => {
    try { await api.patch(`/admin/coupons/${id}/toggle`); fetch(); }
    catch { toast.error('Failed to toggle'); }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try { await api.delete(`/admin/coupons/${id}`); toast.success('Deleted'); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Coupons & Offers</h1>
          <p className="admin-page-subtitle">Create and manage discount coupons</p>
        </div>
        <button className="btn-primary" onClick={openCreate} id="add-coupon-btn">
          <Plus size={18} /> Add Coupon
        </button>
      </div>

      <div className="admin-card">
        {loading ? (
          <div style={{textAlign:'center',padding:'40px'}}><div className="admin-loader" /></div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Code</th><th>Discount</th><th>Min Order</th><th>Max Discount</th><th>Usage</th><th>Valid Until</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr><td colSpan={8} className="admin-table-empty">No coupons yet</td></tr>
                ) : coupons.map(c => (
                  <tr key={c.couponId}>
                    <td><span style={{background:'rgba(212,175,55,0.1)',color:'#d4af37',padding:'4px 10px',borderRadius:'6px',fontWeight:700,fontFamily:'monospace',fontSize:'13px'}}>{c.code}</span></td>
                    <td><span className="text-green" style={{fontWeight:700}}>{c.discountPercent}%</span></td>
                    <td className="text-muted">{c.minOrderAmount ? fmt(c.minOrderAmount) : '—'}</td>
                    <td className="text-muted">{c.maxDiscount ? fmt(c.maxDiscount) : '—'}</td>
                    <td className="text-muted">{c.usedCount}/{c.usageLimit}</td>
                    <td className="text-muted" style={{fontSize:'12px'}}>{new Date(c.validUntil).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}</td>
                    <td>
                      <button className="toggle-btn" onClick={() => toggleCoupon(c.couponId)}>
                        {c.isActive ? <><ToggleRight size={22} className="text-green" /><span className="text-green">Active</span></> : <><ToggleLeft size={22} className="text-muted" /><span className="text-muted">Off</span></>}
                      </button>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn action-edit" onClick={() => openEdit(c)}><Edit size={16} /></button>
                        <button className="action-btn action-delete" onClick={() => deleteCoupon(c.couponId)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal-box modal-md">
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Edit Coupon' : 'Add Coupon'}</h2>
              <button className="modal-close" onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label className="form-label">Coupon Code *</label>
                <input name="code" value={form.code} onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})} required className="form-input" placeholder="e.g. FANCY20" id="coupon-code" style={{fontFamily:'monospace',fontWeight:700,letterSpacing:'2px'}} />
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Discount % *</label>
                  <input type="number" name="discountPercent" value={form.discountPercent} onChange={(e) => setForm({...form, discountPercent: e.target.value})} required min="1" max="99" className="form-input" id="coupon-discount" />
                </div>
                <div className="form-group">
                  <label className="form-label">Usage Limit</label>
                  <input type="number" name="usageLimit" value={form.usageLimit} onChange={(e) => setForm({...form, usageLimit: e.target.value})} min="1" className="form-input" id="coupon-limit" />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Min Order (₹)</label>
                  <input type="number" name="minOrderAmount" value={form.minOrderAmount} onChange={(e) => setForm({...form, minOrderAmount: e.target.value})} min="0" className="form-input" placeholder="0" id="coupon-min" />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Discount (₹)</label>
                  <input type="number" name="maxDiscount" value={form.maxDiscount} onChange={(e) => setForm({...form, maxDiscount: e.target.value})} min="0" className="form-input" placeholder="0" id="coupon-max" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Valid Until *</label>
                <input type="date" name="validUntil" value={form.validUntil} onChange={(e) => setForm({...form, validUntil: e.target.value})} required className="form-input" id="coupon-until" style={{colorScheme:'dark'}} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving} id="coupon-save-btn">{saving ? 'Saving...' : editingId ? 'Update' : 'Add Coupon'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <AdminStyles />
    </div>
  );
};

export default AdminCoupons;
