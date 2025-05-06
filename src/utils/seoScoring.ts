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
  tooltip: string; // Tooltip text explaining the issue and how to fix it
}

export interface ProgressSection {
  id: number;
  title: string;
  progress: number;
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

// Calculate overall section progress
// Include pending items in the calculation but count them as 0 score
export const calculateSectionProgress = (items: ChecklistItem[]): number => {
  if (items.length === 0) return 0;

  // Only exclude inactive items, but include pending items with 0 score
  const activeItems = items.filter(item => item.status !== 'inactive');
  if (activeItems.length === 0) return 0;

  // If items have score and maxScore properties, use those for more accurate calculation
  if (activeItems.every(item => item.score !== undefined && item.maxScore !== undefined)) {
    // For pending items, ensure score is 0
    const totalScore = activeItems.reduce((sum, item) => {
      // If item is pending, count it as 0 regardless of its score value
      const effectiveScore = item.status === 'pending' ? 0 : (item.score || 0);
      return sum + effectiveScore;
    }, 0);

    const totalMaxScore = activeItems.reduce((sum, item) => sum + (item.maxScore || 0), 0);

    return Math.round((totalScore / totalMaxScore) * 100);
  }

  // Fall back to simple success/total calculation
  const successItems = activeItems.filter(item => item.status === 'success');
  // Include all items in the denominator, including pending ones
  return Math.round((successItems.length / activeItems.length) * 100);
};

// Determine section type based on progress
export const determineSectionType = (progress: number): CriterionStatus => {
  if (progress === 0) return 'inactive';
  if (progress < 33) return 'error';
  if (progress < 66) return 'warning';
  return 'success';
};

// Calculate overall SEO score
export const calculateOverallScore = (sections: ProgressSection[]): number => {
  if (sections.length === 0) return 0;

  let totalWeightedScore = 0;
  let totalWeight = 0;

  sections.forEach(section => {
    totalWeightedScore += section.progress * section.weight;
    totalWeight += section.weight;
  });

  return Math.round(totalWeightedScore / totalWeight);
};