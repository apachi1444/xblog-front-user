import { api } from './index';

// Types for feedback API
export interface CreateFeedbackRequest {
  stars: number; // 1-5 star rating (required)
  comment?: string; // Optional comment
}

export interface CreateFeedbackResponse {
  success: boolean;
  message: string;
  feedback_id?: string;
}

// Feedback API endpoints
export const feedbackApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create feedback endpoint
    createFeedback: builder.mutation<CreateFeedbackResponse, CreateFeedbackRequest>({
      query: (feedbackData) => ({
        url: '/ratings',
        method: 'POST',
        body: feedbackData,
      }),
      transformResponse: (response: any) => {
        // Handle both direct string response and object response
        if (typeof response === 'string') {
          return {
            success: true,
            message: 'Feedback submitted successfully',
            feedback_id: `feedback_${Date.now()}`
          };
        }
        return response;
      },
    }),
  }),
});

// Export hooks for use in components
export const {
  useCreateFeedbackMutation,
} = feedbackApi;
