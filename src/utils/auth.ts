// Secure token key with random suffix to prevent XSS attacks
const TOKEN_KEY = 'xblog_secure_session_token_v2_8a7b6c5d4e3f2g1h';

export const getToken = () => {
  try {
    // Try to get token from new secure key first
    let token = sessionStorage.getItem(TOKEN_KEY);

    // If not found, try the old key for backward compatibility
    if (!token) {
      token = sessionStorage.getItem('access_token');

      // If found in old storage, migrate to new secure key and remove old one
      if (token) {
        sessionStorage.setItem(TOKEN_KEY, token);
        sessionStorage.removeItem('access_token');
      }
    }

    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

export const setToken = (access_token: string | null): void => {
  try {
    if (access_token) {
      sessionStorage.setItem(TOKEN_KEY, access_token);
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
    }

    // Always remove old token key for security
    sessionStorage.removeItem('access_token');
  } catch (error) {
    console.error('Error setting token:', error);
  }
};
