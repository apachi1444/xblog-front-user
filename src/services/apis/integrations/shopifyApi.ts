import { api } from "..";

const SHOPIFY_BASE_URL = 'shopify';

// Interface for Shopify store connection request
interface ConnectShopifyRequest {
  store_name: string;
  api_key: string;
  api_secret: string;
}

// Interface for Shopify store connection response
interface ConnectShopifyResponse {
  id: string;
  name: string;
  url: string;
  isConnected: boolean;
  message?: string;
}

export const shopifyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Connect Shopify store
    connectShopify: builder.mutation<ConnectShopifyResponse, ConnectShopifyRequest>({
      query: (storeData) => ({
        url: `/connect/${SHOPIFY_BASE_URL}`,
        method: 'POST',
        body: storeData,
      }),
    }),
    
    // Get Shopify store details
    getShopifyStore: builder.query<ConnectShopifyResponse, string>({
      query: (storeId) => ({
        url: `${SHOPIFY_BASE_URL}/stores/${storeId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useConnectShopifyMutation,
  useGetShopifyStoreQuery,
} = shopifyApi;