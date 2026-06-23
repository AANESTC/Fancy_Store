import { useEffect, useState } from 'react';
import { AlertTriangle, Package, Edit2, Check } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AdminStyles } from './AdminProducts';

const AdminInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [newStock, setNewStock] = useState('');

  const fetchInventory = async (f = '') => {
    setLoading(true);
    try { const res = await api.get(`/admin/inventory?filter=${f}`); setItems(res.data); }
    catch { toast.error('Failed to load inventory'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInventory(); }, []);

  const updateStock = async (id) => {
    if (newStock === '' || isNaN(Number(newStock))) return toast.error('Enter valid stock');
    try {
      await api.patch(`/admin/inventory/${id}/stock`, { stock: Number(newStock) });
      toast.success('Stock updated');
      setEditingId(null);
      fetchInventory(filter);
    } catch { toast.error('Failed to update stock'); }
  };

  const low = items.filter(i => i.stockStatus === 'LowStock').length;
  const out = items.filter(i => i.stockStatus === 'OutOfStock').length;

  const getStatusStyle = (status) => {
    if (status === 'OutOfStock') return { badge: 'status-cancelled', text: 'Out of Stock' };
    if (status === 'LowStock') return { badge: 'status-pending', text: 'Low Stock' };
    return { badge: 'status-delivered', text: 'In Stock' };
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Inventory</h1>
          <p className="admin-page-subtitle">Monitor and update product stock levels</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:'14px'}}>
        {[
          { label: 'Total Products', value: items.length, color: '#6366f1', icon: '📦' },
          { label: 'In Stock', value: items.filter(i=>i.stockStatus==='InStock').length, color: '#10b981', icon: '✅' },
          { label: 'Low Stock', value: low, color: '#f59e0b', icon: '⚠️' },
          { label: 'Out of Stock', value: out, color: '#ef4444', icon: '🚫' },
        ].map(c => (
          <div key={c.label} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'14px',padding:'18px'}}>
            <div style={{fontSize:'28px',marginBottom:'8px'}}>{c.icon}</div>
            <div style={{fontSize:'24px',fontWeight:700,color:c.color}}>{c.value}</div>
            <div style={{fontSize:'13px',color:'rgba(255,255,255,0.45)'}}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(low > 0 || out > 0) && (
        <div style={{background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:'12px',padding:'14px 18px',display:'flex',alignItems:'center',gap:'12px'}}>
          <AlertTriangle size={20} style={{color:'#fbbf24',flexShrink:0}} />
          <div style={{fontSize:'14px',color:'rgba(255,255,255,0.75)'}}>
            {out > 0 && <span><strong style={{color:'#f87171'}}>{out} products</strong> are out of stock. </span>}
            {low > 0 && <span><strong style={{color:'#fbbf24'}}>{low} products</strong> are running low (less than 10 units).</span>}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="admin-card">
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
          {[['', 'All Products'], ['low', 'Low Stock'], ['out', 'Out of Stock']].map(([val, label]) => (
            <button key={val} onClick={() => { setFilter(val); fetchInventory(val); }}
              style={{padding:'8px 16px',borderRadius:'8px',border:'1px solid',cursor:'pointer',fontSize:'13px',fontWeight:600,transition:'all 0.2s',
                background: filter === val ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                color: filter === val ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
                borderColor: filter === val ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.08)'}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Product</th><th>Category</th><th>Price</th><th>Current Stock</th><th>Status</th><th>Update Stock</th></tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="admin-table-empty"><div className="admin-loader" /></td></tr>
                : items.length === 0 ? <tr><td colSpan={6} className="admin-table-empty">No items found</td></tr>
                : items.map(item => {
                  const s = getStatusStyle(item.stockStatus);
                  return (
                    <tr key={item.productId}>
                      <td style={{fontWeight:500,color:'#fff'}}>{item.productName}</td>
                      <td className="text-muted">{item.categoryName}</td>
                      <td className="text-gold">{fmt(item.price)}</td>
                      <td>
                        <span style={{fontWeight:700, color: item.stockStatus==='OutOfStock'?'#f87171':item.stockStatus==='LowStock'?'#fbbf24':'#34d399', fontSize:'15px'}}>
                          {item.stock}
                        </span>
                        <span className="text-muted" style={{fontSize:'12px',marginLeft:'4px'}}>units</span>
                      </td>
                      <td><span className={`status-badge ${s.badge}`}>{s.text}</span></td>
                      <td>
                        {editingId === item.productId ? (
                          <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
                            <input
                              type="number"
                              min="0"
                              value={newStock}
                              onChange={(e) => setNewStock(e.target.value)}
                              style={{width:'70px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'7px',padding:'6px 10px',color:'#fff',fontSize:'13px',outline:'none'}}
                              autoFocus
                              id={`stock-input-${item.productId}`}
                            />
                            <button className="action-btn action-edit" onClick={() => updateStock(item.productId)} title="Save"><Check size={15} /></button>
                            <button className="action-btn action-delete" onClick={() => setEditingId(null)} title="Cancel" style={{color:'rgba(255,255,255,0.4)'}}>✕</button>
                          </div>
                        ) : (
                          <button className="action-btn action-edit" onClick={() => { setEditingId(item.productId); setNewStock(item.stock); }} title="Update Stock">
                            <Edit2 size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <AdminStyles />
    </div>
  );
};

export default AdminInventory;
