import { api } from '.';

const AI_GENERATE_BASE_URL = '/generate-blog';

// Common interfaces for AI generation
interface BaseAIGenerateRequest {
  title: string;
  keywords: string[];
  summary: string;
  tone?: string;
  topics?: string[];
  include_images?: boolean;
  include_conclusion?: boolean;
  include_introduction?: boolean;
  target_country?: string;
  article_type?: string;
  writing_style?: string;
  tone_of_voice?: string;
  point_of_view?: string;
  target_audience?: string;
  image_quality?: string;
  image_placement?: string;
  image_style?: string;
  number_of_images?: number;
  include_videos?: boolean;
  internal_linking?: boolean;
  external_linking?: boolean;
}

interface AIGenerateResponse {
  content: string;
  success: boolean;
  message?: string;
}

// Provider-specific endpoints
export const aiGenerateApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // OpenAI generation endpoint
    generateWithOpenAI: builder.mutation<AIGenerateResponse, BaseAIGenerateRequest>({
      query: (data) => ({
        url: `${AI_GENERATE_BASE_URL}/openai`,
        method: 'POST',
        body: data,
      }),
    }),

    // Deepseek generation endpoint
    generateWithDeepseek: builder.mutation<AIGenerateResponse, BaseAIGenerateRequest>({
      query: (data) => ({
        url: `${AI_GENERATE_BASE_URL}/deepseek`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGenerateWithOpenAIMutation,
  useGenerateWithDeepseekMutation,
} = aiGenerateApi;