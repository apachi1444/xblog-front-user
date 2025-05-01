import { api } from '.';
import { GeminiTitleRequest, GeminiTitleResponse } from './aiGenerateApi';

const GENERATE_BASE_URL = '/generate';

// Request/Response interfaces
interface GenerateTitleRequest {
  primaryKeyword: string;
  language?: string;
  targetCountry?: string;
}

interface GenerateMetaRequest {
  title: string;
  primaryKeyword: string;
  language?: string;
}

interface GenerateKeywordsRequest {
  primaryKeyword: string;
  language?: string;
  targetCountry?: string;
}

interface GenerateSectionsRequest {
  title: string;
  keyword: string;
  secondaryKeywords?: string[];
  language?: string;
  contentType?: string;
}

interface GenerateImagesRequest {
  title: string;
  description: string;
  style?: string;
  size?: string;
  count?: number;
}

interface GeneratedTitle {
  title: string;
  score?: number;
}

interface GeneratedMeta {
  metaTitle: string;
  metaDescription: string;
  urlSlug: string;
  score?: number;
}

interface GeneratedKeywords {
  keywords: string[];
  score?: number;
}

interface GeneratedSection {
  id: string;
  title: string;
  content?: string;
  subsections?: GeneratedSection[];
}

interface GenerateSectionsResponse {
  sections: GeneratedSection[];
  score?: number;
}

interface GeneratedImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

// RTK Query endpoints
export const generateContentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Generate title endpoint
    generateTitle: builder.mutation<GeminiTitleResponse, GeminiTitleRequest>({
      query: (data) => {
        const apiKey = 'AIzaSyBgXmwBn-QvGmCMIU4OkkG-UPB7SKG6K-Y';

        // Construct an SEO-optimized prompt for title generation
        const prompt = `
Generate a compelling, SEO-friendly article title about "${data.topic}".

The title should:
- Be attention-grabbing and engaging
- Include at least one of these keywords if possible: ${data.keywords?.join(', ') || 'N/A'}
- Be appropriate for ${data.targetAudience || 'general readers'}
- Be between 5-12 words long
- Include power words to drive engagement
- Be optimized for search engines
- Not use clickbait tactics
- Not include quotes unless absolutely necessary

Only return the title itself, nothing else.
`;
        console.log(prompt , "title");
        

        return {
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          method: 'POST',
          body: {
            contents: [{
              parts: [{ text: prompt }]
            }],
          },
          transformResponse: (response: any) => {
            console.log(response);
            
            const title = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Failed to generate title';

            return {
              title,
              metadata: {
                topic: data.topic,
                keywords: data.keywords || [],
                targetAudience: data.targetAudience || 'general readers',
                generationTime: 1.2, // Mock value since Gemini doesn't return this
                model: 'gemini-2.0-flash'
              }
            };
          },
        };
      },
    }),

    // Generate meta information endpoint
    generateMeta: builder.mutation<GeneratedMeta, GenerateMetaRequest>({
      query: (data) => ({
        url: `${GENERATE_BASE_URL}/meta`,
        method: 'POST',
        body: data,
      }),
    }),

    // Generate keywords endpoint
    generateKeywords: builder.mutation<GeneratedKeywords, GenerateKeywordsRequest>({
      query: (data) => ({
        url: `${GENERATE_BASE_URL}/keywords`,
        method: 'POST',
        body: data,
      }),
    }),

    // Generate sections endpoint
    generateSections: builder.mutation<GenerateSectionsResponse, GenerateSectionsRequest>({
      query: (body) => ({
        url: `${GENERATE_BASE_URL}/sections`,
        method: 'POST',
        body,
      }),
    }),

    // Generate images endpoint
    generateImages: builder.mutation<GeneratedImage[], GenerateImagesRequest>({
      query: (data) => ({
        url: `${GENERATE_BASE_URL}/images`,
        method: 'POST',
        body: data,
      }),
    }),

    // Regenerate specific content
    regenerateContent: builder.mutation<any, { type: string; data: any }>({
      query: ({ type, data }) => ({
        url: `${GENERATE_BASE_URL}/regenerate/${type}`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

// Export hooks
export const {
  useGenerateTitleMutation,
  useGenerateMetaMutation,
  useGenerateKeywordsMutation,
  useGenerateSectionsMutation,
  useGenerateImagesMutation,
  useRegenerateContentMutation,
} = generateContentApi;
