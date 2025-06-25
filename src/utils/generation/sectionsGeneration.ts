import type { GeneratedSection, GenerateSectionsRequest, GenerateSectionsResponse } from 'src/services/apis/generateContentApi';

import { useGenerateSectionsMutation } from 'src/services/apis/generateContentApi';
import { useApiGenerationWithRetry } from 'src/hooks/useApiGenerationWithRetry';

/**
 * Custom hook for generating article sections/table of contents with retry functionality
 * @returns Functions and state for sections generation
 */
export const useSectionsGeneration = () => {
  // Use the RTK Query mutation hook
  const [generateSections, { isLoading, isError, error }] = useGenerateSectionsMutation();

  // Use retry mechanism for API calls
  const retryHandler = useApiGenerationWithRetry({
    maxRetries: 3,
    retryDelay: 2500, // 2.5 seconds delay for sections generation
  });

  /**
   * Generate article sections based on title, keyword, and other parameters with retry functionality
   * @param title - The article title
   * @param keyword - The main keyword for the article
   * @param secondaryKeywords - Array of secondary keywords
   * @param language - Optional language parameter
   * @param contentType - Optional content type parameter
   * @param articleSize - Optional article size parameter
   * @param toneOfVoice - Optional tone of voice parameter
   * @param targetCountry - Optional target country parameter
   * @returns The generated sections or null if there was an error
   */
  const generateArticleSections = async (
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

      console.log('📋 Generating article sections with payload:', payload);

      // Call the API
      const response = await generateSections(payload).unwrap();

      // Check if the request was successful
      if (!response.success) {
        console.error('Sections generation failed:', response.message);
        throw new Error(response.message || 'Sections generation failed');
      }

      console.log('✅ Successfully generated sections:', response.sections);
      return response.sections;
    };

    try {
      // Execute with retry mechanism
      return await retryHandler.executeWithRetry(
        apiCall,
        'Article Sections Generation',
        `Failed to generate sections for "${title}". Server might be overloaded.`
      );
    } catch (err) {
      console.error('❌ Final error generating sections:', err);
      return null;
    }
  };

  return {
    generateArticleSections,
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
 * Parse a sections generation API response
 * @param response - The API response from the sections generation endpoint
 * @returns The generated sections or null if unsuccessful
 */
export const parseSectionsResponse = (response: GenerateSectionsResponse): GeneratedSection[] | null => {
  if (!response.success) {
    console.error('Sections generation failed:', response.message);
    return null;
  }
  
  return response.sections;
};

/**
 * Example of how to use the sections generation hook in a component:
 * 
 * ```tsx
 * import { useSectionsGeneration } from 'src/utils/generation/sectionsGeneration';
 * 
 * const MyComponent = () => {
 *   const { generateArticleSections, isGenerating } = useSectionsGeneration();
 *   const [sections, setSections] = useState<GeneratedSection[]>([]);
 * 
 *   const handleGenerateSections = async () => {
 *     const title = "10 Essential SEO Strategies for 2023";
 *     const primaryKeyword = "SEO strategies";
 *     const secondaryKeywords = ["content marketing", "search ranking"];
 *     
 *     const generatedSections = await generateArticleSections(
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
 *     if (generatedSections) {
 *       setSections(generatedSections);
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <button 
 *         onClick={handleGenerateSections}
 *         disabled={isGenerating}
 *       >
 *         {isGenerating ? 'Generating...' : 'Generate Sections'}
 *       </button>
 *       
 *       {sections.length > 0 && (
 *         <div>
 *           <h2>Generated Sections:</h2>
 *           <ul>
 *             {sections.map((section) => (
 *               <li key={section.id}>
 *                 <h3>{section.title}</h3>
 *                 {section.content && <p>{section.content}</p>}
 *                 
 *                 {section.subsections && section.subsections.length > 0 && (
 *                   <ul>
 *                     {section.subsections.map((subsection) => (
 *                       <li key={subsection.id}>
 *                         <h4>{subsection.title}</h4>
 *                         {subsection.content && <p>{subsection.content}</p>}
 *                       </li>
 *                     ))}
 *                   </ul>
 *                 )}
 *               </li>
 *             ))}
 *           </ul>
 *         </div>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 */
