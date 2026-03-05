const express = require('express');
const {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getDashboardStats,
  getExpiringSoon
} = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Client Routes
 * All routes are protected (require authentication)
 */

// Apply authentication middleware to all routes
router.use(protect);

// Dashboard stats
router.get('/stats/dashboard', getDashboardStats);

// Expiring soon clients
router.get('/expiring-soon', getExpiringSoon);

// CRUD operations
router.route('/')
  .get(getClients)
  .post(createClient);

router.route('/:id')
  .get(getClientById)
  .put(updateClient)
  .delete(deleteClient);

module.exports = router;
