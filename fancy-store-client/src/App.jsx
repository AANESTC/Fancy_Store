import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminInventory from './pages/admin/AdminInventory';
import AdminPriceRanges from './pages/admin/AdminPriceRanges';
import AdminSettings from './pages/admin/AdminSettings';

// Route Guards
import { PrivateRoute, PublicRoute } from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      {/* ========== PUBLIC CUSTOMER ROUTES ========== */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="profile" element={
          <PrivateRoute>
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">User Profile</h1>
              <p className="text-slate-500">Profile page coming soon!</p>
            </div>
          </PrivateRoute>
        } />

        {/* Auth Pages — redirect if already logged in */}
        <Route path="login" element={
          <PublicRoute><Login /></PublicRoute>
        } />
        <Route path="register" element={
          <PublicRoute><Register /></PublicRoute>
        } />
        <Route path="forgot-password" element={
          <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'16px'}}>
            <h1 style={{fontSize:'24px',fontWeight:700}}>Forgot Password</h1>
            <p style={{color:'#64748b'}}>Password reset via email — coming soon!</p>
          </div>
        } />

        <Route path="*" element={
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">404 - Not Found</h1>
            <p className="text-slate-500">The page you are looking for does not exist.</p>
          </div>
        } />
      </Route>

      {/* ========== ADMIN LOGIN (Separate page) ========== */}
      <Route path="/admin/login" element={
        <PublicRoute><AdminLogin /></PublicRoute>
      } />

      {/* ========== ADMIN PORTAL (Protected - Admin only) ========== */}
      <Route path="/admin" element={
        <PrivateRoute requiredRole="Admin">
          <AdminLayout />
        </PrivateRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="priceranges" element={<AdminPriceRanges />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
