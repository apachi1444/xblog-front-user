import { api } from '.';

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
    generateTitle: builder.mutation<GeneratedTitle, GenerateTitleRequest>({
      query: (data) => ({
        url: `${GENERATE_BASE_URL}/title`,
        method: 'POST',
        body: data,
      }),
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
    generateSections: builder.mutation<GeneratedSection[], GenerateSectionsRequest>({
      query: (data) => ({
        url: `${GENERATE_BASE_URL}/sections`,
        method: 'POST',
        body: data,
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