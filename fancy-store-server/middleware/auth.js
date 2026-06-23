const { verifyToken } = require('../services/jwtService');

// Middleware: verify JWT and attach user to request
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware: require Admin role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

// Helper: get userId from JWT claims
const getUserId = (req) => parseInt(req.user.sub);

module.exports = { authenticate, requireAdmin, getUserId };
