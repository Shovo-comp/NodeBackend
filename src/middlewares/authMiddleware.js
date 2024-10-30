const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.error("No token provided");
    return res.status(401).json({ message: 'Unauthorized access: No token provided' });
  }

  console.log("Received token:", token);  // Log to ensure token is received correctly

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err.message);
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};


const isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access forbidden: Superadmin only' });
  }
  next();
};

// Middleware to authorize based on roles
const authorizeRoles = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Retrieve the token
      const authHeader = req.header('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or improperly formatted' });
      }
      const token = authHeader.replace('Bearer ', '');

      // Decode and verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // Find the user based on the decoded user ID
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Check if user has an allowed role
      // if (!allowedRoles.includes(user.role)) {
      //   return res.status(403).json({ message: 'Access denied' });
      // }

      // Attach user to request and proceed
      req.user = user;
      next();
    } catch (error) {
      console.error('Authorization error:', error);  // Log error for debugging
      res.status(401).json({ message: 'Unauthorized access' });
    }
  };
};




const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(' ')[1];
  console.log(token);

  if (!token) {
      return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error(err.message);
        return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = decoded; // Set req.user if token is valid
    console.log('Decoded user: ', decoded)
    next(); // Proceed only if verification succeeds
  });


};


// User Authenticate


function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing or invalid" });

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Add user data from token to request
      next();
  } catch (error) {
      console.error("JWT error:", error);
      res.status(403).json({ error: "Invalid token" });
  }
}








module.exports = { verifyToken, isSuperAdmin, authMiddleware, authenticate, authorizeRoles };
