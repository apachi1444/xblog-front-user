// SEO Scoring Points System
// This file defines the point values for each SEO criterion based on the provided table

export interface ScoringItem {
  id: number;
  description: string;
  points: number;
  category: 'primary' | 'title' | 'content' | 'additional';
}

// Define the scoring items with their point values
export const SEO_SCORING_ITEMS: ScoringItem[] = [
  // Primary SEO Checklist (35%)
  { id: 101, description: 'Focus keyword in meta description', points: 15, category: 'primary' },
  { id: 102, description: 'Focus keyword in URL', points: 15, category: 'primary' },
  { id: 103, description: 'Keyword in first 10% of content', points: 15, category: 'primary' },
  
  // Title Optimization (25%)
  { id: 201, description: 'Keyword at the start of the title', points: 5, category: 'title' },
  { id: 202, description: 'Emotional sentiment in title', points: 5, category: 'title' },
  { id: 203, description: 'Power words used', points: 5, category: 'title' },
  { id: 204, description: 'Keyword in SEO title', points: 5, category: 'title' },
  { id: 205, description: 'Title length is optimal', points: 5, category: 'title' },
  
  // Content Presentation (20%)
  { id: 301, description: 'Easy-to-read paragraphs', points: 5, category: 'content' },
  { id: 302, description: 'Includes media', points: 5, category: 'content' },
  { id: 303, description: 'Proper use of headings', points: 5, category: 'content' },
  { id: 304, description: 'Bullet points / numbered lists', points: 5, category: 'content' },
  
  // Additional SEO Factors (10%)
  { id: 401, description: 'Keyword in subheadings', points: 1.6667, category: 'additional' },
  { id: 402, description: 'Balanced keyword density', points: 1.6667, category: 'additional' },
  { id: 403, description: 'Optimal URL length', points: 1.6667, category: 'additional' },
  { id: 404, description: 'External links to quality resources', points: 1.6667, category: 'additional' },
  { id: 405, description: 'External DoFollow link', points: 1.6667, category: 'additional' },
  { id: 406, description: 'Internal linking', points: 1.6667, category: 'additional' },
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

// Get category weight
export const getCategoryWeight = (category: string): number => {
  switch (category) {
    case 'primary':
      return 35;
    case 'title':
      return 25;
    case 'content':
      return 20;
    case 'additional':
      return 10;
    default:
      return 0;
  }
};

// Get items by category
export const getItemsByCategory = (category: string): ScoringItem[] => {
  return SEO_SCORING_ITEMS.filter(item => item.category === category);
};

// Calculate total possible points for a category
export const getTotalPointsForCategory = (category: string): number => {
  return getItemsByCategory(category).reduce(
    (total, item) => total + item.points,
    0
  );
};

// Format points display
export const formatPoints = (points: number): string => {
  return points % 1 === 0 ? points.toString() : points.toFixed(1);
};
