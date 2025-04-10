/**
 * Logger utility for consistent logging throughout the application
 * Provides different log levels and formatting
 */
export const logger = {
  /**
   * Log informational message
   * @param {string} message - The message to log
   * @param {any} data - Optional data to log
   */
  info: (message, data) => {
    if (data) {
      console.info(`[INFO] ${message}`, data);
    } else {
      console.info(`[INFO] ${message}`);
    }
  },
  
  /**
   * Log warning message
   * @param {string} message - The message to log
   * @param {any} data - Optional data to log
   */
  warn: (message, data) => {
    if (data) {
      console.warn(`[WARNING] ${message}`, data);
    } else {
      console.warn(`[WARNING] ${message}`);
    }
  },
  
  /**
   * Log error message
   * @param {string} message - The message to log
   * @param {any} error - Optional error object to log
   */
  error: (message, error) => {
    if (error) {
      console.error(`[ERROR] ${message}`, error);
    } else {
      console.error(`[ERROR] ${message}`);
    }
  },
  
  /**
   * Log debug message (only in development)
   * @param {string} message - The message to log
   * @param {any} data - Optional data to log
   */
  debug: (message, data) => {
    if (process.env.NODE_ENV !== 'production') {
      if (data) {
        console.debug(`[DEBUG] ${message}`, data);
      } else {
        console.debug(`[DEBUG] ${message}`);
      }
    }
  }
};