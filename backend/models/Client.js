const mongoose = require('mongoose');

/**
 * Client Model
 * Represents a subscriber in the stock broker CRM
 * Tracks subscription details, payment info, and status
 */
const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: ''
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'Online'],
    required: [true, 'Payment mode is required']
  },
  amountPaid: {
    type: Number,
    required: [true, 'Amount paid is required'],
    min: [0, 'Amount cannot be negative']
  },
  subscriptionMonths: {
    type: Number,
    required: [true, 'Subscription months is required'],
    min: [1, 'Subscription must be at least 1 month']
  },
  startDate: {
    type: Date,
    required: true
  },
  manualStartDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Expiring Soon'],
    default: 'Active'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastNotificationSent: {
    type: Date,
    default: null
  }
});

// Virtual field for days remaining (calculated dynamically)
clientSchema.virtual('daysRemaining').get(function() {
  const today = new Date();
  const endDate = new Date(this.endDate);
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Ensure virtuals are included in JSON
clientSchema.set('toJSON', { virtuals: true });
clientSchema.set('toObject', { virtuals: true });

// Index for faster queries
clientSchema.index({ status: 1, endDate: 1 });
clientSchema.index({ name: 'text' });

module.exports = mongoose.model('Client', clientSchema);
