import type { GeneratedImage, GenerateImagesRequest, GenerateImagesResponse } from 'src/services/apis/generateContentApi';

import { useApiGenerationWithRetry } from 'src/hooks/useApiGenerationWithRetry';

import { useGenerateImagesMutation } from 'src/services/apis/generateContentApi';

/**
 * Custom hook for generating image suggestions for article content
 * @returns Functions and state for image generation
 */
export const useImagesGeneration = () => {
  // Use the RTK Query mutation hook
  const [generateImages, { isLoading, isError, error }] = useGenerateImagesMutation();

  // Use retry mechanism for API calls
  const retryHandler = useApiGenerationWithRetry({
    maxRetries: 3,
    retryDelay: 2000, // 2 seconds delay between retries
  });

  /**
   * Generate image suggestions for article content
   * @param topic - The article topic/title
   * @param numberOfImages - Number of images to generate (default: 3)
   * @returns The generated images or null if there was an error
   */
  const generateArticleImages = async (
    topic: string,
    numberOfImages: number = 3
  ): Promise<GeneratedImage[] | null> => {
    // Create the API call function
    const apiCall = async () => {
      // Prepare the request payload
      const payload: GenerateImagesRequest = {
        topic,
        number_of_images: numberOfImages
      };

      // Call the API
      const response = await generateImages(payload).unwrap();

      // Check if the request was successful
      if (!response.success) {
        throw new Error(response.message || 'Image generation failed');
      }

      return response.images;
    };

    // Execute with retry mechanism
    return retryHandler.executeWithRetry(apiCall, 'Image generation');
  };

  return {
    generateArticleImages,
    isGenerating: isLoading,
    isError,
    error
  };
};

/**
 * Parse an image generation API response
 * @param response - The API response from the image generation endpoint
 * @returns The generated images or null if unsuccessful
 */
export const parseImagesResponse = (response: GenerateImagesResponse): GeneratedImage[] | null => {
  if (!response.success) {
    console.error('Image generation failed:', response.message);
    return null;
  }

  return response.images;
};