/* eslint-disable no-cond-assign */
/* eslint-disable no-plusplus */
import { getPointsForItem } from './seoScoringPoints';

export type CriterionStatus = "error" | "warning" | "success" | "inactive" | "pending";

export interface ScoringCriterion {
  id: number;
  name: string;
  description: string;
  weight: number; // 1-10 scale for importance
  evaluate: (formData: any) => {
    score: number; // 0-100
    status: CriterionStatus;
    message: string;
    action: string | null;
  };
}

export interface ChecklistItem {
  id: number;
  text: string;
  status: CriterionStatus;
  action?: string | null;
  score?: number;
  maxScore?: number;
  points?: number; // Actual points earned
  maxPoints?: number; // Maximum possible points
  tooltip: string; // Tooltip text explaining the issue and how to fix it
}

export interface ProgressSection {
  id: number;
  title: string;
  progress: number; // Progress as percentage
  points: number; // Total points earned in this section
  maxPoints: number; // Maximum possible points in this section
  type: CriterionStatus;
  items: ChecklistItem[];
  weight: number; // Section weight for overall scoring
}


export const isFieldFilled = (value: any): boolean => {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined;
};

// Add a helper function to determine item status
export const determineItemStatus = (
  isActive: boolean,
  dependsOnField: boolean,
  fieldFilled: boolean,
  condition: boolean
): CriterionStatus => {
  if (!isActive) return 'inactive';
  if (dependsOnField && !fieldFilled) return 'pending';
  return condition ? 'success' : 'error';
};


// Advanced SEO scoring utility functions

/**
 * Checks if text contains a keyword with various matching strategies
 * @param text The text to search in
 * @param keyword The keyword to search for
 * @param options Matching options
 * @returns Boolean indicating if keyword is present
 */
export const containsKeyword = (
  text: string,
  keyword: string,
  options: {
    exactMatch?: boolean,
    stemming?: boolean,
    synonyms?: string[]
  } = {}
): boolean => {
  if (!text || !keyword) return false;

  const textLower = text.toLowerCase();
  const keywordLower = keyword.toLowerCase();

  // Exact match check
  if (options.exactMatch) {
    const regex = new RegExp(`\\b${keywordLower}\\b`, 'i');
    return regex.test(textLower);
  }

  // Basic contains check
  if (textLower.includes(keywordLower)) return true;

  // Check for keyword variations with stemming (simplified)
  if (options.stemming) {
    // Simple stemming: check for plural/singular forms
    const singularForm = keywordLower.endsWith('s') ? keywordLower.slice(0, -1) : keywordLower;
    const pluralForm = keywordLower.endsWith('s') ? keywordLower : `${keywordLower}s`;

    if (textLower.includes(singularForm) || textLower.includes(pluralForm)) {
      return true;
    }

    // Check for common verb endings
    const stemForms = ['ing', 'ed', 'er', 'es'].map(ending =>
      keywordLower.endsWith(ending)
        ? keywordLower.slice(0, -ending.length)
        : `${keywordLower}${ending}`
    );

    if (stemForms.some(form => textLower.includes(form))) {
      return true;
    }
  }

  // Check for synonyms
  if (options.synonyms && options.synonyms.length > 0) {
    if (options.synonyms.some(synonym => textLower.includes(synonym.toLowerCase()))) {
      return true;
    }
  }

  return false;
};

/**
 * Counts keyword occurrences with advanced options
 * @param text The text to search in
 * @param keyword The keyword to count
 * @param options Counting options
 * @returns Number of occurrences
 */
export const countKeywordOccurrences = (
  text: string,
  keyword: string,
  options: {
    exactMatch?: boolean,
    caseSensitive?: boolean,
    includeVariations?: boolean
  } = {}
): number => {
  if (!text || !keyword) return 0;

  let count = 0;
  const textToSearch = options.caseSensitive ? text : text.toLowerCase();
  const keywordToFind = options.caseSensitive ? keyword : keyword.toLowerCase();

  if (options.exactMatch) {
    // Count exact matches only (word boundaries)
    const regex = options.caseSensitive
      ? new RegExp(`\\b${keywordToFind}\\b`, 'g')
      : new RegExp(`\\b${keywordToFind}\\b`, 'gi');

    const matches = textToSearch.match(regex);
    count = matches ? matches.length : 0;
  } else {
    // Count all occurrences
    let position = textToSearch.indexOf(keywordToFind);
    while (position !== -1) {
      count++;
      position = textToSearch.indexOf(keywordToFind, position + 1);
    }
  }

  // Include variations if requested
  if (options.includeVariations) {
    // Simple variations: plural/singular
    const singularForm = keywordToFind.endsWith('s') ? keywordToFind.slice(0, -1) : keywordToFind;
    const pluralForm = keywordToFind.endsWith('s') ? keywordToFind : `${keywordToFind}s`;

    // Count singular form if different from keyword
    if (singularForm !== keywordToFind) {
      const singularRegex = options.exactMatch
        ? new RegExp(`\\b${singularForm}\\b`, options.caseSensitive ? 'g' : 'gi')
        : new RegExp(singularForm, options.caseSensitive ? 'g' : 'gi');

      const singularMatches = textToSearch.match(singularRegex);
      if (singularMatches) count += singularMatches.length * 0.8; // Count with reduced weight
    }

    // Count plural form if different from keyword
    if (pluralForm !== keywordToFind) {
      const pluralRegex = options.exactMatch
        ? new RegExp(`\\b${pluralForm}\\b`, options.caseSensitive ? 'g' : 'gi')
        : new RegExp(pluralForm, options.caseSensitive ? 'g' : 'gi');

      const pluralMatches = textToSearch.match(pluralRegex);
      if (pluralMatches) count += pluralMatches.length * 0.8; // Count with reduced weight
    }
  }

  return count;
};

/**
 * Calculates keyword density with advanced options
 * @param text The text to analyze
 * @param keyword The keyword to measure density for
 * @param options Density calculation options
 * @returns Keyword density percentage
 */
export const calculateKeywordDensity = (
  text: string,
  keyword: string,
  options: {
    exactMatch?: boolean,
    includeVariations?: boolean,
    weightByPosition?: boolean
  } = {}
): number => {
  if (!text || !keyword) return 0;

  // Count words in text
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  if (wordCount === 0) return 0;

  // Count keyword occurrences
  const occurrences = countKeywordOccurrences(text, keyword, {
    exactMatch: options.exactMatch,
    includeVariations: options.includeVariations
  });

  // Apply position weighting if requested
  if (options.weightByPosition) {
    // Find positions of keyword in text
    const textLower = text.toLowerCase();
    const keywordLower = keyword.toLowerCase();
    const positions: number[] = [];

    let pos = textLower.indexOf(keywordLower);
    while (pos !== -1) {
      positions.push(pos);
      pos = textLower.indexOf(keywordLower, pos + 1);
    }

    // Calculate weighted density
    let weightedOccurrences = 0;
    positions.forEach(newPos => {
      // Keywords in first 20% of content get 50% more weight
      const relativePosition = newPos / text.length;
      if (relativePosition < 0.2) {
        weightedOccurrences += 1.5;
      } else if (relativePosition < 0.5) {
        weightedOccurrences += 1.2;
      } else {
        weightedOccurrences += 1.0;
      }
    });

    return (weightedOccurrences / wordCount) * 100;
  }

  // Standard density calculation
  return (occurrences / wordCount) * 100;
};

/**
 * Checks if keyword appears in the first N% of content
 * @param text The text to analyze
 * @param keyword The keyword to check for
 * @param percentage The percentage of content to check
 * @param options Additional options
 * @returns Boolean indicating if keyword is present in first N%
 */
export const isKeywordInFirstPercentage = (
  text: string,
  keyword: string,
  percentage: number,
  options: {
    exactMatch?: boolean,
    checkFirstParagraph?: boolean,
    checkFirstSentence?: boolean
  } = {}
): boolean => {
  if (!text || !keyword) return false;

  // Check first N% of content
  const firstNPercent = text.substring(0, Math.floor(text.length * (percentage / 100)));
  const keywordInFirstNPercent = containsKeyword(firstNPercent, keyword, {
    exactMatch: options.exactMatch
  });

  if (keywordInFirstNPercent) return true;

  // Check first paragraph if requested
  if (options.checkFirstParagraph) {
    const paragraphs = text.split(/\n\s*\n|\r\n\s*\r\n/);
    if (paragraphs.length > 0) {
      const firstParagraph = paragraphs[0];
      if (containsKeyword(firstParagraph, keyword, { exactMatch: options.exactMatch })) {
        return true;
      }
    }
  }

  // Check first sentence if requested
  if (options.checkFirstSentence) {
    const sentences = text.split(/[.!?]+\s+/);
    if (sentences.length > 0) {
      const firstSentence = sentences[0];
      if (containsKeyword(firstSentence, keyword, { exactMatch: options.exactMatch })) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Analyzes headings in content for SEO optimization
 * @param content The HTML content to analyze
 * @param keyword The primary keyword to check for
 * @param options Additional analysis options
 * @returns Heading analysis results
 */
export const analyzeHeadings = (
  content: string,
  keyword: string,
  options: {
    checkSecondaryKeywords?: boolean,
    secondaryKeywords?: string[],
    requireH1?: boolean
  } = {}
): {
  total: number,
  withKeyword: number,
  withSecondaryKeywords: number,
  hasH1: boolean,
  keywordInH1: boolean,
  headingStructure: 'good' | 'warning' | 'poor'
} => {
  if (!content) {
    return {
      total: 0,
      withKeyword: 0,
      withSecondaryKeywords: 0,
      hasH1: false,
      keywordInH1: false,
      headingStructure: 'poor'
    };
  }

  // Extract all headings with their levels
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
  const headings: {level: number, text: string}[] = [];

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: parseInt(match[1], 10),
      text: match[2].replace(/<[^>]*>/g, '') // Strip any HTML tags inside heading
    });
  }

  // Check for keyword in headings
  const headingsWithKeyword = headings.filter(h =>
    containsKeyword(h.text, keyword, { stemming: true })
  );

  // Check for secondary keywords if requested
  let headingsWithSecondaryKeywords = 0;
  if (options.checkSecondaryKeywords && options.secondaryKeywords?.length) {
    headingsWithSecondaryKeywords = headings.filter(h =>
      options.secondaryKeywords!.some(kw => containsKeyword(h.text, kw, { stemming: true }))
    ).length;
  }

  // Check for H1 and keyword in H1
  const h1Headings = headings.filter(h => h.level === 1);
  const hasH1 = h1Headings.length > 0;
  const keywordInH1 = h1Headings.some(h => containsKeyword(h.text, keyword, { stemming: true }));

  // Evaluate heading structure
  let headingStructure: 'good' | 'warning' | 'poor' = 'good';

  // Check if headings are in sequential order (no skipping levels)
  if (headings.length > 1) {
    let prevLevel = headings[0].level;
    for (let i = 1; i < headings.length; i++) {
      const currentLevel = headings[i].level;
      // Heading levels should either stay the same, increase by exactly 1, or decrease to any lower level
      if (currentLevel > prevLevel && currentLevel !== prevLevel + 1) {
        headingStructure = 'warning'; // Skipped a heading level
      }
      prevLevel = currentLevel;
    }
  }

  // Check if there's more than one H1
  if (h1Headings.length > 1) {
    headingStructure = 'poor'; // Multiple H1s is bad practice
  }

  // Check if H1 is missing but required
  if (options.requireH1 && !hasH1) {
    headingStructure = 'poor'; // Missing required H1
  }

  return {
    total: headings.length,
    withKeyword: headingsWithKeyword.length,
    withSecondaryKeywords: headingsWithSecondaryKeywords,
    hasH1,
    keywordInH1,
    headingStructure
  };
};

// Calculate overall section progress and points
// Include pending items in the calculation but count them as 0 score/points
export const calculateSectionProgress = (items: ChecklistItem[]): { progress: number; points: number; maxPoints: number } => {
  if (items.length === 0) return { progress: 0, points: 0, maxPoints: 0 };

  // Only exclude inactive items, but include pending items with 0 score
  const activeItems = items.filter(item => item.status !== 'inactive');
  if (activeItems.length === 0) return { progress: 0, points: 0, maxPoints: 0 };

  // Calculate points based on item status and point values
  let totalPoints = 0;
  let totalMaxPoints = 0;

  activeItems.forEach(item => {
    // Get the maximum possible points for this item
    const maxItemPoints = item.maxPoints || getPointsForItem(item.id);
    totalMaxPoints += maxItemPoints;

    // Calculate earned points based on status
    let earnedPoints = 0;
    if (item.status === 'success') {
      earnedPoints = maxItemPoints;
    } else if (item.status === 'warning') {
      earnedPoints = maxItemPoints * 0.5; // 50% for warning status
    } else if (item.status === 'error') {
      earnedPoints = 0; // 0% for error status
    } else if (item.status === 'pending') {
      earnedPoints = 0; // 0% for pending status
    }

    // If points are explicitly provided, use those instead
    if (item.points !== undefined) {
      earnedPoints = item.points;
    }

    totalPoints += earnedPoints;
  });

  // Calculate progress percentage and ensure it never exceeds 100%
  const progress = totalMaxPoints > 0 ? Math.min(100, Math.round((totalPoints / totalMaxPoints) * 100)) : 0;

  return {
    progress,
    points: totalPoints,
    maxPoints: totalMaxPoints
  };
};

// Determine section type based on progress
export const determineSectionType = (progress: number): CriterionStatus => {
  if (progress === 0) return 'inactive';
  if (progress < 33) return 'error';
  if (progress < 66) return 'warning';
  return 'success';
};

// Calculate overall SEO score (in points)
export const calculateOverallScore = (sections: ProgressSection[]): { score: number; maxScore: number } => {
  if (sections.length === 0) return { score: 0, maxScore: 0 };

  let totalPoints = 0;
  let totalMaxPoints = 0;

  sections.forEach(section => {
    totalPoints += section.points;
    totalMaxPoints += section.maxPoints;
  });

  // Ensure the score never exceeds 100 points
  const cappedScore = Math.min(100, Math.round(totalPoints));

  return {
    score: cappedScore,
    maxScore: Math.round(totalMaxPoints)
  };
};