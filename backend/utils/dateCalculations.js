/**
 * Date Calculation Utilities
 * Business logic for subscription date calculations
 */

/**
 * Calculate end date based on start date and subscription months
 * @param {Date} startDate - Subscription start date
 * @param {number} months - Number of subscription months
 * @returns {Date} End date
 */
const calculateEndDate = (startDate, months) => {
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + months);
  return endDate;
};

/**
 * Calculate days remaining until end date
 * @param {Date} endDate - Subscription end date
 * @returns {number} Days remaining (negative if expired)
 */
const calculateDaysRemaining = (endDate) => {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Determine subscription status based on days remaining
 * @param {number} daysRemaining - Days until expiry
 * @returns {string} Status: 'Active', 'Expiring Soon', or 'Expired'
 */
const determineStatus = (daysRemaining) => {
  if (daysRemaining <= 0) {
    return 'Expired';
  } else if (daysRemaining <= 5) {
    return 'Expiring Soon';
  } else {
    return 'Active';
  }
};

module.exports = {
  calculateEndDate,
  calculateDaysRemaining,
  determineStatus
};
