/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-shadow */
import type { GenerateArticleFormData } from 'src/sections/generate/schemas';

import { MARKETING_WORDS } from './powerWords';
import { SENTIMENT_WORDS } from './sentimentWords';
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
  // 🔍 Debug logging
  console.log('🔍 hasTableOfContents Debug:', {
    toc,
    tocIsArray: Array.isArray(toc),
    tocLength: toc ? toc.length : 'N/A',
    sections,
    sectionsIsArray: Array.isArray(sections),
    sectionsLength: sections ? sections.length : 'N/A'
  });

  // Check if TOC array exists and has content
  if (toc && Array.isArray(toc) && toc.length > 0) {
    console.log('✅ TOC found - has valid TOC array');
    return true;
  }

  // Check if we have multiple sections (implies TOC structure)
  if (sections && Array.isArray(sections) && sections.length > 2) {
    console.log('✅ TOC found - has multiple sections');
    return true;
  }

  console.log('❌ No TOC found');
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

    // ✅ Check metaTitle (SEO title) instead of title (article title)
    const { title, metaTitle, primaryKeyword } = formData.step1;
    const seoTitle = metaTitle || title; // Use metaTitle if available, fallback to title

    console.log('🔍 Keyword in Title - Article Title:', title);
    console.log('🔍 Keyword in Title - SEO Title (metaTitle):', metaTitle);
    console.log('🔍 Keyword in Title - Using:', seoTitle);
    console.log('🔍 Keyword in Title - Primary Keyword:', primaryKeyword);
    console.log('🔍 Keyword in Title - Are they equal?', seoTitle === primaryKeyword);
    console.log('🔍 Keyword in Title - Lengths:', { seoTitle: seoTitle?.length, primaryKeyword: primaryKeyword?.length });

    if (!seoTitle || !primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for SEO title and primary keyword',
        score: 0,
      };
    }

    const titleLower = seoTitle.toLowerCase();
    const keywordLower = primaryKeyword.toLowerCase();

    console.log('🔍 Comparison - Title Lower:', `"${titleLower}"`);
    console.log('🔍 Comparison - Keyword Lower:', `"${keywordLower}"`);
    console.log('🔍 Comparison - Includes check:', titleLower.includes(keywordLower));

    // First check: exact phrase match (highest score)
    if (titleLower.includes(keywordLower)) {
      console.log('✅ Exact phrase match found');
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    // Second check: word-based matching for partial credit
    const keywordWords = keywordLower.split(/\s+/).filter(word => word.length > 2); // Ignore short words
    const matchingWords = keywordWords.filter(word => titleLower.includes(word));
    const matchPercentage = keywordWords.length > 0 ? matchingWords.length / keywordWords.length : 0;

    console.log('🔍 Keyword words:', keywordWords);
    console.log('🔍 Matching words:', matchingWords);
    console.log('🔍 Match percentage:', matchPercentage);

    // If at least 50% of significant words match, give partial credit
    if (matchPercentage >= 0.5) {
      console.log('⚠️ Partial word match found');
      return {
        status: 'warning',
        message: criterion.evaluationStatus.warning || 'Some keyword words found in title',
        score: criterion.warningScore || Math.floor(criterion.weight * 0.7),
      };
    }

    console.log('❌ No significant keyword match found');
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

    // Advanced keyword matching algorithm with fuzzy matching and percentage calculation
    const calculateKeywordUrlMatch = (keyword: string, urlSlug: string) => {
      // Normalize both strings
      const normalizeString = (str: string) => str.toLowerCase()
        .replace(/[^\w\s]/g, ' ') // Replace special characters with spaces
        .replace(/\s+/g, ' ') // Normalize multiple spaces
        .trim();

      const normalizedKeyword = normalizeString(keyword);
      const normalizedUrl = normalizeString(urlSlug.replace(/-/g, ' ')); // Convert hyphens to spaces

      // Extract words from keyword (filter out common stop words)
      const stopWords = new Set(['a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'the']);
      const keywordWords = normalizedKeyword.split(' ')
        .filter(word => word.length > 1 && !stopWords.has(word));

      if (keywordWords.length === 0) return { percentage: 0, matchedWords: [], missedWords: [] };

      const urlWords = normalizedUrl.split(' ').filter(word => word.length > 1);

      // Calculate exact matches
      const exactMatches = keywordWords.filter(keywordWord =>
        urlWords.some(urlWord => urlWord === keywordWord)
      );

      // Calculate fuzzy matches for remaining words
      const remainingKeywordWords = keywordWords.filter(word => !exactMatches.includes(word));
      const fuzzyMatches = remainingKeywordWords.filter(keywordWord => urlWords.some(urlWord => {
          // Check if keyword word is contained in URL word or vice versa
          if (keywordWord.includes(urlWord) || urlWord.includes(keywordWord)) {
            return true;
          }

          // Check for similar words (Levenshtein distance)
          const similarity = calculateSimilarity(keywordWord, urlWord);
          return similarity >= 0.8; // 80% similarity threshold
        }));

      const totalMatches = exactMatches.length + fuzzyMatches.length;
      const percentage = (totalMatches / keywordWords.length) * 100;

      return {
        percentage,
        matchedWords: [...exactMatches, ...fuzzyMatches],
        missedWords: keywordWords.filter(word =>
          !exactMatches.includes(word) && !fuzzyMatches.includes(word)
        ),
        keywordWords,
        urlWords
      };
    };

    // Simple Levenshtein distance for similarity calculation
    const calculateSimilarity = (str1: string, str2: string): number => {
      const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

      for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
      for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

      for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
          const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
          matrix[j][i] = Math.min(
            matrix[j][i - 1] + 1,     // deletion
            matrix[j - 1][i] + 1,     // insertion
            matrix[j - 1][i - 1] + indicator // substitution
          );
        }
      }

      const maxLength = Math.max(str1.length, str2.length);
      return maxLength === 0 ? 1 : (maxLength - matrix[str2.length][str1.length]) / maxLength;
    };

    const matchResult = calculateKeywordUrlMatch(primaryKeyword, urlSlug);

    // Scoring based on percentage match
    if (matchResult.percentage >= 90) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    } if (matchResult.percentage >= 70) {
      return {
        status: 'warning',
        message: criterion.evaluationStatus.warning || `${matchResult.percentage.toFixed(0)}% of keywords found in URL`,
        score: Math.floor(criterion.weight * 0.7),
      };
    } if (matchResult.percentage >= 50) {
      return {
        status: 'warning',
        message: criterion.evaluationStatus.warning || `${matchResult.percentage.toFixed(0)}% of keywords found in URL`,
        score: Math.floor(criterion.weight * 0.5),
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

    const { primaryKeyword } = formData.step1;

    if (!primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for primary keyword',
        score: 0,
      };
    }

    // Get content from generated HTML body
    const bodyContent = getContentText(formData);

    if (!bodyContent) {
      return {
        status: 'pending',
        message: 'Waiting for content generation',
        score: 0,
      };
    }

    // Get first 10% of body content
    const firstTenPercent = bodyContent.substring(0, Math.floor(bodyContent.length * 0.1));

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

    const { primaryKeyword } = formData.step1;

    if (!primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for primary keyword',
        score: 0,
      };
    }

    // Get content from generated HTML body
    const bodyContent = getContentText(formData);

    if (!bodyContent) {
      return {
        status: 'pending',
        message: 'Waiting for content generation',
        score: 0,
      };
    }

    if (bodyContent.toLowerCase().includes(primaryKeyword.toLowerCase())) {
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
    const toc_data = formData.toc;

    if (!primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for primary keyword',
        score: 0,
      };
    }

    // Check both TOC and sections data
    const hasTocData = toc_data && Array.isArray(toc_data) && toc_data.length > 0;
    const hasSectionsData = sections_data && Array.isArray(sections_data) && sections_data.length > 0;

    if (!hasTocData && !hasSectionsData) {
      return {
        status: 'pending',
        message: 'Waiting for content generation',
        score: 0,
      };
    }

    // Check if keyword appears in TOC titles first (preferred)
    let hasKeywordInSubheadings = false;

    if (hasTocData) {
      hasKeywordInSubheadings = findKeywordInSubheadings(toc_data, primaryKeyword);
    }

    // If not found in TOC, check section titles as fallback
    if (!hasKeywordInSubheadings && hasSectionsData) {
      hasKeywordInSubheadings = findKeywordInSubheadings(sections_data, primaryKeyword);
    }

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

    const externalLinks = formData.step2?.externalLinks;

    if (externalLinks && Array.isArray(externalLinks) && externalLinks.length > 0) {
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

    const externalLinks = formData.step2?.externalLinks;

    if (externalLinks && Array.isArray(externalLinks) && externalLinks.length > 0) {
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

    const internalLinks = formData.step2?.internalLinks;

    if (internalLinks && Array.isArray(internalLinks) && internalLinks.length > 0) {
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

    const { title, metaTitle, primaryKeyword } = formData.step1;
    const seoTitle = metaTitle || title; // Use metaTitle if available, fallback to title

    if (!seoTitle || !primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for SEO title and primary keyword',
        score: 0,
      };
    }

    const titleLower = seoTitle.toLowerCase().trim();
    const keywordLower = primaryKeyword.toLowerCase().trim();

    console.log('🔍 Keyword at Start - Title Lower:', `"${titleLower}"`);
    console.log('🔍 Keyword at Start - Keyword Lower:', `"${keywordLower}"`);

    // Check if SEO title starts with the primary keyword (exact match)
    if (titleLower.startsWith(keywordLower)) {
      console.log('✅ Exact keyword match at start');
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    // Check if SEO title starts with the first significant word of the keyword
    const keywordWords = keywordLower.split(/\s+/).filter(word => word.length > 2);
    if (keywordWords.length > 0 && titleLower.startsWith(keywordWords[0])) {
      console.log('⚠️ First keyword word found at start');
      return {
        status: 'warning',
        message: criterion.evaluationStatus.warning || 'Title starts with part of the focus keyword',
        score: criterion.warningScore || Math.floor(criterion.weight * 0.7),
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

    // Check for sentiment words using TypeScript file
    const titleLower = title.toLowerCase();
    const hasPositive = SENTIMENT_WORDS.positive.some(word => titleLower.includes(word.toLowerCase()));
    const hasNegative = SENTIMENT_WORDS.negative.some(word => titleLower.includes(word.toLowerCase()));

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

    // Get all power words from all categories using TypeScript file
    const allPowerWords = Object.values(MARKETING_WORDS).flat();

    const titleLower = title.toLowerCase();
    const powerWordCount = allPowerWords.filter(word => titleLower.includes(word.toLowerCase())).length;

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

    // 🔍 Debug logging to see what data we have
    console.log('🔍 TOC Criteria Debug:', {
      toc,
      tocType: typeof toc,
      tocIsArray: Array.isArray(toc),
      tocLength: toc ? toc.length : 'N/A',
      sections_data,
      sectionsType: typeof sections_data,
      sectionsIsArray: Array.isArray(sections_data),
      sectionsLength: sections_data ? sections_data.length : 'N/A',
      formDataKeys: Object.keys(formData)
    });

    if (!toc && !sections_data) {
      return {
        status: 'pending',
        message: 'Waiting for content generation',
        score: 0,
      };
    }

    const hasTOC = hasTableOfContents(toc || [], sections_data || []);

    console.log('🔍 TOC Check Result:', { hasTOC, toc: toc || [], sections: sections_data || [] });

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
    const { title, metaTitle, primaryKeyword } = formData.step1;
    const seoTitle = metaTitle || title;
    const valueToOptimize = currentValue || seoTitle;
    if (!valueToOptimize) return primaryKeyword || 'Untitled';
    if (!primaryKeyword) return valueToOptimize;

    if (!valueToOptimize.toLowerCase().trim().startsWith(primaryKeyword.toLowerCase().trim())) {
      return `${primaryKeyword} - ${valueToOptimize}`;
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
