import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { updateQuantityLocal, removeFromCartLocal } from '../features/cart/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, summary, isLoading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Skip fetchCart on mount since we are using local state for the demo
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     dispatch(fetchCart());
  //   }
  // }, [dispatch, isAuthenticated]);

  const handleQuantityChange = (cartId, currentQty, delta, maxStock) => {
    const newQty = currentQty + delta;
    if (newQty > 0 && newQty <= maxStock) {
      dispatch(updateQuantityLocal({ cartId, quantity: newQty }));
    }
  };

  const handleRemove = (cartId) => {
    dispatch(removeFromCartLocal(cartId));
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingBag className="h-16 w-16 text-slate-300 mb-6" />
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Your Cart is Waiting</h2>
        <p className="text-slate-500 mb-8 max-w-md">Please login to view your cart items or to add new elegant pieces to your collection.</p>
        <Link to="/login" className="btn-primary py-3 px-8 text-lg rounded-full">Login to Continue</Link>
      </div>
    );
  }

  // Fallback view for empty cart
  if (!items || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingBag className="h-16 w-16 text-slate-300 mb-6" />
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Your Cart is Empty</h2>
        <p className="text-slate-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Explore our stunning collections!</p>
        <Link to="/products" className="btn-primary py-3 px-8 text-lg rounded-full">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-8">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cart Items List */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 p-6 border-b border-slate-100 bg-slate-50/50 text-sm font-medium text-slate-500 uppercase tracking-wider">
                <div className="sm:col-span-6">Product</div>
                <div className="sm:col-span-2 text-center">Price</div>
                <div className="sm:col-span-2 text-center">Quantity</div>
                <div className="sm:col-span-2 text-right">Subtotal</div>
              </div>
              
              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.cartId} className="p-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    
                    {/* Product Info */}
                    <div className="sm:col-span-6 flex items-center gap-4">
                      <img src={item.imageUrl} alt={item.productName} className="w-20 h-20 object-cover rounded-xl border border-slate-100" />
                      <div>
                        <Link to={`/products/${item.productId}`}>
                          <h3 className="font-bold text-slate-900 hover:text-primary-600 transition-colors">{item.productName}</h3>
                        </Link>
                        {item.discount > 0 && <span className="text-xs text-red-500 font-medium">{item.discount}% OFF applied</span>}
                      </div>
                    </div>
                    
                    {/* Price (Mobile & Desktop) */}
                    <div className="sm:col-span-2 sm:text-center flex justify-between sm:block">
                      <span className="sm:hidden text-slate-500 text-sm">Price:</span>
                      <span className="font-medium text-slate-900">₹{item.discountedPrice}</span>
                    </div>
                    
                    {/* Quantity Control */}
                    <div className="sm:col-span-2 flex justify-between sm:justify-center items-center">
                      <span className="sm:hidden text-slate-500 text-sm">Quantity:</span>
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-1">
                        <button 
                          onClick={() => handleQuantityChange(item.cartId, item.quantity, -1, item.maxStock)}
                          className="p-1 text-slate-400 hover:text-slate-900 disabled:opacity-50"
                          disabled={item.quantity <= 1 || isLoading}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-slate-900">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.cartId, item.quantity, 1, item.maxStock)}
                          className="p-1 text-slate-400 hover:text-slate-900 disabled:opacity-50"
                          disabled={item.quantity >= item.maxStock || isLoading}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Subtotal & Actions */}
                    <div className="sm:col-span-2 flex justify-between sm:justify-end items-center gap-4">
                      <span className="sm:hidden text-slate-500 text-sm">Subtotal:</span>
                      <span className="font-bold text-slate-900">₹{item.subtotal}</span>
                      <button 
                        onClick={() => handleRemove(item.cartId)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Items ({summary?.itemCount || 0})</span>
                  <span>₹{summary?.productTotal || 0}</span>
                </div>
                {summary?.discountAmount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Discount</span>
                    <span>-₹{summary.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge</span>
                  <span>{summary?.deliveryCharge === 0 ? <span className="text-green-500 font-medium">Free</span> : `₹${summary?.deliveryCharge || 0}`}</span>
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-slate-900">Total Amount</span>
                  <span className="text-2xl font-bold text-primary-600">₹{summary?.grandTotal || 0}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 text-right">Includes GST</p>
              </div>
              
              <Link to="/checkout" className="w-full btn-primary py-4 text-lg rounded-xl flex justify-center items-center gap-2 group">
                Proceed to Checkout
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                Secure Checkout guaranteed
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
