const express = require('express');
const {
  getDatabaseStats,
  getAllData,
  clearExpiredClients
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Admin Routes
 * Database management endpoints
 */

// Apply authentication middleware to all routes
router.use(protect);

// Database statistics
router.get('/database-stats', getDatabaseStats);

// Export all data
router.get('/all-data', getAllData);

// Cleanup expired clients
router.delete('/clear-expired', clearExpiredClients);

module.exports = router;
