import type { UseFormReturn } from 'react-hook-form';

// Re-export types from the original seoScoring.ts
export type CriterionStatus = "error" | "warning" | "success" | "inactive" | "pending";

export interface ChecklistItem {
  id: number;
  text: string;
  status: CriterionStatus;
  score?: number;
  maxScore?: number;
  action: string | null;
  tooltip: string;
  points?: number;
  maxPoints?: number;
}

export interface ProgressSection {
  id: number;
  title: string;
  progress: number;
  points: number;
  maxPoints: number;
  type: CriterionStatus;
  items: ChecklistItem[];
  weight: number;
}

// Interface for affected criteria
export interface AffectedCriterion {
  id: number;
  text: string;
  status: CriterionStatus;
  previousStatus: CriterionStatus;
  message: string;
  impact: 'positive' | 'negative' | 'neutral';
}

// Form field values interface
export interface FormFieldValues {
  title: string;
  metaTitle: string;
  metaDescription: string;
  urlSlug: string;
  content: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  contentDescription: string;
  language: string;
  targetCountry: string;
}

// Interface for the hook parameters
export interface SEOScoringHookParams {
  form: UseFormReturn<any>;
}

// Interface for the hook return value
export interface SEOScoringHookResult {
  progressSections: ProgressSection[];
  overallScore: number;
  totalMaxScore: number;
  changedCriteriaIds: number[];
  formattedScore: string;
  getAffectedCriteriaByField: (fieldName: string) => number[];
  simulateFieldChange: (fieldName: string, newValue: any) => AffectedCriterion[];
}

// Interface for keyword score options
export interface KeywordScoreOptions {
  startsWith?: boolean;
  contains?: boolean;
  exactMatch?: boolean;
  density?: number;
  optimalDensity?: number;
  firstPercentage?: number;
  checkFirstParagraph?: boolean;
  checkFirstSentence?: boolean;
  weightByPosition?: boolean;
  includeVariations?: boolean;
  stemming?: boolean;
  synonyms?: string[];
}
