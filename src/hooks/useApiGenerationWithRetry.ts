import { toast } from 'react-hot-toast';
import { useState, useCallback } from 'react';

// ----------------------------------------------------------------------

interface UseApiGenerationWithRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}

interface ApiGenerationState {
  isLoading: boolean;
  isRetrying: boolean;
  error: string | null;
  retryCount: number;
}

export function useApiGenerationWithRetry(options: UseApiGenerationWithRetryOptions = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<ApiGenerationState>({
    isLoading: false,
    isRetrying: false,
    error: null,
    retryCount: 0,
  });

  
  // Store the current API call for retry
  const [currentApiCall, setCurrentApiCall] = useState<(() => Promise<any>) | null>(null);

    const retry = useCallback(async () => {
    if (!currentApiCall || state.retryCount >= maxRetries) {
      return;
    }

    setState(prev => ({
      ...prev,
      isRetrying: true,
      error: null,
    }));

    // Add delay before retry
    if (retryDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }

    try {
      const result = await currentApiCall();
      
      // Success - reset state
      setState({
        isLoading: false,
        isRetrying: false,
        error: null,
        retryCount: 0,
      });
      
      // Close any existing retry toasts
      toast.dismiss();
      
      // Show success message
      toast.success('Operation completed successfully!');
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      // eslint-disable-next-line consistent-return
      return result;
    } catch (error: any) {
      console.error('❌ Retry failed:', error);
      
      const errorMessage = getErrorMessage(error, 'Retry');
      
      setState(prev => ({
        ...prev,
        isRetrying: false,
        error: errorMessage,
        retryCount: prev.retryCount + 1,
      }));

      // Show error or another retry toast based on retry count
      if (state.retryCount + 1 < maxRetries && isRetryableError(error)) {
        // Show clickable error toast for retryable errors
        const retryMessage = `${errorMessage} Click this message to retry.`;
        toast.error(retryMessage, {
          duration: 10000,
        });
      } else {
        toast.error('Maximum retry attempts reached. Please try again later.');
      }

      throw error;
    }
  }, [currentApiCall, state.retryCount, maxRetries, retryDelay, onSuccess]);

  const executeWithRetry = useCallback(async (
    apiCall: () => Promise<any>,
    operationName: string,
    customErrorMessage?: string
  ) => {
    // Store the API call for potential retry
    setCurrentApiCall(() => apiCall);

    setState(prev => ({
      ...prev,
      isLoading: true,
      isRetrying: false,
      error: null,
    }));

    try {
      const result = await apiCall();

      // Success - reset state
      setState({
        isLoading: false,
        isRetrying: false,
        error: null,
        retryCount: 0,
      });

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error: any) {
      console.error(`❌ ${operationName} failed:`, error);

      const errorMessage = customErrorMessage || getErrorMessage(error, operationName);

      setState(prev => ({
        ...prev,
        isLoading: false,
        isRetrying: false,
        error: errorMessage,
        retryCount: prev.retryCount + 1,
      }));

      // Show retry toast for server errors (5xx) or network errors
      if (isRetryableError(error)) {
        // Show clickable error toast for retryable errors
        const retryMessage = `${errorMessage} Click this message to retry.`;
        toast.error(retryMessage, {
          duration: 10000,
        });
      } else {
        // Show regular error toast for non-retryable errors
        toast.error(errorMessage);
      }

      if (onError) {
        onError(error);
      }

      throw error;
    }
  }, [onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isRetrying: false,
      error: null,
      retryCount: 0,
    });
    setCurrentApiCall(null);
  }, []);

  return {
    ...state,
    executeWithRetry,
    retry,
    reset,
    canRetry: state.retryCount < maxRetries && currentApiCall !== null,
  };
}

// Helper functions
function isRetryableError(error: any): boolean {
  // Check if it's a server error (5xx) or network error
  if (error?.status >= 500 && error?.status < 600) {
    return true;
  }
  
  // Check for network errors
  if (error?.message?.includes('Network Error') || 
      error?.message?.includes('fetch') ||
      error?.code === 'NETWORK_ERROR') {
    return true;
  }
  
  // Check for timeout errors
  if (error?.message?.includes('timeout') || error?.code === 'TIMEOUT') {
    return true;
  }
  
  return false;
}

function getErrorMessage(error: any, operationName: string): string {
  if (error?.status >= 500) {
    return `Server is temporarily overloaded. ${operationName} failed, but you can retry.`;
  }
  
  if (error?.message?.includes('Network Error')) {
    return `Network connection issue. ${operationName} failed, but you can retry.`;
  }
  
  if (error?.message?.includes('timeout')) {
    return `Request timed out. ${operationName} failed, but you can retry.`;
  }
  
  // Default error message
  return error?.message || `${operationName} failed. Please try again.`;
}
