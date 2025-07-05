
import { useApiGenerationWithRetry } from 'src/hooks/useApiGenerationWithRetry';


/**
 * Custom hook for generating a complete article with all sections with retry functionality
 * @returns Functions and state for full article generation
 */
export const useFullArticleGeneration = () => {
  // Use the RTK Query mutation hook

  // Use retry mechanism for API calls
  const retryHandler = useApiGenerationWithRetry({
    maxRetries: 3,
    retryDelay: 3000, // 3 seconds delay for content generation (longer process)
  });

  return {
    isGenerating: retryHandler.isLoading,
    isRetrying: retryHandler.isRetrying,
    error: retryHandler.error,
    retryCount: retryHandler.retryCount,
    canRetry: retryHandler.canRetry,
    retry: retryHandler.retry,
    reset: retryHandler.reset,
  };
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
