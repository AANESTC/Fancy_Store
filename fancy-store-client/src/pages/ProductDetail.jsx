import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Star, Truck, ShieldCheck, Heart, ArrowLeft,
  Plus, Minus, ShoppingBag, Package, Tag, Zap
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
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const isWishlisted = wishlistItems.some(item => item.productId === product?.productId);

  useEffect(() => { fetchProduct(); }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setImgLoaded(false);
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
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

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      dispatch(addToCartLocal({ ...product, quantity }));
      setAddedToCart(true);
      toast.success(`${product.name} added to cart!`);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch {
      toast.error('Please login to add items to cart');
      navigate('/login');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingSpinner} />
        <p style={styles.loadingText}>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={styles.loadingScreen}>
        <p style={{ fontSize: 24, color: '#64748b' }}>Product not found</p>
        <button onClick={() => navigate('/products')} style={styles.backBtnAlt}>← Back to Products</button>
      </div>
    );
  }

  const savings = product.discount > 0 ? (product.price - product.discountedPrice).toFixed(2) : 0;

  return (
    <div style={styles.page}>
      {/* ===== FULL SCREEN HERO IMAGE ===== */}
      <div style={styles.heroSection}>
        {/* Back Button */}
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Wishlist */}
        <button onClick={handleToggleWishlist} style={{
          ...styles.wishBtn,
          background: isWishlisted ? '#fee2e2' : 'rgba(255,255,255,0.9)',
          color: isWishlisted ? '#ef4444' : '#64748b',
        }}>
          <Heart size={22} fill={isWishlisted ? '#ef4444' : 'none'} />
        </button>

        {/* Hero Image */}
        <div style={styles.heroImgWrap}>
          {!imgLoaded && <div style={styles.imgSkeleton} />}
          <img
            src={product.imageUrl || 'https://via.placeholder.com/800x900?text=No+Image'}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            style={{ ...styles.heroImg, opacity: imgLoaded ? 1 : 0 }}
          />
        </div>

        {/* Gradient overlay at bottom */}
        <div style={styles.heroGradient} />

        {/* Discount badge */}
        {product.discount > 0 && (
          <div style={styles.discountBadge}>
            <Tag size={14} />
            {product.discount}% OFF
          </div>
        )}

        {/* Stock badge */}
        {product.stock <= 10 && product.stock > 0 && (
          <div style={styles.stockBadge}>
            <Zap size={13} />
            Only {product.stock} left!
          </div>
        )}
      </div>

      {/* ===== DETAILS PANEL (slides up over image) ===== */}
      <div style={styles.detailsPanel}>
        {/* Category pill */}
        <span style={styles.categoryPill}>{product.categoryName}</span>

        {/* Product name */}
        <h1 style={styles.productName}>{product.name}</h1>

        {/* Rating row */}
        <div style={styles.ratingRow}>
          <div style={styles.stars}>
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} size={16}
                fill={s <= Math.round(product.averageRating) ? '#f59e0b' : 'none'}
                color={s <= Math.round(product.averageRating) ? '#f59e0b' : '#d1d5db'}
              />
            ))}
          </div>
          <span style={styles.ratingText}>
            {product.averageRating} ({product.reviewCount} reviews)
          </span>
        </div>

        {/* Price section */}
        <div style={styles.priceSection}>
          <span style={styles.mainPrice}>₹{product.discountedPrice}</span>
          {product.discount > 0 && (
            <>
              <span style={styles.originalPrice}>₹{product.price}</span>
              <span style={styles.savingsBadge}>Save ₹{savings}</span>
            </>
          )}
        </div>
        <p style={styles.taxNote}>Inclusive of all taxes • Free delivery on orders above ₹500</p>

        {/* Description */}
        <div style={styles.descSection}>
          <h3 style={styles.sectionTitle}>About this product</h3>
          <p style={styles.description}>{product.description}</p>
        </div>

        {/* Feature pills */}
        <div style={styles.featureRow}>
          {product.isTrending && <span style={{ ...styles.featurePill, background: '#fef3c7', color: '#92400e' }}>🔥 Trending</span>}
          {product.isBestSeller && <span style={{ ...styles.featurePill, background: '#dcfce7', color: '#166534' }}>⭐ Best Seller</span>}
          {product.isNewArrival && <span style={{ ...styles.featurePill, background: '#e0e7ff', color: '#3730a3' }}>✨ New Arrival</span>}
        </div>

        {/* Guarantees */}
        <div style={styles.guaranteesRow}>
          <div style={styles.guarantee}>
            <ShieldCheck size={20} color="#16a34a" />
            <span>100% Authentic</span>
          </div>
          <div style={styles.guarantee}>
            <Truck size={20} color="#2563eb" />
            <span>Fast Delivery</span>
          </div>
          <div style={styles.guarantee}>
            <Package size={20} color="#9333ea" />
            <span>Easy Returns</span>
          </div>
        </div>

        {/* Quantity + Add to Cart */}
        <div style={styles.actionSection}>
          {/* Quantity Selector */}
          <div style={styles.qtySection}>
            <span style={styles.qtyLabel}>Qty</span>
            <div style={styles.qtyControl}>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={styles.qtyBtn}>
                <Minus size={16} />
              </button>
              <span style={styles.qtyValue}>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} style={styles.qtyBtn}>
                <Plus size={16} />
              </button>
            </div>
            <span style={styles.stockLabel}>{product.stock} in stock</span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock === 0}
            style={{
              ...styles.addToCartBtn,
              background: product.stock === 0
                ? '#94a3b8'
                : addedToCart
                  ? '#16a34a'
                  : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              transform: isAddingToCart ? 'scale(0.97)' : 'scale(1)',
            }}
          >
            <ShoppingBag size={22} />
            {product.stock === 0 ? 'Out of Stock' : isAddingToCart ? 'Adding...' : addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(60px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    position: 'relative',
    overflowX: 'hidden',
  },
  loadingScreen: {
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    background: '#f8fafc',
  },
  loadingSpinner: {
    width: 44,
    height: 44,
    border: '3px solid #e2e8f0',
    borderTop: '3px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: { color: '#64748b', fontSize: 16 },
  backBtnAlt: {
    marginTop: 16,
    padding: '10px 24px',
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    fontSize: 14,
  },

  // Hero
  heroSection: {
    position: 'relative',
    width: '100%',
    aspectRatio: '3 / 4',
    maxHeight: '88vh',
    background: '#111827',
    overflow: 'hidden',
  },
  heroImgWrap: {
    position: 'absolute',
    inset: 0,
  },
  heroImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    objectPosition: 'center top',
    transition: 'opacity 0.4s ease',
  },
  imgSkeleton: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    background: 'linear-gradient(to bottom, transparent, rgba(15,15,35,0.6))',
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(8px)',
    border: 'none',
    borderRadius: 100,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    color: '#1e293b',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    transition: 'background 0.2s',
  },
  wishBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(8px)',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.25s',
  },
  discountBadge: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '5px 12px',
    background: '#ef4444',
    color: '#fff',
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 700,
  },
  stockBadge: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '5px 12px',
    background: '#f59e0b',
    color: '#fff',
    borderRadius: 100,
    fontSize: 12,
    fontWeight: 700,
  },

  // Details panel
  detailsPanel: {
    position: 'relative',
    zIndex: 2,
    background: '#fff',
    borderRadius: '24px 24px 0 0',
    marginTop: -24,
    padding: '28px 20px 100px',
    animation: 'slideUp 0.4s ease',
    maxWidth: 860,
    margin: '-24px auto 0',
    boxShadow: '0 -4px 30px rgba(0,0,0,0.08)',
  },
  categoryPill: {
    display: 'inline-block',
    padding: '4px 14px',
    background: '#ede9fe',
    color: '#6d28d9',
    borderRadius: 100,
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 12,
  },
  productName: {
    fontSize: 'clamp(22px, 5vw, 32px)',
    fontWeight: 800,
    color: '#0f172a',
    lineHeight: 1.25,
    marginBottom: 12,
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  stars: { display: 'flex', gap: 2 },
  ratingText: { fontSize: 13, color: '#64748b' },

  priceSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  mainPrice: {
    fontSize: 'clamp(28px, 6vw, 40px)',
    fontWeight: 800,
    color: '#0f172a',
  },
  originalPrice: {
    fontSize: 20,
    color: '#94a3b8',
    textDecoration: 'line-through',
  },
  savingsBadge: {
    padding: '4px 12px',
    background: '#dcfce7',
    color: '#16a34a',
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 700,
  },
  taxNote: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 24,
  },
  descSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 1.7,
  },
  featureRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  featurePill: {
    padding: '5px 14px',
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 600,
  },
  guaranteesRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 28,
    flexWrap: 'wrap',
  },
  guarantee: {
    flex: '1 1 100px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    background: '#f8fafc',
    borderRadius: 12,
    fontSize: 13,
    color: '#334155',
    fontWeight: 500,
    border: '1px solid #e2e8f0',
  },

  // Actions
  actionSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  qtySection: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  qtyLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    minWidth: 28,
  },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid #e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
    border: 'none',
    cursor: 'pointer',
    color: '#475569',
    transition: 'background 0.15s',
  },
  qtyValue: {
    width: 44,
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 16,
    color: '#0f172a',
  },
  stockLabel: {
    fontSize: 13,
    color: '#94a3b8',
  },
  addToCartBtn: {
    width: '100%',
    padding: '16px 24px',
    color: '#fff',
    border: 'none',
    borderRadius: 16,
    fontSize: 17,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
    transition: 'all 0.25s ease',
    letterSpacing: '0.3px',
  },
};

export default ProductDetail;
