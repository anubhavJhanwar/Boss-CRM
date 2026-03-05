const express = require('express');
const router = express.Router();
const { signup, login, getMe, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Auth Routes
 * Handles user authentication (signup, login, get current user)
 */

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;
