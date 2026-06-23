import { useEffect, useState } from 'react';
import { Search, Eye, UserX, UserCheck } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AdminStyles } from './AdminProducts';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState(null);

  const fetchCustomers = async (p = 1, s = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/customers?page=${p}&pageSize=10&search=${s}`);
      setCustomers(res.data.customers);
      setTotalPages(res.data.totalPages);
    } catch { toast.error('Failed to load customers'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const viewCustomer = async (id) => {
    try {
      const res = await api.get(`/admin/customers/${id}`);
      setSelected(res.data);
    } catch { toast.error('Failed to load details'); }
  };

  const toggleBlock = async (id) => {
    try {
      const res = await api.patch(`/admin/customers/${id}/toggle-block`);
      toast.success(res.data.message);
      fetchCustomers(page, search);
      if (selected?.userId === id) setSelected(prev => ({ ...prev, isBlocked: !prev.isBlocked }));
    } catch { toast.error('Failed to update'); }
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Customers</h1>
          <p className="admin-page-subtitle">Manage customer accounts</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="filter-row">
          <div className="search-wrap">
            <Search size={16} className="search-icon" />
            <input className="search-input" placeholder="Search by name, email or mobile..." value={search}
              onChange={(e) => { setSearch(e.target.value); fetchCustomers(1, e.target.value); }} id="customer-search" />
          </div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: '20px'}}>
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Customer</th><th>Mobile</th><th>Orders</th><th>Joined</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan={6} className="admin-table-empty"><div className="admin-loader" /></td></tr>
                  : customers.length === 0 ? <tr><td colSpan={6} className="admin-table-empty">No customers found</td></tr>
                  : customers.map(c => (
                    <tr key={c.userId}>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                          <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'14px',fontWeight:700,flexShrink:0}}>
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{fontWeight:500,color:'#fff'}}>{c.name}</div>
                            <div style={{fontSize:'12px',color:'rgba(255,255,255,0.35)'}}>{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted">{c.mobile}</td>
                      <td><span style={{color:'#a5b4fc',fontWeight:600}}>{c.orderCount}</span></td>
                      <td className="text-muted" style={{fontSize:'12px'}}>{new Date(c.createdAt).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}</td>
                      <td>
                        <span className={`status-badge ${c.isBlocked ? 'status-cancelled' : 'status-delivered'}`}>
                          {c.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="action-btn action-edit" onClick={() => viewCustomer(c.userId)} title="View"><Eye size={16} /></button>
                          <button className={`action-btn ${c.isBlocked ? 'action-edit' : 'action-delete'}`} onClick={() => toggleBlock(c.userId)} title={c.isBlocked ? 'Unblock' : 'Block'}>
                            {c.isBlocked ? <UserCheck size={16} /> : <UserX size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" disabled={page === 1} onClick={() => { setPage(p=>p-1); fetchCustomers(page-1, search); }}>← Prev</button>
              <span className="page-info">Page {page} of {totalPages}</span>
              <button className="page-btn" disabled={page === totalPages} onClick={() => { setPage(p=>p+1); fetchCustomers(page+1, search); }}>Next →</button>
            </div>
          )}
        </div>

        {selected && (
          <div className="admin-card" style={{maxHeight:'calc(100vh - 180px)',overflowY:'auto'}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'16px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                <div style={{width:48,height:48,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',fontWeight:700}}>
                  {selected.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{fontWeight:700,color:'#fff',fontSize:'16px'}}>{selected.name}</div>
                  <div style={{fontSize:'13px',color:'rgba(255,255,255,0.4)'}}>{selected.email}</div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'16px'}}>
              {[['Mobile', selected.mobile], ['Joined', new Date(selected.createdAt).toLocaleDateString('en-IN')], ['Total Orders', selected.orders?.length || 0], ['Status', selected.isBlocked ? 'Blocked' : 'Active']].map(([l,v]) => (
                <div key={l} style={{background:'rgba(255,255,255,0.03)',borderRadius:'10px',padding:'12px',border:'1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',textTransform:'uppercase',marginBottom:'4px'}}>{l}</div>
                  <div style={{fontWeight:600,color:'#fff',fontSize:'14px'}}>{v}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => toggleBlock(selected.userId)}
              style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid',cursor:'pointer',fontSize:'14px',fontWeight:600,marginBottom:'16px',
                background: selected.isBlocked ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                color: selected.isBlocked ? '#34d399' : '#f87171',
                borderColor: selected.isBlocked ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}}>
              {selected.isBlocked ? '✓ Unblock Customer' : '⊘ Block Customer'}
            </button>

            <div>
              <p style={{fontSize:'13px',fontWeight:600,color:'rgba(255,255,255,0.5)',marginBottom:'10px'}}>Order History</p>
              {selected.orders?.length === 0 ? (
                <p style={{color:'rgba(255,255,255,0.3)',fontSize:'13px',textAlign:'center',padding:'20px 0'}}>No orders yet</p>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                  {selected.orders?.slice(0, 8).map(o => (
                    <div key={o.orderId} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px',background:'rgba(255,255,255,0.03)',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.05)'}}>
                      <div>
                        <div style={{fontSize:'13px',color:'#a5b4fc',fontWeight:600}}>#{o.orderId}</div>
                        <div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)'}}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div style={{fontSize:'13px',fontWeight:600,color:'#d4af37'}}>{fmt(o.grandTotal)}</div>
                        <span style={{fontSize:'11px',padding:'2px 7px',borderRadius:'10px',background:'rgba(99,102,241,0.12)',color:'#a5b4fc'}}>{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <AdminStyles />
    </div>
  );
};

export default AdminCustomers;
