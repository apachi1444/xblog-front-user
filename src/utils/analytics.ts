// Analytics event interface
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Event categories
export const ANALYTICS_CATEGORIES = {
  AUTHENTICATION: 'authentication',
  NAVIGATION: 'navigation',
  USER_INTERACTION: 'user_interaction',
  CRUD_OPERATIONS: 'crud_operations',
  FILE_OPERATIONS: 'file_operations',
  ERROR_TRACKING: 'error_tracking',
  PERFORMANCE: 'performance',
  ENGAGEMENT: 'engagement',
} as const;

// Event actions
export const ANALYTICS_ACTIONS = {
  // Authentication
  SIGN_IN_ATTEMPT: 'sign_in_attempt',
  SIGN_IN_SUCCESS: 'sign_in_success',
  SIGN_IN_FAILURE: 'sign_in_failure',
  SIGN_OUT: 'sign_out',
  SESSION_TIMEOUT: 'session_timeout',

  NAVIGATE_TO_DETAILS: 'navigate_to_details',
  BACK_NAVIGATION: 'back_navigation',

  // CRUD Operations
  CREATE_RECORD: 'create_record',
  UPDATE_RECORD: 'update_record',
  DELETE_RECORD: 'delete_record',
  SEARCH_RECORDS: 'search_records',

  // UI Interactions
  BUTTON_CLICK: 'button_click',
  MENU_OPEN: 'menu_open',
  DIALOG_OPEN: 'dialog_open',
  DIALOG_CLOSE: 'dialog_close',
  TOGGLE_VISIBILITY: 'toggle_visibility',
  LANGUAGE_CHANGE: 'language_change',

  // File Operations
  PDF_DOWNLOAD_ATTEMPT: 'pdf_download_attempt',
  PDF_DOWNLOAD_SUCCESS: 'pdf_download_success',
  PDF_DOWNLOAD_FAILURE: 'pdf_download_failure',

  // Error Tracking
  API_ERROR: 'api_error',
  VALIDATION_ERROR: 'validation_error',
  GENERIC_ERROR: 'generic_error',
} as const;

// Core tracking function
export function trackEvent(event: AnalyticsEvent): void {
  try {
    if (typeof window === 'undefined' || !window.gtag) {
      console.warn('⚠️ Google Analytics not initialized, event not tracked:', event.action);
      return;
    }

    console.log('📊 Tracking GA4 event:', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters
    });

    // Use gtag directly for GA4
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters
    });
  } catch (error) {
    console.error('❌ Analytics tracking failed:', error);
  }
}

// Convenience function for simple event tracking
export const trackSimpleEvent = (action: string, category: string, label?: string, value?: number) => {
  trackEvent({
    action,
    category,
    label,
    value
  });
};

// Enhanced event tracking with automatic metadata
export const trackEnhancedEvent = (
  action: string,
  category: string,
  additionalData?: Record<string, any>
) => {
  trackEvent({
    action,
    category,
    custom_parameters: {
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      page_title: document.title,
      user_agent: navigator.userAgent,
      language: navigator.language,
      ...additionalData
    }
  });
};

// Predefined event tracking functions
export const trackUserAction = (action: string, details?: Record<string, any>) => {
  trackEnhancedEvent(ANALYTICS_ACTIONS.BUTTON_CLICK, ANALYTICS_CATEGORIES.USER_INTERACTION, {
    action,
    ...details
  });
};

export const trackPageView = (pageName: string, additionalData?: Record<string, any>) => {
  trackEnhancedEvent(pageName, ANALYTICS_CATEGORIES.NAVIGATION, {
    page_name: pageName,
    ...additionalData
  });
};

export const trackSignIn = (method: string) => {
  trackEnhancedEvent(ANALYTICS_ACTIONS.SIGN_IN_SUCCESS, ANALYTICS_CATEGORIES.AUTHENTICATION, {
    method
  });
};

export const trackSignUp = (method: string) => {
  trackEnhancedEvent('sign_up', ANALYTICS_CATEGORIES.AUTHENTICATION, {
    method
  });
};

export const trackSignOut = () => {
  trackEnhancedEvent(ANALYTICS_ACTIONS.SIGN_OUT, ANALYTICS_CATEGORIES.AUTHENTICATION);
};

export const trackTestModeToggle = (enabled: boolean) => {
  trackEnhancedEvent('test_mode_toggle', ANALYTICS_CATEGORIES.USER_INTERACTION, {
    enabled,
    timestamp: new Date().toISOString()
  });
};

// Error tracking functions
export const trackError = (errorType: string, errorMessage: string, context?: Record<string, any>) => {
  trackEnhancedEvent(ANALYTICS_ACTIONS.GENERIC_ERROR, ANALYTICS_CATEGORIES.ERROR_TRACKING, {
    error_type: errorType,
    error_message: errorMessage,
    ...context
  });
};

export const trackApiError = (endpoint: string, statusCode: number, errorMessage: string) => {
  trackEnhancedEvent(ANALYTICS_ACTIONS.API_ERROR, ANALYTICS_CATEGORIES.ERROR_TRACKING, {
    endpoint,
    status_code: statusCode,
    error_message: errorMessage
  });
};

// CRUD operation tracking
export const trackCrudOperation = (operation: 'create' | 'read' | 'update' | 'delete', resourceType: string, resourceId?: string) => {
  const actionMap = {
    create: ANALYTICS_ACTIONS.CREATE_RECORD,
    read: 'read_record',
    update: ANALYTICS_ACTIONS.UPDATE_RECORD,
    delete: ANALYTICS_ACTIONS.DELETE_RECORD
  };

  trackEnhancedEvent(actionMap[operation], ANALYTICS_CATEGORIES.CRUD_OPERATIONS, {
    resource_type: resourceType,
    resource_id: resourceId
  });
};

// File operation tracking
export const trackFileOperation = (operation: string, fileType: string, success: boolean, errorMessage?: string) => {
  const action = success ?
    (operation === 'download' ? ANALYTICS_ACTIONS.PDF_DOWNLOAD_SUCCESS : `${operation}_success`) :
    (operation === 'download' ? ANALYTICS_ACTIONS.PDF_DOWNLOAD_FAILURE : `${operation}_failure`);

  trackEnhancedEvent(action, ANALYTICS_CATEGORIES.FILE_OPERATIONS, {
    file_type: fileType,
    success,
    error_message: errorMessage
  });
};

// Debug function to test analytics
export const testAnalytics = () => {
  console.log('🧪 Testing Google Analytics 4...');
  trackEnhancedEvent('test_event', 'testing', {
    test_parameter: 'test_value'
  });
};
