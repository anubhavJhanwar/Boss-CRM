const { db } = require('../config/firebase');

/**
 * Admin Controller (Firebase)
 * Database management and statistics
 */

/**
 * @route   GET /api/admin/database-stats
 * @desc    Get database statistics
 * @access  Private
 */
const getDatabaseStats = async (req, res) => {
  try {
    // Get collection counts
    const clientsSnapshot = await db.collection('clients').count().get();
    const usersSnapshot = await db.collection('users').count().get();
    
    const clientCount = clientsSnapshot.data().count;
    const userCount = usersSnapshot.data().count;

    // Get all clients for status breakdown
    const allClientsSnapshot = await db.collection('clients').get();
    
    let activeClients = 0;
    let expiredClients = 0;
    let expiringClients = 0;
    let totalRevenue = 0;

    allClientsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === 'Active') activeClients++;
      if (data.status === 'Expired') expiredClients++;
      if (data.status === 'Expiring Soon') expiringClients++;
      totalRevenue += data.amountPaid || 0;
    });

    res.status(200).json({
      success: true,
      data: {
        database: {
          name: 'Firebase Firestore',
          type: 'Cloud NoSQL',
          collections: 2
        },
        collections: {
          clients: clientCount,
          users: userCount
        },
        clientStats: {
          active: activeClients,
          expired: expiredClients,
          expiringSoon: expiringClients,
          total: clientCount
        },
        revenue: {
          total: totalRevenue
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
    const clientsSnapshot = await db.collection('clients').get();
    const usersSnapshot = await db.collection('users').get();

    const clients = [];
    clientsSnapshot.forEach(doc => {
      clients.push({ id: doc.id, ...doc.data() });
    });

    const users = [];
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      delete data.password; // Don't export passwords
      users.push({ id: doc.id, ...data });
    });

    res.status(200).json({
      success: true,
      data: {
        clients,
        users,
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
    const snapshot = await db.collection('clients')
      .where('status', '==', 'Expired')
      .get();

    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.status(200).json({
      success: true,
      message: `Deleted ${snapshot.size} expired clients`,
      deletedCount: snapshot.size
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
