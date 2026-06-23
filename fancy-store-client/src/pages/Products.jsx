import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, ChevronDown, ShoppingBag, Heart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { addToCartLocal } from '../features/cart/cartSlice';
import { toggleWishlist } from '../features/wishlist/wishlistSlice';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  
  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const category = searchParams.get('category');

  const [categories, setCategories] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);
  
  useEffect(() => {
    fetchCategories();
    fetchPriceRanges();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchPriceRanges = async () => {
    try {
      const res = await api.get('/categories/priceranges');
      setPriceRanges(res.data);
    } catch (error) {
      console.error("Failed to fetch price ranges:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Build query string from searchParams
      const query = new URLSearchParams(searchParams).toString();
      const response = await api.get(`/products?${query}`);
      
      if (response.data && response.data.products) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products. Please try again later.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    setAddingId(product.productId);
    try {
      // Simulate API delay for better UX
      setTimeout(() => {
        dispatch(addToCartLocal(product));
        setAddingId(null);
      }, 300);
    } catch (error) {
      toast.error('Failed to add to cart');
      setAddingId(null);
    }
  };

  const handleAddToWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to manage wishlist');
      navigate('/login');
      return;
    }
    
    dispatch(toggleWishlist(product));
  };

  const handlePriceFilter = (rangeLabel) => {
    const newParams = new URLSearchParams(searchParams);
    const rangeObj = priceRanges.find(r => r.label === rangeLabel);
    
    if (!rangeObj) return;

    let min = rangeObj.minPrice;
    let max = rangeObj.maxPrice;

    // Default max to 999999 if null
    if (max === null) max = 999999;
    if (min === null) min = 0;

    const currentMin = newParams.get('minPrice');
    const currentMax = newParams.get('maxPrice');
    
    // Toggle off if clicking the already active range
    if (currentMin === String(min) && currentMax === String(max)) {
        newParams.delete('minPrice');
        newParams.delete('maxPrice');
    } else {
        newParams.set('minPrice', min);
        newParams.set('maxPrice', max);
    }
    
    setSearchParams(newParams);
  };

  // Helper to determine if a price bucket is active
  const isPriceActive = (rangeLabel) => {
    const rangeObj = priceRanges.find(r => r.label === rangeLabel);
    if (!rangeObj) return false;
    
    const min = searchParams.get('minPrice');
    const max = searchParams.get('maxPrice');
    if (!min || !max) return false;
    
    let expectedMax = rangeObj.maxPrice === null ? 999999 : rangeObj.maxPrice;
    let expectedMin = rangeObj.minPrice === null ? 0 : rangeObj.minPrice;

    return min === String(expectedMin) && max === String(expectedMax);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 capitalize">
            {category ? category.replace('-', ' ') : 'All Products'}
          </h1>
          <p className="text-slate-500 mt-2">Showing {products.length} elegant items</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <button 
          className="md:hidden flex items-center justify-between w-full bg-white p-4 rounded-lg shadow-sm border border-slate-200"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <span className="flex items-center gap-2 font-medium"><Filter className="h-5 w-5" /> Filters</span>
          <ChevronDown className={`h-5 w-5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Sidebar Filters */}
        <div className={`md:w-72 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden'} md:block space-y-6`}>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-display font-bold text-lg text-slate-900 mb-5">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {['All', ...categories.map(c => c.categoryName)].map(cat => {
                const isActive = (category || 'All').toLowerCase() === cat.toLowerCase().replace(/ /g, '-');
                return (
                  <button 
                    key={cat}
                    onClick={() => navigate(cat === 'All' ? '/products' : `/products?category=${cat.toLowerCase().replace(/ /g, '-')}`)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30' 
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-primary-600 hover:border-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-display font-bold text-lg text-slate-900 mb-5">Price Range</h3>
            <div className="grid grid-cols-2 gap-3">
              {priceRanges.map(range => {
                const active = isPriceActive(range.label);
                return (
                  <button 
                    key={range.id} 
                    onClick={() => handlePriceFilter(range.label)}
                    className={`px-3 py-3 text-xs font-medium rounded-xl transition-all ${
                      active 
                        ? 'bg-primary-50 border-primary-500 text-primary-700 border ring-1 ring-primary-500 shadow-sm' 
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white hover:border-primary-500 hover:text-primary-600 hover:shadow-sm'
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>
          
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Sorting Top Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex justify-between items-center hidden md:flex">
            <span className="text-sm text-slate-500">Sort by:</span>
            <select className="border-none text-sm font-medium text-slate-700 bg-transparent focus:ring-0 cursor-pointer">
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-100">
                  <div className="h-56 bg-slate-200 rounded-t-2xl"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.productId} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {product.discount}% OFF
                      </div>
                    )}
                    <button 
                      onClick={(e) => handleAddToWishlist(e, product)}
                      className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-slate-400 hover:text-red-500 hover:bg-white transition-colors z-10"
                    >
                      <Heart className={`h-5 w-5 transition-colors ${wishlistItems.some(item => item.productId === product.productId) ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                    
                    {/* Quick Add To Cart */}
                    <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={addingId === product.productId}
                        className="w-full btn-primary py-2 rounded-lg flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                      >
                        <ShoppingBag className="h-4 w-4" /> 
                        {addingId === product.productId ? 'Adding...' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <p className="text-xs font-medium text-primary-600 mb-1">{product.categoryName}</p>
                    <Link to={`/products/${product.productId}`}>
                      <h3 className="font-bold text-slate-900 mb-2 truncate hover:text-primary-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-accent">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm text-slate-600 ml-1">{product.averageRating}</span>
                      </div>
                      <span className="text-xs text-slate-400">({product.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-slate-900">₹{product.discountedPrice}</span>
                      {product.discount > 0 && (
                        <span className="text-sm text-slate-400 line-through">₹{product.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
