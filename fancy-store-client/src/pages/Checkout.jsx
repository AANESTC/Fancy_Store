import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, QrCode, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { clearCart } from '../features/cart/cartSlice';

const Checkout = () => {
  const { items, summary } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // If not authenticated or cart is empty, redirect
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (items.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // In a full DB environment, we would first save the Address to the DB to get AddressId
      // const addressRes = await api.post('/addresses', formData);
      // Then post the Order:
      // await api.post('/orders', { addressId: addressRes.data.addressId, paymentMethod });
      
      // Since we are running a local demo with empty DB, we simulate the API call delay:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate backend success
      setOrderPlaced(true);
      dispatch(clearCart());
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Order Confirmed!</h2>
          <p className="text-slate-500 mb-8">Thank you for shopping with The_Skj_Hub. Your elegant jewelry is on its way!</p>
          <button 
            onClick={() => navigate('/products')}
            className="btn-primary w-full py-3 text-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-8">Secure Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Form & Payment */}
          <div className="flex-1 space-y-8">
            {/* Delivery Details */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b pb-4">1. Delivery Details</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" placeholder="+91 98765 43210" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Complete Address</label>
                  <textarea required name="address" rows="3" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" placeholder="House No, Street, Landmark..."></textarea>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                    <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pincode</label>
                    <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Options */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b pb-4">2. Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* UPI */}
                <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="payment" value="UPI" checked={paymentMethod === 'UPI'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${paymentMethod === 'UPI' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">UPI</h4>
                      <p className="text-xs text-slate-500">Google Pay, PhonePe, Paytm</p>
                    </div>
                  </div>
                </label>

                {/* QR Code */}
                <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'QR' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="payment" value="QR" checked={paymentMethod === 'QR'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${paymentMethod === 'QR' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Scan QR</h4>
                      <p className="text-xs text-slate-500">Scan to pay securely</p>
                    </div>
                  </div>
                </label>

                {/* Card */}
                <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'Card' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="payment" value="Card" checked={paymentMethod === 'Card'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${paymentMethod === 'Card' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Credit / Debit Card</h4>
                      <p className="text-xs text-slate-500">Visa, MasterCard, RuPay</p>
                    </div>
                  </div>
                </label>

                {/* Net Banking */}
                <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'NetBanking' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="payment" value="NetBanking" checked={paymentMethod === 'NetBanking'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${paymentMethod === 'NetBanking' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Net Banking</h4>
                      <p className="text-xs text-slate-500">All major banks supported</p>
                    </div>
                  </div>
                </label>

              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.cartId} className="flex gap-4">
                    <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{item.productName}</h4>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      <p className="font-bold text-sm text-primary-600 mt-1">₹{item.subtotal}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({summary.itemCount} items)</span>
                  <span>₹{summary.productTotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span className="text-green-500">{summary.deliveryCharge === 0 ? 'Free' : `₹${summary.deliveryCharge}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-200 pt-3">
                  <span>Total To Pay</span>
                  <span>₹{summary.grandTotal}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isProcessing || !formData.fullName || !formData.phone || !formData.address}
                className="w-full btn-primary py-4 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Pay ₹${summary.grandTotal}`}
              </button>
              
              <p className="text-xs text-center text-slate-500 mt-4 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Payments are 100% secure & encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
