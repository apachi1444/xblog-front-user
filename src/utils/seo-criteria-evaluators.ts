import type { GenerateArticleFormData } from 'src/sections/generate/schemas';

import { sections, CRITERIA_TO_INPUT_MAP, INPUT_TO_CRITERIA_MAP } from './seo-criteria-definitions';

import type { CriterionStatus } from '../types/criteria.types';


// Type for evaluation functions
export type EvaluationFunction = (
  value: any,
  formData: GenerateArticleFormData,
) => {
  status: CriterionStatus;
  message: string;
  score: number;
}

// Type for improvement functions
export type ImprovementFunction = (value: any, formData: GenerateArticleFormData) => any;

// Evaluation functions for each criteria
export const EVALUATION_FUNCTIONS: Record<number, EvaluationFunction> = {
  // SEO Core Essentials
  1: (_, formData) => { // keyword_in_title
    const criterion = sections[0].criteria[0]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { title, primaryKeyword } = formData.step1;

    if (!title || !primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for title and primary keyword',
        score: 0,
      };
    }

    if (title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  2: (_, formData) => { // keyword_in_meta
    const criterion = sections[0].criteria[1]

    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { metaDescription, primaryKeyword } = formData.step1;

    if (!metaDescription || !primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for meta description and primary keyword',
        score: 0,
      };
    }

    if (metaDescription.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  3: (_, formData) => { // keyword_in_url
    const criterion = sections[0].criteria[2]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { urlSlug, primaryKeyword } = formData.step1;

    if (!urlSlug || !primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for URL slug and primary keyword',
        score: 0,
      };
    }

    if (urlSlug.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  4: (_, formData) => { // keyword_in_first_10
    const criterion = sections[0].criteria[3]

    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { contentDescription, primaryKeyword } = formData.step1;

    if (!contentDescription || !primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for content and primary keyword',
        score: 0,
      };
    }

    // Get first 10% of content
    const firstTenPercent = contentDescription.substring(0, Math.floor(contentDescription.length * 0.1));

    if (firstTenPercent.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  5: (_, formData) => { // keyword_in_content
    const criterion = sections[0].criteria[4]

    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { contentDescription, primaryKeyword } = formData.step1;

    if (!contentDescription || !primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for content and primary keyword',
        score: 0,
      };
    }

    if (contentDescription.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  6: (_, formData) => { // content_length
    const criterion = sections[0].criteria[5]

    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { contentDescription } = formData.step1;

    if (!contentDescription) {
      return {
        status: 'pending',
        message: 'Waiting for content',
        score: 0,
      };
    }

    // Count words
    const wordCount = contentDescription.split(/\s+/).filter(word => word.length > 0).length;

    if (wordCount >= 2500) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    if (wordCount >= 1000) {
      return {
        status: 'warning',
        message: criterion.evaluationStatus.warning || '',
        score: criterion.warningScore || Math.floor(criterion.weight * 0.7), // Use defined warningScore if available
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  }
};

// Improvement functions for each criteria
export const IMPROVEMENT_FUNCTIONS: Record<number, ImprovementFunction> = {
  // SEO Core Essentials
  1: (_, formData) => { // keyword_in_title
    const { title, primaryKeyword } = formData.step1;
    if (!title) return primaryKeyword;
    if (!primaryKeyword) return title;

    if (!title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return `${primaryKeyword}: ${title}`;
    }

    return title;
  },

  2: (_, formData) => { // keyword_in_meta
    const { metaDescription, primaryKeyword } = formData.step1;
    if (!metaDescription) return `Learn about ${primaryKeyword} in this comprehensive guide.`;
    if (!primaryKeyword) return metaDescription;

    if (!metaDescription.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return `${metaDescription} Learn more about ${primaryKeyword}.`;
    }

    return metaDescription;
  },

  3: (_, formData) => { // keyword_in_url
    const { urlSlug, primaryKeyword } = formData.step1;
    if (!urlSlug) return primaryKeyword?.toLowerCase().replace(/\s+/g, '-');
    if (!primaryKeyword) return urlSlug;

    if (!urlSlug.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return `${primaryKeyword.toLowerCase().replace(/\s+/g, '-')}-${urlSlug}`;
    }

    return urlSlug;
  },

};

// Function to get affected criteria by input field
export const getAffectedCriteriaByField = (inputField: string): number[] => INPUT_TO_CRITERIA_MAP[inputField] || [];

// Function to get input fields affected by criterion
export const getInputFieldsByCriterion = (criterionId: number): string[] => CRITERIA_TO_INPUT_MAP[criterionId] || [];
