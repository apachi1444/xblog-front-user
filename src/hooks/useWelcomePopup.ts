import { useWelcomePopupContext } from '../contexts/WelcomePopupContext';

/**
 * Custom hook to manage the welcome video popup display
 * This is now a wrapper around the WelcomePopupContext for backward compatibility
 *
 * - Checks if the user is on the dashboard page
 * - Checks if the user has just completed onboarding
 * - Provides functions to show/hide the popup
 * - Tracks if the user has chosen to not see the popup again
 */
export function useWelcomePopup() {
  // Use the welcome popup context directly
  return useWelcomePopupContext();
}
