import Axios from 'axios';

import { security } from '../security';

const customRequest = Axios.create({
  baseURL: `${window.location.origin  }GlobalConfig.api.BACKEND_BASE_URL`,
});

customRequest.interceptors.request.use(
  async (config) => {
    const tempConf = { ...config };
    const accessToken = await security.getAccessTokenFunction()?.();
    if (accessToken != null) {
      tempConf.headers.Authorization = `Bearer ${accessToken}`;
    }
    return tempConf;
  },
  async (error) => error,
);

export default customRequest;
