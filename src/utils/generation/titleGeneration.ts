import { useGenerateTitleMutation } from 'src/services/apis/generateContentApi';

/**
 * Custom hook for generating article titles
 * @returns Functions and state for title generation
 */
export const useTitleGeneration = () => {
  // Use the RTK Query mutation hook
  const [generateTitle, { isLoading, isError, error }] = useGenerateTitleMutation();

  /**
   * Generate a title based on keywords and content description
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
    try {
      // Prepare the request payload
      const payload = {
        primary_keyword: primaryKeyword,
        secondary_keywords: secondaryKeywords,
        content_description: contentDescription
      };

      // Call the API
      const response = await generateTitle(payload).unwrap();

      // Check if the request was successful
      if (response.success) {
        return response.title;
      } 
        console.error('Title generation failed:', response.message);
        return null;
      

    } catch (err) {
      console.error('Error generating title:', err);
      return null;
    }
  };

  return {
    generateArticleTitle,
    isGenerating: isLoading,
    isError,
    error
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
