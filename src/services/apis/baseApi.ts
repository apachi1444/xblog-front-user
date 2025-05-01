import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { RootState } from '../store';

export const baseApi = createApi({
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});

// Helper function for handling test mode responses
export const handleTestModeResponse = <T>(
  mockData: T,
  isTestMode: boolean,
  errorMessage: string = 'API Error'
) => {
  if (isTestMode) {
    console.log('Test mode active, using mock data:', mockData);
    return { data: mockData };
  }
  throw new Error(errorMessage);
};