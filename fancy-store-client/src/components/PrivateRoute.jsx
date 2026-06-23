import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

// Protects routes requiring authentication and an optional specific role
export const PrivateRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Customer trying to access admin — redirect to their home
    return <Navigate to="/" replace />;
  }

  return children;
};

// Redirects already-authenticated users away from login/register
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    if (user?.role === 'Admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
