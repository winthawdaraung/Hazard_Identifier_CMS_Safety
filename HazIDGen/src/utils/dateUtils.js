// Date utility functions

/**
 * Format a date to DD/MM/YYYY format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDateToDDMMYYYY(date) {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Convert DD/MM/YYYY format to YYYY-MM-DD for HTML date inputs
 * @param {string} dateString - Date in DD/MM/YYYY format
 * @returns {string} Date in YYYY-MM-DD format
 */
export function formatDateForInput(dateString) {
  if (!dateString) return '';
  
  const parts = dateString.split('/');
  if (parts.length !== 3) return '';
  
  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date in DD/MM/YYYY format
 * @returns {string} Today's date formatted as DD/MM/YYYY
 */
export function getTodayFormatted() {
  return formatDateToDDMMYYYY(new Date());
}

/**
 * Get today's date in YYYY-MM-DD format for HTML date inputs
 * @returns {string} Today's date formatted as YYYY-MM-DD
 */
export function getTodayForInput() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
} 