import type { ReactNode } from 'react';
import type { RootState } from 'src/services/store';

import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import React, { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';

// Local storage key for tracking if the welcome popup has been shown
const WELCOME_POPUP_STORAGE_KEY = 'welcome_popup_shown';

// Define the context type
interface WelcomePopupContextType {
  showPopup: boolean;
  closePopup: (dontShowAgain?: boolean) => void;
  showWelcomePopup: () => void;
  resetPopupState: () => void;
}

// Create the context with a default value
const WelcomePopupContext = createContext<WelcomePopupContextType>({
  showPopup: false,
  closePopup: () => {},
  showWelcomePopup: () => {},
  resetPopupState: () => {},
});

// Props for the WelcomePopupProvider component
interface WelcomePopupProviderProps {
  children: ReactNode;
}

// Provider component that wraps the app
export function WelcomePopupContextProvider({ children }: WelcomePopupProviderProps) {
  const location = useLocation();
  
  // Initialize state - don't show popup by default
  const [showPopup, setShowPopup] = useState(false);
  
  // Get onboarding status from Redux store
  const onboardingCompleted = useSelector((state: RootState) => state.auth.onboardingCompleted);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Check if we should show the popup when the component mounts or when relevant state changes
  useEffect(() => {
    // Only proceed if user is authenticated
    if (!isAuthenticated) return;

    // Check if we're on the dashboard page
    const isDashboardPage = location.pathname === '/' || location.pathname === '/dashboard';
    
    if (isDashboardPage) {
      try {
        // Check if the popup has been shown before
        const popupShown = localStorage.getItem(WELCOME_POPUP_STORAGE_KEY) === 'true';
        
        // Show the popup if it hasn't been shown before and onboarding is completed
        if (!popupShown && onboardingCompleted) {
          setShowPopup(true);
        }
      } catch (error) {
        console.error('Error reading welcome popup state from localStorage:', error);
      }
    }
  }, [location.pathname, onboardingCompleted, isAuthenticated]);

  // Function to close the popup
  const closePopup = useCallback((dontShowAgain = false) => {
    setShowPopup(false);
    
    // If dontShowAgain is true, save this preference to localStorage
    if (dontShowAgain) {
      try {
        localStorage.setItem(WELCOME_POPUP_STORAGE_KEY, 'true');
      } catch (error) {
        console.error('Error saving welcome popup state to localStorage:', error);
      }
    }
  }, []);

  // Function to manually show the popup (for testing or if user wants to see it again)
  const showWelcomePopup = useCallback(() => {
    setShowPopup(true);
  }, []);

  // Function to reset the popup state (for testing)
  const resetPopupState = useCallback(() => {
    try {
      localStorage.removeItem(WELCOME_POPUP_STORAGE_KEY);
    } catch (error) {
      console.error('Error removing welcome popup state from localStorage:', error);
    }
  }, []);

  // Create the context value object
  const contextValue = useMemo(() => ({
    showPopup,
    closePopup,
    showWelcomePopup,
    resetPopupState,
  }), [showPopup, closePopup, showWelcomePopup, resetPopupState]);

  return (
    <WelcomePopupContext.Provider value={contextValue}>
      {children}
    </WelcomePopupContext.Provider>
  );
}

// Custom hook to use the welcome popup context
export function useWelcomePopupContext() {
  const context = useContext(WelcomePopupContext);
  if (context === undefined) {
    throw new Error('useWelcomePopupContext must be used within a WelcomePopupContextProvider');
  }
  return context;
}
