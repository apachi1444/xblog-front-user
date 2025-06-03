import type { ExternalLinksRequest, ExternalLinksResponse } from 'src/services/apis/generateContentApi';

import { useGenerateExternalLinksMutation } from 'src/services/apis/generateContentApi';

/**
 * Custom hook for generating external links for article sections
 * @returns Functions and state for external links generation
 */
export const useExternalLinksGeneration = () => {
  // Use the RTK Query mutation hook
  const [generateExternalLinks, { isLoading, isError, error }] = useGenerateExternalLinksMutation();

  /**
   * Generate external links for article content
   * @param primaryKeyword - The main keyword for the article
   * @param secondaryKeywords - Array of secondary keywords
   * @param contentDescription - Description of the content
   * @param title - The article title
   * @returns The generated external links or null if there was an error
   */
  const generateArticleExternalLinks = async (
    primaryKeyword: string,
    contentDescription: string,
    title: string,
    secondaryKeywords: string[] = []
  ): Promise<Array<{ link_text: string; link_url: string }> | null> => {
    try {
      // Prepare the request payload
      const payload: ExternalLinksRequest = {
        primary_keyword: primaryKeyword,
        secondary_keywords: secondaryKeywords,
        content_description: contentDescription,
        title
      };

      // Call the API
      const response = await generateExternalLinks(payload).unwrap();

      // Check if the request was successful
      if (!response.success) {
        console.error('External links generation failed:', response.message);
        return null;
      }

      // Return the external links
      return response.external_links;
    } catch (err) {
      console.error('Error generating external links:', err);
      return null;
    }
  };

  return {
    generateArticleExternalLinks,
    isGenerating: isLoading,
    isError,
    error
  };
};

/**
 * Parse an external links generation API response
 * @param response - The API response from the external links generation endpoint
 * @returns The generated external links or null if unsuccessful
 */
export const parseExternalLinksResponse = (response: ExternalLinksResponse): Array<{ link_text: string; link_url: string }> | null => {
  if (!response.success) {
    console.error('External links generation failed:', response.message);
    return null;
  }

  return response.external_links;
};
