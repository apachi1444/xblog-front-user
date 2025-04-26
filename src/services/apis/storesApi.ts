import type { Store } from 'src/types/store';

import { _fakeStores } from 'src/_mock/stores';

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
      transformErrorResponse: (response, meta, arg) => {
        console.log('API Error, using fallback store data');
        return {
          stores: _fakeStores
        };
      }
    }),
    
    deleteStore: builder.mutation<void, number>({
      query: (store_id) => ({
        url: `${STORES_BASE_URL}/${store_id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(store_id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate the getStores query to refetch the updated list
          dispatch(
            storesApi.util.updateQueryData('getStores', undefined, (draft) => {
              draft.stores = draft.stores.filter(store => store.id !== store_id.toString());
              draft.count = draft.stores.length;
            })
          );
        } catch {
          // If the deletion fails, we don't need to do anything here
          // The error will be handled by the component
        }
      },
    }),

    // New disconnectStore mutation endpoint
    disconnectStore: builder.mutation<void, number>({
      query: (store_id) => ({
        url: `${STORES_BASE_URL}/disconnect/${store_id}`,
        method: 'POST',
      }),
      // Optimistically update the cache to change the store's connection status
      async onQueryStarted(store_id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Update the store's connection status in the cache
          dispatch(
            storesApi.util.updateQueryData('getStores', undefined, (draft) => {
              const storeToUpdate = draft.stores.find(store => store.id === store_id.toString());
              if (storeToUpdate) {
                storeToUpdate.isConnected = false;
              }
            })
          );
        } catch {
          // If the disconnection fails, we don't need to do anything here
          // The error will be handled by the component
        }
      },
    }),

    // New reconnectStore mutation endpoint
    reconnectStore: builder.mutation<void, number>({
      query: (store_id) => ({
        url: `${STORES_BASE_URL}/reconnect/${store_id}`,
        method: 'POST',
      }),
      // Optimistically update the cache to change the store's connection status
      async onQueryStarted(store_id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Update the store's connection status in the cache
          dispatch(
            storesApi.util.updateQueryData('getStores', undefined, (draft) => {
              const storeToUpdate = draft.stores.find(store => store.id === store_id.toString());
              if (storeToUpdate) {
                storeToUpdate.isConnected = true;
              }
            })
          );
        } catch {
          // If the reconnection fails, we don't need to do anything here
          // The error will be handled by the component
        }
      },
    }),
  }),
});

export const { 
  useGetStoresQuery, 
  useLazyGetStoresQuery,
  useDeleteStoreMutation,
  useDisconnectStoreMutation,
  useReconnectStoreMutation
} = storesApi;