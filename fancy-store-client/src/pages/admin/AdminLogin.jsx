import { useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, ChevronRight } from 'lucide-react';
import { loginUser } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(resultAction)) {
        const user = resultAction.payload;
        if (user.role !== 'Admin') {
          toast.error('Access denied. Admin credentials required.');
          return;
        }
        toast.success('Welcome, Admin!');
        navigate('/admin');
      } else {
        toast.error(resultAction.payload || 'Invalid admin credentials');
      }
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg">
        <div className="admin-bg-grid" />
        <div className="admin-bg-glow admin-glow-1" />
        <div className="admin-bg-glow admin-glow-2" />
        <div className="admin-bg-glow admin-glow-3" />
      </div>

      <div className="admin-login-card">
        {/* Header Strip */}
        <div className="admin-card-header">
          <div className="admin-shield-icon">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="admin-card-title">Admin Portal</h1>
            <p className="admin-card-brand">Fancy Store Management</p>
          </div>
        </div>

        {/* Warning Badge */}
        <div className="admin-warning-badge">
          <span className="admin-warning-dot" />
          <span>Restricted Area — Authorized Personnel Only</span>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {/* Email */}
          <div className="admin-field-group">
            <label className="admin-label">Admin Email</label>
            <div className="admin-input-wrap">
              <Mail size={18} className="admin-input-icon" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="admin-input"
                id="admin-email"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="admin-field-group">
            <label className="admin-label">Admin Password</label>
            <div className="admin-input-wrap">
              <Lock size={18} className="admin-input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="admin-input"
                id="admin-password"
                autoComplete="current-password"
              />
              <button type="button" className="admin-eye-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="admin-submit-btn"
            id="admin-login-submit"
          >
            {isLoading ? (
              <span className="admin-btn-loading">
                <span className="admin-spinner" />
                Authenticating...
              </span>
            ) : (
              <span className="admin-btn-content">
                Access Admin Portal
                <ChevronRight size={18} />
              </span>
            )}
          </button>
        </form>

        <div className="admin-footer">
          <Link to="/login" className="admin-customer-link">
            ← Customer Login
          </Link>
          <p className="admin-help-text">Need help? Contact system administrator</p>
        </div>
      </div>

      <AdminLoginStyles />
    </div>
  );
};

const AdminLoginStyles = memo(() => (
  <style>{`
        .admin-login-page {
          min-height: 100vh;
          background: #06070d;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          padding: 20px;
        }

        .admin-login-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .admin-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridScroll 20s linear infinite;
        }

        @keyframes gridScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }

        .admin-bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
          animation: glowPulse 4s ease-in-out infinite;
        }

        .admin-glow-1 {
          width: 600px; height: 600px;
          background: #6366f1;
          top: -200px; left: -200px;
          animation-delay: 0s;
        }

        .admin-glow-2 {
          width: 400px; height: 400px;
          background: #8b5cf6;
          bottom: -100px; right: -100px;
          animation-delay: 2s;
        }

        .admin-glow-3 {
          width: 300px; height: 300px;
          background: #06b6d4;
          bottom: 30%; left: 10%;
          opacity: 0.08;
          animation-delay: 1s;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.12; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }

        .admin-login-card {
          width: 100%;
          max-width: 440px;
          background: rgba(15,17,30,0.9);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 20px;
          padding: 40px 36px;
          position: relative;
          z-index: 1;
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.08),
            0 30px 60px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .admin-login-card::before {
          content: '';
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(99,102,241,0.5), transparent);
        }

        .admin-card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .admin-shield-icon {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 4px 20px rgba(99,102,241,0.4);
        }

        .admin-card-title {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 2px;
        }

        .admin-card-brand {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          margin: 0;
        }

        .admin-warning-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 12px;
          color: rgba(252,165,165,0.8);
          margin-bottom: 28px;
          font-weight: 500;
        }

        .admin-warning-dot {
          width: 7px; height: 7px;
          background: #ef4444;
          border-radius: 50%;
          flex-shrink: 0;
          animation: blinkDot 1.5s ease-in-out infinite;
        }

        @keyframes blinkDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .admin-form { display: flex; flex-direction: column; gap: 20px; }

        .admin-field-group { display: flex; flex-direction: column; gap: 8px; }

        .admin-label {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.3px;
        }

        .admin-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .admin-input-icon {
          position: absolute;
          left: 14px;
          color: rgba(99,102,241,0.7);
          pointer-events: none;
        }

        .admin-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 12px;
          padding: 13px 44px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: all 0.25s ease;
        }

        .admin-input::placeholder { color: rgba(255,255,255,0.2); }

        .admin-input:focus {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.05);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        .admin-eye-btn {
          position: absolute; right: 14px;
          background: none; border: none; cursor: pointer;
          color: rgba(99,102,241,0.6); padding: 0; display: flex; transition: color 0.2s;
        }

        .admin-eye-btn:hover { color: #6366f1; }

        .admin-submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.3px;
          margin-top: 4px;
        }

        .admin-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.4);
          background: linear-gradient(135deg, #818cf8, #a78bfa);
        }

        .admin-submit-btn:active:not(:disabled) { transform: translateY(0); }

        .admin-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .admin-btn-loading,
        .admin-btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .admin-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .admin-footer {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .admin-customer-link {
          font-size: 14px;
          color: rgba(99,102,241,0.8);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .admin-customer-link:hover { color: #818cf8; }

        .admin-help-text {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          margin: 0;
        }
  `}</style>
));

export default AdminLogin;
