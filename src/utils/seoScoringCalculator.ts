/**
 * SEO Scoring Calculator
 * Utility functions to calculate SEO scores based on detailed scoring rules
 */

import { SEO_SCORING_RULES } from './seoScoringRules';

import type { DetailedScoringItem } from './seoScoringRules';

/**
 * Calculate the total max score for each section
 */
export const calculateSectionMaxScores = () => {
  const primarySeoMaxScore = SEO_SCORING_RULES.primary_seo.reduce(
    (total, item) => total + item.max_score, 0
  );

  const titleOptimizationMaxScore = SEO_SCORING_RULES.title_optimization.reduce(
    (total, item) => total + item.max_score, 0
  );

  const contentPresentationMaxScore = SEO_SCORING_RULES.content_presentation.reduce(
    (total, item) => total + item.max_score, 0
  );

  const additionalSeoFactorsMaxScore = SEO_SCORING_RULES.additional_seo_factors.reduce(
    (total, item) => total + item.max_score, 0
  );

  const totalMaxScore = primarySeoMaxScore + titleOptimizationMaxScore +
    contentPresentationMaxScore + additionalSeoFactorsMaxScore;

  return {
    primarySeo: primarySeoMaxScore,
    titleOptimization: titleOptimizationMaxScore,
    contentPresentation: contentPresentationMaxScore,
    additionalSeoFactors: additionalSeoFactorsMaxScore,
    total: totalMaxScore,

    // Calculate weights as percentages of total
    weights: {
      primarySeo: Math.round((primarySeoMaxScore / totalMaxScore) * 100),
      titleOptimization: Math.round((titleOptimizationMaxScore / totalMaxScore) * 100),
      contentPresentation: Math.round((contentPresentationMaxScore / totalMaxScore) * 100),
      additionalSeoFactors: Math.round((additionalSeoFactorsMaxScore / totalMaxScore) * 100)
    }
  };
};

/**
 * Get the scoring rules for a specific item by ID
 */
export const getScoringRulesForItem = (itemId: number): DetailedScoringItem | null => {
  // Check primary SEO section
  const primaryItem = SEO_SCORING_RULES.primary_seo.find(item => item.id === itemId);
  if (primaryItem) return primaryItem;

  // Check title optimization section
  const titleItem = SEO_SCORING_RULES.title_optimization.find(item => item.id === itemId);
  if (titleItem) return titleItem;

  // Check content presentation section
  const contentItem = SEO_SCORING_RULES.content_presentation.find(item => item.id === itemId);
  if (contentItem) return contentItem;

  // Check additional SEO factors section
  const additionalItem = SEO_SCORING_RULES.additional_seo_factors.find(item => item.id === itemId);
  if (additionalItem) return additionalItem;

  return null;
};

/**
 * Calculate the score for a specific item based on the input value
 * @param itemId The ID of the scoring item
 * @param value The value to evaluate
 * @param context Additional context (e.g., primaryKeyword, secondaryKeywords)
 * @returns The calculated score
 */
export const calculateItemScore = (
  itemId: number,
  value: string,
  context: Record<string, any> = {}
): number => {
  const rules = getScoringRulesForItem(itemId);
  if (!rules) return 0;

  // Get the appropriate value based on the input field
  let evaluationValue = value;

  // If the rule has an input field, use the context value for that input
  if (rules.input) {
    switch (rules.input) {
      case 'metaInfo':
        if (itemId === 101 || itemId === 207) {
          evaluationValue = context.metaDescription || value;
        } else if (itemId === 102 || itemId === 401 || itemId === 402 || itemId === 403) {
          evaluationValue = context.urlSlug || value;
        } else if (itemId === 206) {
          evaluationValue = context.metaTitle || value;
        }
        break;

      case 'seoTitle':
        evaluationValue = context.title || context.metaTitle || value;
        break;

      case 'contentDescription':
        evaluationValue = context.contentDescription || value;
        break;

      case 'secondaryKeywords':
        // For secondary keywords, we'll handle this in the specific evaluation functions
        break;

      case 'tocAndContent':
        evaluationValue = context.content || value;
        break;
      
      default:
        break;
    }
  }

  // Evaluate based on item ID
  switch (itemId) {
    // Primary SEO Checklist
    case 101: // Focus keyword in meta description
      return evaluateKeywordInText(evaluationValue, context.primaryKeyword || '', rules);

    case 102: // Focus keyword in URL
      return evaluateKeywordInUrl(evaluationValue, context.primaryKeyword || '', rules);

    case 103: // Keyword in first 10% of content
      return evaluateKeywordInFirstPortion(evaluationValue, context.primaryKeyword || '', rules);

    case 104: // Focus keyword in content description
      return evaluateKeywordInContentDescription(evaluationValue, context.primaryKeyword || '', rules);

    case 105: // Secondary keywords are defined
      return evaluateSecondaryKeywordsDefined(context.secondaryKeywords || [], rules);

    // Title Optimization
    case 201: // Keyword at the start of title
      return evaluateKeywordAtStartOfTitle(evaluationValue, context.primaryKeyword || '', rules);

    case 202: // Emotional sentiment in title
      return evaluateEmotionalWordsInTitle(evaluationValue, rules);

    case 203: // Power words used in title
      return evaluatePowerWordsInTitle(evaluationValue, rules);

    case 204: // Keyword in SEO title
      return evaluateKeywordInText(evaluationValue, context.primaryKeyword || '', rules);

    case 205: // Title length is optimal
      return evaluateTitleLength(evaluationValue, rules);

    case 206: // Meta title length is optimal
      return evaluateTitleLength(evaluationValue, rules);

    case 207: // Meta description length is optimal
      return evaluateMetaDescriptionLength(evaluationValue, rules);

    // Content Presentation
    case 301: // Content is detailed and comprehensive
      return evaluateContentDetail(evaluationValue, rules);

    case 302: // Content includes primary keyword
      return evaluateKeywordInSections(evaluationValue, context.primaryKeyword || '', rules);

    case 303: // Content includes secondary keywords
      return evaluateSecondaryKeywordsInContent(context.content || evaluationValue, context.secondaryKeywords || [], rules);

    case 304: // Content is clear and focused
      return evaluateContentClarity(evaluationValue, context.contentDescription || '', rules);

    // Additional SEO Factors
    case 401: // URL slug is concise and descriptive
      return evaluateUrlConciseness(evaluationValue, rules);

    case 402: // Table of contents present
      return evaluateTableOfContents(evaluationValue, rules);

    case 404: // Language and target country are compatible
      return evaluateLanguageCountryCompatibility(context.language || '', context.targetCountry || '', rules);

    case 405: // Secondary keywords are relevant to primary
      return evaluateSecondaryKeywordsRelevance(context.secondaryKeywords || [], context.primaryKeyword || '', rules);

    case 406: // Enough secondary keywords
      return evaluateSecondaryKeywordsCount(context.secondaryKeywords || [], rules);

    default:
      return 0;
  }
};

// Helper evaluation functions
const evaluateKeywordInText = (text: string, keyword: string, rules: DetailedScoringItem): number => {
  if (!text || !keyword) return 0;

  // Exact match
  if (text.toLowerCase().includes(keyword.toLowerCase())) {
    return rules.max_score;
  }

  // Partial match (check if any word from the keyword is present)
  const keywordWords = keyword.toLowerCase().split(' ');
  const partialMatch = keywordWords.some(word =>
    word.length > 3 && text.toLowerCase().includes(word)
  );

  if (partialMatch) {
    return Math.floor(rules.max_score * 0.8); // 80% of max score
  }

  // Check for stem/synonym (simplified)
  const stemMatch = keywordWords.some(word => {
    if (word.length <= 4) return false;
    const stem = word.substring(0, word.length - 2); // Simple stemming
    return stem.length > 2 && text.toLowerCase().includes(stem);
  });

  if (stemMatch) {
    return Math.floor(rules.max_score * 0.6); // 60% of max score
  }

  return 0;
};

const evaluateKeywordInUrl = (url: string, keyword: string, rules: DetailedScoringItem): number => {
  if (!url || !keyword) return 0;

  // Normalize URL and keyword
  const normalizedUrl = url.toLowerCase().replace(/[^a-z0-9-]/g, '');
  const normalizedKeyword = keyword.toLowerCase().replace(/\s+/g, '-');

  // Exact match
  if (normalizedUrl.includes(normalizedKeyword)) {
    return rules.max_score;
  }

  // Partial match
  const keywordWords = keyword.toLowerCase().split(' ');
  const partialMatch = keywordWords.some(word =>
    word.length > 3 && normalizedUrl.includes(word.toLowerCase())
  );

  if (partialMatch) {
    return Math.floor(rules.max_score * 0.8); // 80% of max score
  }

  // Stem match
  const stemMatch = keywordWords.some(word => {
    if (word.length <= 4) return false;
    const stem = word.substring(0, word.length - 2);
    return stem.length > 2 && normalizedUrl.includes(stem);
  });

  if (stemMatch) {
    return Math.floor(rules.max_score * 0.6); // 60% of max score
  }

  return 0;
};

const evaluateKeywordInFirstPortion = (content: string, keyword: string, rules: DetailedScoringItem): number => {
  if (!content || !keyword) return 0;

  // Get first 10% of content or first 100 words
  const words = content.split(/\s+/);
  const firstPortion = words.slice(0, Math.min(100, Math.ceil(words.length * 0.1))).join(' ');

  if (firstPortion.toLowerCase().includes(keyword.toLowerCase())) {
    return rules.max_score;
  }

  // Check if keyword appears later in content
  if (content.toLowerCase().includes(keyword.toLowerCase())) {
    return Math.floor(rules.max_score * 0.6); // 60% of max score
  }

  return 0;
};

const evaluateKeywordInContentDescription = (description: string, keyword: string, rules: DetailedScoringItem): number => {
  if (!description || !keyword) return 0;

  // Split into lines
  const lines = description.split(/\r?\n/);
  const firstTwoLines = lines.slice(0, 2).join(' ');

  if (firstTwoLines.toLowerCase().includes(keyword.toLowerCase())) {
    return rules.max_score;
  }

  // Check if keyword appears later in description
  if (description.toLowerCase().includes(keyword.toLowerCase())) {
    return Math.floor(rules.max_score * 0.6); // 60% of max score
  }

  return 0;
};

const evaluateSecondaryKeywordsDefined = (secondaryKeywords: string[], rules: DetailedScoringItem): number => {
  // Filter out empty strings
  const validKeywords = secondaryKeywords.filter(k => k.trim().length > 0);

  if (validKeywords.length >= 3) {
    return rules.max_score;
  }

  if (validKeywords.length >= 1) {
    return Math.floor(rules.max_score * 0.8); // 80% of max score
  }

  return 0;
};

const evaluateKeywordAtStartOfTitle = (title: string, keyword: string, rules: DetailedScoringItem): number => {
  if (!title || !keyword) return 0;

  const words = title.split(/\s+/);
  const firstFourWords = words.slice(0, 4).join(' ').toLowerCase();

  // Title starts with keyword
  if (title.toLowerCase().startsWith(keyword.toLowerCase())) {
    return rules.max_score;
  }

  // Keyword within first 4 words
  if (firstFourWords.includes(keyword.toLowerCase())) {
    return Math.floor(rules.max_score * 0.75); // 75% of max score
  }

  // Keyword appears later
  if (title.toLowerCase().includes(keyword.toLowerCase())) {
    return Math.floor(rules.max_score * 0.5); // 50% of max score
  }

  return 0;
};

// List of common emotional words
const emotionalWords = [
  'amazing', 'awesome', 'beautiful', 'best', 'brilliant', 'celebrate', 'delight', 'easy',
  'essential', 'exciting', 'extraordinary', 'fantastic', 'free', 'fun', 'happy', 'incredible',
  'inspiring', 'love', 'perfect', 'remarkable', 'stunning', 'success', 'surprising', 'terrific',
  'thrilling', 'wonderful', 'worst', 'worst', 'hate', 'fear', 'angry', 'sad', 'terrible',
  'horrible', 'awful', 'shocking', 'devastating', 'painful', 'tragic', 'scary', 'dangerous'
];

const evaluateEmotionalWordsInTitle = (title: string, rules: DetailedScoringItem): number => {
  if (!title) return 0;

  const words = title.toLowerCase().split(/\s+/);
  const emotionalWordsCount = words.filter(word => emotionalWords.includes(word)).length;

  if (emotionalWordsCount >= 2) {
    return rules.max_score;
  }

  if (emotionalWordsCount === 1) {
    return Math.floor(rules.max_score * 0.75); // 75% of max score
  }

  return 0;
};

// List of common power words
const powerWords = [
  'instantly', 'powerful', 'secret', 'ultimate', 'proven', 'guaranteed', 'exclusive', 'limited',
  'breakthrough', 'revolutionary', 'discover', 'unlock', 'revealed', 'essential', 'critical',
  'crucial', 'shocking', 'remarkable', 'sensational', 'extraordinary', 'unique', 'special',
  'urgent', 'how to', 'what', 'why', 'when', 'where', 'who', 'which', 'step-by-step', 'guide'
];

const evaluatePowerWordsInTitle = (title: string, rules: DetailedScoringItem): number => {
  if (!title) return 0;

  const words = title.toLowerCase().split(/\s+/);
  const powerWordsCount = words.filter(word => powerWords.includes(word)).length;

  if (powerWordsCount >= 2) {
    return rules.max_score;
  }

  if (powerWordsCount === 1) {
    return Math.floor(rules.max_score * 0.75); // 75% of max score
  }

  return 0;
};

const evaluateTitleLength = (title: string, rules: DetailedScoringItem): number => {
  if (!title) return 0;

  const {length} = title;

  if (length >= 50 && length <= 60) {
    return rules.max_score;
  }

  if ((length >= 40 && length < 50) || (length > 60 && length <= 70)) {
    return Math.floor(rules.max_score * 0.75); // 75% of max score
  }

  return 0;
};

const evaluateMetaDescriptionLength = (description: string, rules: DetailedScoringItem): number => {
  if (!description) return 0;

  const {length} = description;

  if (length >= 140 && length <= 160) {
    return rules.max_score;
  }

  if ((length >= 120 && length < 140) || (length > 160 && length <= 180)) {
    return Math.floor(rules.max_score * 0.75); // 75% of max score
  }

  return 0;
};

const evaluateContentDetail = (content: string, rules: DetailedScoringItem): number => {
  if (!content) return 0;

  // Split content into sections (assuming sections are separated by double newlines)
  const sections = content.split(/\r?\n\r?\n/).filter(s => s.trim().length > 0);

  if (sections.length === 0) return 0;

  // Count sections with 200+ words
  const detailedSections = sections.filter(section => {
    const words = section.split(/\s+/);
    return words.length >= 200;
  });

  // Count sections with less than 100 words
  const shortSections = sections.filter(section => {
    const words = section.split(/\s+/);
    return words.length < 100;
  });

  if (detailedSections.length >= sections.length * 0.7) {
    return rules.max_score;
  }

  if (shortSections.length <= sections.length * 0.5) {
    return Math.floor(rules.max_score * 0.6); // 60% of max score
  }

  return 0;
};

const evaluateKeywordInSections = (content: string, keyword: string, rules: DetailedScoringItem): number => {
  if (!content || !keyword) return 0;

  // Split content into sections
  const sections = content.split(/\r?\n\r?\n/).filter(s => s.trim().length > 0);

  if (sections.length === 0) return 0;

  // Count sections with keyword
  const sectionsWithKeyword = sections.filter(section =>
    section.toLowerCase().includes(keyword.toLowerCase())
  );

  const percentage = (sectionsWithKeyword.length / sections.length) * 100;

  if (percentage >= 80) {
    return rules.max_score;
  }

  if (percentage >= 50) {
    return Math.floor(rules.max_score * 0.6); // 60% of max score
  }

  return 0;
};

const evaluateSecondaryKeywordsInContent = (content: string, secondaryKeywords: string[], rules: DetailedScoringItem): number => {
  if (!content || secondaryKeywords.length === 0) return 0;

  // Filter out empty strings
  const validKeywords = secondaryKeywords.filter(k => k.trim().length > 0);

  if (validKeywords.length === 0) return 0;

  // Count secondary keywords present in content
  const keywordsPresent = validKeywords.filter(keyword =>
    content.toLowerCase().includes(keyword.toLowerCase())
  );

  if (keywordsPresent.length >= 3) {
    return rules.max_score;
  }

  if (keywordsPresent.length >= 1) {
    return Math.floor(rules.max_score * 0.6); // 60% of max score
  }

  return 0;
};

const evaluateContentClarity = (content: string, contentDescription: string, rules: DetailedScoringItem): number => {
  if (!content) return 0;

  // Check if content has headings (simplified check)
  const hasHeadings = /#{1,6}\s.+|<h[1-6]>.+<\/h[1-6]>/i.test(content);

  // Check for short paragraphs (less than 5 lines)
  const paragraphs = content.split(/\r?\n\r?\n/);
  const shortParagraphsPercentage = paragraphs.filter(p =>
    p.split(/\r?\n/).length < 5
  ).length / paragraphs.length;

  // Check if content matches description (simplified)
  const contentMatchesDescription = contentDescription &&
    content.toLowerCase().includes(contentDescription.substring(0, 50).toLowerCase());

  if (hasHeadings && shortParagraphsPercentage >= 0.7 && contentMatchesDescription) {
    return rules.max_score;
  }

  if (hasHeadings || shortParagraphsPercentage >= 0.5) {
    return Math.floor(rules.max_score * 0.6); // 60% of max score
  }

  return 0;
};

const evaluateUrlConciseness = (url: string, rules: DetailedScoringItem): number => {
  if (!url) return 0;

  const words = url.split(/[-_]/);
  const keywordCount = words.length;

  if (keywordCount >= 3 && keywordCount <= 5) {
    return rules.max_score;
  }

  if (keywordCount >= 1 && keywordCount <= 2) {
    return Math.floor(rules.max_score * 0.6); // 60% of max score
  }

  return 0;
};

/**
 * Evaluate if the content has a table of contents
 */
const evaluateTableOfContents = (content: string, rules: DetailedScoringItem): number => {
  if (!content) return 0;

  // Check for common TOC patterns
  const hasTocHeading = /table\s+of\s+contents|toc|contents|in\s+this\s+article/i.test(content);

  // Check for list after TOC heading
  const hasListAfterToc = /table\s+of\s+contents.*?(\n\s*[-*]\s+|\n\s*\d+\.\s+)/is.test(content);

  // Check for links in the TOC
  const hasLinksInToc = /table\s+of\s+contents.*?(\[.*?\]\(.*?\)|<a\s+href)/is.test(content);

  if (hasTocHeading && hasLinksInToc) {
    return rules.max_score; // Full score for TOC with links
  }

  if (hasTocHeading && hasListAfterToc) {
    return Math.floor(rules.max_score * 0.6); // 60% score for TOC with list but no links
  }

  return 0;
};


// Simplified language-country compatibility check
const languageCountryMap: Record<string, string[]> = {
  'en': ['us', 'gb', 'ca', 'au', 'nz'],
  'es': ['es', 'mx', 'ar', 'co', 'pe', 'cl'],
  'fr': ['fr', 'ca', 'be', 'ch'],
  'de': ['de', 'at', 'ch'],
  'pt': ['pt', 'br'],
  'it': ['it', 'ch'],
  'ru': ['ru', 'by', 'kz'],
  'zh': ['cn', 'tw', 'hk', 'sg'],
  'ja': ['jp'],
  'ko': ['kr']
};

const evaluateLanguageCountryCompatibility = (language: string, country: string, rules: DetailedScoringItem): number => {
  if (!language || !country) return 0;

  const lang = language.split('-')[0].toLowerCase();
  const countryCode = country.toLowerCase();

  if (languageCountryMap[lang] && languageCountryMap[lang].includes(countryCode)) {
    return rules.max_score;
  }

  return 0;
};

const evaluateSecondaryKeywordsRelevance = (secondaryKeywords: string[], primaryKeyword: string, rules: DetailedScoringItem): number => {
  if (!primaryKeyword || secondaryKeywords.length === 0) return 0;

  // Filter out empty strings
  const validKeywords = secondaryKeywords.filter(k => k.trim().length > 0);

  if (validKeywords.length === 0) return 0;

  // Simple relevance check: secondary keywords contain words from primary keyword
  const primaryWords = primaryKeyword.toLowerCase().split(/\s+/);

  const relevantKeywords = validKeywords.filter(keyword => {
    const secondaryWords = keyword.toLowerCase().split(/\s+/);
    return primaryWords.some(word =>
      word.length > 3 && secondaryWords.some(w => w.includes(word) || word.includes(w))
    );
  });

  if (relevantKeywords.length === validKeywords.length) {
    return rules.max_score;
  }

  if (relevantKeywords.length >= validKeywords.length * 0.5) {
    return Math.floor(rules.max_score * 0.6); // 60% of max score
  }

  return 0;
};

const evaluateSecondaryKeywordsCount = (secondaryKeywords: string[], rules: DetailedScoringItem): number => {
  // Filter out empty strings
  const validKeywords = secondaryKeywords.filter(k => k.trim().length > 0);

  if (validKeywords.length >= 3) {
    return rules.max_score;
  }

  if (validKeywords.length === 2) {
    return Math.floor(rules.max_score * 0.6); // 60% of max score
  }

  if (validKeywords.length === 1) {
    return Math.floor(rules.max_score * 0.3); // 30% of max score
  }

  return 0;
};
