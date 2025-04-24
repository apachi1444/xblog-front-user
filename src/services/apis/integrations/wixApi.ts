import { api } from "..";

const WIX_BASE_URL = 'wix';

// Interface for Wix store connection request
interface ConnectWixRequest {
  admin_url: string;
  consumer_key: string;
  consumer_secret: string;
}

// Interface for Wix store connection response
interface ConnectWixResponse {
  id: string;
  name: string;
  url: string;
  isConnected: boolean;
  message?: string;
}

export const wixApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Connect Wix store
    connectWix: builder.mutation<ConnectWixResponse, ConnectWixRequest>({
      query: (storeData) => ({
        url: `/connect/${WIX_BASE_URL}`,
        method: 'POST',
        body: storeData,
      }),
    }),
    
    // Get Wix store details
    getWixStore: builder.query<ConnectWixResponse, string>({
      query: (storeId) => ({
        url: `${WIX_BASE_URL}/stores/${storeId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useConnectWixMutation,
  useGetWixStoreQuery,
} = wixApi;