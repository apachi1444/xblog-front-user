import Axios from 'axios';

// Create Axios instance without the token initially
const customRequest = Axios.create({
  baseURL: `https://api.xblog.ai/api/v1/`,
});

// Store for session expired callback - will be set by the auth hook
let sessionExpiredCallback: (() => void) | null = null;

// Function to set the session expired callback
export const setSessionExpiredCallback = (callback: () => void) => {
  sessionExpiredCallback = callback;
};

// Create a function to update the token
export const updateAxiosToken = (token: string | null) => {

  // Add new interceptor with the current token
  customRequest.interceptors.request.use(
    async (config) => {
      const tempConf = { ...config };

      if (token) {
        tempConf.headers.Authorization = `Bearer ${token}`;
      }

      // Ensure Content-Type is set for all requests
      tempConf.headers['Content-Type'] = 'application/json';

      return tempConf;
    },
    async (error) => error,
  );
};

// Default interceptor for initial setup
customRequest.interceptors.request.use(
  async (config) => {
    const updatedConfig = { ...config };
    // Ensure Content-Type is set in the default interceptor as well
    updatedConfig.headers['Content-Type'] = 'application/json';

    return updatedConfig;
  },
  async (error) => error,
);

// Response interceptor to handle 401 errors globally
customRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn('🔒 Token expired or invalid - showing session expired modal');

      // Call the session expired callback to show the modal
      if (sessionExpiredCallback) {
        sessionExpiredCallback();
      } else {
        // Fallback: direct redirect if callback is not set
        console.warn('No session expired callback set, redirecting directly');
        setTimeout(() => {
          window.location.href = '/sign-in';
        }, 1000);
      }
    }

    return Promise.reject(error);
  }
);

export default customRequest;
