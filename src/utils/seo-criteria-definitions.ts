import type { Criterion, CriteriaStructure, CriteriaStatusType } from '../types/criteria.types';

/**
 * SEO Core Essentials criteria
 */
const SEO_CORE_ESSENTIALS: Criterion[] = [
  {
    id: 101,
    description: "seo.criteria.core.keyword_in_title.description",
    weight: 30,
    statusType: "binary" as CriteriaStatusType,
    evaluationStatus: {
      success: "seo.criteria.core.keyword_in_title.success",
      error: "seo.criteria.core.keyword_in_title.error"
    },
    inputKeys: ["title"]
  },
  {
    id: 102,
    description: "seo.criteria.core.keyword_in_meta.description",
    weight: 4,
    statusType: "binary" as CriteriaStatusType,
    evaluationStatus: {
      success: "seo.criteria.core.keyword_in_meta.success",
      error: "seo.criteria.core.keyword_in_meta.error"
    },
    inputKeys: ["metaDescription"]
  },
  {
    id: 103,
    description: "seo.criteria.core.keyword_in_url.description",
    weight: 3,
    statusType: "binary" as CriteriaStatusType,
    evaluationStatus: {
      success: "seo.criteria.core.keyword_in_url.success",
      error: "seo.criteria.core.keyword_in_url.error"
    },
    inputKeys: ["urlSlug"]
  },
  // this one !
  {
    id: 104,
    description: "seo.criteria.core.keyword_in_first_10.description",
    weight: 4,
    statusType: "binary" as CriteriaStatusType,
    evaluationStatus: {
      success: "seo.criteria.core.keyword_in_first_10.success",
      error: "seo.criteria.core.keyword_in_first_10.error"
    },
    inputKeys: ["content"],
    optimizable: false // Cannot be automatically optimized
  },
  // this one also !
  {
    id: 105,
    description: "seo.criteria.core.keyword_in_content.description",
    weight: 3,
    statusType: "binary" as CriteriaStatusType,
    evaluationStatus: {
      success: "seo.criteria.core.keyword_in_content.success",
      error: "seo.criteria.core.keyword_in_content.error"
    },
    inputKeys: ["content", "primaryKeyword"],
    optimizable: false // Cannot be automatically optimized
  },
  // this one !
  {
    id: 106,
    description: "seo.criteria.core.content_length.description",
    weight: 4,
    statusType: "ternary" as CriteriaStatusType,
    evaluationStatus: {
      success: "seo.criteria.core.content_length.success",
      warning: "seo.criteria.core.content_length.warning",
      error: "seo.criteria.core.content_length.error"
    },
    inputKeys: ["content"],
    warningScore: 3, // 75% of the weight
    optimizable: false // Cannot be automatically optimized
  }
];

/**
 * SEO Boosters criteria
 */
const SEO_BOOSTERS: Criterion[] = [
  // this one !
  {
    id: 201,
    description: "seo.criteria.boosters.keyword_in_subheadings.description",
    weight: 4,
    statusType: "binary" as CriteriaStatusType,
    evaluationStatus: {
      success: "seo.criteria.boosters.keyword_in_subheadings.success",
      error: "seo.criteria.boosters.keyword_in_subheadings.error"
    },
    inputKeys: ["content", "primaryKeyword"],
    optimizable: false // Cannot be automatically optimized
  },
  // this one !
  {
    id: 202,
    description: "seo.criteria.boosters.keyword_density.description",
    weight: 3,
    statusType: "ternary" as CriteriaStatusType,
    evaluationStatus: {
      success: "seo.criteria.boosters.keyword_density.success",
      warning: "seo.criteria.boosters.keyword_density.warning",
      error: "seo.criteria.boosters.keyword_density.error"
    },
    inputKeys: ["content", "primaryKeyword"],
    warningScore: 2, // ~67% of the weight
    optimizable: false // Cannot be automatically optimized
  },
  {
    id: 203,
    description: "seo.criteria.boosters.url_slug_length.description",
    weight: 4,
    statusType: "ternary" as CriteriaStatusType,
    evaluationStatus: {
      success: "seo.criteria.boosters.url_slug_length.success",
      warning: "seo.criteria.boosters.url_slug_length.warning",
      error: "seo.criteria.boosters.url_slug_length.error"
    },
    inputKeys: ["urlSlug"],
    warningScore: 3 // 75% of the weight
  },
  {
    id: 204,
    description: "seo.criteria.boosters.external_links.description",
    weight: 3,
    statusType: "binary" as CriteriaStatusType,
    evaluationStatus: {
      success: "seo.criteria.boosters.external_links.success",
      error: "seo.criteria.boosters.external_links.error"
    },
    inputKeys: ["content"]
  },
  {
    id: 205,
    description: "seo.criteria.boosters.dofollow_links.description",
    weight: 4,
    statusType: "binary" as CriteriaStatusType,
    evaluationStatus: {
      success: "seo.criteria.boosters.dofollow_links.success",
      error: "seo.criteria.boosters.dofollow_links.error"
    },
    inputKeys: ["content"]
  },
  {
    id: 206,
    description: "seo.criteria.boosters.internal_links.description",
    weight: 3,
    statusType: "binary" as CriteriaStatusType,
    evaluationStatus: {
      success: "seo.criteria.boosters.internal_links.success",
      error: "seo.criteria.boosters.internal_links.error"
    },
    inputKeys: ["content"]
  }
];

/**
 * Title Optimization criteria
 */
const TITLE_OPTIMIZATION: Criterion[] = [
  {
    id: 301,
    description: "seo.criteria.title.keyword_at_start.description",
    weight: 10,
    statusType: "binary" as CriteriaStatusType,
    evaluationStatus: {
      success: "seo.criteria.title.keyword_at_start.success",
      error: "seo.criteria.title.keyword_at_start.error"
    },
    inputKeys: ["title", "primaryKeyword"]
  },
  {
    id: 302,
    description: "seo.criteria.title.sentiment.description",
    weight: 4,
    statusType: "binary" as CriteriaStatusType,
    evaluationStatus: {
      success: "seo.criteria.title.sentiment.success",
      error: "seo.criteria.title.sentiment.error"
    },
    inputKeys: ["title"]
  },
  {
    id: 303,
    description: "seo.criteria.title.power_words.description",
    weight: 3,
    statusType: "ternary" as CriteriaStatusType,
    evaluationStatus: {
      success: "seo.criteria.title.power_words.success",
      warning: "seo.criteria.title.power_words.warning",
      error: "seo.criteria.title.power_words.error"
    },
    inputKeys: ["title"],
    warningScore: 2 // ~67% of the weight
  }
];

/**
 * Content Clarity criteria
 */
const CONTENT_CLARITY: Criterion[] = [
  // this one !
  {
    id: 401,
    description: "seo.criteria.clarity.table_of_contents.description",
    weight: 4,
    statusType: "binary" as CriteriaStatusType,
    evaluationStatus: {
      success: "seo.criteria.clarity.table_of_contents.success",
      error: "seo.criteria.clarity.table_of_contents.error"
    },
    inputKeys: ["content"],
    optimizable: false // Cannot be automatically optimized
  },
  // this one !
  {
    id: 402,
    description: "seo.criteria.clarity.short_paragraphs.description",
    weight: 4,
    statusType: "ternary" as CriteriaStatusType,
    evaluationStatus: {
      success: "seo.criteria.clarity.short_paragraphs.success",
      warning: "seo.criteria.clarity.short_paragraphs.warning",
      error: "seo.criteria.clarity.short_paragraphs.error"
    },
    inputKeys: ["content"],
    warningScore: 3, // 75% of the weight
    optimizable: false // Cannot be automatically optimized
  },
  // this one !
  {
    id: 403,
    description: "seo.criteria.clarity.media_content.description",
    weight: 4,
    statusType: "binary" as CriteriaStatusType,
    evaluationStatus: {
      success: "seo.criteria.clarity.media_content.success",
      error: "seo.criteria.clarity.media_content.error"
    },
    inputKeys: ["content"],
    optimizable: false // Cannot be automatically optimized
  }
];

/**
 * Complete criteria structure with i18n keys for section titles
 */
export const SEO_CRITERIA: CriteriaStructure = [
  {
    id: 1,
    title: "seo.sections.core_essentials",
    criteria: SEO_CORE_ESSENTIALS
  },
  {
    id: 2,
    title: "seo.sections.boosters",
    criteria: SEO_BOOSTERS
  },
  {
    id: 3,
    title: "seo.sections.title_optimization",
    criteria: TITLE_OPTIMIZATION
  },
  {
    id: 4,
    title: "seo.sections.content_clarity",
    criteria: CONTENT_CLARITY
  }
]


// Total possible score (calculated from criteria definitions)
export const TOTAL_POSSIBLE_SCORE = SEO_CRITERIA.reduce(
  (total, group) => total + group.criteria.reduce((groupTotal, criterion) => groupTotal + criterion.weight, 0),
  0,
)

// Create a mapping from input keys to criteria IDs
export const INPUT_TO_CRITERIA_MAP: Record<string, number[]> = {}
SEO_CRITERIA.forEach((group) => {
  group.criteria.forEach((criterion) => {
    criterion.inputKeys.forEach((inputKey) => {
      if (!INPUT_TO_CRITERIA_MAP[inputKey]) {
        INPUT_TO_CRITERIA_MAP[inputKey] = []
      }
      INPUT_TO_CRITERIA_MAP[inputKey].push(criterion.id)
    })
  })
})

// Create a mapping from criteria IDs to input keys
export const CRITERIA_TO_INPUT_MAP: Record<string, string[]> = {}
SEO_CRITERIA.forEach((group) => {
  group.criteria.forEach((criterion) => {
    CRITERIA_TO_INPUT_MAP[criterion.id] = criterion.inputKeys
  })
})

export const sections = Object.values(SEO_CRITERIA);



export default SEO_CRITERIA;
