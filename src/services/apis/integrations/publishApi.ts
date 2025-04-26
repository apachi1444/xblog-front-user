import { api } from "..";

// Generic publish request interface
interface PublishRequest {
  store_id: string;
  article_id: string;
  scheduled_date?: string;
}

// Generic publish response interface
interface PublishResponse {
  success: boolean;
  message?: string;
}

// Create a factory function for publish endpoints
const createPublishEndpoint = (platform: string) => api.injectEndpoints({
    endpoints: (builder) => ({
      [`publish${platform}`]: builder.mutation<PublishResponse, PublishRequest>({
        query: (data) => ({
          url: `/publish/${platform.toLowerCase()}`,
          method: 'POST',
          body: data,
        }),
      }),
    }),
  });

// Create endpoints for each platform
export const wordpressPublishApi = createPublishEndpoint('WordPress');
export const wixPublishApi = createPublishEndpoint('Wix');
export const shopifyPublishApi = createPublishEndpoint('Shopify');

// Export hooks for each platform
export const {
  usePublishWordPressMutation,
} = wordpressPublishApi;

export const {
  usePublishWixMutation,
} = wixPublishApi;

export const {
  usePublishShopifyMutation,
} = shopifyPublishApi;