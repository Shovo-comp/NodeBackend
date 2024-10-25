const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract the token from the header

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access: No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded; // Attach user data to the request
    next();
  });
};

const isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access forbidden: Superadmin only' });
  }
  next();
};

module.exports = { verifyToken, isSuperAdmin };
