import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const defaultForm = { label: '', minPrice: '', maxPrice: '', sortOrder: 1 };

const AdminPriceRanges = () => {
  const [ranges, setRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetchRanges = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/priceranges');
      setRanges(res.data);
    } catch { toast.error('Failed to load price ranges'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRanges(); }, []);

  const openCreate = () => { setForm(defaultForm); setEditingId(null); setModalOpen(true); };
  const openEdit = (r) => { 
    setForm({ 
      label: r.label, 
      minPrice: r.minPrice === null ? '' : r.minPrice, 
      maxPrice: r.maxPrice === null ? '' : r.maxPrice, 
      sortOrder: r.sortOrder 
    }); 
    setEditingId(r.id); 
    setModalOpen(true); 
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.label.trim()) return toast.error('Label is required');
    setSaving(true);
    try {
      const payload = {
        ...form,
        minPrice: form.minPrice === '' ? null : Number(form.minPrice),
        maxPrice: form.maxPrice === '' ? null : Number(form.maxPrice),
        sortOrder: Number(form.sortOrder)
      };

      if (editingId) { 
        await api.put(`/admin/priceranges/${editingId}`, { id: editingId, ...payload }); 
        toast.success('Price range updated'); 
      } else { 
        await api.post('/admin/priceranges', payload); 
        toast.success('Price range created'); 
      }
      setModalOpen(false);
      fetchRanges();
    } catch { toast.error('Failed to save price range'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this price range?')) return;
    try {
      await api.delete(`/admin/priceranges/${id}`);
      toast.success('Price range deleted');
      fetchRanges();
    } catch { toast.error('Failed to delete price range'); }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading price ranges...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Price Ranges</h1>
          <p className="text-slate-500 mt-2">Manage the price filter options shown in the store.</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Add Price Range
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm uppercase text-slate-500 font-semibold tracking-wider">
              <th className="px-6 py-4">Label</th>
              <th className="px-6 py-4">Min Price (₹)</th>
              <th className="px-6 py-4">Max Price (₹)</th>
              <th className="px-6 py-4">Sort Order</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {ranges.map(r => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{r.label}</td>
                <td className="px-6 py-4">{r.minPrice === null ? '0' : r.minPrice}</td>
                <td className="px-6 py-4">{r.maxPrice === null ? 'Any' : r.maxPrice}</td>
                <td className="px-6 py-4">{r.sortOrder}</td>
                <td className="px-6 py-4 flex items-center justify-end gap-2">
                  <button onClick={() => openEdit(r)} className="p-2 text-slate-400 hover:text-primary-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow transition-all"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(r.id)} className="p-2 text-slate-400 hover:text-red-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow transition-all"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-display font-bold text-slate-900">{editingId ? 'Edit Price Range' : 'Add Price Range'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Label</label>
                <input type="text" value={form.label} onChange={e => setForm({...form, label: e.target.value})} className="input-field" placeholder="e.g. Under ₹500" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Min Price</label>
                  <input type="number" value={form.minPrice} onChange={e => setForm({...form, minPrice: e.target.value})} className="input-field" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Max Price</label>
                  <input type="number" value={form.maxPrice} onChange={e => setForm({...form, maxPrice: e.target.value})} className="input-field" placeholder="Any" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: e.target.value})} className="input-field" required min="1" />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium flex justify-center items-center gap-2 transition-colors">
                  {saving ? 'Saving...' : <><Check size={18} /> Save Range</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPriceRanges;
