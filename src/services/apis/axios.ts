import Axios from 'axios';

// Create Axios instance without the token initially
const customRequest = Axios.create({
  baseURL: `https://api.xlog.ai/api/v1`,
});

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
      tempConf.headers.Connection = 'keep-alive';
      tempConf.headers['access-control-allow-origin'] = '*';
      tempConf.headers['access-control-allow-credentials'] = 'true';
      
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
    updatedConfig.headers.Connection = 'keep-alive';
    updatedConfig.headers['access-control-allow-origin'] = '*';
    updatedConfig.headers['access-control-allow-credentials'] = 'true';
    return updatedConfig;
  },
  async (error) => error,
);

export default customRequest;
