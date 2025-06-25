import type { GenerateMetaRequest, GenerateMetaResponse } from 'src/services/apis/generateContentApi';

import { useApiGenerationWithRetry } from 'src/hooks/useApiGenerationWithRetry';

import { useGenerateMetaMutation } from 'src/services/apis/generateContentApi';

/**
 * Custom hook for generating meta tags for SEO optimization with retry functionality
 * @returns Functions and state for meta tags generation
 */
export const useMetaTagsGeneration = () => {
  // Use the RTK Query mutation hook
  const [generateMeta, { isLoading, isError, error }] = useGenerateMetaMutation();

  // Use retry mechanism for API calls
  const retryHandler = useApiGenerationWithRetry({
    maxRetries: 3,
    retryDelay: 2000, // 2 seconds delay between retries
  });

  /**
   * Generate meta tags based on title and primary keyword with retry functionality
   * @param primary_keyword - The main keyword for the article
   * @param secondary_keywords - Array of secondary keywords
   * @param content_description - Description of the article content
   * @param title - The article title
   * @param language - Target language for meta generation (defaults to 'english')
   * @returns The generated meta information or null if there was an error
   */
  const generateMetaTags = async (
    primary_keyword: string,
    secondary_keywords : string[],
    content_description : string,
    title: string,
    language: string = 'english'
  ): Promise<GenerateMetaResponse | null> => {
    // Create the API call function
    const apiCall = async () => {
      // Prepare the request payload with language parameter
      const payload : GenerateMetaRequest = {
        content_description,
        primary_keyword,
        secondary_keywords,
        title,
        language: language || 'english' // Default to English if no language provided
      };

      console.log('🏷️ Generating meta tags with payload:', payload);

      const response = await generateMeta(payload).unwrap();

      // Check if the request was successful
      if (!response.success) {
        console.error('Meta tags generation failed:', response.message);
        throw new Error(response.message || 'Meta tags generation failed');
      }

      // Map the API response fields to our expected format
      // API returns: meta_title, meta_description, url_slug
      // Our app expects: metaTitle, metaDescription, urlSlug
      const mappedResponse: GenerateMetaResponse = {
        success: response.success,
        message: response.message || '',
        metaTitle: (response as any).meta_title || response.metaTitle || '',
        metaDescription: (response as any).meta_description || response.metaDescription || '',
        urlSlug: (response as any).url_slug || response.urlSlug || '',
        score: response.score
      };

      console.log('✅ Successfully generated meta tags:', mappedResponse);
      return mappedResponse;
    };

    try {
      // Execute with retry mechanism
      return await retryHandler.executeWithRetry(
        apiCall,
        'Meta Tags Generation',
        `Failed to generate meta tags for "${title}". Server might be overloaded.`
      );
    } catch (err) {
      console.error('❌ Final error generating meta tags:', err);
      return null;
    }
  };

  return {
    generateMetaTags,
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