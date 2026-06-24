import { useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Gem } from 'lucide-react';
import { loginUser } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser({ email: formData.email, password: formData.password }));
      if (loginUser.fulfilled.match(resultAction)) {
        const user = resultAction.payload;
        if (user.role === 'Admin') {
          toast.success(`Welcome, Admin!`);
          navigate('/admin');
        } else {
          toast.success(`Welcome back, ${user.name}!`);
          navigate('/');
        }
      } else {
        toast.error(resultAction.payload || 'Login failed');
      }
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="luxury-auth-page">
      {/* Background */}
      <div className="auth-bg">
        <div className="auth-bg-overlay" />
        <div className="auth-floating-gems">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`gem gem-${i + 1}`}>💎</div>
          ))}
        </div>
      </div>

      <div className="auth-container">
        {/* Left Branding Panel */}
        <div className="auth-brand-panel">
          <div className="brand-content">
            <div className="brand-logo-wrap">
              <Gem size={48} className="brand-gem-icon" />
            </div>
            <h1 className="brand-title">Fancy Store</h1>
            <p className="brand-tagline">Where Elegance Meets Luxury</p>
            <div className="brand-divider" />
            <p className="brand-desc">
              Discover our exquisite collection of bangles, chains, hair clips, and fashion accessories crafted for the modern woman.
            </p>
            <div className="brand-features">
              <div className="brand-feature">✨ Premium Jewelry Collections</div>
              <div className="brand-feature">💍 Bangles & Dollar Chains</div>
              <div className="brand-feature">🌸 Hair Accessories & Gifts</div>
            </div>
          </div>
        </div>

        {/* Right Login Card */}
        <div className="auth-card-panel">
          <div className="auth-glass-card">
            <div className="auth-card-header">
              <div className="auth-gem-badge">
                <Gem size={24} />
              </div>
              <h2 className="auth-title">Welcome Back</h2>
              <p className="auth-subtitle">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email */}
              <div className="auth-field-group">
                <label className="auth-label">Email Address</label>
                <div className="auth-input-wrap">
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="auth-input"
                    id="login-email"
                  />
                </div>
              </div>

              {/* Password */}
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
                    placeholder="••••••••"
                    className="auth-input"
                    id="login-password"
                  />
                  <button type="button" className="auth-eye-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="auth-options-row">
                <label className="auth-remember">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    id="remember-me"
                    className="auth-checkbox"
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="auth-forgot-link">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="auth-submit-btn"
                id="login-submit"
              >
                {isLoading ? (
                  <span className="auth-btn-loading">
                    <span className="auth-spinner" />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">Create one now</Link>
              </p>
              <div className="auth-divider-line">
                <span>or</span>
              </div>
              <Link to="/admin/login" className="auth-admin-link">
                🔐 Admin Portal Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <LoginStyles />
    </div>
  );
};

const LoginStyles = memo(() => (
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

        .auth-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .auth-bg-overlay {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 800px 600px at 20% 30%, rgba(212,175,55,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 600px 400px at 80% 70%, rgba(180,30,60,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 400px 300px at 50% 10%, rgba(255,215,0,0.05) 0%, transparent 50%);
        }

        .auth-floating-gems {
          position: absolute;
          inset: 0;
        }

        .gem {
          position: absolute;
          font-size: 24px;
          opacity: 0.15;
          animation: floatGem 6s ease-in-out infinite;
        }

        .gem-1  { top: 10%; left: 5%;  animation-delay: 0s;    font-size: 16px; }
        .gem-2  { top: 20%; left: 15%; animation-delay: 0.5s;  font-size: 24px; }
        .gem-3  { top: 5%;  left: 40%; animation-delay: 1s;    font-size: 12px; }
        .gem-4  { top: 35%; left: 3%;  animation-delay: 1.5s;  font-size: 20px; }
        .gem-5  { top: 70%; left: 8%;  animation-delay: 2s;    font-size: 16px; }
        .gem-6  { top: 85%; left: 20%; animation-delay: 2.5s;  font-size: 28px; }
        .gem-7  { top: 15%; right: 8%; animation-delay: 3s;    font-size: 20px; }
        .gem-8  { top: 40%; right: 5%; animation-delay: 3.5s;  font-size: 14px; }
        .gem-9  { top: 60%; right: 12%;animation-delay: 4s;    font-size: 22px; }
        .gem-10 { top: 80%; right: 6%; animation-delay: 4.5s;  font-size: 18px; }
        .gem-11 { top: 90%; left: 50%; animation-delay: 5s;    font-size: 16px; }
        .gem-12 { top: 55%; left: 30%; animation-delay: 5.5s;  font-size: 12px; }

        @keyframes floatGem {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.15; }
          50%       { transform: translateY(-20px) rotate(180deg); opacity: 0.25; }
        }

        .auth-container {
          display: flex;
          width: 100%;
          max-width: 1100px;
          min-height: 600px;
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
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .auth-brand-panel::after {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 2px; height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(212,175,55,0.4), transparent);
        }

        .brand-content { position: relative; z-index: 1; }

        .brand-logo-wrap {
          width: 80px; height: 80px;
          background: linear-gradient(135deg, #d4af37, #f5d470, #d4af37);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 8px 32px rgba(212,175,55,0.3);
        }

        .brand-gem-icon { color: #1a0800; }

        .brand-title {
          font-size: 42px;
          font-weight: 800;
          background: linear-gradient(135deg, #d4af37, #f5d470, #d4af37);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 8px;
          letter-spacing: -1px;
        }

        .brand-tagline {
          color: rgba(245,212,112,0.7);
          font-size: 16px;
          margin: 0 0 24px;
          font-style: italic;
        }

        .brand-divider {
          width: 60px;
          height: 2px;
          background: linear-gradient(to right, #d4af37, transparent);
          margin: 20px 0;
        }

        .brand-desc {
          color: rgba(255,255,255,0.6);
          font-size: 15px;
          line-height: 1.7;
          margin-bottom: 32px;
        }

        .brand-features { display: flex; flex-direction: column; gap: 12px; }

        .brand-feature {
          color: rgba(245,212,112,0.8);
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(212,175,55,0.08);
          border-radius: 8px;
          border: 1px solid rgba(212,175,55,0.1);
        }

        .auth-card-panel {
          flex: 0 0 420px;
          background: rgba(10,5,20,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          position: relative;
        }

        .auth-glass-card {
          width: 100%;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 20px;
          padding: 40px 36px;
        }

        .auth-card-header { text-align: center; margin-bottom: 32px; }

        .auth-gem-badge {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #d4af37, #f5d470);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #1a0800;
          box-shadow: 0 4px 20px rgba(212,175,55,0.35);
        }

        .auth-title {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 6px;
        }

        .auth-subtitle {
          color: rgba(255,255,255,0.45);
          font-size: 14px;
          margin: 0;
        }

        .auth-form { display: flex; flex-direction: column; gap: 20px; }

        .auth-field-group { display: flex; flex-direction: column; gap: 8px; }

        .auth-label {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
        }

        .auth-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .auth-input-icon {
          position: absolute;
          left: 14px;
          color: rgba(212,175,55,0.6);
          pointer-events: none;
        }

        .auth-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 12px;
          padding: 13px 44px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: all 0.25s ease;
        }

        .auth-input::placeholder { color: rgba(255,255,255,0.25); }

        .auth-input:focus {
          border-color: rgba(212,175,55,0.6);
          background: rgba(212,175,55,0.05);
          box-shadow: 0 0 0 3px rgba(212,175,55,0.1);
        }

        .auth-eye-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(212,175,55,0.6);
          padding: 0;
          display: flex;
          transition: color 0.2s;
        }

        .auth-eye-btn:hover { color: #d4af37; }

        .auth-options-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: -4px;
        }

        .auth-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          cursor: pointer;
        }

        .auth-checkbox {
          width: 16px; height: 16px;
          accent-color: #d4af37;
          cursor: pointer;
        }

        .auth-forgot-link {
          font-size: 13px;
          color: #d4af37;
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.2s;
        }

        .auth-forgot-link:hover { opacity: 0.75; }

        .auth-submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #d4af37, #f5d470, #d4af37);
          background-size: 200% 200%;
          border: none;
          border-radius: 12px;
          color: #1a0800;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
          margin-top: 4px;
        }

        .auth-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(212,175,55,0.4);
          background-position: right;
        }

        .auth-submit-btn:active:not(:disabled) { transform: translateY(0); }

        .auth-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .auth-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(26,8,0,0.3);
          border-top-color: #1a0800;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-footer {
          margin-top: 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .auth-footer p {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          margin: 0;
        }

        .auth-link {
          color: #d4af37;
          text-decoration: none;
          font-weight: 600;
          transition: opacity 0.2s;
        }

        .auth-link:hover { opacity: 0.75; }

        .auth-divider-line {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,0.2);
          font-size: 12px;
        }

        .auth-divider-line::before,
        .auth-divider-line::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.1);
        }

        .auth-admin-link {
          display: inline-block;
          padding: 10px 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.25s ease;
        }

        .auth-admin-link:hover {
          background: rgba(212,175,55,0.08);
          border-color: rgba(212,175,55,0.25);
          color: #d4af37;
        }

        @media (max-width: 768px) {
          .auth-container { flex-direction: column; margin: 0; border-radius: 0; min-height: 100vh; }
          .auth-brand-panel { display: none; }
          .auth-card-panel { flex: 1; padding: 30px 20px; }
          .auth-glass-card { padding: 30px 24px; }
        }
  `}</style>
));

export default Login;
