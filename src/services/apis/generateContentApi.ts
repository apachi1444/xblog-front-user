import { api } from '.';

/**
 * Common response fields for all generation endpoints
 */
interface BaseGenerationResponse {
  success: boolean;
  message: string;
}

/**
 * Request to generate meta tags for an article
 */
export interface GenerateMetaRequest {
  title: string;
  primary_keyword: string;
  secondary_keywords: string[];
  content_description: string;
  language?: string;
}

/**
 * Response containing generated meta tags
 */
export interface GenerateMetaResponse extends BaseGenerationResponse {
  metaTitle: string;
  metaDescription: string;
  urlSlug: string;
  score?: number;
}

/**
 * Request to generate secondary keywords
 */
export interface GenerateKeywordsRequest {
  primary_keyword: string;
}

/**
 * Response containing generated secondary keywords
 */
export interface GenerateKeywordsResponse extends BaseGenerationResponse {
  keywords: string;
}

/**
 * Request to generate article sections/table of contents
 */
export interface GenerateSectionsRequest {
  title: string;
  keyword: string;
  secondaryKeywords?: string[];
  language?: string;
  contentType?: string;
  articleSize?: string;
  toneOfVoice?: string;
  targetCountry?: string;
}

/**
 * Request to generate article title
 */
export interface GenerateTitleRequest {
  primary_keyword: string;
  secondary_keywords: string[];
  content_description: string;
}

/**
 * Response containing generated article title
 */
export interface GenerateTitleResponse extends BaseGenerationResponse {
  title: string;
}

/**
 * Request to generate content description/topic
 */
export interface GenerateTopicRequest {
  primary_keyword: string;
  secondary_keywords: string[];
}

/**
 * Response containing generated content description
 */
export interface GenerateTopicResponse extends BaseGenerationResponse {
  content: string;
}

/**
 * Structure of a generated section
 */
export interface GeneratedSection {
  id: string;
  title: string;
  content?: string;
  subsections?: GeneratedSection[];
  status?: string;
}

/**
 * Response containing generated sections
 */
export interface GenerateSectionsResponse extends BaseGenerationResponse {
  sections: GeneratedSection[];
  score?: number;
}

/**
 * RTK Query endpoints for content generation
 */
export const generateContentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Generate article title based on keywords and content description
     */
    generateTitle: builder.mutation<GenerateTitleResponse, GenerateTitleRequest>({
      query: (data) => ({
        url: '/generate-title',
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Generate secondary keywords based on primary keyword
     */
    generateKeywords: builder.mutation<GenerateKeywordsResponse, GenerateKeywordsRequest>({
      query: (data) => ({
        url: '/generate-keywords',
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Generate content description/topic based on keywords
     */
    generateTopic: builder.mutation<GenerateTopicResponse, GenerateTopicRequest>({
      query: (data) => ({
        url: '/generate-topic',
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Generate meta tags (title, description, URL slug) for SEO
     */
    generateMeta: builder.mutation<GenerateMetaResponse, GenerateMetaRequest>({
      query: (data) => ({
        url: '/generate-meta-tags',
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Generate table of contents/sections for an article
     */
    generateSections: builder.mutation<GenerateSectionsResponse, GenerateSectionsRequest>({
      query: (body) => ({
        url: '/generate-table-of-contents',
        method: 'POST',
        body,
      }),
    }),

    /**
     * Generate internal links for article sections
     */
    generateInternalLinks: builder.mutation<GenerateSectionsResponse, GenerateSectionsRequest>({
      query: (body) => ({
        url: '/generate-internal-links',
        method: 'POST',
        body,
      }),
    }),

    /**
     * Generate external links for article sections
     */
    generateExternalLinks: builder.mutation<GenerateSectionsResponse, GenerateSectionsRequest>({
      query: (body) => ({
        url: '/generate-external-links',
        method: 'POST',
        body,
      }),
    }),

    /**
     * Generate image suggestions for article sections
     */
    generateImages: builder.mutation<GenerateSectionsResponse, GenerateSectionsRequest>({
      query: (body) => ({
        url: '/generate-images',
        method: 'POST',
        body,
      }),
    }),

    /**
     * Generate complete article content
     */
    generateFullArticle: builder.mutation<GenerateSectionsResponse, GenerateSectionsRequest>({
      query: (body) => ({
        url: '/generate-article',
        method: 'POST',
        body,
      }),
    }),
  }),
});

/**
 * Export hooks for use in components
 */
export const {
  useGenerateTitleMutation,
  useGenerateMetaMutation,
  useGenerateKeywordsMutation,
  useGenerateSectionsMutation,
  useGenerateTopicMutation,
  useGenerateInternalLinksMutation,
  useGenerateExternalLinksMutation,
  useGenerateImagesMutation,
  useGenerateFullArticleMutation,
} = generateContentApi;
