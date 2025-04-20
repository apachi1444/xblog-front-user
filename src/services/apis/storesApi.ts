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
    
    // New deleteStore mutation endpoint
    deleteStore: builder.mutation<void, number>({
      query: (store_id) => ({
        url: `${STORES_BASE_URL}/${store_id}`,
        method: 'DELETE',
      }),
      // Optimistically update the cache to remove the deleted store
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
  }),
});

export const { 
  useGetStoresQuery, 
  useLazyGetStoresQuery,
  useDeleteStoreMutation 
} = storesApi;