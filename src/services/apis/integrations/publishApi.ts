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