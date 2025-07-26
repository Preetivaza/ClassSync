// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
// import User from '../models/User.js'; 
// // Adjust path if needed
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer Token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]; // Split "Bearer <token>" and get token part

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is in .env

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };
