import React, { useEffect } from 'react';

import { Box } from '@mui/material';

interface HtmlRendererProps {
  htmlContent: string;
  className?: string;
  updateDocumentHead?: boolean; // Whether to update document head with meta tags
}

/**
 * Component to render pure HTML content in React/TSX
 * Supports full HTML documents including meta tags, styles, and scripts
 */
export function HtmlRenderer({ 
  htmlContent, 
  className,
  updateDocumentHead = false 
}: HtmlRendererProps) {
  
  useEffect(() => {
    if (updateDocumentHead && htmlContent) {
      // Extract and apply meta tags, title, and other head elements
      updateDocumentHeadFromHtml(htmlContent);
    }
  }, [htmlContent, updateDocumentHead]);

  // Method 1: Render HTML content directly using dangerouslySetInnerHTML
  return (
    <Box 
      className={className}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      sx={{
        // Ensure the rendered HTML respects its own styles
        '& *': {
          // Allow HTML content to override default styles
        },
        // Preserve HTML formatting
        whiteSpace: 'normal',
        // Ensure proper text rendering
        wordBreak: 'break-word',
      }}
    />
  );
}

/**
 * Alternative component that extracts body content only
 * Use this when you want to render only the body content without full document structure
 */
export function HtmlBodyRenderer({ htmlContent, className }: Omit<HtmlRendererProps, 'updateDocumentHead'>) {
  // Extract only body content from full HTML document
  const bodyContent = extractBodyContent(htmlContent);
  
  return (
    <Box 
      className={className}
      dangerouslySetInnerHTML={{ __html: bodyContent }}
      sx={{
        // Styling for body content only
        maxWidth: '100%',
        overflow: 'hidden',
      }}
    />
  );
}

/**
 * Component that renders HTML in an iframe for complete isolation
 * Use this when you need complete HTML document rendering with full head support
 */
export function HtmlIframeRenderer({ htmlContent, className }: Omit<HtmlRendererProps, 'updateDocumentHead'>) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;

      if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();

        // Remove default margins and padding from html and body
        if (doc.documentElement) {
          doc.documentElement.style.margin = '0';
          doc.documentElement.style.padding = '0';
          doc.documentElement.style.height = '100%';
        }
        if (doc.body) {
          doc.body.style.margin = '0';
          doc.body.style.padding = '0';
          doc.body.style.height = '100%';
        }
      }
    }
  }, [htmlContent]);

  return (
    <iframe
      ref={iframeRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        margin: 0,
        padding: 0,
        backgroundColor: 'white',
        display: 'block',
      }}
      title="HTML Content"
    />
  );
}

/**
 * Utility function to extract body content from full HTML document
 */
function extractBodyContent(htmlContent: string): string {
  try {
    // Create a temporary DOM element to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Extract body content
    const {body} = doc;
    return body ? body.innerHTML : htmlContent;
  } catch (error) {
    console.warn('Failed to parse HTML content:', error);
    return htmlContent;
  }
}

/**
 * Utility function to update document head with meta tags from HTML content
 */
function updateDocumentHeadFromHtml(htmlContent: string): void {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const {head} = doc;
    
    if (!head) return;

    // Update title
    const title = head.querySelector('title');
    if (title) {
      document.title = title.textContent || '';
    }

    // Update meta tags
    const metaTags = head.querySelectorAll('meta');
    metaTags.forEach(meta => {
      const name = meta.getAttribute('name');
      const property = meta.getAttribute('property');
      const content = meta.getAttribute('content');
      
      if (!content) return;

      // Update or create meta tag
      let existingMeta: HTMLMetaElement | null = null;
      
      if (name) {
        existingMeta = document.querySelector(`meta[name="${name}"]`);
      } else if (property) {
        existingMeta = document.querySelector(`meta[property="${property}"]`);
      }

      if (existingMeta) {
        existingMeta.setAttribute('content', content);
      } else {
        const newMeta = document.createElement('meta');
        if (name) newMeta.setAttribute('name', name);
        if (property) newMeta.setAttribute('property', property);
        newMeta.setAttribute('content', content);
        document.head.appendChild(newMeta);
      }
    });

    // Update canonical link
    const canonical = head.querySelector('link[rel="canonical"]');
    if (canonical) {
      const href = canonical.getAttribute('href');
      if (href) {
        const existingCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (existingCanonical) {
          existingCanonical.href = href;
        } else {
          const newCanonical = document.createElement('link');
          newCanonical.rel = 'canonical';
          newCanonical.href = href;
          document.head.appendChild(newCanonical);
        }
      }
    }

  } catch (error) {
    console.warn('Failed to update document head:', error);
  }
}

/**
 * Function to inject HTML content into a specific element by ID within existing HTML
 * @param originalHtml - The original HTML content
 * @param targetId - The ID of the element where content should be injected
 * @param contentToInject - The HTML content to inject
 * @param replaceContent - Whether to replace existing content (true) or append (false)
 * @returns Modified HTML with injected content
 */
export function injectHtmlById(
  originalHtml: string,
  targetId: string,
  contentToInject: string,
  replaceContent = true
): string {
  try {
    // Create a temporary DOM element to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(originalHtml, 'text/html');

    // Find the target element by ID
    const targetElement = doc.getElementById(targetId);

    if (!targetElement) {
      console.warn(`Element with ID "${targetId}" not found in HTML content`);
      return originalHtml;
    }

    // Inject the content
    if (replaceContent) {
      targetElement.innerHTML = contentToInject;
    } else {
      targetElement.innerHTML += contentToInject;
    }

    // Return the modified HTML
    return doc.documentElement.outerHTML;
  } catch (error) {
    console.error('Failed to inject HTML content:', error);
    return originalHtml;
  }
}

/**
 * Function to inject multiple HTML contents into different elements by their IDs
 * @param originalHtml - The original HTML content
 * @param injections - Array of injection objects with id, content, and replace options
 * @returns Modified HTML with all injections applied
 */
export function injectMultipleHtmlById(
  originalHtml: string,
  injections: Array<{
    id: string;
    content: string;
    replace?: boolean;
  }>
): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(originalHtml, 'text/html');

    // Apply all injections
    injections.forEach(({ id, content, replace = true }) => {
      const targetElement = doc.getElementById(id);

      if (targetElement) {
        if (replace) {
          targetElement.innerHTML = content;
        } else {
          targetElement.innerHTML += content;
        }
      } else {
        console.warn(`Element with ID "${id}" not found in HTML content`);
      }
    });

    return doc.documentElement.outerHTML;
  } catch (error) {
    console.error('Failed to inject multiple HTML contents:', error);
    return originalHtml;
  }
}

/**
 * Hook for managing HTML content rendering with cleanup
 */
export function useHtmlRenderer(htmlContent: string, updateHead = false) {
  const [processedContent, setProcessedContent] = React.useState('');

  useEffect(() => {
    if (htmlContent) {
      // Process HTML content if needed
      setProcessedContent(htmlContent);

      if (updateHead) {
        updateDocumentHeadFromHtml(htmlContent);
      }
    }

    // Cleanup function to restore original document state if needed
    return () => {
      if (updateHead) {
        // Optionally restore original title/meta tags here
      }
    };
  }, [htmlContent, updateHead]);

  return processedContent;
}
