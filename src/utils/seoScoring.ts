import { getPointsForItem, TOTAL_POSSIBLE_POINTS, formatPoints } from './seoScoringPoints';

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


// Utility function to check keyword presence
export const containsKeyword = (text: string, keyword: string): boolean => {
  if (!text || !keyword) return false;
  return text.toLowerCase().includes(keyword.toLowerCase());
};

// Utility function to count keyword occurrences
export const countKeywordOccurrences = (text: string, keyword: string): number => {
  if (!text || !keyword) return 0;
  const regex = new RegExp(keyword.toLowerCase(), 'g');
  return (text.toLowerCase().match(regex) || []).length;
};

// Calculate keyword density
export const calculateKeywordDensity = (text: string, keyword: string): number => {
  if (!text || !keyword) return 0;
  const wordCount = text.split(/\s+/).length;
  if (wordCount === 0) return 0;

  const occurrences = countKeywordOccurrences(text, keyword);
  return (occurrences / wordCount) * 100;
};

// Check if keyword is in first N% of content
export const isKeywordInFirstPercentage = (text: string, keyword: string, percentage: number): boolean => {
  if (!text || !keyword) return false;

  const firstNPercent = text.substring(0, Math.floor(text.length * (percentage / 100)));
  return containsKeyword(firstNPercent, keyword);
};

// Count headings in content
export const countHeadings = (content: string): { total: number, withKeyword: number } => {
  if (!content) return { total: 0, withKeyword: 0 };

  // Simple regex to match h1-h6 tags - in a real app, you'd use a proper HTML parser
  const headingRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
  const headings = content.match(headingRegex) || [];

  return {
    total: headings.length,
    withKeyword: 0 // This would need actual implementation with keyword checking
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

  // Calculate progress percentage
  const progress = totalMaxPoints > 0 ? Math.round((totalPoints / totalMaxPoints) * 100) : 0;

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

  return {
    score: Math.round(totalPoints),
    maxScore: Math.round(totalMaxPoints)
  };
};