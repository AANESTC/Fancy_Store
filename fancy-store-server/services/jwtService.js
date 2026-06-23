const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const payload = {
    sub: user.UserId.toString(),
    email: user.Email,
    name: user.Name,
    role: user.Role,
    mobile: user.Mobile,
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': user.Role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'FancyStore_SuperSecret_JWT_Key_2024_!@#$%', {
    expiresIn: `${process.env.JWT_EXPIRY_DAYS || 7}d`,
    issuer: process.env.JWT_ISSUER || 'FancyStoreAPI',
    audience: process.env.JWT_AUDIENCE || 'FancyStoreClient',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'FancyStore_SuperSecret_JWT_Key_2024_!@#$%', {
    issuer: process.env.JWT_ISSUER || 'FancyStoreAPI',
    audience: process.env.JWT_AUDIENCE || 'FancyStoreClient',
  });
};

module.exports = { generateToken, verifyToken };
