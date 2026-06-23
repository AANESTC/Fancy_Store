import { useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Gem } from 'lucide-react';
import { registerUser } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const Field = ({ icon: Icon, label, name, type = 'text', placeholder, error, suffix, value, onChange }) => (
  <div className="auth-field-group">
    <label className="auth-label">{label}</label>
    <div className="auth-input-wrap">
      <Icon size={18} className="auth-input-icon" />
      <input
        type={type}
        name={name}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`auth-input ${error ? 'auth-input-error' : ''}`}
        id={`register-${name}`}
      />
      {suffix}
    </div>
    {error && <span className="auth-error-msg">{error}</span>}
  </div>
);

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', password: '', confirmPassword: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2)
      errs.name = 'Full name must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Enter a valid email address';
    if (!/^[0-9]{10}$/.test(formData.mobile))
      errs.mobile = 'Enter a valid 10-digit mobile number';
    if (formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      const resultAction = await dispatch(registerUser({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password
      }));

      if (registerUser.fulfilled.match(resultAction)) {
        toast.success('Account created! Welcome to Fancy Store!');
        navigate('/');
      } else {
        toast.error(resultAction.payload || 'Registration failed');
      }
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="luxury-auth-page">
      <div className="auth-bg">
        <div className="auth-bg-overlay" />
        <div className="auth-floating-gems">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`gem gem-${i + 1}`}>{'💎💍🌸✨🪙'.split('')[i % 5]}</div>
          ))}
        </div>
      </div>

      <div className="auth-container auth-container-register">
        {/* Left Branding */}
        <div className="auth-brand-panel">
          <div className="brand-content">
            <div className="brand-logo-wrap">
              <Gem size={48} className="brand-gem-icon" />
            </div>
            <h1 className="brand-title">Join Us</h1>
            <p className="brand-tagline">Create Your Fancy Account</p>
            <div className="brand-divider" />
            <p className="brand-desc">
              Become a member and enjoy exclusive access to our premium jewelry collections, special offers, and personalized recommendations.
            </p>
            <div className="brand-features">
              <div className="brand-feature">🎁 Exclusive Member Discounts</div>
              <div className="brand-feature">🚚 Free Delivery on Orders ₹500+</div>
              <div className="brand-feature">💫 Early Access to New Collections</div>
              <div className="brand-feature">🔔 Order Tracking & Notifications</div>
            </div>
          </div>
        </div>

        {/* Register Card */}
        <div className="auth-card-panel">
          <div className="auth-glass-card">
            <div className="auth-card-header">
              <div className="auth-gem-badge">
                <Gem size={24} />
              </div>
              <h2 className="auth-title">Create Account</h2>
              <p className="auth-subtitle">Join the Fancy Store family</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <Field
                icon={User}
                label="Full Name"
                name="name"
                placeholder="Your full name"
                error={errors.name}
                value={formData.name}
                onChange={handleChange}
              />
              <Field
                icon={Mail}
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                error={errors.email}
                value={formData.email}
                onChange={handleChange}
              />
              <Field
                icon={Phone}
                label="Mobile Number"
                name="mobile"
                type="tel"
                placeholder="10-digit mobile number"
                error={errors.mobile}
                value={formData.mobile}
                onChange={handleChange}
              />

              <div className="auth-field-group">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                    id="register-password"
                  />
                  <button type="button" className="auth-eye-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="auth-error-msg">{errors.password}</span>}
              </div>

              <div className="auth-field-group">
                <label className="auth-label">Confirm Password</label>
                <div className="auth-input-wrap">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className={`auth-input ${errors.confirmPassword ? 'auth-input-error' : ''}`}
                    id="register-confirm-password"
                  />
                  <button type="button" className="auth-eye-btn" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="auth-error-msg">{errors.confirmPassword}</span>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="auth-submit-btn"
                id="register-submit"
              >
                {isLoading ? (
                  <span className="auth-btn-loading">
                    <span className="auth-spinner" />
                    Creating Account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <RegisterStyles />
    </div>
  );
};

const RegisterStyles = memo(() => (
  <style>{`
        .luxury-auth-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 30%, #2d1a00 60%, #1a0a1a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }
        .auth-bg { position: absolute; inset: 0; pointer-events: none; }
        .auth-bg-overlay {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 800px 600px at 20% 30%, rgba(212,175,55,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse 600px 400px at 80% 70%, rgba(180,30,60,0.06) 0%, transparent 60%);
        }
        .auth-floating-gems { position: absolute; inset: 0; }
        .gem { position: absolute; font-size: 20px; opacity: 0.12; animation: floatGem 6s ease-in-out infinite; }
        .gem-1  { top: 10%; left: 5%; animation-delay: 0s; }
        .gem-2  { top: 25%; left: 12%; animation-delay: 0.8s; }
        .gem-3  { top: 5%; left: 40%; animation-delay: 1.5s; font-size: 14px; }
        .gem-4  { top: 60%; left: 6%; animation-delay: 2s; }
        .gem-5  { top: 80%; left: 20%; animation-delay: 2.5s; font-size: 24px; }
        .gem-6  { top: 12%; right: 8%; animation-delay: 3s; }
        .gem-7  { top: 45%; right: 5%; animation-delay: 3.5s; font-size: 16px; }
        .gem-8  { top: 70%; right: 10%; animation-delay: 4s; }
        .gem-9  { top: 88%; left: 55%; animation-delay: 4.5s; font-size: 18px; }
        .gem-10 { top: 50%; left: 28%; animation-delay: 5s; font-size: 12px; }
        @keyframes floatGem {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.12; }
          50% { transform: translateY(-18px) rotate(180deg); opacity: 0.22; }
        }
        .auth-container {
          display: flex;
          width: 100%;
          max-width: 1100px;
          margin: 20px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.15);
          position: relative;
          z-index: 1;
        }
        .auth-brand-panel {
          flex: 1;
          background: linear-gradient(160deg, #1a0e00 0%, #2d1500 40%, #1a0800 70%, #0d0509 100%);
          padding: 60px 50px;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .auth-brand-panel::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .auth-brand-panel::after {
          content: '';
          position: absolute; top: 0; right: 0;
          width: 2px; height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(212,175,55,0.4), transparent);
        }
        .brand-content { position: relative; z-index: 1; }
        .brand-logo-wrap {
          width: 80px; height: 80px;
          background: linear-gradient(135deg, #d4af37, #f5d470, #d4af37);
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 8px 32px rgba(212,175,55,0.3);
        }
        .brand-gem-icon { color: #1a0800; }
        .brand-title {
          font-size: 42px; font-weight: 800;
          background: linear-gradient(135deg, #d4af37, #f5d470, #d4af37);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          margin: 0 0 8px; letter-spacing: -1px;
        }
        .brand-tagline { color: rgba(245,212,112,0.7); font-size: 16px; margin: 0 0 24px; font-style: italic; }
        .brand-divider { width: 60px; height: 2px; background: linear-gradient(to right, #d4af37, transparent); margin: 20px 0; }
        .brand-desc { color: rgba(255,255,255,0.6); font-size: 15px; line-height: 1.7; margin-bottom: 32px; }
        .brand-features { display: flex; flex-direction: column; gap: 10px; }
        .brand-feature {
          color: rgba(245,212,112,0.8); font-size: 14px;
          padding: 8px 12px;
          background: rgba(212,175,55,0.08); border-radius: 8px;
          border: 1px solid rgba(212,175,55,0.1);
        }
        .auth-card-panel {
          flex: 0 0 440px;
          background: rgba(10,5,20,0.95);
          display: flex; align-items: center; justify-content: center;
          padding: 30px 36px;
          overflow-y: auto;
        }
        .auth-glass-card {
          width: 100%;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 20px;
          padding: 36px;
        }
        .auth-card-header { text-align: center; margin-bottom: 28px; }
        .auth-gem-badge {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #d4af37, #f5d470);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px; color: #1a0800;
          box-shadow: 0 4px 20px rgba(212,175,55,0.35);
        }
        .auth-title { font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 6px; }
        .auth-subtitle { color: rgba(255,255,255,0.45); font-size: 14px; margin: 0; }
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .auth-field-group { display: flex; flex-direction: column; gap: 6px; }
        .auth-label { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.7); }
        .auth-input-wrap { position: relative; display: flex; align-items: center; }
        .auth-input-icon { position: absolute; left: 14px; color: rgba(212,175,55,0.6); pointer-events: none; }
        .auth-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 12px;
          padding: 12px 44px;
          color: #fff; font-size: 14px; outline: none;
          transition: all 0.25s ease;
        }
        .auth-input::placeholder { color: rgba(255,255,255,0.25); }
        .auth-input:focus {
          border-color: rgba(212,175,55,0.6);
          background: rgba(212,175,55,0.05);
          box-shadow: 0 0 0 3px rgba(212,175,55,0.1);
        }
        .auth-input-error { border-color: rgba(239,68,68,0.5) !important; }
        .auth-input-error:focus { border-color: rgba(239,68,68,0.8) !important; box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important; }
        .auth-error-msg { color: #f87171; font-size: 12px; }
        .auth-eye-btn {
          position: absolute; right: 14px;
          background: none; border: none; cursor: pointer;
          color: rgba(212,175,55,0.6); padding: 0; display: flex; transition: color 0.2s;
        }
        .auth-eye-btn:hover { color: #d4af37; }
        .auth-submit-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #d4af37, #f5d470, #d4af37);
          border: none; border-radius: 12px;
          color: #1a0800; font-size: 15px; font-weight: 700;
          cursor: pointer; transition: all 0.3s ease;
          letter-spacing: 0.5px; margin-top: 4px;
        }
        .auth-submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(212,175,55,0.4); }
        .auth-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .auth-btn-loading { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .auth-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(26,8,0,0.3); border-top-color: #1a0800;
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-footer { margin-top: 20px; text-align: center; }
        .auth-footer p { color: rgba(255,255,255,0.5); font-size: 14px; margin: 0; }
        .auth-link { color: #d4af37; text-decoration: none; font-weight: 600; transition: opacity 0.2s; }
        .auth-link:hover { opacity: 0.75; }
        @media (max-width: 768px) {
          .auth-container { flex-direction: column; margin: 0; border-radius: 0; }
          .auth-brand-panel { display: none; }
          .auth-card-panel { flex: 1; padding: 24px 20px; }
          .auth-glass-card { padding: 28px 20px; }
        }
  `}</style>
));

export default Register;
