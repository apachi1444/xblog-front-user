/**
 * Types for SEO scoring criteria
 */

/**
 * Status type for criteria evaluation
 */
export type CriteriaStatusType = 'binary' | 'ternary';

export type InputKey = 'title' | 'metaDescription' | 'urlSlug' | 'contentDescription' | 'primaryKeyword' | 'secondaryKeywords'
| 'content' | 'metaTitle' | 'sections' | 'generatedHtml' | 'toc' | 'images' | 'faq' | 'externalLinks' | 'internalLinks'

/**
 * Evaluation status messages for criteria
 */
export interface EvaluationStatus {
  success: string;
  error: string;
  warning?: string;
}

/**
 * Individual criterion definition
 */
export interface Criterion {
  id: number;
  description: string;
  weight: number;
  statusType: CriteriaStatusType;
  evaluationStatus: EvaluationStatus;
  inputKeys: InputKey[]; // Array of input field keys that affect this criterion
  warningScore?: number; // Score to assign when status is 'warning' (for ternary criteria)
  optimizable?: boolean; // Whether this criterion can be automatically optimized (default: true)
}

/**
 * Section of criteria
 */
export interface CriteriaSection {
  id: number;
  title: string;
  criteria: Criterion[];
}

/**
 * Complete criteria structure
 */
export type CriteriaStructure = CriteriaSection[];


export interface SectionMapping {
  id: number;
  jsonKey: string;
  internalName: string;
}

/**
 * Status of a criterion evaluation
 */
export type CriterionStatus = 'success' | 'warning' | 'error' | 'pending';

/**
 * Evaluated criterion with status
 */
export interface EvaluatedCriterion {
  id: number;
  description: string;
  weight: number;
  status: CriterionStatus;
  statusType: CriteriaStatusType;
  evaluationMessage: string;
  score: number;
  maxScore: number;
}

/**
 * Evaluated section with progress
 */
export interface EvaluatedSection {
  id: number;
  title: string;
  criteria: EvaluatedCriterion[];
  progress: number;
  score: number;
  maxScore: number;
  status: CriterionStatus;
}

/**
 * Overall scoring result
 */
export interface ScoringResult {
  sections: EvaluatedSection[];
  overallScore: number;
  maxScore: number;
  status: CriterionStatus;
}
