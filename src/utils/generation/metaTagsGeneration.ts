import type { GenerateMetaRequest, GenerateMetaResponse } from 'src/services/apis/generateContentApi';

import { useGenerateMetaMutation } from 'src/services/apis/generateContentApi';

/**
 * Custom hook for generating meta tags for SEO optimization
 * @returns Functions and state for meta tags generation
 */
export const useMetaTagsGeneration = () => {
  // Use the RTK Query mutation hook
  const [generateMeta, { isLoading, isError, error }] = useGenerateMetaMutation();

  /**
   * Generate meta tags based on title and primary keyword
   * @param title - The article title
   * @param primaryKeyword - The main keyword for the article
   * @param language - Optional language parameter
   * @returns The generated meta information or null if there was an error
   */
  const generateMetaTags = async (
    primary_keyword: string,
    secondary_keywords : string[],
    content_description : string,
    title: string,
  ): Promise<GenerateMetaResponse | null> => {
    try {
      // Prepare the request payload
      const payload : GenerateMetaRequest = {
        content_description,
        primary_keyword,
        secondary_keywords,
        title
      };

      const response = await generateMeta(payload).unwrap();

      // Check if the request was successful
      if (!response.success) {
        console.error('Meta tags generation failed:', response.message);
        return null;
      }

      // Map the API response fields to our expected format
      // API returns: meta_title, meta_description, url_slug
      // Our app expects: metaTitle, metaDescription, urlSlug
      const mappedResponse: GenerateMetaResponse = {
        success: response.success,
        message: response.message || '',
        metaTitle: (response as any).meta_title || '',
        metaDescription: (response as any).meta_description || '',
        urlSlug: (response as any).url_slug || '',
        score: response.score
      };

      // Return the mapped response
      return mappedResponse;
    } catch (err) {
      console.error('Error generating meta tags:', err);
      return null;
    }
  };

  return {
    generateMetaTags,
    isGenerating: isLoading,
    isError,
    error
  };
};