import { api } from "..";

const SHOPIFY_BASE_URL = 'shopify';

// Interface for Shopify store connection request
interface ConnectShopifyRequest {
  api_key: string;
  api_password: string;
  store_domain: string;
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
      query: (data) => ({
        url: `/connect/${SHOPIFY_BASE_URL}`,
        method: 'POST',
        body: data,
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
