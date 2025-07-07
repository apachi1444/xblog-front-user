import type { GeneratedSection, GenerateSectionsRequest, GenerateSectionsResponse } from 'src/services/apis/generateContentApi';

import { useApiGenerationWithRetry } from 'src/hooks/useApiGenerationWithRetry';

import { useGenerateSectionsMutation } from 'src/services/apis/generateContentApi';

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
   * Generate article sections based on the new API schema with retry functionality
   * @param request - The complete request object matching the API schema
   * @returns The generated sections or null if there was an error
   */
  const generateArticleSections = async (
    request: GenerateSectionsRequest
  ): Promise<GeneratedSection[] | null> => {
    // Create the API call function
    const apiCall = async () => {
      console.log('📋 Generating article sections with payload:', request);

      // Call the API
      const response = await generateSections(request).unwrap();

      // Check if the request was successful
      if (!response) {
        throw new Error('Sections generation failed');
      }

      console.log('✅ Successfully generated sections:', response.sections);
      return response.sections;
    };

    try {
      // Execute with retry mechanism
      return await retryHandler.executeWithRetry(
        apiCall,
        'Article Sections Generation',
        `Failed to generate sections for "${request.article_title}". Server might be overloaded.`
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
  if (!response) {
    return null;
  }
  
  return response.sections;
};

/**
 * Example of how to use the sections generation hook in a component:
 *
 * ```tsx
 * import { useSectionsGeneration } from 'src/utils/generation/sectionsGeneration';
 * import type { GenerateSectionsRequest } from 'src/services/apis/generateContentApi';
 *
 * const MyComponent = () => {
 *   const { generateArticleSections, isGenerating } = useSectionsGeneration();
 *   const [sections, setSections] = useState<GeneratedSection[]>([]);
 *
 *   const handleGenerateSections = async () => {
 *     const request: GenerateSectionsRequest = {
 *       toc: [
 *         { heading: "Introduction", subheadings: [] },
 *         { heading: "Main Content", subheadings: ["Subsection 1", "Subsection 2"] }
 *       ],
 *       article_title: "10 Essential SEO Strategies for 2023",
 *       target_audience: "general",
 *       tone: "friendly",
 *       point_of_view: "third-person",
 *       article_type: "how-to",
 *       article_size: "medium",
 *       links: [],
 *       images: [],
 *       language: "english"
 *     };
 *
 *     const generatedSections = await generateArticleSections(request);
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
