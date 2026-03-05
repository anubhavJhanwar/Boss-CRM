const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 * Protects routes from unauthorized access
 */
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      console.log('🔐 Token received:', token.substring(0, 20) + '...');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token verified for user ID:', decoded.id);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');
      req.admin = req.user; // For backward compatibility with existing code

      if (!req.user) {
        console.log('❌ User not found for ID:', decoded.id);
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      console.log('✅ User authenticated:', req.user.email);
      next();
    } catch (error) {
      console.error('❌ Auth middleware error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  } else {
    console.log('❌ No token provided in request');
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

module.exports = { protect };
