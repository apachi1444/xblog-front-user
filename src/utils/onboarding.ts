/**
 * Utility functions for managing onboarding status
 * Implements fallback strategy: API first, localStorage second
 */

import type { AuthUser } from 'src/types/user';

/**
 * Get onboarding completion status using fallback strategy
 * @param userData - User data from API (may be undefined)
 * @returns boolean indicating if onboarding is completed
 */
export const getOnboardingStatus = (userData?: AuthUser | null): boolean => {
  // First priority: Check API response
  if (userData?.is_completed_onboarding !== undefined) {
    return userData.is_completed_onboarding;
  }
  
  // Fallback: Check localStorage flag
  try {
    const localOnboardingStatus = localStorage.getItem('is_onboarding_completed');
    return localOnboardingStatus === 'true';
  } catch (error) {
    console.warn('Error reading onboarding status from localStorage:', error);
    return false;
  }
};

/**
 * Set onboarding completion status in localStorage
 * @param completed - Whether onboarding is completed
 */
export const setOnboardingStatusInStorage = (completed: boolean): void => {
  try {
    localStorage.setItem('is_onboarding_completed', completed.toString());
  } catch (error) {
    console.warn('Error setting onboarding status in localStorage:', error);
  }
};

/**
 * Clear onboarding status from localStorage
 */
export const clearOnboardingStatusFromStorage = (): void => {
  try {
    localStorage.removeItem('is_onboarding_completed');
  } catch (error) {
    console.warn('Error clearing onboarding status from localStorage:', error);
  }
};

/**
 * Sync localStorage with API data when available
 * @param userData - User data from API
 */
export const syncOnboardingStatusWithAPI = (userData?: AuthUser | null): void => {
  if (userData?.is_completed_onboarding !== undefined) {
    setOnboardingStatusInStorage(userData.is_completed_onboarding);
  }
};

/**
 * Initialize onboarding status for first-time login
 * Sets localStorage flag to false if not already set
 */
export const initializeOnboardingStatus = (): void => {
  try {
    const existingStatus = localStorage.getItem('is_onboarding_completed');
    if (existingStatus === null) {
      // First time login - set to false
      localStorage.setItem('is_onboarding_completed', 'false');
    }
  } catch (error) {
    console.warn('Error initializing onboarding status:', error);
  }
};
