// sentiment-words.ts

export type SentimentType = 'positive' | 'negative';

export interface SentimentWords {
  positive: readonly string[];
  negative: readonly string[];
}

export const SENTIMENT_WORDS: SentimentWords = {
  positive: [
    'amazing',
    'awesome',
    'beautiful',
    'best',
    'brilliant',
    'charming',
    'delightful',
    'easy',
    'effortless',
    'elegant',
    'excellent',
    'exciting',
    'fascinating',
    'fun',
    'genius',
    'happy',
    'incredible',
    'inspiring',
    'love',
    'loved',
    'magical',
    'motivating',
    'outstanding',
    'perfect',
    'powerful',
    'remarkable',
    'rich',
    'satisfying',
    'smart',
    'successful',
    'wonderful'
  ] as const,
  negative: [
    'awful',
    'bad',
    'boring',
    'broken',
    'complicated',
    'dangerous',
    'disappointing',
    'disastrous',
    'dumb',
    'fail',
    'fake',
    'frustrating',
    'hard',
    'hate',
    'horrible',
    'lame',
    'messy',
    'mistake',
    'painful',
    'poor',
    'problem',
    'sad',
    'scam',
    'slow',
    'stupid',
    'terrible',
    'ugly',
    'unbelievable',
    'unhappy',
    'useless',
    'waste',
    'weak',
    'worst'
  ] as const
} as const;

// Type for individual positive words
export type PositiveWord = typeof SENTIMENT_WORDS.positive[number];

// Type for individual negative words
export type NegativeWord = typeof SENTIMENT_WORDS.negative[number];

// Union type for any sentiment word
export type SentimentWord = PositiveWord | NegativeWord;

// Utility functions
export const isPositiveWord = (word: string): word is PositiveWord => SENTIMENT_WORDS.positive.includes(word as PositiveWord);

export const isNegativeWord = (word: string): word is NegativeWord => SENTIMENT_WORDS.negative.includes(word as NegativeWord);

export const getSentimentType = (word: string): SentimentType | null => {
  if (isPositiveWord(word)) return 'positive';
  if (isNegativeWord(word)) return 'negative';
  return null;
};

export const getAllWords = (): SentimentWord[] => [...SENTIMENT_WORDS.positive, ...SENTIMENT_WORDS.negative];

export const getWordsByType = (type: SentimentType): readonly string[] => SENTIMENT_WORDS[type];

// Statistics utilities
export const getSentimentStats = () => ({
    totalWords: getAllWords().length,
    positiveCount: SENTIMENT_WORDS.positive.length,
    negativeCount: SENTIMENT_WORDS.negative.length,
    ratio: SENTIMENT_WORDS.positive.length / SENTIMENT_WORDS.negative.length
  });

export default SENTIMENT_WORDS;