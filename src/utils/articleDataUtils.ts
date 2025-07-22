import type { ArticleFaq, ArticleToc, ArticleImage } from 'src/sections/generate/schemas';

/**
 * Utility functions for converting between array and string formats
 * for article data (toc, images, faq)
 */

// Convert array to JSON string for API
export const arrayToString = <T>(array: T[] | undefined | null): string | null => {
  if (!array || array.length === 0) return null;
  try {
    return JSON.stringify(array);
  } catch (error) {
    console.error('Error converting array to string:', error);
    return null;
  }
};

// Convert JSON string to array from API
export const stringToArray = <T>(str: string | null | undefined, fallback: T[] = []): T[] => {
  if (!str) return fallback;
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.error('Error parsing string to array:', error);
    return fallback;
  }
};

// Specific converters for each data type
export const tocToString = (toc: ArticleToc[] | undefined | null): string | null => arrayToString(toc);

export const stringToToc = (str: string | null | undefined): ArticleToc[] => stringToArray<ArticleToc>(str, []);

export const imagesToString = (images: ArticleImage[] | undefined | null): string | null => arrayToString(images);

export const stringToImages = (str: string | null | undefined): ArticleImage[] => stringToArray<ArticleImage>(str, []);

export const faqToString = (faq: ArticleFaq[] | undefined | null): string | null => arrayToString(faq);

export const stringToFaq = (str: string | null | undefined): ArticleFaq[] => stringToArray<ArticleFaq>(str, []);

// Helper function to safely parse any JSON string
export const safeJsonParse = <T>(str: string | null | undefined, fallback: T): T => {
  if (!str) return fallback;
  try {
    return JSON.parse(str) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
};

// Helper function to safely stringify any object
export const safeJsonStringify = (obj: any): string | null => {
  if (!obj) return null;
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error stringifying object:', error);
    return null;
  }
};
