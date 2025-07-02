import type { Store } from 'src/types/store';

import { api } from '.';

export const STORES_BASE_URL = '/stores';

interface StoreState {
  stores: Store[];
  count: number;
}

export const storesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStores: builder.query<StoreState, void>({
      query: () => ({
        url: `${STORES_BASE_URL}`,
        method: 'GET',
      }),
      providesTags: ['Stores'],
      // Cache stores data for 5 minutes to reduce unnecessary refetches
      keepUnusedDataFor: 300, // 5 minutes
    }),
    
    deleteStore: builder.mutation<void, number>({
      query: (store_id) => ({
        url: `${STORES_BASE_URL}/${store_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Stores', 'Subscription'],
    }),

    // New disconnectStore mutation endpoint
    disconnectStore: builder.mutation<void, number>({
      query: (store_id) => ({
        url: `${STORES_BASE_URL}/disconnect/${store_id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Stores'],
    }),

    // New reconnectStore mutation endpoint
    reconnectStore: builder.mutation<void, number>({
      query: (store_id) => ({
        url: `${STORES_BASE_URL}/reconnect/${store_id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Stores'],
    }),

    // Add store mutation endpoint
    addStore: builder.mutation<Store, Partial<Store>>({
      query: (store) => ({
        url: `${STORES_BASE_URL}`,
        method: 'POST',
        body: store,
      }),
      invalidatesTags: ['Stores', 'Subscription'],
    }),
  }),
});

export const {
  useGetStoresQuery,
  useLazyGetStoresQuery,
  useDeleteStoreMutation,
  useDisconnectStoreMutation,
  useReconnectStoreMutation,
  useAddStoreMutation
} = storesApi;