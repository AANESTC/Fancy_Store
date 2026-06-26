import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Star, Truck, ShieldCheck, Heart, ArrowLeft,
  Plus, Minus, ShoppingBag, Package, Tag, Zap, RefreshCcw, CheckCircle, ChevronRight, Share2
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { addToCartLocal } from '../features/cart/cartSlice';
import { toggleWishlist } from '../features/wishlist/wishlistSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [is360Mode, setIs360Mode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Related products
  const [similarProducts, setSimilarProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    fetchProductAndRelated();
  }, [id]);

  const fetchProductAndRelated = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      
      // Fetch related products (mocked by fetching same category)
      if (response.data.categoryId) {
        const catRes = await api.get(`/products?category=${response.data.categoryName.toLowerCase().replace(/ /g, '-')}&pageSize=4`);
        if (catRes.data && catRes.data.products) {
          setSimilarProducts(catRes.data.products.filter(p => p.productId !== response.data.productId).slice(0, 4));
        }
      }

      // Fetch trending
      const trendRes = await api.get('/products?pageSize=4');
      if (trendRes.data && trendRes.data.products) {
        setTrendingProducts(trendRes.data.products.slice(0, 4));
      }

    } catch {
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) { toast.error('Please login to manage wishlist'); navigate('/login'); return; }
    if (product) dispatch(toggleWishlist(product));
  };

  const handleAddToCart = async (buyNow = false) => {
    setIsAddingToCart(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      dispatch(addToCartLocal({ ...product, quantity }));
      toast.success(`${product.name} added to cart!`);
      if (buyNow) {
        navigate('/cart');
      }
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading premium experience...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Product Not Found</h2>
        <button onClick={() => navigate('/products')} className="btn-primary">Return to Shop</button>
      </div>
    );
  }

  const savings = product.discount > 0 ? (product.price - product.discountedPrice).toFixed(2) : 0;
  const isWishlisted = wishlistItems.some(item => item.productId === product?.productId);

  const baseImages = product.images && product.images.length > 0 
    ? [...product.images].sort((a, b) => a.displayOrder - b.displayOrder)
    : [{ imageUrl: product.imageUrl, rotationAngle: 0 }];

  const images = baseImages.length === 1 
    ? [0, 90, 180, 270].map(angle => ({ url: baseImages[0].imageUrl, rotation: angle }))
    : baseImages.map(i => ({ url: i.imageUrl, rotation: i.rotationAngle || 0 }));

  const handleDragStart = (e) => {
    if (!is360Mode) return;
    setIsDragging(true);
    setStartX(e.clientX || (e.touches && e.touches[0].clientX));
  };

  const handleDragMove = (e) => {
    if (!isDragging || !is360Mode) return;
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const deltaX = x - startX;
    if (Math.abs(deltaX) > 20) {
      if (deltaX > 0) setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      else setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      setStartX(x);
    }
  };

  const handleDragEnd = () => setIsDragging(false);

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-3 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center text-sm text-slate-500">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link to="/products" className="hover:text-primary-600 transition-colors">Jewelry</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link to={`/products?category=${product.categoryName}`} className="hover:text-primary-600 transition-colors">{product.categoryName}</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* ====== IMAGE GALLERY ====== */}
            <div className="p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col-reverse md:flex-row gap-6 relative">
              
              {/* Floating Badges */}
              <div className="absolute top-10 left-10 z-10 flex flex-col gap-2">
                {product.discount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {product.discount}% OFF
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    #1 Best Seller
                  </span>
                )}
              </div>

              {/* Share & Wishlist */}
              <div className="absolute top-10 right-10 z-10 flex flex-col gap-3">
                <button 
                  onClick={handleToggleWishlist}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 text-slate-400 hover:text-red-500 hover:scale-110 transition-all"
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 text-slate-400 hover:text-primary-600 hover:scale-110 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnail strip */}
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar md:w-24 shrink-0">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => { setActiveImage(idx); setIs360Mode(false); }}
                    className={`w-20 h-24 md:w-full md:h-28 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? 'border-primary-600 shadow-md scale-105' : 'border-slate-100 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img.url} alt={`Thumbnail ${idx}`} style={{ transform: `rotate(${img.rotation}deg)` }} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 bg-slate-50 rounded-2xl overflow-hidden relative group min-h-[400px] select-none"
                   onMouseDown={handleDragStart}
                   onMouseMove={handleDragMove}
                   onMouseUp={handleDragEnd}
                   onMouseLeave={handleDragEnd}
                   onTouchStart={handleDragStart}
                   onTouchMove={handleDragMove}
                   onTouchEnd={handleDragEnd}
              >
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  {images.length > 1 && (
                    <button 
                      onClick={() => setIs360Mode(!is360Mode)} 
                      className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md transition-colors ${is360Mode ? 'bg-primary-600 text-white' : 'bg-white text-slate-800'}`}
                    >
                      {is360Mode ? 'Exit 360° View' : '360° View'}
                    </button>
                  )}
                  <button onClick={() => setIsFullscreen(true)} className="px-3 py-1.5 bg-white text-slate-800 rounded-full text-xs font-bold shadow-md">
                    Full Screen
                  </button>
                </div>
                
                {is360Mode && (
                  <div className="absolute inset-0 z-10 flex items-center justify-between px-4 pointer-events-none">
                    <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">Drag to Rotate</div>
                  </div>
                )}
                
                {!is360Mode && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white text-slate-700">
                      ←
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white text-slate-700">
                      →
                    </button>
                  </>
                )}
                
                <div className={`w-full h-full absolute inset-0 transition-transform duration-500 origin-center ${!is360Mode ? 'group-hover:scale-150 cursor-zoom-in' : 'cursor-grab active:cursor-grabbing pointer-events-none'}`}>
                  <img 
                    src={images[activeImage].url} 
                    alt={product.name} 
                    style={{ transform: `rotate(${images[activeImage].rotation}deg)` }}
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300"
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            {/* ====== PRODUCT DETAILS ====== */}
            <div className="p-6 md:p-10 flex flex-col">
              <Link to={`/products?category=${product.categoryName}`} className="text-primary-600 text-sm font-bold tracking-widest uppercase mb-3 hover:underline">
                {product.categoryName}
              </Link>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                  <span className="font-bold text-green-700 text-sm">{product.averageRating}</span>
                  <Star className="w-4 h-4 fill-green-600 text-green-600" />
                </div>
                <span className="text-slate-500 text-sm font-medium hover:text-primary-600 cursor-pointer transition-colors underline decoration-dotted">
                  Read {product.reviewCount} Verified Reviews
                </span>
              </div>

              {/* Pricing Box */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-display font-bold text-slate-900">₹{product.discountedPrice}</span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-xl text-slate-400 line-through">₹{product.price}</span>
                      <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Save ₹{savings}</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-slate-500 mb-4">Inclusive of all taxes. No hidden charges.</p>
                
                {/* Bank Offers Mock */}
                <div className="text-sm text-slate-600 flex flex-col gap-2 border-t border-slate-200 pt-4">
                  <div className="flex items-start gap-2">
                    <Tag className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <p><span className="font-semibold text-slate-900">Bank Offer:</span> 5% Unlimited Cashback on Flipkart Axis Bank Credit Card</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Tag className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <p><span className="font-semibold text-slate-900">Special Price:</span> Get extra 10% off (price inclusive of cashback/coupon)</p>
                  </div>
                </div>
              </div>

              {/* Delivery & Services */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="flex flex-col items-center text-center gap-2 p-3 bg-white border border-slate-200 rounded-xl">
                  <Truck className="w-6 h-6 text-primary-600" />
                  <span className="text-xs font-semibold text-slate-700">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-3 bg-white border border-slate-200 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-primary-600" />
                  <span className="text-xs font-semibold text-slate-700">1 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-3 bg-white border border-slate-200 rounded-xl">
                  <RefreshCcw className="w-6 h-6 text-primary-600" />
                  <span className="text-xs font-semibold text-slate-700">30 Day Return</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-3 bg-white border border-slate-200 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-primary-600" />
                  <span className="text-xs font-semibold text-slate-700">100% Authentic</span>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex items-center gap-4 mb-6">
                  {/* Quantity */}
                  <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden h-14 bg-white shrink-0">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                      className="w-12 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg text-slate-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} 
                      className="w-12 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {product.stock <= 10 && product.stock > 0 && (
                    <span className="text-orange-600 text-sm font-bold flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
                      <Zap className="w-4 h-4 fill-current" /> Only {product.stock} left in stock!
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="text-red-600 font-bold bg-red-50 px-4 py-2 rounded-lg border border-red-200">Out of Stock</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleAddToCart(false)}
                    disabled={isAddingToCart || product.stock === 0}
                    className="flex-1 bg-white border-2 border-primary-600 text-primary-600 h-14 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-primary-50 transition-colors disabled:opacity-50"
                  >
                    <ShoppingBag className="w-5 h-5" /> 
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button 
                    onClick={() => handleAddToCart(true)}
                    disabled={isAddingToCart || product.stock === 0}
                    className="flex-1 bg-primary-600 text-white h-14 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-600/30 transition-all disabled:opacity-50"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====== DETAILED SECTIONS ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-accent rounded-full"></div>
                Product Description
              </h3>
              <div className="text-slate-600 leading-relaxed whitespace-pre-line text-lg font-light">
                {showFullDesc ? product.description : product.description.slice(0, 300) + (product.description.length > 300 ? '...' : '')}
              </div>
              {product.description.length > 300 && (
                <button 
                  onClick={() => setShowFullDesc(!showFullDesc)} 
                  className="mt-4 text-primary-600 font-bold hover:underline"
                >
                  {showFullDesc ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-accent rounded-full"></div>
                Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-500">Brand</span>
                  <span className="font-medium text-slate-900">The_Skj_Hub</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-500">Material</span>
                  <span className="font-medium text-slate-900">Premium Alloy</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-500">Occasion</span>
                  <span className="font-medium text-slate-900">Bridal, Party, Ethnic</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-500">Color</span>
                  <span className="font-medium text-slate-900">Gold Plated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Frequently Bought Together Mock */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 text-white sticky top-24">
              <h3 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent fill-accent" />
                Frequently Bought Together
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-white" />
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                    <p className="font-bold text-accent">₹{product.discountedPrice}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <div className="flex justify-center"><Plus className="text-slate-500" /></div>
                <div className="flex items-center gap-3 opacity-80">
                  <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center">
                    <Package className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">Premium Velvet Box</p>
                    <p className="font-bold text-slate-300">₹299</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border border-slate-500"></div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4 mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400">Total Price:</span>
                  <span className="text-2xl font-bold text-white">₹{(product.discountedPrice + 299).toFixed(2)}</span>
                </div>
                <p className="text-xs text-green-400 text-right">Save ₹50 on bundle</p>
              </div>

              <button className="w-full bg-accent text-slate-900 font-bold py-3 rounded-xl hover:bg-white transition-colors">
                Add Bundle To Cart
              </button>
            </div>
          </div>
        </div>

        {/* ====== SIMILAR PRODUCTS ====== */}
        {similarProducts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold text-slate-900">Similar Products</h2>
              <Link to={`/products?category=${product.categoryName}`} className="text-primary-600 font-bold text-sm uppercase tracking-wider hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map(item => (
                <Link key={item.productId} to={`/products/${item.productId}`} className="bg-white rounded-xl border border-slate-200 overflow-hidden group hover:shadow-xl transition-all">
                  <div className="relative h-64 bg-slate-100 overflow-hidden">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-slate-900 mb-1 truncate">{item.name}</h3>
                    <p className="font-bold text-primary-600">₹{item.discountedPrice}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
      
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
          <button onClick={() => setIsFullscreen(false)} className="absolute top-6 right-6 text-white hover:text-red-500 p-2">
            Close ✕
          </button>
          <button onClick={prevImage} className="absolute left-6 text-white hover:text-primary-400 text-4xl px-4 py-8">
            ‹
          </button>
          <img src={images[activeImage].url} style={{ transform: `rotate(${images[activeImage].rotation}deg)` }} className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
          <button onClick={nextImage} className="absolute right-6 text-white hover:text-primary-400 text-4xl px-4 py-8">
            ›
          </button>
          <div className="absolute bottom-6 flex gap-2 overflow-x-auto max-w-2xl px-4 py-2 bg-black/50 rounded-xl backdrop-blur-sm">
            {images.map((img, idx) => (
              <img key={idx} src={img.url} style={{ transform: `rotate(${img.rotation}deg)` }} onClick={() => setActiveImage(idx)} className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${activeImage === idx ? 'border-primary-500' : 'border-transparent opacity-50'}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
