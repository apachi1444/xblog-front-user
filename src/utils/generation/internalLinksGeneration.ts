import type { GeneratedSection, GenerateSectionsRequest, GenerateSectionsResponse } from 'src/services/apis/generateContentApi';

import { useGenerateInternalLinksMutation } from 'src/services/apis/generateContentApi';

/**
 * Custom hook for generating internal links for article sections
 * @returns Functions and state for internal links generation
 */
export const useInternalLinksGeneration = () => {
  // Use the RTK Query mutation hook
  const [generateInternalLinks, { isLoading, isError, error }] = useGenerateInternalLinksMutation();

  /**
   * Generate internal links for article sections
   * @param title - The article title
   * @param keyword - The main keyword for the article
   * @param secondaryKeywords - Array of secondary keywords
   * @param language - Optional language parameter
   * @param contentType - Optional content type parameter
   * @returns The generated sections with internal links or null if there was an error
   */
  const generateArticleInternalLinks = async (
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
      const response = await generateInternalLinks(payload).unwrap();

      // Check if the request was successful
      if (!response.success) {
        console.error('Internal links generation failed:', response.message);
        return null;
      }

      // Return the sections with internal links
      return response.sections;
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
 * @returns The generated sections with internal links or null if unsuccessful
 */
export const parseInternalLinksResponse = (response: GenerateSectionsResponse): GeneratedSection[] | null => {
  if (!response.success) {
    console.error('Internal links generation failed:', response.message);
    return null;
  }
  
  return response.sections;
};