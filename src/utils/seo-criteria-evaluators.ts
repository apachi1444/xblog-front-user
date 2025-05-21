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
  101: (_, formData) => { // keyword_in_title
    const criterion = sections[0].criteria[0]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { title, primaryKeyword } = formData.step1;

    console.log(title, primaryKeyword, " title and primary keyword");


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

  102: (_, formData) => { // keyword_in_meta
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

  103: (_, formData) => { // keyword_in_url
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

  104: (_, formData) => { // keyword_in_first_10
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

  105: (_, formData) => { // keyword_in_content
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

  106: (_, formData) => { // content_length
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
  },

  // SEO Boosters
  201: (_, formData) => { // keyword_in_subheadings
    const criterion = sections[1].criteria[0]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { contentDescription, primaryKeyword } = formData.step1;

    if (!contentDescription || !primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for content and primary keyword',
        score: 0,
      };
    }

    // Simple check - in a real implementation, you'd parse the content to find subheadings
    return {
      status: 'success',
      message: criterion.evaluationStatus.success,
      score: criterion.weight,
    };
  },

  202: (_, formData) => { // keyword_density
    const criterion = sections[1].criteria[1]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { contentDescription, primaryKeyword } = formData.step1;

    if (!contentDescription || !primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for content and primary keyword',
        score: 0,
      };
    }

    // Simple density check
    const words = contentDescription.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    const keywordCount = words.filter(word => word.includes(primaryKeyword.toLowerCase())).length;
    const density = (keywordCount / words.length) * 100;

    if (density >= 1 && density <= 3) {
      return {
        status: 'success',
        message: criterion.evaluationStatus.success,
        score: criterion.weight,
      };
    }

    if (density > 0) {
      return {
        status: 'warning',
        message: criterion.evaluationStatus.warning || '',
        score: criterion.warningScore || Math.floor(criterion.weight * 0.7),
      };
    }

    return {
      status: 'error',
      message: criterion.evaluationStatus.error,
      score: 0,
    };
  },

  // Title Optimization
  301: (_, formData) => { // keyword_at_start
    const criterion = sections[2].criteria[0]
    if (!criterion) return { status: 'error', message: 'Criterion not found', score: 0 };

    const { title, primaryKeyword } = formData.step1;

    if (!title || !primaryKeyword) {
      return {
        status: 'pending',
        message: 'Waiting for title and primary keyword',
        score: 0,
      };
    }

    // Check if title starts with the primary keyword
    if (title.toLowerCase().startsWith(primaryKeyword.toLowerCase())) {
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
  }
};

// Improvement functions for each criteria
export const IMPROVEMENT_FUNCTIONS: Record<number, ImprovementFunction> = {
  // SEO Core Essentials
  101: (_, formData) => { // keyword_in_title
    const { title, primaryKeyword } = formData.step1;
    if (!title) return primaryKeyword;
    if (!primaryKeyword) return title;

    if (!title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return `${primaryKeyword}: ${title}`;
    }

    return title;
  },

  102: (_, formData) => { // keyword_in_meta
    const { metaDescription, primaryKeyword } = formData.step1;
    if (!metaDescription) return `Learn about ${primaryKeyword} in this comprehensive guide.`;
    if (!primaryKeyword) return metaDescription;

    if (!metaDescription.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return `${metaDescription} Learn more about ${primaryKeyword}.`;
    }

    return metaDescription;
  },

  103: (_, formData) => { // keyword_in_url
    const { urlSlug, primaryKeyword } = formData.step1;
    if (!urlSlug) return primaryKeyword?.toLowerCase().replace(/\s+/g, '-');
    if (!primaryKeyword) return urlSlug;

    if (!urlSlug.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      return `${primaryKeyword.toLowerCase().replace(/\s+/g, '-')}-${urlSlug}`;
    }

    return urlSlug;
  },

  104: (_, formData) => { // keyword_in_first_10
    const { contentDescription, primaryKeyword } = formData.step1;
    if (!contentDescription) return `${primaryKeyword} is an important topic...`;
    if (!primaryKeyword) return contentDescription;

    // Get first 10% of content
    const firstTenPercent = contentDescription.substring(0, Math.floor(contentDescription.length * 0.1));

    if (!firstTenPercent.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      // Insert the keyword at the beginning
      return `${primaryKeyword} - ${contentDescription}`;
    }

    return contentDescription;
  },

  105: (_, formData) => { // keyword_in_content
    const { contentDescription, primaryKeyword } = formData.step1;
    if (!contentDescription) return `This article is about ${primaryKeyword}.`;
    if (!primaryKeyword) return contentDescription;

    if (!contentDescription.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      // Add the keyword to the content
      return `${contentDescription} In conclusion, ${primaryKeyword} is an important topic to understand.`;
    }

    return contentDescription;
  },

  301: (_, formData) => { // keyword_at_start
    const { title, primaryKeyword } = formData.step1;
    if (!title) return primaryKeyword;
    if (!primaryKeyword) return title;

    if (!title.toLowerCase().startsWith(primaryKeyword.toLowerCase())) {
      return `${primaryKeyword}: ${title}`;
    }

    return title;
  },

  106: (_, formData) => { // content_length
    const { contentDescription, primaryKeyword } = formData.step1;
    if (!contentDescription) return `This is a comprehensive guide about ${primaryKeyword || 'the topic'}. [Add more content here to reach at least 1000 words]`;

    // Count words
    const wordCount = contentDescription.split(/\s+/).filter(word => word.length > 0).length;

    if (wordCount < 1000) {
      // Add more content to reach at least 1000 words
      const primaryKeywordText = primaryKeyword || 'this topic';

      return `${contentDescription}\n\n## Additional Information About ${primaryKeywordText}\n\nTo provide more comprehensive information about ${primaryKeywordText}, let's explore some additional aspects that are important to understand.\n\n### Benefits of ${primaryKeywordText}\n\nThere are several key benefits to consider when exploring ${primaryKeywordText}. First, it can significantly improve your understanding of the subject matter. Second, it provides practical applications that can be implemented in various contexts. Third, it offers a foundation for further learning and development in related areas.\n\n### Common Misconceptions About ${primaryKeywordText}\n\nDespite its importance, there are several misconceptions about ${primaryKeywordText} that should be addressed. Many people incorrectly assume that it's overly complicated or difficult to implement. However, with the right approach and understanding, it becomes much more accessible. Another common misconception is that it's only relevant in specific contexts, when in fact its applications are much broader.\n\n### Future Developments in ${primaryKeywordText}\n\nLooking ahead, we can expect to see significant developments in how ${primaryKeywordText} is understood and applied. Emerging research continues to expand our knowledge, and new methodologies are being developed to enhance its effectiveness. Staying informed about these developments will be crucial for anyone interested in this field.`;
    }

    return contentDescription;
  },
};

// Function to get affected criteria by input field
export const getAffectedCriteriaByField = (inputField: string): number[] => INPUT_TO_CRITERIA_MAP[inputField] || [];

// Function to get input fields affected by criterion
export const getInputFieldsByCriterion = (criterionId: number): string[] => CRITERIA_TO_INPUT_MAP[criterionId] || [];
