import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { updateAxiosToken } from 'src/services/apis/axios';
import { selectAccessToken } from 'src/services/slices/auth/selectors';

export const useAxiosAuth = () => {
  const accessToken = useSelector(selectAccessToken);
  
  useEffect(() => {
    // Update the Axios instance with the current token
    updateAxiosToken(accessToken);
    
    // No cleanup needed as we're not subscribing to anything
  }, [accessToken]);
  
  return null; // This hook doesn't return anything
};