const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Model
 * Represents an admin user in the Boss Tracker system
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('🔍 Comparing passwords...');
  console.log('Candidate password:', candidatePassword);
  console.log('Stored hash (first 20 chars):', this.password.substring(0, 20));
  const result = await bcrypt.compare(candidatePassword, this.password);
  console.log('Comparison result:', result);
  return result;
};

module.exports = mongoose.model('User', userSchema);
