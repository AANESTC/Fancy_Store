import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { addToCartLocal } from '../features/cart/cartSlice';

const Wishlist = () => {
  const { items } = useSelector(state => state.wishlist);
  const dispatch = useDispatch();

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCartLocal(product));
    dispatch(removeFromWishlist(product.productId));
  };

  if (items.length === 0) {
    return (
      <div className="bg-slate-50 min-h-[80vh] flex items-center justify-center py-12">
        <div className="bg-white p-12 rounded-2xl shadow-sm text-center max-w-md w-full border border-slate-100">
          <Heart className="h-20 w-20 text-slate-200 mx-auto mb-6" />
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Your Wishlist is Empty</h2>
          <p className="text-slate-500 mb-8 font-light">
            You haven't saved any masterpieces yet. Explore our exquisite collection and find something you love.
          </p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-accent hover:text-slate-900 transition-colors">
            Explore Boutique <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-accent font-medium tracking-[0.2em] uppercase text-xs mb-2 block">Your Selection</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900">Wishlist</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.productId} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <button 
                  onClick={() => handleRemove(item.productId)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-slate-400 hover:text-red-500 hover:bg-white transition-colors"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                
                {/* Quick Add To Cart */}
                <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-slate-900 text-white hover:bg-accent hover:text-slate-900 py-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <ShoppingBag className="h-4 w-4" /> 
                    Move to Cart
                  </button>
                </div>
              </div>
              
              <div className="p-5">
                <p className="text-xs font-medium text-primary-600 mb-1">{item.categoryName}</p>
                <Link to={`/products/${item.productId}`}>
                  <h3 className="font-bold text-slate-900 mb-2 truncate hover:text-primary-600 transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg text-slate-900">₹{item.discountedPrice}</span>
                  {item.discount > 0 && (
                    <span className="text-sm text-slate-400 line-through">₹{item.price}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
