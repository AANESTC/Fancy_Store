import { useEffect, useState } from 'react';
import {
  ShoppingCart, Users, Package, TrendingUp,
  AlertTriangle, Clock, ArrowUpRight, Gem
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const statusColors = {
  Pending: 'status-pending',
  Confirmed: 'status-confirmed',
  Packed: 'status-packed',
  Shipped: 'status-shipped',
  Delivered: 'status-delivered',
  Cancelled: 'status-cancelled',
  Placed: 'status-pending',
};

const StatCard = ({ icon: Icon, label, value, sub, color, trend }) => (
  <div className={`stat-card stat-card-${color}`}>
    <div className="stat-card-header">
      <div className={`stat-icon stat-icon-${color}`}>
        <Icon size={22} />
      </div>
      {trend !== undefined && (
        <span className="stat-trend">
          <ArrowUpRight size={14} />
          {trend}%
        </span>
      )}
    </div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setData(res.data);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
  const fmtNum = (n) => Number(n || 0).toLocaleString('en-IN');

  if (loading) {
    return (
      <div className="admin-page-loading">
        <div className="admin-loader" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const maxChart = data?.salesChart?.length
    ? Math.max(...data.salesChart.map(s => s.amount)) || 1
    : 1;

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome back! Here's your store overview.</p>
        </div>
        <div className="admin-header-badge">
          <Gem size={16} />
          <span>Fancy Store Admin</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          icon={TrendingUp}
          label="Total Revenue"
          value={fmt(data?.totalSales)}
          sub={`Today: ${fmt(data?.todaySales)}`}
          color="gold"
          trend={12}
        />
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={fmtNum(data?.totalOrders)}
          sub={`Today: ${fmtNum(data?.todayOrders)}`}
          color="blue"
          trend={8}
        />
        <StatCard
          icon={Users}
          label="Total Customers"
          value={fmtNum(data?.totalCustomers)}
          color="green"
          trend={5}
        />
        <StatCard
          icon={Package}
          label="Total Products"
          value={fmtNum(data?.totalProducts)}
          color="purple"
        />
        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={fmtNum(data?.pendingOrders)}
          color="orange"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={fmtNum(data?.lowStockProducts)}
          sub="Products < 10 units"
          color="red"
        />
      </div>

      {/* Charts + Recent Orders */}
      <div className="admin-grid-2">
        {/* Sales Chart */}
        <div className="admin-card">
          <div className="admin-card-head">
            <h2 className="admin-card-title">Monthly Sales</h2>
            <span className="admin-card-badge">Last 6 months</span>
          </div>
          {data?.salesChart?.length > 0 ? (
            <div className="chart-container">
              {data.salesChart.map((s, i) => (
                <div key={i} className="chart-bar-wrap">
                  <div
                    className="chart-bar"
                    style={{ height: `${(s.amount / maxChart) * 160}px` }}
                    title={`₹${s.amount.toLocaleString('en-IN')}`}
                  >
                    <div className="chart-bar-tooltip">
                      {fmt(s.amount)}<br />{s.orders} orders
                    </div>
                  </div>
                  <span className="chart-label">{s.label.slice(5)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty-chart">No sales data yet</div>
          )}
        </div>

        {/* Top Products */}
        <div className="admin-card">
          <div className="admin-card-head">
            <h2 className="admin-card-title">Top Products</h2>
            <span className="admin-card-badge">By revenue</span>
          </div>
          {data?.topProducts?.length > 0 ? (
            <div className="top-products-list">
              {data.topProducts.map((p, i) => (
                <div key={p.productId} className="top-product-item">
                  <div className="top-product-rank">#{i + 1}</div>
                  <img
                    src={p.imageUrl || 'https://via.placeholder.com/40x40'}
                    alt={p.name}
                    className="top-product-img"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/40x40'; }}
                  />
                  <div className="top-product-info">
                    <span className="top-product-name">{p.name}</span>
                    <span className="top-product-sold">{p.totalSold} sold</span>
                  </div>
                  <span className="top-product-revenue">{fmt(p.revenue)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty-chart">No product data yet</div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="admin-card">
        <div className="admin-card-head">
          <h2 className="admin-card-title">Recent Orders</h2>
          <a href="/admin/orders" className="admin-view-all">View All →</a>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentOrders?.length > 0 ? (
                data.recentOrders.map((o) => (
                  <tr key={o.orderId}>
                    <td><span className="order-id">#{o.orderId}</span></td>
                    <td>{o.customerName}</td>
                    <td className="order-amount">{fmt(o.grandTotal)}</td>
                    <td>
                      <span className={`status-badge ${statusColors[o.status] || 'status-pending'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="order-date">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="admin-table-empty">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .admin-page { display: flex; flex-direction: column; gap: 24px; }

        .admin-page-loading {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; min-height: 400px; gap: 16px;
          color: rgba(255,255,255,0.4); font-size: 14px;
        }

        .admin-loader {
          width: 40px; height: 40px;
          border: 3px solid rgba(99,102,241,0.2);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .admin-page-header {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
        }

        .admin-page-title { font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 4px; }
        .admin-page-subtitle { font-size: 14px; color: rgba(255,255,255,0.45); margin: 0; }

        .admin-header-badge {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 16px;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 20px;
          color: #d4af37; font-size: 13px; font-weight: 600;
        }

        /* Stats */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .stat-card {
          background: rgba(255,255,255,0.04);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.06);
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
        }

        .stat-card-gold::before { background: linear-gradient(to right, #d4af37, #f5d470); }
        .stat-card-blue::before { background: linear-gradient(to right, #3b82f6, #60a5fa); }
        .stat-card-green::before { background: linear-gradient(to right, #10b981, #34d399); }
        .stat-card-purple::before { background: linear-gradient(to right, #8b5cf6, #a78bfa); }
        .stat-card-orange::before { background: linear-gradient(to right, #f59e0b, #fbbf24); }
        .stat-card-red::before { background: linear-gradient(to right, #ef4444, #f87171); }

        .stat-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }

        .stat-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }

        .stat-icon-gold { background: rgba(212,175,55,0.15); color: #d4af37; }
        .stat-icon-blue { background: rgba(59,130,246,0.15); color: #60a5fa; }
        .stat-icon-green { background: rgba(16,185,129,0.15); color: #34d399; }
        .stat-icon-purple { background: rgba(139,92,246,0.15); color: #a78bfa; }
        .stat-icon-orange { background: rgba(245,158,11,0.15); color: #fbbf24; }
        .stat-icon-red { background: rgba(239,68,68,0.15); color: #f87171; }

        .stat-trend {
          display: flex; align-items: center; gap: 2px;
          font-size: 12px; font-weight: 600; color: #34d399;
          background: rgba(16,185,129,0.12); padding: 3px 8px; border-radius: 6px;
        }

        .stat-value { font-size: 26px; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .stat-label { font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 500; }
        .stat-sub { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 4px; }

        /* Grid 2 cols */
        .admin-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        @media (max-width: 900px) { .admin-grid-2 { grid-template-columns: 1fr; } }

        /* Card */
        .admin-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 20px;
        }

        .admin-card-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
        }

        .admin-card-title { font-size: 16px; font-weight: 600; color: #fff; margin: 0; }
        .admin-card-badge {
          font-size: 12px; color: rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 6px;
        }
        .admin-view-all { font-size: 13px; color: #6366f1; text-decoration: none; font-weight: 500; }
        .admin-view-all:hover { color: #a5b4fc; }

        /* Chart */
        .chart-container {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          height: 180px;
          padding: 0 4px;
        }

        .chart-bar-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          height: 100%;
          justify-content: flex-end;
        }

        .chart-bar {
          width: 100%;
          background: linear-gradient(to top, #6366f1, #818cf8);
          border-radius: 6px 6px 2px 2px;
          min-height: 4px;
          position: relative;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .chart-bar:hover { opacity: 0.8; }

        .chart-bar-tooltip {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%; transform: translateX(-50%);
          background: #1e2040;
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 12px;
          color: #fff;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
          z-index: 10;
          text-align: center;
        }

        .chart-bar:hover .chart-bar-tooltip { opacity: 1; }
        .chart-label { font-size: 11px; color: rgba(255,255,255,0.35); }
        .admin-empty-chart { color: rgba(255,255,255,0.3); font-size: 14px; text-align: center; padding: 40px; }

        /* Top Products */
        .top-products-list { display: flex; flex-direction: column; gap: 14px; }

        .top-product-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.05);
          transition: background 0.2s;
        }

        .top-product-item:hover { background: rgba(99,102,241,0.05); }

        .top-product-rank { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.3); width: 24px; }
        .top-product-img { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; }
        .top-product-info { flex: 1; min-width: 0; }
        .top-product-name { font-size: 14px; font-weight: 500; color: #fff; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .top-product-sold { font-size: 12px; color: rgba(255,255,255,0.35); }
        .top-product-revenue { font-size: 13px; font-weight: 600; color: #34d399; white-space: nowrap; }

        /* Table */
        .admin-table-wrap { overflow-x: auto; }

        .admin-table {
          width: 100%; border-collapse: collapse;
          font-size: 14px;
        }

        .admin-table th {
          text-align: left; padding: 10px 12px;
          color: rgba(255,255,255,0.4); font-size: 12px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.5px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .admin-table td {
          padding: 13px 12px;
          color: rgba(255,255,255,0.8);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .admin-table tr:last-child td { border-bottom: none; }
        .admin-table tr:hover td { background: rgba(99,102,241,0.04); }

        .order-id { font-weight: 600; color: #a5b4fc; }
        .order-amount { font-weight: 600; color: #34d399; }
        .order-date { color: rgba(255,255,255,0.45); font-size: 13px; }
        .admin-table-empty { text-align: center; color: rgba(255,255,255,0.3); padding: 32px; }

        /* Status badges */
        .status-badge {
          display: inline-flex; align-items: center;
          padding: 3px 10px; border-radius: 20px;
          font-size: 12px; font-weight: 600;
        }
        .status-pending  { background: rgba(245,158,11,0.15); color: #fbbf24; }
        .status-confirmed{ background: rgba(59,130,246,0.15); color: #60a5fa; }
        .status-packed   { background: rgba(139,92,246,0.15); color: #a78bfa; }
        .status-shipped  { background: rgba(16,185,129,0.15); color: #34d399; }
        .status-delivered{ background: rgba(34,197,94,0.15); color: #86efac; }
        .status-cancelled{ background: rgba(239,68,68,0.15); color: #f87171; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
