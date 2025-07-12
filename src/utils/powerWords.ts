// marketing-words.ts

export type MarketingCategory = 
  | 'action' 
  | 'emotion' 
  | 'value' 
  | 'trust' 
  | 'urgency' 
  | 'fear' 
  | 'positive_feeling' 
  | 'numbers';

export interface MarketingWords {
  action: readonly string[];
  emotion: readonly string[];
  value: readonly string[];
  trust: readonly string[];
  urgency: readonly string[];
  fear: readonly string[];
  positive_feeling: readonly string[];
  numbers: readonly string[];
}

export const MARKETING_WORDS: MarketingWords = {
  action: [
    'boost',
    'grow',
    'increase',
    'launch',
    'get',
    'build',
    'win',
    'create',
    'start',
    'discover',
    'unlock',
    'generate',
    'achieve',
    'accelerate',
    'double',
    'dominate',
    'drive',
    'explode',
    'improve',
    'attract',
    'control',
    'earn',
    'expand',
    'gain',
    'leverage',
    'maximize',
    'multiply',
    'secure',
    'skyrocket',
    'supercharge',
    'transform',
    'upgrade'
  ] as const,
  emotion: [
    'secret',
    'hidden',
    'proven',
    'powerful',
    'shocking',
    'mind-blowing',
    'bizarre',
    'strange',
    'unbelievable',
    'inspiring',
    'exciting',
    'dangerous',
    'surprising',
    'jaw-dropping',
    'eye-opening',
    'controversial',
    'brutal',
    'unexpected',
    'mysterious',
    'tragic',
    'incredible',
    'fascinating',
    'outrageous',
    'dramatic',
    'emotional',
    'revolutionary'
  ] as const,
  value: [
    'free',
    'exclusive',
    'premium',
    'ultimate',
    'essential',
    'best',
    'top',
    'limited',
    'cheap',
    'affordable',
    'valuable',
    'bonus',
    'profit',
    'bargain',
    'deal',
    'special',
    'savings',
    'discount',
    'offer',
    'gift',
    'giveaway',
    'reward',
    'win',
    'jackpot',
    'fortune'
  ] as const,
  trust: [
    'guaranteed',
    'certified',
    'authentic',
    'trusted',
    'expert',
    'backed',
    'verified',
    'safe',
    'risk-free',
    'approved',
    'secure',
    'legit',
    'accredited',
    'validated',
    'professional'
  ] as const,
  urgency: [
    'now',
    'hurry',
    'instantly',
    'today',
    'soon',
    'limited',
    'deadline',
    'only',
    'while it lasts',
    'act now',
    'final',
    'urgent',
    'don\'t miss',
    'countdown',
    'ends tonight',
    'running out',
    'few left',
    'scarce',
    'last chance',
    'closing soon'
  ] as const,
  fear: [
    'avoid',
    'warning',
    'never',
    'stop',
    'mistake',
    'kill',
    'dangers',
    'trap',
    'risk',
    'disaster',
    'hidden truth',
    'unknown',
    'uncovered',
    'leaked',
    'banned',
    'scandal',
    'threat'
  ] as const,
  positive_feeling: [
    'amazing',
    'brilliant',
    'delightful',
    'wonderful',
    'beautiful',
    'easy',
    'effortless',
    'fun',
    'happy',
    'loved',
    'smart',
    'genius',
    'inspiring',
    'relaxing',
    'cool',
    'charming',
    'successful',
    'rich',
    'stylish',
    'satisfying',
    'motivating',
    'magical'
  ] as const,
  numbers: [
    'top',
    'first',
    'best',
    'worst',
    'fastest',
    'biggest',
    'smallest',
    'most',
    'least',
    'million',
    'billion',
    'all-time',
    'record-breaking',
    'ultimate',
    'only',
    'exclusive',
    '#1',
    'must-have',
    'can\'t-miss'
  ] as const
} as const;

// Type for individual words in each category
export type ActionWord = typeof MARKETING_WORDS.action[number];
export type EmotionWord = typeof MARKETING_WORDS.emotion[number];
export type ValueWord = typeof MARKETING_WORDS.value[number];
export type TrustWord = typeof MARKETING_WORDS.trust[number];
export type UrgencyWord = typeof MARKETING_WORDS.urgency[number];
export type FearWord = typeof MARKETING_WORDS.fear[number];
export type PositiveFeelingWord = typeof MARKETING_WORDS.positive_feeling[number];
export type NumbersWord = typeof MARKETING_WORDS.numbers[number];

// Union type for any marketing word
export type MarketingWord = 
  | ActionWord 
  | EmotionWord 
  | ValueWord 
  | TrustWord 
  | UrgencyWord 
  | FearWord 
  | PositiveFeelingWord 
  | NumbersWord;

// Utility functions for type checking
export const isActionWord = (word: string): word is ActionWord => MARKETING_WORDS.action.includes(word as ActionWord);

export const isEmotionWord = (word: string): word is EmotionWord => MARKETING_WORDS.emotion.includes(word as EmotionWord);

export const isValueWord = (word: string): word is ValueWord => MARKETING_WORDS.value.includes(word as ValueWord);

export const isTrustWord = (word: string): word is TrustWord => MARKETING_WORDS.trust.includes(word as TrustWord);

export const isUrgencyWord = (word: string): word is UrgencyWord => MARKETING_WORDS.urgency.includes(word as UrgencyWord);

export const isFearWord = (word: string): word is FearWord => MARKETING_WORDS.fear.includes(word as FearWord);

export const isPositiveFeelingWord = (word: string): word is PositiveFeelingWord => MARKETING_WORDS.positive_feeling.includes(word as PositiveFeelingWord);

export const isNumbersWord = (word: string): word is NumbersWord => MARKETING_WORDS.numbers.includes(word as NumbersWord);

// Get category of a word
export const getWordCategory = (word: string): MarketingCategory | null => {
  if (isActionWord(word)) return 'action';
  if (isEmotionWord(word)) return 'emotion';
  if (isValueWord(word)) return 'value';
  if (isTrustWord(word)) return 'trust';
  if (isUrgencyWord(word)) return 'urgency';
  if (isFearWord(word)) return 'fear';
  if (isPositiveFeelingWord(word)) return 'positive_feeling';
  if (isNumbersWord(word)) return 'numbers';
  return null;
};

// Get all words from a specific category
export const getWordsByCategory = (category: MarketingCategory): readonly string[] => MARKETING_WORDS[category];

// Get all words as a flat array
export const getAllMarketingWords = (): MarketingWord[] => Object.values(MARKETING_WORDS).flat() as MarketingWord[];

// Get random word from a category
export const getRandomWordFromCategory = (category: MarketingCategory): string => {
  const words = MARKETING_WORDS[category];
  return words[Math.floor(Math.random() * words.length)];
};

// Get random words from multiple categories
export const getRandomWordsFromCategories = (
  categories: MarketingCategory[], 
  count: number = 1
): string[] => {
  const allWords = categories.flatMap(cat => [...MARKETING_WORDS[cat]]);
  const shuffled = [...allWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Statistics utilities
export const getMarketingStats = () => {
  const stats = Object.entries(MARKETING_WORDS).map(([category, words]) => ({
    category: category as MarketingCategory,
    count: words.length
  }));
  
  return {
    totalWords: getAllMarketingWords().length,
    categoryStats: stats,
    averageWordsPerCategory: stats.reduce((sum, stat) => sum + stat.count, 0) / stats.length
  };
};

// Marketing word combinations
export interface MarketingCombination {
  action?: string;
  emotion?: string;
  value?: string;
  trust?: string;
  urgency?: string;
  fear?: string;
  positive_feeling?: string;
  numbers?: string;
}

export const generateMarketingCombination = (
  categories: MarketingCategory[]
): MarketingCombination => {
  const combination: MarketingCombination = {};
  
  categories.forEach(category => {
    combination[category] = getRandomWordFromCategory(category);
  });
  
  return combination;
};

// Export default
export default MARKETING_WORDS;