import type { UseFormReturn } from 'react-hook-form';

import { useMemo, useCallback } from 'react';

import { enhancedContainsKeyword } from '../../../../../utils/seoScoringFixes';
import { useActionText, useFieldValidator, useFormFieldValues } from '../utils';

import type { ChecklistItem } from '../types';

/**
 * Hook for evaluating Title Optimization checklist items
 */
export const useTitleOptimizationItems = (form: UseFormReturn<any>) => {
  // Get helper functions
  const isFieldValid = useFieldValidator(form);
  const getActionText = useActionText(isFieldValid);
  const { getFieldValue } = useFormFieldValues(form);

  // Get form values
  const title = useMemo(() => getFieldValue('title'), [getFieldValue]);
  const metaTitle = useMemo(() => getFieldValue('metaTitle'), [getFieldValue]);
  const primaryKeyword = useMemo(() => getFieldValue('primaryKeyword'), [getFieldValue]);
  const metaDescription = useMemo(() => getFieldValue('metaDescription'), [getFieldValue]);

  // Generate Title Optimization checklist items
  const generateTitleOptimizationItems = useCallback((): ChecklistItem[] => [
      {
        id: 201,
        text: "Primary keyword appears at the start of the title",
        status: !isFieldValid('title') || !isFieldValid('primaryKeyword') ?
                'pending' :
                title.toLowerCase().startsWith(primaryKeyword.toLowerCase()) ? 'success' : 'warning',
        score: !isFieldValid('title') || !isFieldValid('primaryKeyword') ? 0 :
               title.toLowerCase().startsWith(primaryKeyword.toLowerCase()) ? 10 : 5,
        maxScore: 10,
        action: getActionText(
                ['title', 'primaryKeyword'],
                !isFieldValid('title') || !isFieldValid('primaryKeyword') ? 0 :
                title.toLowerCase().startsWith(primaryKeyword.toLowerCase()) ? 10 : 5,
                4,
                8,
                !isFieldValid('title') || !isFieldValid('primaryKeyword') ?
                'pending' :
                title.toLowerCase().startsWith(primaryKeyword.toLowerCase()) ? 'success' : 'warning'
              ),
        tooltip: !isFieldValid('title') || !isFieldValid('primaryKeyword') ?
                "Fill in both title and primary keyword fields" :
                title.toLowerCase().startsWith(primaryKeyword.toLowerCase()) ?
                "Great! Your title starts with your primary keyword, which is optimal for SEO." :
                `For best SEO results, start your title with your primary keyword "${primaryKeyword}". Search engines give more weight to keywords at the beginning of titles.`
      },
      {
        id: 202,
        text: "Title evokes emotional sentiment",
        status: !isFieldValid('title') ? 'pending' : 'success', // Simplified for demo
        score: !isFieldValid('title') ? 0 : 10, // Simplified for demo
        maxScore: 10,
        action: !isFieldValid('title') ? "Fill Required Fields" : null,
        tooltip: !isFieldValid('title')
          ? "Please add a title to your content"
          : "Titles that evoke emotions tend to get higher click-through rates. Your title appears to have emotional appeal, which is great for engagement."
      },
      {
        id: 203,
        text: "Includes power words to drive engagement",
        status: !isFieldValid('title') ? 'pending' : 'success', // Simplified for demo
        score: !isFieldValid('title') ? 0 : 10, // Simplified for demo
        maxScore: 10,
        action: !isFieldValid('title') ? "Fill Required Fields" : null,
        tooltip: !isFieldValid('title')
          ? "Please add a title to your content"
          : "Power words like 'amazing', 'essential', 'proven', etc. can significantly increase engagement. Your title appears to include effective power words."
      },
      {
        id: 204,
        text: "Focus keyword included in SEO title",
        status: !isFieldValid('metaTitle') || !isFieldValid('primaryKeyword') ?
                'pending' :
                enhancedContainsKeyword(metaTitle, primaryKeyword, { partialMatch: true, stemming: true }) ? 'success' : 'error',
        score: !isFieldValid('metaTitle') || !isFieldValid('primaryKeyword') ? 0 :
               enhancedContainsKeyword(metaTitle, primaryKeyword, { partialMatch: true, stemming: true }) ? 10 : 0,
        maxScore: 10,
        action: !isFieldValid('metaTitle') || !isFieldValid('primaryKeyword') ?
                "Fill Required Fields" :
                enhancedContainsKeyword(metaTitle, primaryKeyword, { partialMatch: true, stemming: true }) ? null : "Fix",
        tooltip: !isFieldValid('metaTitle') || !isFieldValid('primaryKeyword')
                ? "Fill in both meta title and primary keyword fields"
                : !enhancedContainsKeyword(metaTitle, primaryKeyword, { partialMatch: true, stemming: true })
                  ? `Your SEO title doesn't include your primary keyword "${primaryKeyword}". Including it is essential for search engines to understand your content's focus.`
                  : "Great! Your SEO title includes your primary keyword, which is essential for search engines."
      },
      {
        id: 205,
        text: `Title length: ${isFieldValid('title') ? title.length : 0} characters`,
        status: !isFieldValid('title') ?
                'pending' :
                title.length >= 40 && title.length <= 60 ? 'success' :
                title.length < 40 ? 'error' : 'warning',
        score: !isFieldValid('title') ? 0 :
               title.length >= 40 && title.length <= 60 ? 10 :
               title.length >= 30 && title.length < 40 ? 7 :
               title.length > 60 && title.length <= 70 ? 7 :
               title.length > 70 ? 3 : 5,
        maxScore: 10,
        action: !isFieldValid('title') ?
                "Fill Required Fields" :
                (title.length >= 40 && title.length <= 60) ? null : "Fix",
        tooltip: !isFieldValid('title')
                ? "Please add a title to your content"
                : title.length >= 40 && title.length <= 60
                  ? "Perfect! Your title length is optimal (40-60 characters)."
                  : title.length < 40
                    ? `Your title is too short (${title.length} characters). Aim for 40-60 characters to provide enough information for search engines and users.`
                    : `Your title is too long (${title.length} characters). Keep it under 60 characters to prevent truncation in search results.`
      },
      {
        id: 206,
        text: "Meta title length is optimal",
        status: !isFieldValid('metaTitle') ?
                'pending' :
                metaTitle.length >= 50 && metaTitle.length <= 60 ? 'success' :
                metaTitle.length < 50 ? 'error' : 'warning',
        score: !isFieldValid('metaTitle') ? 0 :
               metaTitle.length >= 50 && metaTitle.length <= 60 ? 10 :
               metaTitle.length >= 40 && metaTitle.length < 50 ? 7 :
               metaTitle.length > 60 && metaTitle.length <= 70 ? 7 :
               metaTitle.length > 70 ? 3 : 5,
        maxScore: 10,
        action: !isFieldValid('metaTitle') ?
                "Fill Required Fields" :
                (metaTitle.length >= 50 && metaTitle.length <= 60) ? null : "Fix",
        tooltip: !isFieldValid('metaTitle')
                ? "Please add a meta title to your content"
                : metaTitle.length >= 50 && metaTitle.length <= 60
                  ? "Perfect! Your meta title length is optimal (50-60 characters)."
                  : metaTitle.length < 50
                    ? `Your meta title is too short (${metaTitle.length} characters). Aim for 50-60 characters to provide enough information for search engines and users.`
                    : `Your meta title is too long (${metaTitle.length} characters). Keep it under 60 characters to prevent truncation in search results.`
      },
      {
        id: 207,
        text: "Meta description length is optimal",
        status: !isFieldValid('metaDescription') ?
                'pending' :
                metaDescription.length >= 120 && metaDescription.length <= 160 ? 'success' :
                metaDescription.length < 120 ? 'error' : 'warning',
        score: !isFieldValid('metaDescription') ? 0 :
               metaDescription.length >= 120 && metaDescription.length <= 160 ? 10 :
               metaDescription.length >= 100 && metaDescription.length < 120 ? 7 :
               metaDescription.length > 160 && metaDescription.length <= 180 ? 7 :
               metaDescription.length > 180 ? 3 : 5,
        maxScore: 10,
        action: !isFieldValid('metaDescription') ?
                "Fill Required Fields" :
                (metaDescription.length >= 120 && metaDescription.length <= 160) ? null : "Fix",
        tooltip: !isFieldValid('metaDescription') ?
                "Please add a meta description" :
                metaDescription.length >= 120 && metaDescription.length <= 160 ?
                "Perfect! Your meta description length is optimal (120-160 characters)." :
                metaDescription.length < 120 ?
                `Your meta description is too short (${metaDescription.length} characters). Aim for 120-160 characters to provide enough information for search engines and users.` :
                `Your meta description is too long (${metaDescription.length} characters). Keep it under 160 characters to prevent truncation in search results.`
      },
    ], [
    isFieldValid,
    getActionText,
    title,
    metaTitle,
    metaDescription,
    primaryKeyword
  ]);

  return {
    generateTitleOptimizationItems
  };
};
