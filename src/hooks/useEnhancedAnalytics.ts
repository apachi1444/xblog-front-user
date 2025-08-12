import { 
  trackError, 
  trackSignIn,
  trackSignUp,
  trackSignOut,
  trackApiError,
  trackPageView,
  ANALYTICS_ACTIONS,
  trackCrudOperation,
  trackFileOperation,
  ANALYTICS_CATEGORIES
} from 'src/utils/analytics';

import { useAnalytics } from 'src/contexts/analytics-context';

// Enhanced analytics hook with comprehensive tracking methods
export function useEnhancedAnalytics() {
  const analytics = useAnalytics();

  // Authentication tracking
  const trackSignInAttempt = (method: string) => {
    analytics.trackEnhancedEvent(ANALYTICS_ACTIONS.SIGN_IN_ATTEMPT, ANALYTICS_CATEGORIES.AUTHENTICATION, {
      method
    });
  };

  const trackSignInSuccess = (method: string, userId?: string) => {
    trackSignIn(method);
    if (userId) {
      analytics.trackEnhancedEvent('user_identified', ANALYTICS_CATEGORIES.AUTHENTICATION, {
        user_id: userId
      });
    }
  };

  const trackSignInFailure = (method: string, errorReason: string) => {
    analytics.trackEnhancedEvent(ANALYTICS_ACTIONS.SIGN_IN_FAILURE, ANALYTICS_CATEGORIES.AUTHENTICATION, {
      method,
      error_reason: errorReason
    });
  };

  const trackSignUpAttempt = (method: string) => {
    analytics.trackEnhancedEvent('sign_up_attempt', ANALYTICS_CATEGORIES.AUTHENTICATION, {
      method
    });
  };

  const trackSignUpSuccess = (method: string) => {
    trackSignUp(method);
  };

  const trackUserSignOut = () => {
    trackSignOut();
  };

  const trackSessionTimeout = () => {
    analytics.trackEnhancedEvent(ANALYTICS_ACTIONS.SESSION_TIMEOUT, ANALYTICS_CATEGORIES.AUTHENTICATION);
  };

  // Navigation tracking
  const trackPageVisit = (pageName: string, additionalData?: Record<string, any>) => {
    trackPageView(pageName, additionalData);
  };

  const trackNavigateToDetails = (itemType: string, itemId: string) => {
    analytics.trackEnhancedEvent(ANALYTICS_ACTIONS.NAVIGATE_TO_DETAILS, ANALYTICS_CATEGORIES.NAVIGATION, {
      item_type: itemType,
      item_id: itemId
    });
  };

  const trackBackNavigation = (fromPage: string, toPage: string) => {
    analytics.trackEnhancedEvent(ANALYTICS_ACTIONS.BACK_NAVIGATION, ANALYTICS_CATEGORIES.NAVIGATION, {
      from_page: fromPage,
      to_page: toPage
    });
  };

  // CRUD operations tracking
  const trackCreateRecord = (resourceType: string, resourceId?: string) => {
    trackCrudOperation('create', resourceType, resourceId);
  };

  const trackUpdateRecord = (resourceType: string, resourceId: string) => {
    trackCrudOperation('update', resourceType, resourceId);
  };

  const trackDeleteRecord = (resourceType: string, resourceId: string) => {
    trackCrudOperation('delete', resourceType, resourceId);
  };

  const trackSearchRecords = (searchTerm: string, resultsCount: number, resourceType?: string) => {
    analytics.trackEnhancedEvent(ANALYTICS_ACTIONS.SEARCH_RECORDS, ANALYTICS_CATEGORIES.CRUD_OPERATIONS, {
      search_term: searchTerm,
      results_count: resultsCount,
      resource_type: resourceType
    });
  };

  // UI interaction tracking
  const trackButtonClick = (buttonName: string, context: string, additionalData?: Record<string, any>) => {
    analytics.trackEnhancedEvent(ANALYTICS_ACTIONS.BUTTON_CLICK, ANALYTICS_CATEGORIES.USER_INTERACTION, {
      button_name: buttonName,
      context,
      ...additionalData
    });
  };

  const trackMenuOpen = (menuName: string) => {
    analytics.trackEnhancedEvent(ANALYTICS_ACTIONS.MENU_OPEN, ANALYTICS_CATEGORIES.USER_INTERACTION, {
      menu_name: menuName
    });
  };

  const trackDialogOpen = (dialogName: string) => {
    analytics.trackEnhancedEvent(ANALYTICS_ACTIONS.DIALOG_OPEN, ANALYTICS_CATEGORIES.USER_INTERACTION, {
      dialog_name: dialogName
    });
  };

  const trackDialogClose = (dialogName: string, action: 'confirm' | 'cancel' | 'close') => {
    analytics.trackEnhancedEvent(ANALYTICS_ACTIONS.DIALOG_CLOSE, ANALYTICS_CATEGORIES.USER_INTERACTION, {
      dialog_name: dialogName,
      close_action: action
    });
  };

  const trackToggleVisibility = (elementName: string, isVisible: boolean) => {
    analytics.trackEnhancedEvent(ANALYTICS_ACTIONS.TOGGLE_VISIBILITY, ANALYTICS_CATEGORIES.USER_INTERACTION, {
      element_name: elementName,
      is_visible: isVisible
    });
  };

  const trackLanguageChange = (fromLanguage: string, toLanguage: string) => {
    analytics.trackEnhancedEvent(ANALYTICS_ACTIONS.LANGUAGE_CHANGE, ANALYTICS_CATEGORIES.USER_INTERACTION, {
      from_language: fromLanguage,
      to_language: toLanguage
    });
  };

  // File operations tracking
  const trackPdfDownloadAttempt = (documentType: string, documentId?: string) => {
    analytics.trackEnhancedEvent(ANALYTICS_ACTIONS.PDF_DOWNLOAD_ATTEMPT, ANALYTICS_CATEGORIES.FILE_OPERATIONS, {
      document_type: documentType,
      document_id: documentId
    });
  };

  const trackPdfDownloadSuccess = (documentType: string, fileSize?: number) => {
    trackFileOperation('download', 'pdf', true);
    analytics.trackEnhancedEvent(ANALYTICS_ACTIONS.PDF_DOWNLOAD_SUCCESS, ANALYTICS_CATEGORIES.FILE_OPERATIONS, {
      document_type: documentType,
      file_size: fileSize
    });
  };

  const trackPdfDownloadFailure = (documentType: string, errorMessage: string) => {
    trackFileOperation('download', 'pdf', false, errorMessage);
  };

  // Error tracking
  const trackApplicationError = (errorType: string, errorMessage: string, context?: Record<string, any>) => {
    trackError(errorType, errorMessage, context);
  };

  const trackApiErrorEvent = (endpoint: string, statusCode: number, errorMessage: string) => {
    trackApiError(endpoint, statusCode, errorMessage);
  };

  const trackValidationError = (fieldName: string, errorMessage: string, formName?: string) => {
    analytics.trackEnhancedEvent(ANALYTICS_ACTIONS.VALIDATION_ERROR, ANALYTICS_CATEGORIES.ERROR_TRACKING, {
      field_name: fieldName,
      error_message: errorMessage,
      form_name: formName
    });
  };

  return {
    // Base analytics functions
    ...analytics,
    
    // Authentication
    trackSignInAttempt,
    trackSignInSuccess,
    trackSignInFailure,
    trackSignUpAttempt,
    trackSignUpSuccess,
    trackUserSignOut,
    trackSessionTimeout,
    
    // Navigation
    trackPageVisit,
    trackNavigateToDetails,
    trackBackNavigation,
    
    // CRUD Operations
    trackCreateRecord,
    trackUpdateRecord,
    trackDeleteRecord,
    trackSearchRecords,
    
    // UI Interactions
    trackButtonClick,
    trackMenuOpen,
    trackDialogOpen,
    trackDialogClose,
    trackToggleVisibility,
    trackLanguageChange,
    
    // File Operations
    trackPdfDownloadAttempt,
    trackPdfDownloadSuccess,
    trackPdfDownloadFailure,
    
    // Error Tracking
    trackApplicationError,
    trackApiErrorEvent,
    trackValidationError,
  };
}
