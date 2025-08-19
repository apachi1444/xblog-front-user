import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useLazyVerifyCheckoutSessionQuery } from 'src/services/apis/subscriptionApi';

interface SessionVerificationState {
  isVerifying: boolean;
  isValid: boolean | null;
  sessionId: string | null;
  error: string | null;
  showSuccessAnimation: boolean;
  showErrorAnimation: boolean;
}

/**
 * Hook to handle Stripe session verification and show appropriate animations
 * Detects session_id in URL and verifies it with the backend
 */
export function useSessionVerification() {
  const location = useLocation();
  const [verifySession] = useLazyVerifyCheckoutSessionQuery();
  
  const [state, setState] = useState<SessionVerificationState>({
    isVerifying: false,
    isValid: null,
    sessionId: null,
    error: null,
    showSuccessAnimation: false,
    showErrorAnimation: false,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId && !state.isVerifying && state.sessionId !== sessionId) {      
      setState(prev => ({
        ...prev,
        isVerifying: true,
        sessionId,
        error: null,
        isValid: null,
      }));

      // Verify the session
      verifySession({ session_id: sessionId })
        .then((result) => {
          if (result.data && result.data.status === 'paid') {

            setState(prev => ({
              ...prev,
              isVerifying: false,
              isValid: true,
              showSuccessAnimation: true,
            }));
          } else {
            const errorMessage = result.data?.status
              ? `Payment status: ${result.data.status}`
              : 'Session not found or invalid';

            setState(prev => ({
              ...prev,
              isVerifying: false,
              isValid: false,
              error: errorMessage,
              showErrorAnimation: true,
            }));

            toast.error(`Payment verification failed - ${errorMessage}`);
          }
        })
        .catch((error) => {
          
          setState(prev => ({
            ...prev,
            isVerifying: false,
            isValid: false,
            error: error.message || 'Verification failed',
            showErrorAnimation: true,
          }));

          toast.error('Payment verification failed - please contact support');
        });
    }
  }, [location.search, verifySession, state.isVerifying, state.sessionId]);

  const hideSuccessAnimation = () => {
    setState(prev => ({
      ...prev,
      showSuccessAnimation: false,
    }));
  };

  const hideErrorAnimation = () => {
    setState(prev => ({
      ...prev,
      showErrorAnimation: false,
    }));
  };

  const resetVerification = () => {
    setState({
      isVerifying: false,
      isValid: null,
      sessionId: null,
      error: null,
      showSuccessAnimation: false,
      showErrorAnimation: false,
    });
  };

  return {
    ...state,
    hideSuccessAnimation,
    hideErrorAnimation,
    resetVerification,
    hasSessionId: !!state.sessionId,
  };
}
