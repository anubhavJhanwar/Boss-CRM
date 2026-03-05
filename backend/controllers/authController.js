const { auth, db } = require('../config/firebase');
const bcrypt = require('bcryptjs');
const sendSignupMail = require('../services/sendSignupMail');

/**
 * Firebase Auth Controller
 * Handles user authentication with Firebase Auth and Firestore
 */

/**
 * @route   POST /api/auth/signup
 * @desc    Register new user
 * @access  Public
 */
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Store plain password for email (before hashing)
    const plainPassword = password;

    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email: email.toLowerCase(),
      password: password,
      displayName: name
    });

    console.log('✅ Firebase Auth user created:', userRecord.uid);

    // Hash password for Firestore storage
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store user details in Firestore
    const userData = {
      uid: userRecord.uid,
      name: name,
      email: email.toLowerCase(),
      password: hashedPassword, // Store hashed password
      createdAt: new Date().toISOString()
    };

    await db.collection('users').doc(userRecord.uid).set(userData);
    console.log('✅ User data stored in Firestore');

    // Send signup email with credentials
    try {
      await sendSignupMail(name, email, plainPassword);
      console.log('✅ Signup email sent to:', email);
    } catch (emailError) {
      console.error('⚠️  Email sending failed but user created:', emailError.message);
    }

    // Generate custom token for authentication
    const customToken = await auth.createCustomToken(userRecord.uid);

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Credentials sent to your email.',
      token: customToken,
      user: {
        id: userRecord.uid,
        name: name,
        email: email.toLowerCase(),
        createdAt: userData.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    
    // Handle Firebase-specific errors
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating account',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt for:', email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Get user from Firebase Auth
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email.toLowerCase());
    } catch (error) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('✅ User found in Firebase Auth:', userRecord.uid);

    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    
    if (!userDoc.exists) {
      console.log('❌ User data not found in Firestore');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const userData = userDoc.data();

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    console.log('🔑 Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate custom token
    const customToken = await auth.createCustomToken(userRecord.uid);

    console.log('✅ Login successful for:', email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: customToken,
      user: {
        id: userRecord.uid,
        name: userData.name,
        email: userData.email,
        createdAt: userData.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();
    
    res.status(200).json({
      success: true,
      user: {
        id: userData.uid,
        name: userData.name,
        email: userData.email,
        createdAt: userData.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/auth/delete-account
 * @desc    Delete user account permanently
 * @access  Private
 */
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.uid;

    console.log('🗑️  Delete account request for:', userId);

    // Delete all user's clients from Firestore
    const clientsSnapshot = await db.collection('clients')
      .where('userId', '==', userId)
      .get();

    const batch = db.batch();
    clientsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`✅ Deleted ${clientsSnapshot.size} clients`);

    // Delete user data from Firestore
    await db.collection('users').doc(userId).delete();
    console.log('✅ User data deleted from Firestore');

    // Delete user from Firebase Authentication
    await auth.deleteUser(userId);
    console.log('✅ User deleted from Firebase Auth');

    res.status(200).json({
      success: true,
      message: 'Account deleted permanently'
    });
  } catch (error) {
    console.error('❌ Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: error.message
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  deleteAccount
};
