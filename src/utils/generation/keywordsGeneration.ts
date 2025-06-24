import type { GenerateKeywordsResponse } from 'src/services/apis/generateContentApi';

import { useApiGenerationWithRetry } from 'src/hooks/useApiGenerationWithRetry';

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
 * Custom hook for generating secondary keywords with retry functionality
 * @returns Functions and state for keyword generation
 */
export const useKeywordGeneration = () => {
  // Use the RTK Query mutation hook
  const [generateKeywords, { isLoading, isError, error}] = useGenerateKeywordsMutation();

  // Use retry mechanism for API calls
  const retryHandler = useApiGenerationWithRetry({
    maxRetries: 3,
    retryDelay: 2000, // 2 seconds delay between retries
  });

  /**
   * Generate secondary keywords based on a primary keyword with retry functionality
   * @param primaryKeyword - The main keyword to generate secondary keywords for
   * @param language - The target language for keyword generation (defaults to 'english')
   * @returns Array of generated secondary keywords or empty array if there was an error
   */
  const generateSecondaryKeywords = async (
    primaryKeyword: string,
    language: string = 'english'
  ): Promise<string[]> => {
    // Create the API call function
    const apiCall = async () => {
      // Prepare the request payload with language parameter
      const payload = {
        primary_keyword: primaryKeyword,
        language: language || 'english' // Default to English if no language provided
      };

      console.log('🔑 Generating secondary keywords with payload:', payload);

      // Call the API
      const response = await generateKeywords(payload).unwrap();

      // Parse the response using the utility function
      const keywords = parseSecondaryKeywordsResponse(response);

      console.log('✅ Successfully generated keywords:', keywords);
      return keywords;
    };

    try {
      // Execute with retry mechanism
      return await retryHandler.executeWithRetry(
        apiCall,
        'Secondary Keywords Generation',
        `Failed to generate secondary keywords for "${primaryKeyword}". Server might be overloaded.`
      );
    } catch (err) {
      console.error('❌ Final error generating secondary keywords:', err);
      return [];
    }
  };

  return {
    generateSecondaryKeywords,
    isGenerating: isLoading || retryHandler.isLoading,
    isRetrying: retryHandler.isRetrying,
    isError,
    error: error || retryHandler.error,
    retryCount: retryHandler.retryCount,
    canRetry: retryHandler.canRetry,
    retry: retryHandler.retry,
    reset: retryHandler.reset,
  };
}