const { auth, db } = require('../config/firebase');

/**
 * Firebase Auth Middleware
 * Verifies Firebase custom tokens and attaches user to request
 */

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    try {
      // Verify the token
      // For custom tokens, we need to verify them differently
      // The client will exchange custom token for ID token
      // Here we verify the ID token
      const decodedToken = await auth.verifyIdToken(token);
      
      // Get user data from Firestore
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();
      
      if (!userDoc.exists) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Attach user to request
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        ...userDoc.data()
      };

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token verification failed'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

module.exports = { protect };
