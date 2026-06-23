import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Star, Truck, ShieldCheck, Heart, Share2, Plus, Minus, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { addToCartLocal } from '../features/cart/cartSlice';
import { toggleWishlist } from '../features/wishlist/wishlistSlice';
import { useSelector } from 'react-redux';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const isWishlisted = wishlistItems.some(item => item.productId === product?.productId);

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please login to manage wishlist');
      navigate('/login');
      return;
    }
    if (product) {
      dispatch(toggleWishlist(product));
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${id}`);
      if (response.data) {
        setProduct(response.data);
      } else {
        toast.error('Product not found');
      }
    } catch (error) {
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      setTimeout(() => {
        dispatch(addToCartLocal({ ...product, quantity }));
        setIsAddingToCart(false);
      }, 300);
    } catch (error) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading elegant details...</div>;
  }

  if (!product) {
    return <div className="min-h-[60vh] flex items-center justify-center">Product not found</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="text-primary-600 font-medium text-sm tracking-wider uppercase">{product.categoryName}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">{product.name}</h1>
            
            {/* Reviews */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-1 text-accent">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`h-5 w-5 ${star <= Math.floor(product.averageRating) ? 'fill-current' : 'text-slate-300'}`} />
                ))}
              </div>
              <span className="text-sm text-slate-500">{product.averageRating} ({product.reviewCount} Reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-end gap-4">
                <span className="text-4xl font-bold text-slate-900">₹{product.discountedPrice}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-xl text-slate-400 line-through mb-1">₹{product.price}</span>
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-bold mb-1">{product.discount}% OFF</span>
                  </>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-2">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {product.material && (
                <div className="bg-slate-50 p-4 rounded-xl">
                  <span className="block text-xs text-slate-500 mb-1">Material</span>
                  <span className="font-medium text-slate-900">{product.material}</span>
                </div>
              )}
              {product.color && (
                <div className="bg-slate-50 p-4 rounded-xl">
                  <span className="block text-xs text-slate-500 mb-1">Color</span>
                  <span className="font-medium text-slate-900">{product.color}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-auto pt-8 border-t border-slate-100">
              <div className="flex items-center gap-6 mb-6">
                <span className="font-medium text-slate-900">Quantity</span>
                <div className="flex items-center border border-slate-200 rounded-lg p-1 w-32">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex-1 text-center font-medium text-slate-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-slate-500">{product.stock} items left</span>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.stock === 0}
                  className="flex-1 btn-primary py-4 text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button 
                  onClick={handleToggleWishlist}
                  className={`p-4 rounded-xl border transition-colors ${
                    isWishlisted 
                      ? 'border-red-500 text-red-500 bg-red-50' 
                      : 'border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="p-4 rounded-xl border border-slate-200 text-slate-400 hover:text-primary-600 hover:border-primary-600 hover:bg-primary-50 transition-colors">
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="bg-green-50 p-2 rounded-full"><ShieldCheck className="h-5 w-5 text-green-600" /></div>
                <span className="text-sm font-medium text-slate-700">100% Authentic</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-full"><Truck className="h-5 w-5 text-blue-600" /></div>
                <span className="text-sm font-medium text-slate-700">Fast Delivery</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
