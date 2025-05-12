import type { GeneratedSection, GenerateSectionsRequest, GenerateSectionsResponse } from 'src/services/apis/generateContentApi';

import { useGenerateSectionsMutation } from 'src/services/apis/generateContentApi';

/**
 * Custom hook for generating article sections/table of contents
 * @returns Functions and state for sections generation
 */
export const useSectionsGeneration = () => {
  // Use the RTK Query mutation hook
  const [generateSections, { isLoading, isError, error }] = useGenerateSectionsMutation();

  /**
   * Generate article sections based on title, keyword, and other parameters
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
    try {
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

      // Call the API
      const response = await generateSections(payload).unwrap();

      // Check if the request was successful
      if (!response.success) {
        console.error('Sections generation failed:', response.message);
        return null;
      }

      // Return the sections
      return response.sections;
    } catch (err) {
      console.error('Error generating sections:', err);
      return null;
    }
  };

  return {
    generateArticleSections,
    isGenerating: isLoading,
    isError,
    error
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
