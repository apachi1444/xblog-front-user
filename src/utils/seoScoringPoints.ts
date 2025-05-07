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
  { id: 101, description: 'Focus keyword in meta description', points: 10, category: 'primary' },
  { id: 102, description: 'Focus keyword in URL', points: 10, category: 'primary' },
  { id: 103, description: 'Keyword in first 10% of content', points: 10, category: 'primary' },
  { id: 104, description: 'Focus keyword included in content description', points: 10, category: 'primary' },
  { id: 105, description: 'Secondary keywords are defined', points: 10, category: 'primary' },
  { id: 106, description: 'Language and target country are specified', points: 10, category: 'primary' },

  // Title Optimization (25%)
  { id: 201, description: 'Keyword at the start of the title', points: 3.5, category: 'title' },
  { id: 202, description: 'Emotional sentiment in title', points: 3.5, category: 'title' },
  { id: 203, description: 'Power words used', points: 3.5, category: 'title' },
  { id: 204, description: 'Keyword in SEO title', points: 3.5, category: 'title' },
  { id: 205, description: 'Title length is optimal', points: 3.5, category: 'title' },
  { id: 206, description: 'Meta title length is optimal', points: 3.5, category: 'title' },
  { id: 207, description: 'Meta description length is optimal', points: 3.5, category: 'title' },

  // Content Presentation (20%)
  { id: 301, description: 'Content description is detailed and comprehensive', points: 5, category: 'content' },
  { id: 302, description: 'Content description includes primary keyword', points: 5, category: 'content' },
  { id: 303, description: 'Content description includes secondary keywords', points: 5, category: 'content' },
  { id: 304, description: 'Content description is clear and focused', points: 5, category: 'content' },

  // Additional SEO Factors (10%)
  { id: 401, description: 'URL slug is concise and descriptive', points: 1.6667, category: 'additional' },
  { id: 402, description: 'URL slug uses hyphens to separate words', points: 1.6667, category: 'additional' },
  { id: 403, description: 'URL slug contains no special characters', points: 1.6667, category: 'additional' },
  { id: 404, description: 'Language and target country are compatible', points: 1.6667, category: 'additional' },
  { id: 405, description: 'Secondary keywords are relevant to primary keyword', points: 1.6667, category: 'additional' },
  { id: 406, description: 'Has sufficient number of secondary keywords', points: 1.6667, category: 'additional' },
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
export const getItemsByCategory = (category: string): ScoringItem[] => SEO_SCORING_ITEMS.filter(item => item.category === category);

// Calculate total possible points for a category
export const getTotalPointsForCategory = (category: string): number => getItemsByCategory(category).reduce(
    (total, item) => total + item.points,
    0
  );

// Format points display
export const formatPoints = (points: number): string => points % 1 === 0 ? points.toString() : points.toFixed(1);
