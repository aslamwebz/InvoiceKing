/**
 * Calculate the subtotal of all items in the invoice
 * @param {Array} items - Array of item objects with price and quantity properties
 * @returns {number} - The subtotal of all items
 */
export const calculateSubTotal = (items = []) => {
  return items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return sum + (price * quantity);
  }, 0);
};

/**
 * Calculate the tax amount based on the subtotal and tax rate
 * @param {number} subtotal - The subtotal amount
 * @param {number} taxRate - The tax rate as a percentage (e.g., 10 for 10%)
 * @returns {number} - The calculated tax amount
 */
export const calculateTaxAmount = (subtotal, taxRate = 0) => {
  if (!taxRate) return 0;
  return (subtotal * (parseFloat(taxRate) / 100)) || 0;
};

/**
 * Calculate the grand total (subtotal + tax)
 * @param {number} subtotal - The subtotal amount
 * @param {number} taxAmount - The tax amount
 * @returns {number} - The grand total
 */
export const calculateGrandTotal = (subtotal, taxAmount = 0) => {
  return (parseFloat(subtotal) || 0) + (parseFloat(taxAmount) || 0);
};

export default {
  calculateSubTotal,
  calculateTaxAmount,
  calculateGrandTotal
};
