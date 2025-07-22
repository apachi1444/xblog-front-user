import { logEvent } from 'firebase/analytics';

import { analytics } from 'src/services/firebase';

// Analytics utility functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  try {
    if (analytics) {
      console.log('🔥 Tracking Firebase event:', eventName, parameters);
      logEvent(analytics, eventName, parameters);
    } else {
      console.warn('⚠️ Firebase Analytics not initialized, event not tracked:', eventName);
    }
  } catch (error) {
    console.error('❌ Error tracking Firebase event:', eventName, error);
  }
};

// Predefined event tracking functions
export const trackUserAction = (action: string, details?: Record<string, any>) => {
  trackEvent('user_action', {
    action,
    timestamp: new Date().toISOString(),
    ...details
  });
};

export const trackPageView = (pageName: string, additionalData?: Record<string, any>) => {
  trackEvent('page_view', {
    page_title: pageName,
    page_location: window.location.href,
    ...additionalData
  });
};

export const trackTestModeToggle = (enabled: boolean) => {
  trackEvent('page_view', {
    enabled,
    timestamp: new Date().toISOString()
  });
};

export const trackSignIn = (method: string) => {
  trackEvent('login', {
    method,
    timestamp: new Date().toISOString()
  });
};

export const trackSignUp = (method: string) => {
  trackEvent('sign_up', {
    method,
    timestamp: new Date().toISOString()
  });
};

// Debug function to test analytics
export const testAnalytics = () => {
  console.log('🧪 Testing Firebase Analytics...');
  trackEvent('test_event', {
    test_parameter: 'test_value',
    timestamp: new Date().toISOString()
  });
};
