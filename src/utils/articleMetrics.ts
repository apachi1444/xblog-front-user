// Utility functions for calculating article consumption metrics

// Strip HTML tags from content
const stripHtmlTags = (html: string): string => 
  html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ');

// Count words in text
export const countWords = (text: string): number => 
  text.split(/\s+/).filter(word => word.length > 0).length;

// Count characters in text
export const countCharacters = (text: string): number => 
  text.replace(/\s/g, '').length;

// Calculate reading time (average 200 words per minute)
export const calculateReadingTime = (wordCount: number): number => 
  Math.ceil(wordCount / 200);

// Extract content from article
export const extractArticleContent = (article: any): string => {
  // Try to get content from different possible fields
  if (article.content) {
    // If it's HTML, extract text content
    if (article.content.includes('<')) {
      const bodyMatch = article.content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch && bodyMatch[1]) {
        return stripHtmlTags(bodyMatch[1]);
      }
      return stripHtmlTags(article.content);
    }
    return article.content;
  }
  
  // Fallback to content description
  if (article.content_description) {
    return article.content_description;
  }
  
  return '';
};

// Calculate comprehensive article metrics
export interface ArticleMetrics {
  wordCount: number;
  characterCount: number;
  readingTime: number; // in minutes
  hasContent: boolean;
  contentLength: 'short' | 'medium' | 'long';
  primaryKeyword?: string;
  language?: string;
}

export const calculateArticleMetrics = (article: any): ArticleMetrics => {
  const content = extractArticleContent(article);
  const wordCount = countWords(content);
  const characterCount = countCharacters(content);
  const readingTime = calculateReadingTime(wordCount);
  
  // Determine content length category
  let contentLength: 'short' | 'medium' | 'long' = 'short';
  if (wordCount >= 2000) {
    contentLength = 'long';
  } else if (wordCount >= 800) {
    contentLength = 'medium';
  }
  
  return {
    wordCount,
    characterCount,
    readingTime,
    hasContent: wordCount > 0,
    contentLength,
    primaryKeyword: article.primary_keyword,
    language: article.language,
  };
};

// Format metrics for display
export const formatMetrics = (metrics: ArticleMetrics) => ({
  wordCount: `${metrics.wordCount.toLocaleString()} words`,
  readingTime: `${metrics.readingTime} min read`,
  contentLength: metrics.contentLength,
});

// Get content quality indicator
export const getContentQuality = (metrics: ArticleMetrics): {
  level: 'low' | 'medium' | 'high';
  color: 'error' | 'warning' | 'success';
  label: string;
} => {
  if (metrics.wordCount >= 1500) {
    return { level: 'high', color: 'success', label: 'High Quality' };
  }
  if (metrics.wordCount >= 500) {
    return { level: 'medium', color: 'warning', label: 'Medium Quality' };
  }
  return { level: 'low', color: 'error', label: 'Needs Content' };
};
