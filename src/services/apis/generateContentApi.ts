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
  language?: string;
}

/**
 * Response containing generated secondary keywords
 */
export interface GenerateKeywordsResponse extends BaseGenerationResponse {
  keywords: string;
}

/**
 * Request to generate article sections
 */
export interface GenerateSectionsRequest {
  primary_keyword: string;
  secondary_keywords: string[];
  toc: Array<{
    heading: string;
    subheadings: string[];
  }>;
  article_title: string;
  target_audience: string;
  tone: string;
  point_of_view: string;
  article_type: string;
  article_size: string;
  links: Array<{
    link_text: string;
    link_url: string;
  }>;
  images: Array<{
    img_text: string;
    img_url: string;
  }>;
  language: string;
}

/**
 * Request to generate table of contents
 */
export interface GenerateTableOfContentsRequest {
  primary_keyword: string;
  secondary_keywords: string[];
  content_description: string;
  title: string;
  language?: string;
}

/**
 * Request to generate article title
 */
export interface GenerateTitleRequest {
  primary_keyword: string;
  secondary_keywords: string[];
  content_description: string;
  language?: string;
}

/**
 * Response containing generated article titles
 */
export interface GenerateTitleResponse extends BaseGenerationResponse {
  titles: string[];
}

/**
 * Request to generate content description/topic
 */
export interface GenerateTopicRequest {
  primary_keyword: string;
  secondary_keywords: string[];
  language?: string;
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
  title: string;
  content: string;
}

/**
 * Raw API response structure for sections (string format)
 */
export interface GenerateSectionsApiResponse {
  [key: string]: string; // Direct object with section keys (introduction, section_one, etc.) and HTML content values
}

/**
 * Response containing generated sections (mapped for UI)
 */
export interface GenerateSectionsResponse{
  sections: GeneratedSection[];
}

/**
 * Structure for FAQ items in full article generation
 */
export interface GenerateFullArticleFaq {
  question: string;
  answer: string;
}

/**
 * Structure for external links in full article generation
 */
export interface GenerateFullArticleExternalLink {
  link_text: string;
  link_url: string;
}

/**
 * Structure for table of contents items in full article generation
 */
export interface GenerateFullArticleTableOfContents {
  heading: string;
  subheadings: string[];
}

/**
 * Structure for sections in full article generation
 */
export interface GenerateFullArticleSection {
  key: string;
  content: string;
}

/**
 * Request to generate complete article HTML
 */
export interface GenerateFullArticleRequest {
  title: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  author: string;
  featured_media: string;
  reading_time_estimate: number;
  url: string;
  faqs: GenerateFullArticleFaq[];
  external_links: GenerateFullArticleExternalLink[];
  table_of_contents: GenerateFullArticleTableOfContents[];
  sections: GenerateFullArticleSection[];
  language: string;
  template_name?: string;
}

/**
 * Response containing complete article HTML
 * Note: API returns HTML content directly as string, not wrapped in object
 */
export type GenerateFullArticleResponse = string; // Direct HTML content

/**
 * Structure of a table of contents item
 */
export interface GeneratedTableOfContents {
  heading: string;
  subheadings: string[];
}

/**
 * Response containing generated table of contents
 */
export interface GenerateTableOfContentsResponse extends BaseGenerationResponse {
  table_of_contents: GeneratedTableOfContents[];
}

/**
 * Request to generate images
 */
export interface GenerateImagesRequest {
  topic: string;
  number_of_images: number;
  language?: string;
}

/**
 * Structure of a generated image
 */
export interface GeneratedImage {
  img_text: string;
  img_url: string;
}

/**
 * Response containing generated images
 */
export interface GenerateImagesResponse extends BaseGenerationResponse {
  images: GeneratedImage[];
}

/**
 * Request to generate FAQ
 */
export interface GenerateFaqRequest {
  title: string;
  primary_keyword: string;
  secondary_keywords: string[];
  content_description: string;
  language?: string;
}

/**
 * Structure of a generated FAQ item
 */
export interface GeneratedFaq {
  question: string;
  answer: string;
}

/**
 * Response containing generated FAQ
 */
export interface GenerateFaqResponse extends BaseGenerationResponse {
  faq: GeneratedFaq[];
}

// Internal Links API Types
export interface InternalLinksRequest {
  website_url: string;
}

export interface InternalLinksResponse {
  success: boolean;
  message: string;
  internal_links: Array<{
    link_text: string;
    link_url: string;
  }>;
}

// External Links API Types
export interface ExternalLinksRequest {
  primary_keyword: string;
  secondary_keywords: string[];
  content_description: string;
  title: string;
  language?: string;
}

export interface ExternalLinksResponse {
  success: boolean;
  message: string;
  external_links: Array<{
    link_text: string;
    link_url: string;
  }>;
}

/**
 * RTK Query endpoints for content generation
 */
export const generateContentApi = api.injectEndpoints({
  endpoints: (builder) => ({
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
     * Generate internal links for article sections
     */
    generateInternalLinks: builder.mutation<InternalLinksResponse, InternalLinksRequest>({
      query: (body) => ({
        url: '/generate-internal-links',
        method: 'POST',
        body,
      }),
    }),

    /**
     * Generate external links for article sections
     */
    generateExternalLinks: builder.mutation<ExternalLinksResponse, ExternalLinksRequest>({
      query: (body) => ({
        url: '/generate-external-links',
        method: 'POST',
        body,
      }),
    }),

    /**
     * Generate table of contents for an article
     */
    generateTableOfContents: builder.mutation<GenerateTableOfContentsResponse, GenerateTableOfContentsRequest>({
      query: (body) => ({
        url: '/generate-table-of-contents',
        method: 'POST',
        body,
      }),
    }),

    /**
     * Generate images for article content
     */
    generateImages: builder.mutation<GenerateImagesResponse, GenerateImagesRequest>({
      query: (body) => ({
        url: '/generate-images',
        method: 'POST',
        body,
      }),
    }),

    /**
     * Generate FAQ for article content
     */
    generateFaq: builder.mutation<GenerateFaqResponse, GenerateFaqRequest>({
      query: (body) => ({
        url: '/generate-faq',
        method: 'POST',
        body,
      }),
    }),
    /**
     * Generate article sections
     */
    generateSections: builder.mutation<GenerateSectionsResponse, GenerateSectionsRequest>({
      query: (body) => ({
        url: '/generate-sections',
        method: 'POST',
        body,
      }),
      transformResponse: (response: GenerateSectionsApiResponse): GenerateSectionsResponse => {
        try {
          // Response is already an object with section keys and HTML content values
          // Map the object keys to section array
          const sections: GeneratedSection[] = Object.entries(response).map(([key, htmlContent]) => ({
            title: key,
            content: htmlContent as string,
          }));

          return {
            ...response,
            sections,
          };
        } catch (error) {
          return {
            sections: [],
          };
        }
      },
    }),

    /**
     * Generate complete article HTML content
     */
    generateFullArticle: builder.mutation<GenerateFullArticleResponse, GenerateFullArticleRequest>({
      query: (body) => ({
        url: '/generate-full-article',
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
  useGenerateTableOfContentsMutation,
  useGenerateTopicMutation,
  useGenerateInternalLinksMutation,
  useGenerateExternalLinksMutation,
  useGenerateImagesMutation,
  useGenerateFaqMutation,
  useGenerateFullArticleMutation,
} = generateContentApi;
