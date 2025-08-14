/**
 * Utility functions for mock API configuration
 * This module provides functions to check and manage mock API settings
 */

import { CONFIG } from 'src/config-global';

/**
 * Check if mock API is enabled based on environment variable
 * @returns {boolean} True if mock API should be used
 */
export const isMockApiEnabled = (): boolean => CONFIG.useMockApi;

/**
 * Get the current mock API configuration status
 * @returns {object} Configuration status information
 */
export const getMockApiStatus = () => ({
  enabled: isMockApiEnabled(),
  source: 'environment variable (VITE_USE_MOCK_API)',
  value: import.meta.env.VITE_USE_MOCK_API,
});

/**
 * Log the current mock API configuration to console
 * Useful for debugging and development
 */
export const logMockApiStatus = (): void => {
  const status = getMockApiStatus();
  console.log('🔧 Mock API Configuration:', status);
  
  if (status.enabled) {
    console.log('✅ Mock API is ENABLED - Using mock responses');
  } else {
    console.log('🌐 Mock API is DISABLED - Using real API endpoints');
  }
};

/**
 * Validate that the environment variable is properly set
 * @returns {boolean} True if the environment variable is valid
 */
export const validateMockApiConfig = (): boolean => {
  const envValue = import.meta.env.VITE_USE_MOCK_API;
  
  if (envValue === undefined) {
    console.warn('⚠️ VITE_USE_MOCK_API environment variable is not set. Defaulting to false.');
    return false;
  }
  
  if (envValue !== 'true' && envValue !== 'false') {
    console.warn(`⚠️ VITE_USE_MOCK_API has invalid value: "${envValue}". Expected "true" or "false". Defaulting to false.`);
    return false;
  }
  
  return true;
};
