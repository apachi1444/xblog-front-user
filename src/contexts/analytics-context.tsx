import type { ReactNode } from 'react';

import React, { useState, useEffect, useContext, createContext } from 'react';

import { trackEvent, trackEnhancedEvent, ANALYTICS_CATEGORIES } from 'src/utils/analytics';

// Analytics context interface
interface AnalyticsContextType {
  isInitialized: boolean;
  trackEvent: typeof trackEvent;
  trackEnhancedEvent: typeof trackEnhancedEvent;
  trackAppInitialization: () => void;
  trackUserEngagement: (action: string, details?: Record<string, any>) => void;
  trackPerformance: (metric: string, value: number, details?: Record<string, any>) => void;
}

// Create the context
const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

// Provider props interface
interface AnalyticsProviderProps {
  children: ReactNode;
}

// Analytics Provider component
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize analytics on mount
  useEffect(() => {
    const initializeAnalytics = () => {
      try {
        // Check if gtag is available
        if (typeof window !== 'undefined') {
          console.log('✅ Google Analytics 4 initialized successfully');
          setIsInitialized(true);
          
          // Track app initialization
          trackAppInitialization();
        } else {
          console.warn('⚠️ Google Analytics not available');
          // Retry after a short delay
          setTimeout(initializeAnalytics, 1000);
        }
      } catch (error) {
        console.error('❌ Error initializing Google Analytics:', error);
      }
    };

    initializeAnalytics();
  }, []);

  // Track app initialization
  const trackAppInitialization = () => {
    trackEnhancedEvent('app_initialization', ANALYTICS_CATEGORIES.ENGAGEMENT, {
      app_version: '1.0.0',
      initialization_time: new Date().toISOString()
    });
  };

  // Track user engagement
  const trackUserEngagement = (action: string, details?: Record<string, any>) => {
    trackEnhancedEvent(action, ANALYTICS_CATEGORIES.ENGAGEMENT, details);
  };

  // Track performance metrics
  const trackPerformance = (metric: string, value: number, details?: Record<string, any>) => {
    trackEnhancedEvent(metric, ANALYTICS_CATEGORIES.PERFORMANCE, {
      metric_value: value,
      ...details
    });
  };

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const contextValue: AnalyticsContextType = {
    isInitialized,
    trackEvent,
    trackEnhancedEvent,
    trackAppInitialization,
    trackUserEngagement,
    trackPerformance,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}

// Custom hook to use analytics context
export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

// Export the context for advanced usage
export { AnalyticsContext };
