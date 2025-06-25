import { useGenerateFullArticleMutation } from 'src/services/apis/generateContentApi';
import { useApiGenerationWithRetry } from 'src/hooks/useApiGenerationWithRetry';
import type { GenerateSectionsRequest, GenerateSectionsResponse, GeneratedSection } from 'src/services/apis/generateContentApi';

/**
 * Custom hook for generating a complete article with all sections with retry functionality
 * @returns Functions and state for full article generation
 */
export const useFullArticleGeneration = () => {
  // Use the RTK Query mutation hook
  const [generateFullArticle, { isLoading, isError, error }] = useGenerateFullArticleMutation();

  // Use retry mechanism for API calls
  const retryHandler = useApiGenerationWithRetry({
    maxRetries: 3,
    retryDelay: 3000, // 3 seconds delay for content generation (longer process)
  });

  /**
   * Generate a complete article with all sections with retry functionality
   * @param title - The article title
   * @param keyword - The main keyword for the article
   * @param secondaryKeywords - Array of secondary keywords
   * @param language - Optional language parameter
   * @param contentType - Optional content type parameter
   * @param articleSize - Optional article size parameter
   * @param toneOfVoice - Optional tone of voice parameter
   * @param targetCountry - Optional target country parameter
   * @returns The generated article sections or null if there was an error
   */
  const generateCompleteArticle = async (
    title: string,
    keyword: string,
    secondaryKeywords: string[] = [],
    language: string = 'en-us',
    contentType: string = 'how-to',
    articleSize: string = 'medium',
    toneOfVoice: string = 'friendly',
    targetCountry: string = 'us'
  ): Promise<GeneratedSection[] | null> => {
    // Create the API call function
    const apiCall = async () => {
      // Prepare the request payload
      const payload: GenerateSectionsRequest = {
        title,
        keyword,
        secondaryKeywords,
        language,
        contentType,
        articleSize,
        toneOfVoice,
        targetCountry
      };

      console.log('📝 Generating full article with payload:', payload);

      // Call the API
      const response = await generateFullArticle(payload).unwrap();

      // Check if the request was successful
      if (!response.success) {
        console.error('Full article generation failed:', response.message);
        throw new Error(response.message || 'Full article generation failed');
      }

      console.log('✅ Successfully generated article sections:', response.sections);
      return response.sections;
    };

    try {
      // Execute with retry mechanism
      return await retryHandler.executeWithRetry(
        apiCall,
        'Full Article Generation',
        `Failed to generate article content for "${title}". Server might be overloaded.`
      );
    } catch (err) {
      console.error('❌ Final error generating full article:', err);
      return null;
    }
  };

  return {
    generateCompleteArticle,
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
 * Parse a full article generation API response
 * @param response - The API response from the full article generation endpoint
 * @returns The generated article sections or null if unsuccessful
 */
export const parseFullArticleResponse = (response: GenerateSectionsResponse): GeneratedSection[] | null => {
  if (!response.success) {
    console.error('Full article generation failed:', response.message);
    return null;
  }
  
  return response.sections;
};

/**
 * Example of how to use the full article generation hook in a component:
 * 
 * ```tsx
 * import { useFullArticleGeneration } from 'src/utils/generation/fullArticleGeneration';
 * 
 * const MyComponent = () => {
 *   const { generateCompleteArticle, isGenerating } = useFullArticleGeneration();
 *   const [articleSections, setArticleSections] = useState<GeneratedSection[]>([]);
 * 
 *   const handleGenerateArticle = async () => {
 *     const title = "10 Essential SEO Strategies for 2023";
 *     const primaryKeyword = "SEO strategies";
 *     const secondaryKeywords = ["content marketing", "search ranking"];
 *     
 *     const generatedArticle = await generateCompleteArticle(
 *       title,
 *       primaryKeyword,
 *       secondaryKeywords,
 *       'en-us',
 *       'how-to',
 *       'medium',
 *       'friendly',
 *       'us'
 *     );
 *     
 *     if (generatedArticle) {
 *       setArticleSections(generatedArticle);
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <button 
 *         onClick={handleGenerateArticle}
 *         disabled={isGenerating}
 *       >
 *         {isGenerating ? 'Generating...' : 'Generate Complete Article'}
 *       </button>
 *       
 *       {articleSections.length > 0 && (
 *         <div>
 *           <h2>Generated Article:</h2>
 *           <div>
 *             {articleSections.map((section) => (
 *               <div key={section.id}>
 *                 <h3>{section.title}</h3>
 *                 {section.content && <div dangerouslySetInnerHTML={{ __html: section.content }} />}
 *                 
 *                 {section.subsections && section.subsections.length > 0 && (
 *                   <div style={{ marginLeft: '20px' }}>
 *                     {section.subsections.map((subsection) => (
 *                       <div key={subsection.id}>
 *                         <h4>{subsection.title}</h4>
 *                         {subsection.content && <div dangerouslySetInnerHTML={{ __html: subsection.content }} />}
 *                       </div>
 *                     ))}
 *                   </div>
 *                 )}
 *               </div>
 *             ))}
 *           </div>
 *         </div>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 */
