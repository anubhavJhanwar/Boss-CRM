const Client = require('../models/Client');
const Admin = require('../models/Admin');
const mongoose = require('mongoose');

/**
 * Admin Controller
 * Database management and statistics
 */

/**
 * @route   GET /api/admin/database-stats
 * @desc    Get database statistics
 * @access  Private
 */
const getDatabaseStats = async (req, res) => {
  try {
    // Get collection stats
    const clientCount = await Client.countDocuments();
    const adminCount = await Admin.countDocuments();

    // Get database size info
    const db = mongoose.connection.db;
    const stats = await db.stats();

    // Get clients by status
    const activeClients = await Client.countDocuments({ status: 'Active' });
    const expiredClients = await Client.countDocuments({ status: 'Expired' });
    const expiringClients = await Client.countDocuments({ status: 'Expiring Soon' });

    // Calculate total revenue
    const totalRevenue = await Client.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amountPaid' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        database: {
          name: db.databaseName,
          sizeOnDisk: `${(stats.dataSize / (1024 * 1024)).toFixed(2)} MB`,
          collections: stats.collections,
          indexes: stats.indexes
        },
        collections: {
          clients: clientCount,
          admins: adminCount
        },
        clientStats: {
          active: activeClients,
          expired: expiredClients,
          expiringSoon: expiringClients,
          total: clientCount
        },
        revenue: {
          total: totalRevenue.length > 0 ? totalRevenue[0].total : 0
        }
      }
    });
  } catch (error) {
    console.error('Database stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

/**
 * @route   GET /api/admin/all-data
 * @desc    Get all database data (for backup/export)
 * @access  Private
 */
const getAllData = async (req, res) => {
  try {
    const clients = await Client.find({}).sort({ createdAt: -1 });
    const admins = await Admin.find({}).select('-password');

    res.status(200).json({
      success: true,
      data: {
        clients,
        admins,
        exportDate: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get all data error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

/**
 * @route   DELETE /api/admin/clear-expired
 * @desc    Delete all expired clients (cleanup)
 * @access  Private
 */
const clearExpiredClients = async (req, res) => {
  try {
    const result = await Client.deleteMany({ status: 'Expired' });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} expired clients`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Clear expired error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  getDatabaseStats,
  getAllData,
  clearExpiredClients
};
