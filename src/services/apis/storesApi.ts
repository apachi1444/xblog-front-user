import type { Store } from 'src/types/store';

import { api } from '.';

const STORES_BASE_URL = '/stores';

interface StoreState {
  stores: Store[];
  count: number;
}

export const storesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStores: builder.query<StoreState, void>({
      query: () => ({
        url: `${STORES_BASE_URL}/`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetStoresQuery, useLazyGetStoresQuery } = storesApi;