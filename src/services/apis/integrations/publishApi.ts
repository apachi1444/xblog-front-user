import { api } from "..";

// Generic publish request interface
export interface PublishRequest {
  store_id: number;
  article_id: number;
  scheduled_date?: string;
}

// Generic publish response interface
interface PublishResponse {
  success: boolean;
  message?: string;
}

// WordPress publish endpoint (real API)
export const wordpressPublishApi = api.injectEndpoints({
  endpoints: (builder) => ({
    publishWordPress: builder.mutation<PublishResponse, PublishRequest>({
      query: (data) => ({
        url: '/publish/wordpress',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

// Export hooks for WordPress
export const {
  usePublishWordPressMutation,
} = wordpressPublishApi;