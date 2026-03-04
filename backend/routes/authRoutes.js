const express = require('express');
const { registerAdmin, loginAdmin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * Auth Routes
 * Handles admin authentication endpoints
 */

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
