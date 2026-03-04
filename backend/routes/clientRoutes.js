const express = require('express');
const {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getDashboardStats
} = require('../controllers/clientController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * Client Routes
 * All routes are protected (require authentication)
 */

// Apply authentication middleware to all routes
router.use(protect);

// Dashboard stats
router.get('/stats/dashboard', getDashboardStats);

// CRUD operations
router.route('/')
  .get(getClients)
  .post(createClient);

router.route('/:id')
  .get(getClientById)
  .put(updateClient)
  .delete(deleteClient);

module.exports = router;
