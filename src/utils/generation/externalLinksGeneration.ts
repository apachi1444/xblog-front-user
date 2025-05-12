import type { GeneratedSection, GenerateSectionsRequest, GenerateSectionsResponse } from 'src/services/apis/generateContentApi';

import { useGenerateExternalLinksMutation } from 'src/services/apis/generateContentApi';

/**
 * Custom hook for generating external links for article sections
 * @returns Functions and state for external links generation
 */
export const useExternalLinksGeneration = () => {
  // Use the RTK Query mutation hook
  const [generateExternalLinks, { isLoading, isError, error }] = useGenerateExternalLinksMutation();

  /**
   * Generate external links for article sections
   * @param title - The article title
   * @param keyword - The main keyword for the article
   * @param secondaryKeywords - Array of secondary keywords
   * @param language - Optional language parameter
   * @param contentType - Optional content type parameter
   * @returns The generated sections with external links or null if there was an error
   */
  const generateArticleExternalLinks = async (
    title: string,
    keyword: string,
    secondaryKeywords: string[] = [],
    language: string = 'en-us',
    contentType: string = 'how-to'
  ): Promise<GeneratedSection[] | null> => {
    try {
      // Prepare the request payload
      const payload: GenerateSectionsRequest = {
        title,
        keyword,
        secondaryKeywords,
        language,
        contentType
      };

      // Call the API
      const response = await generateExternalLinks(payload).unwrap();

      // Check if the request was successful
      if (!response.success) {
        console.error('External links generation failed:', response.message);
        return null;
      }

      // Return the sections with external links
      return response.sections;
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
 * @returns The generated sections with external links or null if unsuccessful
 */
export const parseExternalLinksResponse = (response: GenerateSectionsResponse): GeneratedSection[] | null => {
  if (!response.success) {
    console.error('External links generation failed:', response.message);
    return null;
  }
  
  return response.sections;
};
