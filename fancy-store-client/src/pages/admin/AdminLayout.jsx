import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard, Package, Grid3X3, ShoppingCart, Users,
  Tag, Warehouse, BarChart3, Settings, LogOut, Menu, X,
  Gem, Bell, ChevronDown, User, IndianRupee
} from 'lucide-react';
import { logout } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',   path: '/admin',              end: true },
  { icon: Package,         label: 'Products',     path: '/admin/products' },
  { icon: Grid3X3,         label: 'Categories',   path: '/admin/categories' },
  { icon: ShoppingCart,    label: 'Orders',        path: '/admin/orders' },
  { icon: Users,           label: 'Customers',    path: '/admin/customers' },
  { icon: Tag,             label: 'Coupons',      path: '/admin/coupons' },
  { icon: Warehouse,       label: 'Inventory',    path: '/admin/inventory' },
  { icon: IndianRupee,     label: 'Price Ranges', path: '/admin/priceranges' },
  { icon: Settings,        label: 'Settings',     path: '/admin/settings' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        {/* Logo */}
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <div className="admin-logo-icon">
              <Gem size={20} />
            </div>
            {sidebarOpen && <span className="admin-logo-text">Fancy Admin</span>}
          </div>
          <button
            className="admin-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="admin-nav">
          {navItems.map(({ icon: Icon, label, path, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'admin-nav-active' : ''}`
              }
              title={!sidebarOpen ? label : undefined}
            >
              <Icon size={20} className="admin-nav-icon" />
              {sidebarOpen && <span className="admin-nav-label">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout at bottom */}
        <div className="admin-sidebar-footer">
          <button
            onClick={handleLogout}
            className="admin-logout-btn"
            title={!sidebarOpen ? 'Logout' : undefined}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-menu-btn md-hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </button>
            <div className="admin-breadcrumb">
              <span className="admin-breadcrumb-item">Admin Panel</span>
            </div>
          </div>

          <div className="admin-topbar-right">
            {/* Notification */}
            <button className="admin-topbar-icon-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="admin-notif-dot" />
            </button>

            {/* User Menu */}
            <div className="admin-user-menu-wrap">
              <button
                className="admin-user-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="admin-user-avatar">
                  <User size={16} />
                </div>
                <div className="admin-user-info">
                  <span className="admin-user-name">{user?.name || 'Admin'}</span>
                  <span className="admin-user-role">Administrator</span>
                </div>
                <ChevronDown size={16} className={`admin-user-chevron ${userMenuOpen ? 'rotated' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="admin-user-dropdown">
                  <div className="admin-dropdown-header">
                    <p className="admin-dropdown-name">{user?.name}</p>
                    <p className="admin-dropdown-email">{user?.email}</p>
                  </div>
                  <div className="admin-dropdown-divider" />
                  <button className="admin-dropdown-item" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        * { box-sizing: border-box; }

        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #0f111a;
          font-family: 'Inter', sans-serif;
        }

        /* ========== SIDEBAR ========== */
        .admin-sidebar {
          display: flex;
          flex-direction: column;
          background: #0c0e1a;
          border-right: 1px solid rgba(99,102,241,0.12);
          transition: width 0.25s ease;
          overflow: hidden;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 100;
        }

        .sidebar-open { width: 240px; }
        .sidebar-collapsed { width: 70px; }

        .admin-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 16px;
          border-bottom: 1px solid rgba(99,102,241,0.1);
          min-height: 68px;
          flex-shrink: 0;
        }

        .admin-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
        }

        .admin-logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
        }

        .admin-logo-text {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
          background: linear-gradient(135deg, #a5b4fc, #c4b5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .admin-sidebar-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.4);
          padding: 4px;
          border-radius: 6px;
          display: flex;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .admin-sidebar-toggle:hover {
          background: rgba(99,102,241,0.15);
          color: #fff;
        }

        .admin-nav {
          flex: 1;
          padding: 12px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }

        .admin-nav::-webkit-scrollbar { width: 4px; }
        .admin-nav::-webkit-scrollbar-track { background: transparent; }
        .admin-nav::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 2px; }

        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          white-space: nowrap;
          position: relative;
        }

        .admin-nav-item:hover {
          background: rgba(99,102,241,0.12);
          color: #fff;
        }

        .admin-nav-active {
          background: rgba(99,102,241,0.15) !important;
          color: #a5b4fc !important;
        }

        .admin-nav-active::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 3px; height: 60%;
          background: #6366f1;
          border-radius: 0 2px 2px 0;
        }

        .admin-nav-icon { flex-shrink: 0; }
        .admin-nav-label { overflow: hidden; }

        .admin-sidebar-footer {
          padding: 12px 10px;
          border-top: 1px solid rgba(99,102,241,0.1);
          flex-shrink: 0;
        }

        .admin-logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.4);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .admin-logout-btn:hover {
          background: rgba(239,68,68,0.1);
          color: #fca5a5;
        }

        /* ========== MAIN ========== */
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }

        /* ========== TOPBAR ========== */
        .admin-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 64px;
          background: rgba(12,14,26,0.95);
          border-bottom: 1px solid rgba(99,102,241,0.1);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 50;
          flex-shrink: 0;
        }

        .admin-topbar-left { display: flex; align-items: center; gap: 16px; }

        .admin-menu-btn {
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.6); padding: 8px; border-radius: 8px;
          display: none; transition: all 0.2s;
        }

        .admin-menu-btn:hover { background: rgba(99,102,241,0.15); color: #fff; }

        .admin-breadcrumb-item {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          font-weight: 500;
        }

        .admin-topbar-right { display: flex; align-items: center; gap: 12px; }

        .admin-topbar-icon-btn {
          width: 38px; height: 38px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          cursor: pointer;
          color: rgba(255,255,255,0.6);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; position: relative;
        }

        .admin-topbar-icon-btn:hover { background: rgba(99,102,241,0.15); color: #fff; }

        .admin-notif-dot {
          position: absolute; top: 8px; right: 8px;
          width: 8px; height: 8px;
          background: #ef4444; border-radius: 50%;
          border: 2px solid #0c0e1a;
        }

        .admin-user-menu-wrap { position: relative; }

        .admin-user-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 6px 12px 6px 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          cursor: pointer;
          color: #fff;
          transition: all 0.2s;
        }

        .admin-user-btn:hover { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.2); }

        .admin-user-avatar {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; flex-shrink: 0;
        }

        .admin-user-info { display: flex; flex-direction: column; align-items: flex-start; }

        .admin-user-name { font-size: 13px; font-weight: 600; color: #fff; line-height: 1.2; }
        .admin-user-role { font-size: 11px; color: rgba(165,180,252,0.7); line-height: 1.2; }

        .admin-user-chevron {
          color: rgba(255,255,255,0.4);
          transition: transform 0.2s;
        }

        .admin-user-chevron.rotated { transform: rotate(180deg); }

        .admin-user-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0;
          width: 220px;
          background: #1a1d2e;
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          animation: dropdownIn 0.15s ease;
          z-index: 200;
        }

        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .admin-dropdown-header { padding: 16px; }
        .admin-dropdown-name { font-size: 14px; font-weight: 600; color: #fff; margin: 0 0 2px; }
        .admin-dropdown-email { font-size: 12px; color: rgba(255,255,255,0.4); margin: 0; }

        .admin-dropdown-divider { height: 1px; background: rgba(99,102,241,0.1); }

        .admin-dropdown-item {
          width: 100%; display: flex; align-items: center; gap: 10px;
          padding: 12px 16px; background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 500;
          transition: all 0.2s; text-align: left;
        }

        .admin-dropdown-item:hover { background: rgba(239,68,68,0.08); color: #fca5a5; }

        /* ========== CONTENT ========== */
        .admin-content {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          min-height: 0;
        }

        .admin-content::-webkit-scrollbar { width: 6px; }
        .admin-content::-webkit-scrollbar-track { background: transparent; }
        .admin-content::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 3px; }

        @media (max-width: 768px) {
          .admin-sidebar { position: fixed; left: 0; top: 0; }
          .sidebar-collapsed { width: 0; }
          .admin-menu-btn { display: flex !important; }
          .admin-content { padding: 16px; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
