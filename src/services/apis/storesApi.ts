import type { Store } from 'src/types/store';

import { api } from '.';

const STORES_BASE_URL = '/stores';

export const storesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStores: builder.query<Store[], void>({
      query: () => ({
        url: `${STORES_BASE_URL}/`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetStoresQuery, useLazyGetStoresQuery } = storesApi;