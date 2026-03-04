const Client = require('../models/Client');
const { calculateEndDate, calculateDaysRemaining, determineStatus } = require('../utils/dateCalculations');

/**
 * Client Controller
 * Handles all client CRUD operations and business logic
 */

/**
 * @route   GET /api/clients
 * @desc    Get all clients with optional filters
 * @access  Private
 */
const getClients = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const clients = await Client.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

/**
 * @route   GET /api/clients/:id
 * @desc    Get single client by ID
 * @access  Private
 */
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

/**
 * @route   POST /api/clients
 * @desc    Create new client
 * @access  Private
 */
const createClient = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      paymentMode,
      amountPaid,
      subscriptionMonths,
      manualStartDate,
      notes
    } = req.body;

    // Determine start date (manual override or current date)
    const startDate = manualStartDate ? new Date(manualStartDate) : new Date();

    // Calculate end date
    const endDate = calculateEndDate(startDate, subscriptionMonths);

    // Calculate days remaining and status
    const daysRemaining = calculateDaysRemaining(endDate);
    const status = determineStatus(daysRemaining);

    // Create client
    const client = await Client.create({
      name,
      phoneNumber,
      paymentMode,
      amountPaid,
      subscriptionMonths,
      startDate,
      manualStartDate: manualStartDate || null,
      endDate,
      status,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client
    });
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

/**
 * @route   PUT /api/clients/:id
 * @desc    Update client
 * @access  Private
 */
const updateClient = async (req, res) => {
  try {
    let client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    const {
      name,
      phoneNumber,
      paymentMode,
      amountPaid,
      subscriptionMonths,
      manualStartDate,
      notes
    } = req.body;

    // Update basic fields
    client.name = name || client.name;
    client.phoneNumber = phoneNumber !== undefined ? phoneNumber : client.phoneNumber;
    client.paymentMode = paymentMode || client.paymentMode;
    client.amountPaid = amountPaid !== undefined ? amountPaid : client.amountPaid;
    client.notes = notes !== undefined ? notes : client.notes;

    // Recalculate dates if subscription months or start date changed
    if (subscriptionMonths || manualStartDate) {
      const months = subscriptionMonths || client.subscriptionMonths;
      const startDate = manualStartDate ? new Date(manualStartDate) : client.startDate;

      client.subscriptionMonths = months;
      client.startDate = startDate;
      client.manualStartDate = manualStartDate || client.manualStartDate;
      client.endDate = calculateEndDate(startDate, months);

      // Recalculate status
      const daysRemaining = calculateDaysRemaining(client.endDate);
      client.status = determineStatus(daysRemaining);
    }

    await client.save();

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: client
    });
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

/**
 * @route   DELETE /api/clients/:id
 * @desc    Delete client
 * @access  Private
 */
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    await client.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

/**
 * @route   GET /api/clients/stats/dashboard
 * @desc    Get dashboard statistics
 * @access  Private
 */
const getDashboardStats = async (req, res) => {
  try {
    // Total active clients
    const activeClients = await Client.countDocuments({ status: 'Active' });

    // Total expired clients
    const expiredClients = await Client.countDocuments({ status: 'Expired' });

    // Revenue this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const revenueThisMonth = await Client.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amountPaid' }
        }
      }
    ]);

    // Clients expiring in next 7 days
    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);

    const expiringClients = await Client.countDocuments({
      endDate: { $gte: today, $lte: next7Days },
      status: { $ne: 'Expired' }
    });

    res.status(200).json({
      success: true,
      data: {
        activeClients,
        expiredClients,
        revenueThisMonth: revenueThisMonth.length > 0 ? revenueThisMonth[0].total : 0,
        expiringClients
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getDashboardStats
};
