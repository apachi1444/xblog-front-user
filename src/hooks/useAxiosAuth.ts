import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useSessionExpired } from 'src/contexts/SessionExpiredContext';
import { selectAccessToken } from 'src/services/slices/auth/selectors';
import { updateAxiosToken, setSessionExpiredCallback } from 'src/services/apis/axios';

export const useAxiosAuth = () => {
  const accessToken = useSelector(selectAccessToken);
  const { showSessionExpiredModal } = useSessionExpired();

  useEffect(() => {
    // Update the Axios instance with the current token
    updateAxiosToken(accessToken);

    // Set up the session expired callback for 401 error handling
    setSessionExpiredCallback(() => {
      showSessionExpiredModal();
    });

    // No cleanup needed as we're not subscribing to anything
  }, [accessToken, showSessionExpiredModal]);

  return null; // This hook doesn't return anything
};