import { useEffect, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AdminStyles } from './AdminProducts';

const STATUS_FLOW = {
  Placed: ['Confirmed', 'Cancelled'],
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Packed', 'Cancelled'],
  Packed: ['Shipped'],
  Shipped: ['Delivered'],
  Delivered: ['Refunded'],
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async (p = 1, s = '', sf = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/orders?page=${p}&pageSize=10&search=${s}&status=${sf}`);
      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const viewOrder = async (id) => {
    try {
      const res = await api.get(`/admin/orders/${id}`);
      setSelectedOrder(res.data);
    } catch { toast.error('Failed to load details'); }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      toast.success(`Order marked as ${status}`);
      setSelectedOrder(prev => prev ? { ...prev, status } : prev);
      fetchOrders(page, search, statusFilter);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
  const sc = (s) => ({ Pending: 'status-pending', Placed: 'status-pending', Confirmed: 'status-confirmed', Packed: 'status-packed', Shipped: 'status-shipped', Delivered: 'status-delivered', Cancelled: 'status-cancelled', Refunded: 'status-refunded' }[s] || 'status-pending');

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-subtitle">Track and manage customer orders</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="filter-row">
          <div className="search-wrap">
            <Search size={16} className="search-icon" />
            <input className="search-input" placeholder="Search by customer or order ID..." value={search}
              onChange={(e) => { setSearch(e.target.value); fetchOrders(1, e.target.value, statusFilter); }} id="order-search" />
          </div>
          <select className="filter-select" value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); fetchOrders(1, search, e.target.value); }} id="order-status-filter">
            {['', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
              <option key={s} value={s}>{s || 'All Statuses'}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="orders-layout">
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th><th></th></tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan={6} className="admin-table-empty"><div className="admin-loader" /></td></tr>
                  : orders.length === 0 ? <tr><td colSpan={6} className="admin-table-empty">No orders found</td></tr>
                  : orders.map(o => (
                    <tr key={o.orderId}>
                      <td><span style={{fontWeight:700,color:'#a5b4fc'}}>#{o.orderId}</span></td>
                      <td>
                        <div className="text-bold">{o.customerName}</div>
                        <div className="text-muted" style={{fontSize:'12px'}}>{o.itemCount} items</div>
                      </td>
                      <td><span className="text-gold">{fmt(o.grandTotal)}</span></td>
                      <td><span className={`status-badge ${sc(o.status)}`}>{o.status}</span></td>
                      <td className="text-muted" style={{fontSize:'12px'}}>{new Date(o.createdAt).toLocaleDateString('en-IN', {day:'2-digit',month:'short'})}</td>
                      <td>
                        <button className="action-btn action-edit" onClick={() => viewOrder(o.orderId)} title="View">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" disabled={page === 1} onClick={() => { setPage(p=>p-1); fetchOrders(page-1, search, statusFilter); }}>← Prev</button>
              <span className="page-info">Page {page} of {totalPages}</span>
              <button className="page-btn" disabled={page === totalPages} onClick={() => { setPage(p=>p+1); fetchOrders(page+1, search, statusFilter); }}>Next →</button>
            </div>
          )}
        </div>

        {selectedOrder && (
          <div className="admin-card" style={{maxHeight:'calc(100vh - 180px)', overflowY:'auto', display:'flex', flexDirection:'column', gap:'16px'}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
              <div>
                <div className="admin-card-title">Order #{selectedOrder.orderId}</div>
                <span className={`status-badge ${sc(selectedOrder.status)}`} style={{marginTop:'6px',display:'inline-flex'}}>{selectedOrder.status}</span>
              </div>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            {STATUS_FLOW[selectedOrder.status] && (
              <div style={{background:'rgba(255,255,255,0.03)',borderRadius:'10px',padding:'14px',border:'1px solid rgba(255,255,255,0.05)'}}>
                <p style={{fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.8px',color:'rgba(255,255,255,0.35)',margin:'0 0 10px',fontWeight:600}}>Update Status</p>
                <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                  {STATUS_FLOW[selectedOrder.status].map(next => (
                    <button key={next}
                      style={{padding:'7px 14px',borderRadius:'8px',border:'1px solid',cursor:'pointer',fontSize:'13px',fontWeight:600,
                        background: next === 'Cancelled' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.15)',
                        color: next === 'Cancelled' ? '#f87171' : '#34d399',
                        borderColor: next === 'Cancelled' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.25)'}}
                      onClick={() => updateStatus(selectedOrder.orderId, next)}>
                      → {next}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{borderTop:'1px solid rgba(255,255,255,0.05)',paddingTop:'14px'}}>
              <p style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',textTransform:'uppercase',margin:'0 0 8px',fontWeight:600}}>Customer</p>
              <p style={{color:'#fff',margin:'0 0 3px',fontWeight:500}}>{selectedOrder.customer?.name}</p>
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:'13px',margin:'0 0 2px'}}>{selectedOrder.customer?.email}</p>
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:'13px',margin:0}}>{selectedOrder.customer?.mobile}</p>
            </div>

            {selectedOrder.address && (
              <div style={{borderTop:'1px solid rgba(255,255,255,0.05)',paddingTop:'14px'}}>
                <p style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',textTransform:'uppercase',margin:'0 0 8px',fontWeight:600}}>Delivery Address</p>
                <p style={{color:'rgba(255,255,255,0.7)',fontSize:'13px',margin:0,lineHeight:1.6}}>
                  {selectedOrder.address.addressLine}{selectedOrder.address.landmark && `, ${selectedOrder.address.landmark}`}, {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}
                </p>
              </div>
            )}

            <div style={{borderTop:'1px solid rgba(255,255,255,0.05)',paddingTop:'14px'}}>
              <p style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',textTransform:'uppercase',margin:'0 0 10px',fontWeight:600}}>Items</p>
              <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <img src={item.imageUrl || 'https://via.placeholder.com/36'} alt={item.productName} style={{width:36,height:36,borderRadius:7,objectFit:'cover'}} onError={(e)=>{e.target.src='https://via.placeholder.com/36';}} />
                    <div style={{flex:1}}>
                      <div style={{fontSize:'13px',color:'#fff'}}>{item.productName}</div>
                      <div style={{fontSize:'12px',color:'rgba(255,255,255,0.35)'}}>Qty: {item.quantity}</div>
                    </div>
                    <span style={{fontSize:'13px',fontWeight:600,color:'#d4af37'}}>{fmt(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{borderTop:'1px solid rgba(255,255,255,0.05)',paddingTop:'14px',display:'flex',flexDirection:'column',gap:'8px'}}>
              {[['Subtotal', fmt(selectedOrder.totalAmount)], ['Discount', `-${fmt(selectedOrder.discountAmount)}`], ['GST', fmt(selectedOrder.gstAmount)], ['Delivery', fmt(selectedOrder.deliveryCharge)]].map(([l, v]) => (
                <div key={l} style={{display:'flex',justifyContent:'space-between',fontSize:'13px',color:'rgba(255,255,255,0.5)'}}>
                  <span>{l}</span><span>{v}</span>
                </div>
              ))}
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'16px',fontWeight:700,color:'#fff',borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:'10px',marginTop:'4px'}}>
                <span>Grand Total</span><span className="text-gold">{fmt(selectedOrder.grandTotal)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <AdminStyles />
      <style>{`
        .orders-layout { display: grid; grid-template-columns: 1fr 360px; gap: 20px; }
        @media(max-width:1100px){ .orders-layout { grid-template-columns: 1fr; } }
        .filter-select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px; color: #fff; font-size: 14px; outline: none; }
        .filter-select option { background: #1a1d2e; }
        .text-bold { font-weight: 500; color: #fff; }
        .admin-card-title { font-size: 16px; font-weight: 600; color: #fff; }
      `}</style>
    </div>
  );
};

export default AdminOrders;
