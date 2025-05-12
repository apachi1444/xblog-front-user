import type { GeneratedSection, GenerateSectionsRequest, GenerateSectionsResponse } from 'src/services/apis/generateContentApi';

import { useGenerateImagesMutation } from 'src/services/apis/generateContentApi';

/**
 * Custom hook for generating image suggestions for article sections
 * @returns Functions and state for image generation
 */
export const useImagesGeneration = () => {
  // Use the RTK Query mutation hook
  const [generateImages, { isLoading, isError, error }] = useGenerateImagesMutation();

  /**
   * Generate image suggestions for article sections
   * @param title - The article title
   * @param keyword - The main keyword for the article
   * @param secondaryKeywords - Array of secondary keywords
   * @param language - Optional language parameter
   * @param contentType - Optional content type parameter
   * @returns The generated sections with image suggestions or null if there was an error
   */
  const generateArticleImages = async (
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
      const response = await generateImages(payload).unwrap();

      // Check if the request was successful
      if (!response.success) {
        console.error('Image generation failed:', response.message);
        return null;
      }

      // Return the sections with image suggestions
      return response.sections;
    } catch (err) {
      console.error('Error generating images:', err);
      return null;
    }
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
 * @returns The generated sections with image suggestions or null if unsuccessful
 */
export const parseImagesResponse = (response: GenerateSectionsResponse): GeneratedSection[] | null => {
  if (!response.success) {
    console.error('Image generation failed:', response.message);
    return null;
  }

  return response.sections;
};