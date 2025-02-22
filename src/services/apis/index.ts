import GlobalConfig from 'global-config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { security } from '../internals/security';

// API == Backend For Frontend
export const api = createApi({
  // fetchBaseQuery uses fetch; baseQuery could be changed if Axios is wanted
  baseQuery: fetchBaseQuery({
    baseUrl: `${window.location.origin}${GlobalConfig.api.BACKEND_BASE_URL}`,
    prepareHeaders: async (headers) => {
      const accessToken = await security.getAccessTokenFunction()?.();
      if (accessToken != null) {
        headers.set('authorization', `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: [],
  endpoints: () => ({}),
});
