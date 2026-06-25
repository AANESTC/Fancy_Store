import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Heart, MapPin, Settings, LogOut, Edit2, Plus, Trash2, Camera, Eye } from 'lucide-react';
import { logout } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  
  // Fake wishlist data since we don't have a backend endpoint
  const [wishlist] = useState([
    { id: 1, name: 'Bridal Diamond Set', price: 1599.99, image: '/images/hero.png' },
    { id: 2, name: 'Gold Bangle Set', price: 899.50, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop' }
  ]);

  // Fake addresses
  const [addresses] = useState([
    { id: 1, name: 'Home', fullAddress: '123 Luxury Lane, Beverly Hills, CA 90210, USA', isDefault: true },
    { id: 2, name: 'Office', fullAddress: '456 Business Blvd, Suite 100, New York, NY 10001, USA', isDefault: false }
  ]);

  useEffect(() => {
    if (activeTab === 'orders') {
      api.get('/orders').then(res => setOrders(res.data)).catch(console.error);
    }
  }, [activeTab]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-2">My Account</h1>
          <p className="text-slate-500">Manage your profile, orders, and preferences.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
              <div className="p-6 border-b border-slate-100 flex flex-col items-center">
                <div className="relative mb-4 group cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-slate-200 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                    <User className="w-12 h-12 text-slate-400" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-900">{user?.name || 'Valued Client'}</h3>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
              <div className="p-4 flex flex-col gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id 
                          ? 'bg-primary-50 text-primary-700 font-medium' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary-600' : 'text-slate-400'}`} />
                      {tab.label}
                    </button>
                  );
                })}
                <div className="my-2 border-t border-slate-100"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8"
              >
                {/* DASHBOARD TAB */}
                {activeTab === 'dashboard' && (
                  <div>
                    <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Dashboard Overview</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <Package className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium mb-1">Total Orders</p>
                          <h4 className="text-2xl font-bold text-slate-900">12</h4>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                          <Heart className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium mb-1">Wishlist Items</p>
                          <h4 className="text-2xl font-bold text-slate-900">{wishlist.length}</h4>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium mb-1">Saved Addresses</p>
                          <h4 className="text-2xl font-bold text-slate-900">{addresses.length}</h4>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                      <h3 className="font-bold text-lg text-slate-900 mb-4">Profile Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Full Name</p>
                          <p className="font-medium text-slate-900">{user?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Email Address</p>
                          <p className="font-medium text-slate-900">{user?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Mobile Number</p>
                          <p className="font-medium text-slate-900">+1 234 567 8900</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Member Since</p>
                          <p className="font-medium text-slate-900">January 2024</p>
                        </div>
                      </div>
                      <button onClick={() => setActiveTab('settings')} className="mt-6 text-primary-600 font-medium text-sm flex items-center gap-2 hover:text-primary-800 transition-colors">
                        <Edit2 className="w-4 h-4" /> Edit Profile
                      </button>
                    </div>
                  </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Order History</h2>
                    {orders.length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No orders yet</h3>
                        <p className="text-slate-500 mb-6">You haven't placed any orders yet.</p>
                        <Link to="/products" className="btn-primary">Start Shopping</Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map(order => (
                          <div key={order.orderId} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Order ID</p>
                                <p className="font-bold text-slate-900">#{order.orderId}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Date</p>
                                <p className="font-medium text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total</p>
                                <p className="font-bold text-slate-900">${order.grandTotal.toFixed(2)}</p>
                              </div>
                              <div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                  {order.status || 'Delivered'}
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              {order.items?.map(item => (
                                <div key={item.productId} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0 last:pb-0">
                                  <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 object-cover rounded-md bg-slate-100" />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-slate-900">{item.productName}</h4>
                                    <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-slate-900">${item.price.toFixed(2)}</p>
                                  </div>
                                </div>
                              ))}
                              <div className="mt-4 flex justify-end gap-3">
                                <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
                                  <Eye className="w-4 h-4" /> View Details
                                </button>
                                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
                                  Track Order
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* WISHLIST TAB */}
                {activeTab === 'wishlist' && (
                  <div>
                    <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">My Wishlist</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map(item => (
                        <div key={item.id} className="group relative border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white">
                          <div className="relative h-48 overflow-hidden bg-slate-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <button className="absolute top-3 right-3 p-2 bg-white rounded-full text-red-500 hover:scale-110 transition-transform shadow-md">
                              <Heart className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-slate-900 mb-1 truncate">{item.name}</h3>
                            <p className="font-bold text-primary-600 mb-4">${item.price.toFixed(2)}</p>
                            <button className="w-full py-2 bg-slate-900 text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-primary-700 transition-colors">
                              Move to Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ADDRESSES TAB */}
                {activeTab === 'addresses' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-display font-bold text-slate-900">Saved Addresses</h2>
                      <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                        <Plus className="w-4 h-4" /> Add New
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map(address => (
                        <div key={address.id} className="border border-slate-200 rounded-xl p-5 relative group hover:border-primary-400 transition-colors">
                          {address.isDefault && (
                            <span className="absolute top-0 right-0 bg-primary-100 text-primary-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl rounded-tr-xl">
                              Default
                            </span>
                          )}
                          <div className="flex items-start gap-3 mb-3">
                            <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                            <div>
                              <h3 className="font-bold text-slate-900">{address.name}</h3>
                              <p className="text-slate-600 text-sm mt-1 leading-relaxed">{address.fullAddress}</p>
                            </div>
                          </div>
                          <div className="flex gap-4 mt-6 pt-4 border-t border-slate-100">
                            <button className="text-sm font-medium text-primary-600 hover:text-primary-800 flex items-center gap-1">
                              <Edit2 className="w-4 h-4" /> Edit
                            </button>
                            <button className="text-sm font-medium text-red-600 hover:text-red-800 flex items-center gap-1">
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                  <div>
                    <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Account Settings</h2>
                    <form className="max-w-2xl space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                          <input type="text" defaultValue={user?.name} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                          <input type="email" defaultValue={user?.email} disabled className="w-full px-4 py-3 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number</label>
                          <input type="tel" defaultValue="+1 234 567 8900" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-slate-200 mt-8">
                        <h3 className="font-bold text-lg text-slate-900 mb-4">Change Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                          </div>
                          <div></div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 flex justify-end">
                        <button type="button" className="px-8 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors shadow-md">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
