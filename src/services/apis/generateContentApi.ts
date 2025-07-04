import { api } from '.';

/**
 * Common response fields for all generation endpoints
 */
interface BaseGenerationResponse {
  success: boolean;
  message: string;
}

// Helper functions for section mapping
const extractTitleFromHtml = (htmlContent: string): string | null => {
  // Extract title from h2 tag
  const h2Match = htmlContent.match(/<h2[^>]*>(.*?)<\/h2>/i);
  if (h2Match) {
    return h2Match[1].replace(/<[^>]*>/g, '').trim();
  }

  // Extract title from section id attribute
  const sectionMatch = htmlContent.match(/id="([^"]*)"[^>]*>/i);
  if (sectionMatch) {
    return formatSectionTitle(sectionMatch[1]);
  }

  return null;
};

const formatSectionTitle = (key: string): string => 
  // Convert snake_case or camelCase to Title Case
   key
    .replace(/[_-]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
;

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
  content: string;
  status?: string;
}

/**
 * Raw API response structure for sections (string format)
 */
export interface GenerateSectionsApiResponse extends BaseGenerationResponse {
  sections: string; // This is the raw string response from API
}

/**
 * Response containing generated sections (mapped for UI)
 */
export interface GenerateSectionsResponse extends BaseGenerationResponse {
  sections: GeneratedSection[];
  score?: number;
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
}

/**
 * Response containing complete article HTML
 */
export interface GenerateFullArticleResponse extends BaseGenerationResponse {
  article_html: string; // Complete HTML content like aa.html
}

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
          // Parse the string response to extract sections
          const sectionsData = JSON.parse(response.sections);

          // Map the object keys to section array
          const sections: GeneratedSection[] = Object.entries(sectionsData).map(([key, htmlContent], index) => ({
            id: `section-${index + 1}`,
            title: extractTitleFromHtml(htmlContent as string) || formatSectionTitle(key),
            content: htmlContent as string,
            status: 'completed'
          }));

          return {
            ...response,
            sections,
            success: response.success,
            message: response.message
          };
        } catch (error) {
          console.error('Error parsing sections response:', error);
          // Fallback to empty sections if parsing fails
          return {
            ...response,
            sections: [],
            success: false,
            message: 'Failed to parse sections response'
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
