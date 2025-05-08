/**
 * Shared types for SEO scoring and input mapping
 */

/**
 * Defines the key user input categories that affect SEO scoring
 */
export type UserInputKey =
  | 'targetCountryLanguage'
  | 'primaryKeyword'
  | 'secondaryKeywords'
  | 'seoTitle'
  | 'metaInfo'
  | 'contentDescription'
  | 'tocAndContent';

/**
 * Scoring rule interface
 */
export interface ScoringRule {
  score: number;
  description: string;
}

/**
 * Detailed scoring item interface
 */
export interface DetailedScoringItem {
  id: number;
  description: string;
  max_score: number;
  input?: UserInputKey;
  scoring_rules: Record<string, string>;
}

/**
 * Scoring rules structure
 */
export interface ScoringRules {
  primary_seo: DetailedScoringItem[];
  title_optimization: DetailedScoringItem[];
  content_presentation: DetailedScoringItem[];
  additional_seo_factors: DetailedScoringItem[];
}
