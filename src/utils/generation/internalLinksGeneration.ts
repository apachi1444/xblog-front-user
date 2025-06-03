import type { InternalLinksRequest, InternalLinksResponse } from 'src/services/apis/generateContentApi';

import { useGenerateInternalLinksMutation } from 'src/services/apis/generateContentApi';

/**
 * Custom hook for generating internal links for article sections
 * @returns Functions and state for internal links generation
 */
export const useInternalLinksGeneration = () => {
  // Use the RTK Query mutation hook
  const [generateInternalLinks, { isLoading, isError, error }] = useGenerateInternalLinksMutation();

  /**
   * Generate internal links for article content
   * @param websiteUrl - The website URL to generate internal links for
   * @returns The generated internal links or null if there was an error
   */
  const generateArticleInternalLinks = async (
    websiteUrl: string
  ): Promise<Array<{ link_text: string; link_url: string }> | null> => {
    try {
      // Prepare the request payload
      const payload: InternalLinksRequest = {
        website_url: websiteUrl
      };

      // Call the API
      const response = await generateInternalLinks(payload).unwrap();

      // Check if the request was successful
      if (!response.success) {
        console.error('Internal links generation failed:', response.message);
        return null;
      }

      // Return the internal links
      return response.internal_links;
    } catch (err) {
      console.error('Error generating internal links:', err);
      return null;
    }
  };

  return {
    generateArticleInternalLinks,
    isGenerating: isLoading,
    isError,
    error
  };
};

/**
 * Parse an internal links generation API response
 * @param response - The API response from the internal links generation endpoint
 * @returns The generated internal links or null if unsuccessful
 */
export const parseInternalLinksResponse = (response: InternalLinksResponse): Array<{ link_text: string; link_url: string }> | null => {
  if (!response.success) {
    console.error('Internal links generation failed:', response.message);
    return null;
  }

  return response.internal_links;
};