import { useFormContext } from 'react-hook-form';
import { useState, useEffect, useCallback, useMemo } from 'react';

import {
  containsKeyword,
  determineSectionType,
  calculateOverallScore,
  calculateKeywordDensity,
  calculateSectionProgress,
  isKeywordInFirstPercentage
} from '../utils/seoScoring';

import type { ChecklistItem, ProgressSection } from '../utils/seoScoring';

export const useSEOScoring = () => {
  const { watch, getFieldState, formState } = useFormContext();
  const [progressSections, setProgressSections] = useState<ProgressSection[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);

  // We'll watch individual fields directly
  // Get individual values directly from watch to avoid unnecessary re-renders
  const title = watch('title');
  const metaTitle = watch('metaTitle');
  const metaDescription = watch('metaDescription');
  const urlSlug = watch('urlSlug');
  const content = watch('content');
  const primaryKeyword = watch('primaryKeyword');
  const tableOfContents = watch('tableOfContents');

  // Helper function to check if a field is valid and has a value
  const isFieldValid = useCallback((fieldName: string): boolean => {
    const fieldState = getFieldState(fieldName, formState);
    const value = watch(fieldName);

    // Check if the field has a value and is valid according to form validation
    const hasValue = value !== undefined && value !== null && value !== '';
    const isValid = !fieldState.invalid;

    return hasValue && isValid;
  }, [getFieldState, formState, watch]);

  // Helper function to determine status based on field validity
  const getStatusBasedOnFields = useCallback((
    requiredFields: string[],
    successCondition: boolean
  ): 'pending' | 'success' | 'error' | 'warning' => {
    // Check if any required field is missing
    const missingField = requiredFields.some(field => !isFieldValid(field));

    if (missingField) {
      return 'pending';
    }

    return successCondition ? 'success' : 'error';
  }, [isFieldValid]);

  // Helper function to determine the appropriate action text based on score
  const getActionText = useCallback((
    fieldNames: string[],
    currentScore: number,
    minThreshold: number,
    maxThreshold: number
  ): string | null => {
    // Check if any required field is missing
    const missingField = fieldNames.some(field => !isFieldValid(field));

    if (missingField) {
      return "Fill Required Fields";
    }

    // If score is at or above max threshold, no action needed
    if (currentScore >= maxThreshold) {
      return null;
    }

    // If score is below min threshold, it needs fixing
    if (currentScore < minThreshold) {
      return "Fix";
    }

    // If score is between min and max, it needs optimization
    return "Optimize";
  }, [isFieldValid]);

  // Helper function to calculate score for keyword presence
  const calculateKeywordScore = useCallback((
    text: string,
    keyword: string,
    options: {
      startsWith?: boolean,
      contains?: boolean,
      density?: number,
      firstPercentage?: number
    } = {}
  ): number => {
    if (!text || !keyword) return 0;

    let score = 0;
    const maxScore = 10;

    // Check if text starts with keyword (worth 40% of max score)
    if (options.startsWith && text.toLowerCase().startsWith(keyword.toLowerCase())) {
      score += maxScore * 0.4;
    }

    // Check if text contains keyword (worth 30% of max score)
    if (options.contains && containsKeyword(text, keyword)) {
      score += maxScore * 0.3;
    }

    // Check keyword density (worth 20% of max score)
    if (options.density) {
      const density = calculateKeywordDensity(text, keyword);
      if (density >= options.density) {
        score += maxScore * 0.2;
      } else if (density >= options.density / 2) {
        score += maxScore * 0.1;
      }
    }

    // Check if keyword appears in first percentage of content (worth 10% of max score)
    if (options.firstPercentage && isKeywordInFirstPercentage(text, keyword, options.firstPercentage)) {
      score += maxScore * 0.1;
    }

    return score;
  }, []);

  useEffect(() => {
    // Generate checklist items based on current form values
    const primarySEOItems: ChecklistItem[] = [
      {
        id: 101,
        text: "Focus keyword added to meta description",
        status: getStatusBasedOnFields(
          ['metaDescription', 'primaryKeyword'],
          containsKeyword(metaDescription, primaryKeyword)
        ),
        score: calculateKeywordScore(metaDescription, primaryKeyword, { contains: true }),
        maxScore: 10,
        action: getActionText(
          ['metaDescription', 'primaryKeyword'],
          calculateKeywordScore(metaDescription, primaryKeyword, { contains: true }),
          4, // Min threshold (40% of max score)
          8  // Max threshold (80% of max score)
        )
      },

      // Update other items similarly...
      {
        id: 102,
        text: "Focus keyword present in the URL",
        status: getStatusBasedOnFields(
          ['urlSlug', 'primaryKeyword'],
          containsKeyword(urlSlug, primaryKeyword)
        ),
        score: calculateKeywordScore(urlSlug, primaryKeyword, { contains: true }),
        maxScore: 10,
        action: getActionText(
          ['urlSlug', 'primaryKeyword'],
          calculateKeywordScore(urlSlug, primaryKeyword, { contains: true }),
          4,
          8
        )
      },

      {
        id: 103,
        text: "Focus keyword appears within the first 10% of content",
        status: getStatusBasedOnFields(
          ['content', 'primaryKeyword'],
          isKeywordInFirstPercentage(content, primaryKeyword, 10)
        ),
        score: calculateKeywordScore(content, primaryKeyword, { firstPercentage: 10 }),
        maxScore: 10,
        action: getActionText(
          ['content', 'primaryKeyword'],
          calculateKeywordScore(content, primaryKeyword, { firstPercentage: 10 }),
          4,
          8
        )
      },

      // Continue updating other items...
    ];

    const titleOptimizationItems: ChecklistItem[] = [
      {
        id: 201,
        text: "Primary keyword appears at the start of the title",
        status: !isFieldValid('title') || !isFieldValid('primaryKeyword') ?
                'pending' :
                title.toLowerCase().startsWith(primaryKeyword.toLowerCase()) ? 'success' : 'warning',
        action: !isFieldValid('title') || !isFieldValid('primaryKeyword') ?
                "Fill Required Fields" :
                title.toLowerCase().startsWith(primaryKeyword.toLowerCase()) ? null : "Optimize"
      },
      {
        id: 202,
        text: "Title evokes emotional sentiment",
        status: !isFieldValid('title') ? 'pending' : 'success', // Simplified for demo
        action: !isFieldValid('title') ? "Fill Required Fields" : null
      },
      {
        id: 203,
        text: "Includes power words to drive engagement",
        status: !isFieldValid('title') ? 'pending' : 'success', // Simplified for demo
        action: !isFieldValid('title') ? "Fill Required Fields" : null
      },
      {
        id: 204,
        text: "Focus keyword included in SEO title",
        status: !isFieldValid('metaTitle') || !isFieldValid('primaryKeyword') ?
                'pending' :
                containsKeyword(metaTitle, primaryKeyword) ? 'success' : 'error',
        action: !isFieldValid('metaTitle') || !isFieldValid('primaryKeyword') ?
                "Fill Required Fields" :
                containsKeyword(metaTitle, primaryKeyword) ? null : "Fix"
      },
      {
        id: 205,
        text: `Title length: ${isFieldValid('title') ? title.length : 0} characters`,
        status: !isFieldValid('title') ?
                'pending' :
                title.length >= 40 && title.length <= 60 ? 'success' :
                title.length < 40 ? 'error' : 'warning',
        action: !isFieldValid('title') ?
                "Fill Required Fields" :
                (title.length >= 40 && title.length <= 60) ? null : "Fix"
      },
    ];

    // Create content presentation and additional SEO sections similarly
    const contentPresentationItems: ChecklistItem[] = [
      // Simplified for demo
      {
        id: 301,
        text: "Content uses short, easy-to-read paragraphs",
        status: !isFieldValid('content') ? 'pending' : 'success',
        action: !isFieldValid('content') ? "Fill Required Fields" : null
      },
      {
        id: 302,
        text: "Content includes media (images and/or videos)",
        status: !isFieldValid('content') ? 'pending' : 'success',
        action: !isFieldValid('content') ? "Fill Required Fields" : null
      },
      {
        id: 303,
        text: "Proper use of headings and subheadings",
        status: !isFieldValid('content') ? 'pending' : 'warning',
        action: !isFieldValid('content') ? "Fill Required Fields" : "Optimize"
      },
      {
        id: 304,
        text: "Content includes bullet points or numbered lists",
        status: !isFieldValid('content') ? 'pending' : 'warning',
        action: !isFieldValid('content') ? "Fill Required Fields" : "Add"
      },
    ];

    const additionalSEOItems: ChecklistItem[] = [
      // Simplified for demo
      {
        id: 401,
        text: "Focus keyword found in subheadings",
        status: !isFieldValid('content') || !isFieldValid('primaryKeyword') ? 'pending' : 'inactive',
        action: !isFieldValid('content') || !isFieldValid('primaryKeyword') ? "Fill Required Fields" : null
      },
      {
        id: 402,
        text: "Keyword density is balanced",
        status: !isFieldValid('content') || !isFieldValid('primaryKeyword') ? 'pending' : 'inactive',
        action: !isFieldValid('content') || !isFieldValid('primaryKeyword') ? "Fill Required Fields" : null
      },
      {
        id: 403,
        text: "URL length is optimal",
        status: !isFieldValid('urlSlug') ? 'pending' : 'inactive',
        action: !isFieldValid('urlSlug') ? "Fill Required Fields" : null
      },
      {
        id: 404,
        text: "You're linking to high-quality external resources",
        status: !isFieldValid('content') ? 'pending' : 'inactive',
        action: !isFieldValid('content') ? "Fill Required Fields" : null
      },
      {
        id: 405,
        text: "Includes at least one external DoFollow link",
        status: !isFieldValid('content') ? 'pending' : 'inactive',
        action: !isFieldValid('content') ? "Fill Required Fields" : null
      },
      {
        id: 406,
        text: "Internal links to related content on your website",
        status: !isFieldValid('content') ? 'pending' : 'inactive',
        action: !isFieldValid('content') ? "Fill Required Fields" : null
      },
    ];

    // Calculate progress for each section
    const primarySEOProgress = calculateSectionProgress(primarySEOItems);
    const titleOptimizationProgress = calculateSectionProgress(titleOptimizationItems);
    const contentPresentationProgress = calculateSectionProgress(contentPresentationItems);
    const additionalSEOProgress = calculateSectionProgress(additionalSEOItems);

    // Create sections with progress and type
    const sections: ProgressSection[] = [
      {
        id: 1,
        title: `Primary SEO Checklist (${40}%)`,
        progress: primarySEOProgress,
        type: determineSectionType(primarySEOProgress),
        items: primarySEOItems,
        weight: 40
      },
      {
        id: 2,
        title: `Title Optimization (${30}%)`,
        progress: titleOptimizationProgress,
        type: determineSectionType(titleOptimizationProgress),
        items: titleOptimizationItems,
        weight: 30
      },
      {
        id: 3,
        title: `Content Presentation Quality (${20}%)`,
        progress: contentPresentationProgress,
        type: determineSectionType(contentPresentationProgress),
        items: contentPresentationItems,
        weight: 20
      },
      {
        id: 4,
        title: `Additional SEO Factors (${10}%)`,
        progress: additionalSEOProgress,
        type: determineSectionType(additionalSEOProgress),
        items: additionalSEOItems,
        weight: 10
      }
    ];

    // Calculate overall score
    const score = calculateOverallScore(sections);

    setProgressSections(sections);
    setOverallScore(score);
  }, [
    title,
    metaTitle,
    metaDescription,
    urlSlug,
    content,
    primaryKeyword,
    tableOfContents,
    formState,
    getFieldState,
    getStatusBasedOnFields,
    isFieldValid,
    getActionText,
    calculateKeywordScore
  ]);

  // Memoize the return values to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    progressSections,
    overallScore: Math.round(overallScore)
  }), [progressSections, overallScore]);

  return returnValue;
};
