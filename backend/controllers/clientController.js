const { db } = require('../config/firebase');
const { calculateEndDate, calculateDaysRemaining, determineStatus } = require('../utils/dateCalculations');

/**
 * Firebase Client Controller
 * Handles all client CRUD operations with Firestore
 */

/**
 * @route   GET /api/clients
 * @desc    Get all clients with optional filters (only user's own clients)
 * @access  Private
 */
const getClients = async (req, res) => {
  try {
    const { status, search } = req.query;
    const userId = req.user.uid;

    // Build query
    let query = db.collection('clients').where('userId', '==', userId);

    // Filter by status
    if (status && status !== 'All') {
      query = query.where('status', '==', status);
    }

    // Execute query (removed orderBy to avoid index requirement)
    const snapshot = await query.get();

    let clients = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // Calculate days remaining dynamically
      const daysRemaining = calculateDaysRemaining(new Date(data.endDate));
      clients.push({
        id: doc.id,
        ...data,
        daysRemaining
      });
    });

    // Sort in memory by createdAt (descending)
    clients.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply search filter (Firestore doesn't support text search natively)
    if (search) {
      const searchLower = search.toLowerCase();
      clients = clients.filter(client => 
        client.name.toLowerCase().includes(searchLower)
      );
    }

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
 * @desc    Get single client by ID (only if owned by user)
 * @access  Private
 */
const getClientById = async (req, res) => {
  try {
    const clientDoc = await db.collection('clients').doc(req.params.id).get();

    if (!clientDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    const clientData = clientDoc.data();

    // Check if client belongs to current user
    if (clientData.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this client'
      });
    }

    // Calculate days remaining dynamically
    const daysRemaining = calculateDaysRemaining(new Date(clientData.endDate));

    res.status(200).json({
      success: true,
      data: {
        id: clientDoc.id,
        ...clientData,
        daysRemaining
      }
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
 * @desc    Create new client (assigned to current user)
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

    // Create client data
    const clientData = {
      userId: req.user.uid,
      name,
      phoneNumber: phoneNumber || '',
      paymentMode,
      amountPaid,
      subscriptionMonths,
      startDate: startDate.toISOString(),
      manualStartDate: manualStartDate || null,
      endDate: endDate.toISOString(),
      status,
      notes: notes || '',
      createdAt: new Date().toISOString(),
      lastNotificationSent: null,
      lastReminderSent: null
    };

    // Add to Firestore
    const docRef = await db.collection('clients').add(clientData);

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: {
        id: docRef.id,
        ...clientData,
        daysRemaining
      }
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
 * @desc    Update client (only if owned by user)
 * @access  Private
 */
const updateClient = async (req, res) => {
  try {
    const clientRef = db.collection('clients').doc(req.params.id);
    const clientDoc = await clientRef.get();

    if (!clientDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    const clientData = clientDoc.data();

    // Check if client belongs to current user
    if (clientData.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this client'
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

    // Prepare update data
    const updateData = {
      name: name || clientData.name,
      phoneNumber: phoneNumber !== undefined ? phoneNumber : clientData.phoneNumber,
      paymentMode: paymentMode || clientData.paymentMode,
      amountPaid: amountPaid !== undefined ? amountPaid : clientData.amountPaid,
      notes: notes !== undefined ? notes : clientData.notes
    };

    // Recalculate dates if subscription months or start date changed
    if (subscriptionMonths || manualStartDate) {
      const months = subscriptionMonths || clientData.subscriptionMonths;
      const startDate = manualStartDate ? new Date(manualStartDate) : new Date(clientData.startDate);

      updateData.subscriptionMonths = months;
      updateData.startDate = startDate.toISOString();
      updateData.manualStartDate = manualStartDate || clientData.manualStartDate;
      updateData.endDate = calculateEndDate(startDate, months).toISOString();

      // Recalculate status
      const daysRemaining = calculateDaysRemaining(new Date(updateData.endDate));
      updateData.status = determineStatus(daysRemaining);
    }

    // Update in Firestore
    await clientRef.update(updateData);

    // Get updated document
    const updatedDoc = await clientRef.get();
    const updatedData = updatedDoc.data();
    const daysRemaining = calculateDaysRemaining(new Date(updatedData.endDate));

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: {
        id: clientDoc.id,
        ...updatedData,
        daysRemaining
      }
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
 * @desc    Delete client (only if owned by user)
 * @access  Private
 */
const deleteClient = async (req, res) => {
  try {
    const clientRef = db.collection('clients').doc(req.params.id);
    const clientDoc = await clientRef.get();

    if (!clientDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    const clientData = clientDoc.data();

    // Check if client belongs to current user
    if (clientData.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this client'
      });
    }

    await clientRef.delete();

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
 * @desc    Get dashboard statistics (only for user's clients)
 * @access  Private
 */
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.uid;

    // Get all user's clients
    const snapshot = await db.collection('clients')
      .where('userId', '==', userId)
      .get();

    let activeClients = 0;
    let expiredClients = 0;
    let revenueThisMonth = 0;
    let expiringClients = 0;

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);

    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Count by status
      if (data.status === 'Active') activeClients++;
      if (data.status === 'Expired') expiredClients++;

      // Revenue this month
      const createdAt = new Date(data.createdAt);
      if (createdAt >= startOfMonth) {
        revenueThisMonth += data.amountPaid;
      }

      // Expiring in next 7 days
      const endDate = new Date(data.endDate);
      if (endDate >= today && endDate <= next7Days && data.status !== 'Expired') {
        expiringClients++;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        activeClients,
        expiredClients,
        revenueThisMonth,
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

/**
 * @route   GET /api/clients/expiring-soon
 * @desc    Get clients expiring within next 7 days
 * @access  Private
 */
const getExpiringSoon = async (req, res) => {
  try {
    const userId = req.user.uid;

    // Get all user's clients
    const snapshot = await db.collection('clients')
      .where('userId', '==', userId)
      .where('status', '!=', 'Expired')
      .get();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);
    sevenDaysLater.setHours(23, 59, 59, 999);

    const expiringClients = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      const endDate = new Date(data.endDate);
      
      // Check if expiry date is within next 7 days
      if (endDate >= today && endDate <= sevenDaysLater) {
        const daysLeft = calculateDaysRemaining(endDate);
        expiringClients.push({
          id: doc.id,
          clientName: data.name,
          phoneNumber: data.phoneNumber,
          expiryDate: data.endDate,
          daysLeft: daysLeft,
          amountPaid: data.amountPaid,
          status: data.status
        });
      }
    });

    // Sort by days left (ascending)
    expiringClients.sort((a, b) => a.daysLeft - b.daysLeft);

    res.status(200).json({
      success: true,
      count: expiringClients.length,
      data: expiringClients
    });
  } catch (error) {
    console.error('Get expiring soon error:', error);
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
  getDashboardStats,
  getExpiringSoon
};
