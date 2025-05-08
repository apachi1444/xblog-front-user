// SEO Scoring Points System
// This file defines the point values for each SEO criterion based on the detailed scoring rules

import { SEO_SCORING_RULES } from './seoScoringRules';
import { calculateSectionMaxScores } from './seoScoringCalculator';

export interface ScoringItem {
  id: number;
  description: string;
  points: number;
  category: 'primary' | 'title' | 'content' | 'additional';
  max_score?: number; // Maximum possible score for this item
}

// Calculate section weights based on max scores
export const sectionScores = calculateSectionMaxScores();

// Define the scoring items with their point values based on the detailed rules
export const SEO_SCORING_ITEMS: ScoringItem[] = [
  // Primary SEO Checklist (30%)
  ...SEO_SCORING_RULES.primary_seo.map(item => ({
    id: item.id,
    description: item.description,
    points: item.max_score,
    category: 'primary' as const,
    max_score: item.max_score
  })),

  // Title Optimization (28%)
  ...SEO_SCORING_RULES.title_optimization.map(item => ({
    id: item.id,
    description: item.description,
    points: item.max_score,
    category: 'title' as const,
    max_score: item.max_score
  })),

  // Content Presentation (24%)
  ...SEO_SCORING_RULES.content_presentation.map(item => ({
    id: item.id,
    description: item.description,
    points: item.max_score,
    category: 'content' as const,
    max_score: item.max_score
  })),

  // Additional SEO Factors (18%)
  ...SEO_SCORING_RULES.additional_seo_factors.map(item => ({
    id: item.id,
    description: item.description,
    points: item.max_score,
    category: 'additional' as const,
    max_score: item.max_score
  })),
];


// Get the total possible points
export const TOTAL_POSSIBLE_POINTS = SEO_SCORING_ITEMS.reduce(
  (total, item) => total + item.points,
  0
);

// Get points for a specific item ID
export const getPointsForItem = (itemId: number): number => {
  const item = SEO_SCORING_ITEMS.find(i => i.id === itemId);
  return item ? item.points : 0;
};

// Get max score for a specific item ID
export const getMaxScoreForItem = (itemId: number): number => {
  const item = SEO_SCORING_ITEMS.find(i => i.id === itemId);
  return item?.max_score || 0;
};

// Get category weight based on calculated section scores
export const getCategoryWeight = (category: string): number => {
  switch (category) {
    case 'primary':
      return sectionScores.weights.primarySeo;
    case 'title':
      return sectionScores.weights.titleOptimization;
    case 'content':
      return sectionScores.weights.contentPresentation;
    case 'additional':
      return sectionScores.weights.additionalSeoFactors;
    default:
      return 0;
  }
};

// Format points display
export const formatPoints = (points: number): string => points % 1 === 0 ? points.toString() : points.toFixed(1);
