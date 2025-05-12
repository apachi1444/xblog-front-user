import type { GenerateKeywordsResponse } from 'src/services/apis/generateContentApi';

import { useGenerateKeywordsMutation } from 'src/services/apis/generateContentApi';

/**
 * Parse a secondary keywords API response
 * @param response - The API response from the keywords generation endpoint
 * @returns Array of generated secondary keywords or empty array if unsuccessful
 */
export const parseSecondaryKeywordsResponse = (response: GenerateKeywordsResponse): string[] => {
  if (!response.success) {
    console.error('Secondary keywords generation failed:', response.message);
    return [];
  }
  
  // Split the comma-separated keywords string into an array
  return response.keywords
    .split(',')
    .map((keyword: string) => keyword.trim())
    .filter((keyword: string | any[]) => keyword.length > 0);
};

/**
 * Custom hook for generating secondary keywords
 * @returns Functions and state for keyword generation
 */
export const useKeywordGeneration = () => {
  // Use the RTK Query mutation hook
  const [generateKeywords, { isLoading, isError, error}] = useGenerateKeywordsMutation();

  /**
   * Generate secondary keywords based on a primary keyword
   * @param primaryKeyword - The main keyword to generate secondary keywords for
   * @returns Array of generated secondary keywords or empty array if there was an error
   */
  const generateSecondaryKeywords = async (
    primaryKeyword: string
  ): Promise<string[]> => {
    try {
      // Prepare the request payload
      const payload = {
        primary_keyword: primaryKeyword
      };


      // Call the API
      const response = await generateKeywords(payload).unwrap();

      // Parse the response using the utility function
      return parseSecondaryKeywordsResponse(response);
    } catch (err) {
      console.error('Error generating secondary keywords:', err);
      return [];
    }
  };

  return {
    generateSecondaryKeywords,
    isGenerating: isLoading,
    isError,
    error
  };
}