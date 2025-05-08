/**
 * Detailed SEO scoring rules with specific criteria for each scoring item
 */

// Import shared types from seoTypes
import {
  ScoringRule,
  DetailedScoringItem,
  ScoringRules,
  UserInputKey
} from './seoTypes';

// Re-export types for backward compatibility
export type {
  ScoringRule,
  DetailedScoringItem,
  ScoringRules
};

export const SEO_SCORING_RULES: ScoringRules = {
  "primary_seo": [
    {
      "id": 101,
      "description": "Focus keyword in meta description",
      "max_score": 6,
      "input": "metaInfo",
      "scoring_rules": {
        "6": "Exact match of primary keyword in meta description.",
        "5": "Partial match (e.g., one of the words).",
        "4": "Keyword stem/synonym present.",
        "0": "No related keyword."
      }
    },
    {
      "id": 102,
      "description": "Focus keyword in URL",
      "max_score": 6,
      "input": "metaInfo",
      "scoring_rules": {
        "6": "Exact match of primary keyword in URL slug.",
        "5": "Partial match of primary keyword in URL slug.",
        "4": "Stem/synonym of primary keyword in URL slug.",
        "0": "No match."
      }
    },
    {
      "id": 103,
      "description": "Keyword in first 10% of content",
      "max_score": 6,
      "input": "contentDescription",
      "scoring_rules": {
        "6": "Keyword in the first 100 words or 10% of full content.",
        "4": "Keyword appears later in content.",
        "0": "Keyword not in content."
      }
    },
    {
      "id": 104,
      "description": "Focus keyword in content description",
      "max_score": 6,
      "input": "contentDescription",
      "scoring_rules": {
        "6": "Keyword in the first 2 lines of content description.",
        "4": "Keyword appears further down in content description.",
        "0": "Keyword not present in content description."
      }
    },
    {
      "id": 105,
      "description": "Secondary keywords are defined",
      "max_score": 6,
      "input": "secondaryKeywords",
      "scoring_rules": {
        "6": "3 or more secondary keywords defined.",
        "5": "1-2 secondary keywords defined.",
        "0": "No secondary keywords defined."
      }
    }
  ],
  "title_optimization": [
    {
      "id": 201,
      "description": "Keyword at the start of title",
      "max_score": 4,
      "input": "seoTitle",
      "scoring_rules": {
        "4": "Title starts with the primary keyword.",
        "3": "Keyword within the first 4 words of the title.",
        "2": "Keyword appears after the first 4 words.",
        "0": "Keyword not present."
      }
    },
    {
      "id": 202,
      "description": "Emotional sentiment in title",
      "max_score": 4,
      "input": "seoTitle",
      "scoring_rules": {
        "4": "2+ emotional words in the title.",
        "3": "1 emotional word in the title.",
        "0": "No emotional words."
      }
    },
    {
      "id": 203,
      "description": "Power words used in title",
      "max_score": 4,
      "input": "seoTitle",
      "scoring_rules": {
        "4": "2+ power words used in title.",
        "3": "1 power word used in title.",
        "0": "No power words used."
      }
    },
    {
      "id": 204,
      "description": "Keyword in SEO title",
      "max_score": 4,
      "input": "seoTitle",
      "scoring_rules": {
        "4": "Exact match of primary keyword in SEO title.",
        "3": "Partial match of primary keyword in SEO title.",
        "2": "Synonym of primary keyword in SEO title.",
        "0": "No match."
      }
    },
    {
      "id": 205,
      "description": "Title length is optimal",
      "max_score": 4,
      "input": "seoTitle",
      "scoring_rules": {
        "4": "50–60 characters.",
        "3": "40–49 or 61–70 characters.",
        "0": "Outside these ranges."
      }
    },
    {
      "id": 206,
      "description": "Meta title length is optimal",
      "max_score": 4,
      "input": "metaInfo",
      "scoring_rules": {
        "4": "50–60 characters.",
        "3": "40–49 or 61–70 characters.",
        "0": "Outside these ranges."
      }
    },
    {
      "id": 207,
      "description": "Meta description length is optimal",
      "max_score": 4,
      "input": "metaInfo",
      "scoring_rules": {
        "4": "140–160 characters.",
        "3": "120–139 or 161–180 characters.",
        "0": "Outside these ranges."
      }
    }
  ],
  "content_presentation": [
    {
      "id": 301,
      "description": "Content is detailed and comprehensive",
      "max_score": 6,
      "input": "contentDescription",
      "scoring_rules": {
        "6": "Each section has 200+ words, well-structured.",
        "4": "Some sections are detailed, others short (<100 words).",
        "0": "Empty or bare sentences."
      }
    },
    {
      "id": 302,
      "description": "Content includes primary keyword",
      "max_score": 6,
      "input": "contentDescription",
      "scoring_rules": {
        "6": "Primary keyword present in 80%+ of sections.",
        "4": "Primary keyword present in 50%-79% of sections.",
        "0": "No primary keyword."
      }
    },
    {
      "id": 303,
      "description": "Content includes secondary keywords",
      "max_score": 6,
      "input": "secondaryKeywords",
      "scoring_rules": {
        "6": "3+ secondary keywords used across sections.",
        "4": "1–2 secondary keywords used.",
        "0": "No secondary keywords."
      }
    },
    {
      "id": 304,
      "description": "Content is clear and focused",
      "max_score": 6,
      "input": "contentDescription",
      "scoring_rules": {
        "6": "Content matches description, uses clear headings, and short paragraphs.",
        "4": "Fairly structured, some sections unclear.",
        "0": "Unfocused or confusing text."
      }
    }
  ],
  "additional_seo_factors": [
    {
      "id": 401,
      "description": "URL slug is concise and descriptive",
      "max_score": 3,
      "input": "metaInfo",
      "scoring_rules": {
        "3": "3-5 keywords in the URL slug.",
        "2": "1-2 keywords in the URL slug.",
        "0": "No relevant keywords."
      }
    },
    {
      "id": 402,
      "description": "Table of contents (TOC) present",
      "max_score": 6,
      "input": "tocAndContent",
      "scoring_rules": {
        "6": "Table of contents present, linking to all key sections.",
        "4": "Table of contents with some sections linked.",
        "0": "No table of contents."
      }
    }
  ]
};
