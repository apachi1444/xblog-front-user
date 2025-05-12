import { useGenerateTopicMutation } from 'src/services/apis/generateContentApi';

/**
 * Custom hook for generating content descriptions (topics)
 * @returns Functions and state for topic generation
 */
export const useTopicGeneration = () => {
  // Use the RTK Query mutation hook
  const [generateTopic, { isLoading, isError, error }] = useGenerateTopicMutation();

  /**
   * Generate a content description based on keywords
   * @param primaryKeyword - The main keyword for the content
   * @param secondaryKeywords - Array of secondary keywords
   * @returns The generated content description or null if there was an error
   */
  const generateContentDescription = async (
    primaryKeyword: string,
    secondaryKeywords: string[] = []
  ): Promise<string | null> => {
    try {
      // Prepare the request payload
      const payload = {
        primary_keyword: primaryKeyword,
        secondary_keywords: secondaryKeywords
      };

      // Call the API
      const response = await generateTopic(payload).unwrap();

      // Check if the request was successful
      if (response.success) {
        return response.content;
      }
      
      console.error('Content description generation failed:', response.message);
      return null;
    } catch (err) {
      console.error('Error generating content description:', err);
      return null;
    }
  };

  return {
    generateContentDescription,
    isGenerating: isLoading,
    isError,
    error
  };
};

/**
 * Parse a topic generation API response
 * @param response - The API response from the topic generation endpoint
 * @returns The generated content description or null if unsuccessful
 */
export const parseTopicResponse = (response: { 
  content: string; 
  success: boolean; 
  message: string;
}): string | null => {
  if (!response.success) {
    console.error('Content description generation failed:', response.message);
    return null;
  }
  
  return response.content;
};

/**
 * Example of how to use the topic generation hook in a component:
 * 
 * ```tsx
 * import { useTopicGeneration } from 'src/utils/topicGeneration';
 * 
 * const MyComponent = () => {
 *   const { generateContentDescription, isGenerating } = useTopicGeneration();
 *   const [description, setDescription] = useState('');
 * 
 *   const handleGenerateDescription = async () => {
 *     const primaryKeyword = 'SEO optimization';
 *     const secondaryKeywords = ['content marketing', 'search ranking'];
 *     
 *     const generatedDescription = await generateContentDescription(
 *       primaryKeyword,
 *       secondaryKeywords
 *     );
 *     
 *     if (generatedDescription) {
 *       setDescription(generatedDescription);
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <button 
 *         onClick={handleGenerateDescription}
 *         disabled={isGenerating}
 *       >
 *         {isGenerating ? 'Generating...' : 'Generate Description'}
 *       </button>
 *       
 *       {description && (
 *         <div>
 *           <h3>Content Description:</h3>
 *           <p>{description}</p>
 *         </div>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 */
