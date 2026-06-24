import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, Heart, Gem } from 'lucide-react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items: cartItems } = useSelector(state => state.cart);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const cartItemCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  const wishlistItemCount = wishlistItems?.length || 0;

  return (
    <nav className="bg-white/95 backdrop-blur-md fixed w-full z-50 top-0 border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-slate-900 hover:text-slate-500 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center md:justify-start">
            <Link to="/" className="flex items-center gap-2 group">
              <Gem className="h-7 w-7 text-accent group-hover:rotate-12 transition-transform duration-500" />
              <span className="font-brand font-bold text-3xl tracking-wide text-slate-900">The_Skj_Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-10">
            <Link to="/" className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-900 hover:text-accent transition-colors">Home</Link>
            <Link to="/products?category=bangles" className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-900 hover:text-accent transition-colors">Bangles</Link>
            <Link to="/products?category=chains" className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-900 hover:text-accent transition-colors">Chains</Link>
            <Link to="/products?category=hair-clips" className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-900 hover:text-accent transition-colors">Hair Clips</Link>
            <Link to="/products" className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-900 hover:text-accent transition-colors">Boutique</Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-6">
            <button className="text-slate-900 hover:text-accent hidden sm:block transition-colors">
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>
            
            <Link to="/wishlist" className="text-slate-900 hover:text-accent hidden sm:block transition-colors relative">
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-slate-900 text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/profile" className="text-[11px] font-bold tracking-[0.1em] uppercase bg-slate-100 text-slate-900 px-4 py-2 rounded-full hover:bg-slate-200 transition-all flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-[11px] font-bold tracking-[0.1em] uppercase bg-red-50 text-red-600 px-4 py-2 rounded-full hover:bg-red-100 transition-all flex items-center gap-2"
                >
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link to="/login" className="text-[11px] font-bold tracking-[0.1em] uppercase bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-accent hover:text-slate-900 transition-all shadow-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Log In</span>
                </Link>
              </div>
            )}

            <Link to="/cart" className="text-slate-900 hover:text-accent relative transition-colors">
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">Home</Link>
            <Link to="/products?category=bangles" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">Bangles</Link>
            <Link to="/products?category=chains" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">Chains</Link>
            <Link to="/products?category=hair-clips" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">Hair Clips</Link>
            <Link to="/products" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">All Products</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
