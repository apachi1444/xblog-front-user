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

// Specific interface for Gemini requests
export interface GeminiGenerateRequest {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  apiKey?: string;
}

// Specific interface for Gemini title generation
export interface GeminiTitleRequest {
  topic: string;
  keywords?: string[];
  targetAudience?: string;
  apiKey?: string;  // Optional API key, will use default if not provided
}

interface AIGenerateResponse {
  content: string;
  success: boolean;
  message?: string;
}

// Gemini title generation response
export interface GeminiTitleResponse {
  title: string;
  metadata: {
    topic: string;
    keywords: string[];
    targetAudience: string;
    generationTime: number;
    model: string;
  };
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

    // Google Gemini content generation endpoint
    generateWithGemini: builder.mutation<AIGenerateResponse, BaseAIGenerateRequest>({
      query: (data) => ({
        url: `${AI_GENERATE_BASE_URL}/gemini`,
        method: 'POST',
        body: data,
      }),
    }),

    // Gemini direct API call for content generation
    generateWithGeminiDirect: builder.mutation<AIGenerateResponse, GeminiGenerateRequest>({
      query: (data) => {
        const apiKey = data.apiKey || 'AIzaSyBgXmwBn-QvGmCMIU4OkkG-UPB7SKG6K-Y';
        return {
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          method: 'POST',
          body: {
            contents: [{
              parts: [{ text: data.prompt }]
            }],
            generationConfig: {
              temperature: data.temperature || 0.7,
              maxOutputTokens: data.maxTokens || 1024,
              topP: data.topP || 0.95,
              topK: data.topK || 40
            }
          },
        };
      },
    }),    
  }),
});

export const {
  useGenerateWithOpenAIMutation,
  useGenerateWithDeepseekMutation,
  useGenerateWithGeminiMutation,
  useGenerateWithGeminiDirectMutation,
} = aiGenerateApi;