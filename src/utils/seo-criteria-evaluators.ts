/* eslint-disable @typescript-eslint/no-shadow */
import type { GenerateArticleFormData } from 'src/sections/generate/schemas';

import { sections, CRITERIA_TO_INPUT_MAP, INPUT_TO_CRITERIA_MAP } from './seo-criteria-definitions';

import type { CriterionStatus } from '../types/criteria.types';

// Utility functions for content analysis
const stripHtmlTags = (html: string): string => html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ');

const countWords = (text: string): number => text.split(/\s+/).filter(word => word.length > 0).length;



const getContentText = (formData: GenerateArticleFormData): string => {
  // Only use generated HTML content within <body> tags
  if (formData.generatedHtml) {
    // Extract content between <body> tags
    const bodyMatch = formData.generatedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch && bodyMatch[1]) {
      return stripHtmlTags(bodyMatch[1]);
    }
    // Fallback: use entire HTML if no body tags found
    return stripHtmlTags(formData.generatedHtml);
  }

  // Fallback: Use content description only if no HTML
  return formData.step1?.contentDescription || '';
};

const findKeywordInSubheadings = (sections: any[], keyword: string): boolean => {
  if (!sections || !Array.isArray(sections) || !keyword) return false;

  return sections.some(section => {
    const title = section.title || '';
    return title.toLowerCase().includes(keyword.toLowerCase());
  });
};

const calculateKeywordDensity = (text: string, keyword: string): number => {
  if (!text || !keyword) return 0;

  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  const keywordCount = words.filter(word => word.includes(keyword.toLowerCase())).length;

  return words.length > 0 ? (keywordCount / words.length) * 100 : 0;
};

const hasExternalLinks = (_sections: any[], generatedHtml?: string): boolean => {
  // Only check in generated HTML body content
  if (generatedHtml) {
    // Extract content between <body> tags
    const bodyMatch = generatedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const contentToCheck = bodyMatch && bodyMatch[1] ? bodyMatch[1] : generatedHtml;

    const externalLinkRegex = /<a[^>]+href=["']https?:\/\/[^"']+["'][^>]*>/gi;
    return externalLinkRegex.test(contentToCheck);
  }

  return false;
};

const hasInternalLinks = (_sections: any[], generatedHtml?: string): boolean => {
  // Only check in generated HTML body content
  if (generatedHtml) {
    // Extract content between <body> tags
    const bodyMatch = generatedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const contentToCheck = bodyMatch && bodyMatch[1] ? bodyMatch[1] : generatedHtml;

    const internalLinkRegex = /<a[^>]+href=["'][^h][^t][^t][^p][^"']*["'][^>]*>/gi;
    return internalLinkRegex.test(contentToCheck);
  }

  return false;
};

const hasImages = (images: any[], _sections: any[], generatedHtml?: string): boolean => {
  // Check if images array exists and has content
  if (images && Array.isArray(images) && images.length > 0) {
    return true;
  }

  // Only check in generated HTML body content
  if (generatedHtml) {
    // Extract content between <body> tags
    const bodyMatch = generatedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const contentToCheck = bodyMatch && bodyMatch[1] ? bodyMatch[1] : generatedHtml;

    const imageRegex = /<img[^>]+>/gi;
    return imageRegex.test(contentToCheck);
  }

  return false;
};

const hasTableOfContents = (toc: any[], sections: any[]): boolean => {
  // Check if TOC array exists and has content
  if (toc && Array.isArray(toc) && toc.length > 0) {
    return true;
  }

  // Check if we have multiple sections (implies TOC structure)
  if (sections && Array.isArray(sections) && sections.length > 2) {
    return true;
  }

  return false;
};

const hasShortParagraphs = (_sections: any[], generatedHtml?: string): { status: 'success' | 'warning' | 'error', percentage: number } => {
  let allParagraphs: string[] = [];

  // Only extract paragraphs from generated HTML body content
  if (generatedHtml) {
    // Extract content between <body> tags
    const bodyMatch = generatedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const contentToCheck = bodyMatch && bodyMatch[1] ? bodyMatch[1] : generatedHtml;

    const paragraphRegex = /<p[^>]*>(.*?)<\/p>/gi;
    const matches = contentToCheck.match(paragraphRegex) || [];
    allParagraphs = matches.map(p => stripHtmlTags(p));
  }

  if (allParagraphs.length === 0) {
    return { status: 'error', percentage: 0 };
  }

  const shortParagraphs = allParagraphs.filter(p => {
    const wordCount = countWords(p);
    return wordCount <= 150; // Consider paragraphs with 150 words or less as "short"
  });

  const percentage = (shortParagraphs.length / allParagraphs.length) * 100;

  if (percentage >= 80) return { status: 'success', percentage };
  if (percentage >= 60) return { status: 'warning', percentage };
  return { status: 'error', percentage };
};


// Type for evaluation functions
export type EvaluationFunction = (
  value: any,
  formData: GenerateArticleFormData,
) => {
  status: CriterionStatus;
  message: string;
  score: number;
}

// Type for improvement functions
export type ImprovementFunction = (value: any, formData: GenerateArticleFormData) => any;

// Evaluation functions for each criteria
export const EVALUATION_FUNCTIONS: Record<number, EvaluationFunction> = {
  // SEO Core Essentials
  101: (_, formData) => { // keyword_in_title
    const criterion = sections[0].criteria[0]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { title, primaryKeyword } = formData.step1;

    console.log(title, primaryKeyword, " title and primary keyword");


    if (!title || !primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for title and primary keyword',
        score: 0,
      };
    }

    if (title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  102: (_, formData) => { // keyword_in_meta
    const criterion = sections[0].criteria[1]

    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { metaDescription, primaryKeyword } = formData.step1;

    if (!metaDescription || !primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for meta description and primary keyword',
        score: 0,
      };
    }

    if (metaDescription.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  103: (_, formData) => { // keyword_in_url
    const criterion = sections[0].criteria[2]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { urlSlug, primaryKeyword } = formData.step1;

    if (!urlSlug || !primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for URL slug and primary keyword',
        score: 0,
      };
    }

    if (urlSlug.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  104: (_, formData) => { // keyword_in_first_10
    const criterion = sections[0].criteria[3]

    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { contentDescription, primaryKeyword } = formData.step1;

    if (!contentDescription || !primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for content and primary keyword',
        score: 0,
      };
    }

    // Get first 10% of content
    const firstTenPercent = contentDescription.substring(0, Math.floor(contentDescription.length * 0.1));

    if (firstTenPercent.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  105: (_, formData) => { // keyword_in_content
    const criterion = sections[0].criteria[4]

    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { contentDescription, primaryKeyword } = formData.step1;

    if (!contentDescription || !primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for content and primary keyword',
        score: 0,
      };
    }

    if (contentDescription.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  106: (_, formData) => { // content_length
    const criterion = sections[0].criteria[5]

    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    // Get content from generated HTML or sections
    const contentText = getContentText(formData);

    if (!contentText || contentText.trim().length === 0) {
      return {
        status: 'pending',
        message: 'Waiting for content generation',
        score: 0,
      };
    }

    // Count words in the actual content
    const wordCount = countWords(contentText);

    if (wordCount >= 2500) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    if (wordCount >= 1000) {
      return {
        status: 'warning',
        message: criterion.evaluationStatus.warning || '',
        score: criterion.warningScore || Math.floor(criterion.weight * 0.7),
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  // SEO Boosters
  201: (_, formData) => { // keyword_in_subheadings
    const criterion = sections[1].criteria[0]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { primaryKeyword } = formData.step1;
    const sections_data = formData.step3?.sections;

    if (!primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for primary keyword',
        score: 0,
      };
    }

    if (!sections_data || sections_data.length === 0) {
      return {
        status: 'pending',
        message: 'Waiting for content generation',
        score: 0,
      };
    }

    // Check if keyword appears in section titles (subheadings)
    const hasKeywordInSubheadings = findKeywordInSubheadings(sections_data, primaryKeyword);

    if (hasKeywordInSubheadings) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  202: (_, formData) => { // keyword_density
    const criterion = sections[1].criteria[1]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { primaryKeyword } = formData.step1;

    if (!primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for primary keyword',
        score: 0,
      };
    }

    // Get content from generated HTML or sections
    const contentText = getContentText(formData);

    if (!contentText || contentText.trim().length === 0) {
      return {
        status: 'pending',
        message: 'Waiting for content generation',
        score: 0,
      };
    }

    // Calculate keyword density in actual content
    const density = calculateKeywordDensity(contentText, primaryKeyword);

    if (density >= 1 && density <= 3) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    if (density > 0) {
      return {
        status: 'warning',
        message: criterion.evaluationStatus.warning || '',
        score: criterion.warningScore || Math.floor(criterion.weight * 0.7),
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  // SEO Boosters - Additional criteria
  203: (_, formData) => { // url_slug_length
    const criterion = sections[1].criteria[2]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { urlSlug } = formData.step1;

    if (!urlSlug) {
      return {
        status: 'pending',
        message: 'Waiting for URL slug',
        score: 0,
      };
    }

    const wordCount = urlSlug.split('-').filter(word => word.length > 0).length;

    if (wordCount >= 3 && wordCount <= 6) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    if (wordCount >= 2 && wordCount <= 8) {
      return {
        status: 'warning',
        message: criterion.evaluationStatus.warning || '',
        score: criterion.warningScore || Math.floor(criterion.weight * 0.75),
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  204: (_, formData) => { // external_links
    const criterion = sections[1].criteria[3]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const sections_data = formData.step3?.sections;
    const {generatedHtml} = formData;

    if (!sections_data && !generatedHtml) {
      return {
        status: 'pending',
        message: 'Waiting for content generation',
        score: 0,
      };
    }

    const hasExtLinks = hasExternalLinks(sections_data || [], generatedHtml);

    if (hasExtLinks) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  205: (_, formData) => { // dofollow_links
    const criterion = sections[1].criteria[4]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const sections_data = formData.step3?.sections;
    const {generatedHtml} = formData;

    if (!sections_data && !generatedHtml) {
      return {
        status: 'pending',
        message: 'Waiting for content generation',
        score: 0,
      };
    }

    // For now, assume external links are dofollow by default
    const hasExtLinks = hasExternalLinks(sections_data || [], generatedHtml);

    if (hasExtLinks) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  206: (_, formData) => { // internal_links
    const criterion = sections[1].criteria[5]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const sections_data = formData.step3?.sections;
    const {generatedHtml} = formData;

    if (!sections_data && !generatedHtml) {
      return {
        status: 'pending',
        message: 'Waiting for content generation',
        score: 0,
      };
    }

    const hasIntLinks = hasInternalLinks(sections_data || [], generatedHtml);

    if (hasIntLinks) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  // Title Optimization
  301: (_, formData) => { // keyword_at_start
    const criterion = sections[2].criteria[0]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { title, primaryKeyword } = formData.step1;

    if (!title || !primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for title and primary keyword',
        score: 0,
      };
    }

    // Check if title starts with the primary keyword
    if (title.toLowerCase().startsWith(primaryKeyword.toLowerCase())) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  302: (_, formData) => { // title_sentiment
    const criterion = sections[2].criteria[1]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { title } = formData.step1;

    if (!title) {
      return {
        status: 'pending',
        message: 'Waiting for title',
        score: 0,
      };
    }

    // Simple sentiment check - look for positive/negative words
    const positiveWords = ['best', 'top', 'ultimate', 'complete', 'essential', 'amazing', 'perfect', 'great', 'excellent'];
    const negativeWords = ['worst', 'terrible', 'awful', 'bad', 'horrible', 'avoid', 'never', 'don\'t'];

    const titleLower = title.toLowerCase();
    const hasPositive = positiveWords.some(word => titleLower.includes(word));
    const hasNegative = negativeWords.some(word => titleLower.includes(word));

    if (hasPositive || hasNegative) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  303: (_, formData) => { // power_words
    const criterion = sections[2].criteria[2]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { title } = formData.step1;

    if (!title) {
      return {
        status: 'pending',
        message: 'Waiting for title',
        score: 0,
      };
    }

    // Power words that grab attention
    const powerWords = ['ultimate', 'complete', 'essential', 'proven', 'secret', 'exclusive', 'instant', 'guaranteed', 'powerful', 'effective'];

    const titleLower = title.toLowerCase();
    const powerWordCount = powerWords.filter(word => titleLower.includes(word)).length;

    if (powerWordCount >= 2) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    if (powerWordCount >= 1) {
      return {
        status: 'warning',
        message: criterion.evaluationStatus.warning || '',
        score: criterion.warningScore || Math.floor(criterion.weight * 0.67),
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  // Content Clarity
  401: (_, formData) => { // table_of_contents
    const criterion = sections[3].criteria[0]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const {toc} = formData;
    const sections_data = formData.step3?.sections;

    if (!toc && !sections_data) {
      return {
        status: 'pending',
        message: 'Waiting for content generation',
        score: 0,
      };
    }

    const hasTOC = hasTableOfContents(toc || [], sections_data || []);

    if (hasTOC) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  402: (_, formData) => { // short_paragraphs
    const criterion = sections[3].criteria[1]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const sections_data = formData.step3?.sections;
    const {generatedHtml} = formData;

    if (!sections_data && !generatedHtml) {
      return {
        status: 'pending',
        message: 'Waiting for content generation',
        score: 0,
      };
    }

    const paragraphAnalysis = hasShortParagraphs(sections_data || [], generatedHtml);

    if (paragraphAnalysis.status === 'success') {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    if (paragraphAnalysis.status === 'warning') {
      return {
        status: 'warning',
        message: criterion.evaluationStatus.warning || '',
        score: criterion.warningScore || Math.floor(criterion.weight * 0.75),
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  403: (_, formData) => { // media_content
    const criterion = sections[3].criteria[2]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const {images} = formData;
    const sections_data = formData.step3?.sections;
    const {generatedHtml} = formData;

    if (!images && !sections_data && !generatedHtml) {
      return {
        status: 'pending',
        message: 'Waiting for content generation',
        score: 0,
      };
    }

    const hasMediaContent = hasImages(images || [], sections_data || [], generatedHtml);

    if (hasMediaContent) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  }
};

// Improvement functions for each criteria
export const IMPROVEMENT_FUNCTIONS: Record<number, ImprovementFunction> = {
  // SEO Core Essentials
  101: (currentValue, formData) => { // keyword_in_title
    const { title, primaryKeyword } = formData.step1;
    const valueToOptimize = currentValue || title;
    if (!valueToOptimize) return primaryKeyword || 'Untitled';
    if (!primaryKeyword) return valueToOptimize;

    if (!valueToOptimize.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return `${primaryKeyword}: ${valueToOptimize}`;
    }

    return valueToOptimize;
  },

  102: (currentValue, formData) => { // keyword_in_meta
    const { metaDescription, primaryKeyword } = formData.step1;
    const valueToOptimize = currentValue || metaDescription;
    if (!valueToOptimize) return `Learn about ${primaryKeyword || 'this topic'} in this comprehensive guide.`;
    if (!primaryKeyword) return valueToOptimize;

    if (!valueToOptimize.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return `${valueToOptimize} Learn more about ${primaryKeyword}.`;
    }

    return valueToOptimize;
  },

  103: (currentValue, formData) => { // keyword_in_url
    const { urlSlug, primaryKeyword } = formData.step1;
    const valueToOptimize = currentValue || urlSlug;
    if (!valueToOptimize) return primaryKeyword?.toLowerCase().replace(/\s+/g, '-') || 'article';
    if (!primaryKeyword) return valueToOptimize;

    if (!valueToOptimize.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return `${primaryKeyword.toLowerCase().replace(/\s+/g, '-')}-${valueToOptimize}`;
    }

    return valueToOptimize;
  },

  104: (currentValue, formData) => { // keyword_in_first_10
    const { contentDescription, primaryKeyword } = formData.step1;
    const valueToOptimize = currentValue || contentDescription;
    if (!valueToOptimize) return `${primaryKeyword || 'This topic'} is an important subject to understand...`;
    if (!primaryKeyword) return valueToOptimize;

    // Get first 10% of content
    const firstTenPercent = valueToOptimize.substring(0, Math.floor(valueToOptimize.length * 0.1));

    if (!firstTenPercent.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      // Insert the keyword at the beginning
      return `${primaryKeyword} - ${valueToOptimize}`;
    }

    return valueToOptimize;
  },

  105: (currentValue, formData) => { // keyword_in_content
    const { contentDescription, primaryKeyword } = formData.step1;
    const valueToOptimize = currentValue || contentDescription;
    if (!valueToOptimize) return `This article is about ${primaryKeyword || 'an important topic'}.`;
    if (!primaryKeyword) return valueToOptimize;

    if (!valueToOptimize.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      // Add the keyword to the content
      return `${valueToOptimize} In conclusion, ${primaryKeyword} is an important topic to understand.`;
    }

    return valueToOptimize;
  },

  301: (currentValue, formData) => { // keyword_at_start
    const { title, primaryKeyword } = formData.step1;
    const valueToOptimize = currentValue || title;
    if (!valueToOptimize) return primaryKeyword || 'Untitled';
    if (!primaryKeyword) return valueToOptimize;

    if (!valueToOptimize.toLowerCase().startsWith(primaryKeyword.toLowerCase())) {
      return `${primaryKeyword}: ${valueToOptimize}`;
    }

    return valueToOptimize;
  },

  106: (currentValue, formData) => { // content_length
    const { contentDescription, primaryKeyword } = formData.step1;
    const valueToOptimize = currentValue || contentDescription;
    if (!valueToOptimize) return `This is a comprehensive guide about ${primaryKeyword || 'the topic'}. [Add more content here to reach at least 1000 words]`;

    // Count words
    const wordCount = valueToOptimize.split(/\s+/).filter((word: string | any[]) => word.length > 0).length;

    if (wordCount < 1000) {
      // Add more content to reach at least 1000 words
      const primaryKeywordText = primaryKeyword || 'this topic';

      return `${valueToOptimize}\n\n## Additional Information About ${primaryKeywordText}\n\nTo provide more comprehensive information about ${primaryKeywordText}, let's explore some additional aspects that are important to understand.\n\n### Benefits of ${primaryKeywordText}\n\nThere are several key benefits to consider when exploring ${primaryKeywordText}. First, it can significantly improve your understanding of the subject matter. Second, it provides practical applications that can be implemented in various contexts. Third, it offers a foundation for further learning and development in related areas.\n\n### Common Misconceptions About ${primaryKeywordText}\n\nDespite its importance, there are several misconceptions about ${primaryKeywordText} that should be addressed. Many people incorrectly assume that it's overly complicated or difficult to implement. However, with the right approach and understanding, it becomes much more accessible. Another common misconception is that it's only relevant in specific contexts, when in fact its applications are much broader.\n\n### Future Developments in ${primaryKeywordText}\n\nLooking ahead, we can expect to see significant developments in how ${primaryKeywordText} is understood and applied. Emerging research continues to expand our knowledge, and new methodologies are being developed to enhance its effectiveness. Staying informed about these developments will be crucial for anyone interested in this field.`;
    }

    return valueToOptimize;
  },
};

// Function to get affected criteria by input field
export const getAffectedCriteriaByField = (inputField: string): number[] => INPUT_TO_CRITERIA_MAP[inputField] || [];

// Function to get input fields affected by criterion
export const getInputFieldsByCriterion = (criterionId: number): string[] => CRITERIA_TO_INPUT_MAP[criterionId] || [];
