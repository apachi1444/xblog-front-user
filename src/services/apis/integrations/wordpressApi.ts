import { api } from "..";

const WORDPRESS_BASE_URL = 'wordpress';

// Interface for WordPress store connection request
interface ConnectWordPressRequest {
  store_url: string;
  store_username: string;
  store_password: string;
}

// Interface for WordPress store connection response
interface ConnectWordPressResponse {
  id: string;
  name: string;
  url: string;
  isConnected: boolean;
  message?: string;
}

export const wordpressApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Connect WordPress store
    connectWordPress: builder.mutation<ConnectWordPressResponse, ConnectWordPressRequest>({
      query: (storeData) => ({
        url: `/connect/${WORDPRESS_BASE_URL}`,
        method: 'POST',
        body: storeData,
      }),
    }),
    
    // Get WordPress store details
    getWordPressStore: builder.query<ConnectWordPressResponse, string>({
      query: (storeId) => ({
        url: `${WORDPRESS_BASE_URL}/stores/${storeId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useConnectWordPressMutation,
  useGetWordPressStoreQuery,
} = wordpressApi;