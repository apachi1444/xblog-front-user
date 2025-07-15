/**
 * Utility functions for processing HTML content to make links open in new tabs
 */

/**
 * Processes HTML content to ensure all links open in new tabs
 * Adds target="_blank" and rel="noopener noreferrer" to all anchor tags
 * @param htmlContent - The HTML content to process
 * @returns Processed HTML content with updated link attributes
 */
export function processLinksForNewTab(htmlContent: string): string {
  if (!htmlContent) return htmlContent;

  // Create a temporary DOM element to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Find all anchor tags
  const links = tempDiv.querySelectorAll('a');

  // Update each link to open in new tab
  links.forEach((link) => {
    // Only add target="_blank" if it doesn't already exist
    if (!link.hasAttribute('target')) {
      link.setAttribute('target', '_blank');
    }
    
    // Add rel="noopener noreferrer" for security
    const existingRel = link.getAttribute('rel') || '';
    const relValues = existingRel.split(' ').filter(val => val.trim() !== '');
    
    if (!relValues.includes('noopener')) {
      relValues.push('noopener');
    }
    if (!relValues.includes('noreferrer')) {
      relValues.push('noreferrer');
    }
    
    link.setAttribute('rel', relValues.join(' '));
  });

  return tempDiv.innerHTML;
}

/**
 * Processes HTML content using regex (alternative approach for server-side or when DOM is not available)
 * @param htmlContent - The HTML content to process
 * @returns Processed HTML content with updated link attributes
 */
export function processLinksForNewTabRegex(htmlContent: string): string {
  if (!htmlContent) return htmlContent;

  // Regex to match anchor tags
  return htmlContent.replace(
    /<a\s+([^>]*?)>/gi,
    (match, attributes) => {
      // Check if target attribute already exists
      const hasTarget = /target\s*=\s*["'][^"']*["']/i.test(attributes);
      const hasRel = /rel\s*=\s*["']([^"']*)["']/i.test(attributes);

      let newAttributes = attributes;

      // Add target="_blank" if not present
      if (!hasTarget) {
        newAttributes += ' target="_blank"';
      }

      // Handle rel attribute
      if (hasRel) {
        // Update existing rel attribute
        newAttributes = newAttributes.replace(
          /rel\s*=\s*["']([^"']*)["']/i,
          (relMatch, relValue) => {
            const relValues = relValue.split(' ').filter((val: string) => val.trim() !== '');
            if (!relValues.includes('noopener')) {
              relValues.push('noopener');
            }
            if (!relValues.includes('noreferrer')) {
              relValues.push('noreferrer');
            }
            return `rel="${relValues.join(' ')}"`;
          }
        );
      } else {
        // Add rel attribute
        newAttributes += ' rel="noopener noreferrer"';
      }

      return `<a ${newAttributes}>`;
    }
  );
}

/**
 * Hook to process HTML content for React components
 * @param htmlContent - The HTML content to process
 * @param useRegex - Whether to use regex approach instead of DOM manipulation
 * @returns Processed HTML content
 */
export function useProcessedHtmlContent(htmlContent: string, useRegex = false): string {
  if (useRegex) {
    return processLinksForNewTabRegex(htmlContent);
  }
  return processLinksForNewTab(htmlContent);
}
