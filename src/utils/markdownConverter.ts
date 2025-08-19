/**
 * Utility functions to convert HTML content to markdown format
 */

import type { GenerateArticleFormData } from 'src/sections/generate/schemas';

import TurndownService from 'turndown';

/**
 * Convert HTML to Markdown using Turndown library
 * @param html HTML string to convert
 * @returns Markdown string
 */
export const htmlToMarkdown = (html: string): string => {
  if (!html) return '';

  const turndownService = new TurndownService({
    headingStyle: 'atx', // Use # for headings
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    fence: '```',
    emDelimiter: '*',
    strongDelimiter: '**',
    linkStyle: 'inlined',
    linkReferenceStyle: 'full'
  });

  // Add custom rules for better conversion
  turndownService.addRule('removeComments', {
    filter (node) {
      return node.nodeType === 8; // Comment node
    },
    replacement () {
      return '';
    }
  });

  try {
    return turndownService.turndown(html);
  } catch (error) {
    console.error('Error converting HTML to Markdown:', error);
    // Fallback: return HTML as-is
    return html;
  }
};

/**
 * Get HTML content from form data
 * @param formData The complete form data
 * @returns HTML string
 */
export const getHtmlContent = (formData: GenerateArticleFormData): string => {
  if (formData.generatedHtml) {
    return formData.generatedHtml;
  }

  // Fallback if no generated HTML
  const title = formData.step1?.title || 'Untitled Article';
  return `<h1>${title}</h1><p>No content has been generated yet.</p>`;
};

/**
 * Convert form data to markdown format
 * @param formData The complete form data
 * @returns Markdown string for the entire article
 */
export const formDataToMarkdown = (formData: GenerateArticleFormData): string => {
  console.log('formDataToMarkdown called with:', formData);

  const htmlContent = getHtmlContent(formData);
  const markdown = htmlToMarkdown(htmlContent);

  console.log('Generated markdown:', markdown);
  return markdown;
};

/**
 * Convert form data to HTML format
 * @param formData The complete form data
 * @returns HTML string for the entire article
 */
export const formDataToHtml = (formData: GenerateArticleFormData): string => getHtmlContent(formData);
