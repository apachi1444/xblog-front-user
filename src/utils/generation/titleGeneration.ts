import { useApiGenerationWithRetry } from 'src/hooks/useApiGenerationWithRetry';

import { useGenerateTitleMutation } from 'src/services/apis/generateContentApi';

/**
 * Custom hook for generating article titles with retry functionality
 * @returns Functions and state for title generation
 */
export const useTitleGeneration = () => {
  // Use the RTK Query mutation hook
  const [generateTitle, { isLoading, isError, error }] = useGenerateTitleMutation();

  // Use retry mechanism for API calls
  const retryHandler = useApiGenerationWithRetry({
    maxRetries: 3,
    retryDelay: 2000, // 2 seconds delay between retries
  });

  /**
   * Generate a title based on keywords and content description with retry functionality
   * @param primaryKeyword - The main keyword for the article
   * @param secondaryKeywords - Array of secondary keywords
   * @param contentDescription - Description of the article content
   * @returns The generated title or null if there was an error
   */
  const generateArticleTitle = async (
    primaryKeyword: string,
    secondaryKeywords: string[] = [],
    contentDescription: string = ''
  ): Promise<string | null> => {
    // Create the API call function
    const apiCall = async () => {
      // Prepare the request payload
      const payload = {
        primary_keyword: primaryKeyword,
        secondary_keywords: secondaryKeywords,
        content_description: contentDescription
      };

      console.log('📝 Generating title with payload:', payload);

      // Call the API
      const response = await generateTitle(payload).unwrap();

      // Check if the request was successful
      if (response.success) {
        console.log('✅ Successfully generated title:', response.title);
        return response.title;
      }

      console.error('Title generation failed:', response.message);
      throw new Error(response.message || 'Title generation failed');
    };

    try {
      // Execute with retry mechanism
      return await retryHandler.executeWithRetry(
        apiCall,
        'Title Generation',
        `Failed to generate title for "${primaryKeyword}". Server might be overloaded.`
      );
    } catch (err) {
      console.error('❌ Final error generating title:', err);
      return null;
    }
  };

  return {
    generateArticleTitle,
    isGenerating: isLoading || retryHandler.isLoading,
    isRetrying: retryHandler.isRetrying,
    isError,
    error: error || retryHandler.error,
    retryCount: retryHandler.retryCount,
    canRetry: retryHandler.canRetry,
    retry: retryHandler.retry,
    reset: retryHandler.reset,
  };
};

/**
 * Parse a title generation API response
 * @param response - The API response from the title generation endpoint
 * @returns The generated title or null if unsuccessful
 */
export const parseTitleResponse = (response: {
  title: string;
  success: boolean;
  message: string;
}): string | null => {
  if (!response.success) {
    console.error('Title generation failed:', response.message);
    return null;
  }

  return response.title;
};
