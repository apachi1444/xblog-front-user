import type { UseFormReturn } from 'react-hook-form';

import { useMemo, useEffect, useCallback } from 'react';

import { useFieldValidator, useFormFieldValues } from '../utils';
import { debugLog, debugFormValues } from '../../../../../utils/seoDebug';
import { enhancedContainsKeyword } from '../../../../../utils/seoScoringFixes';
import { directKeywordCheck, getAllPossibleValues, directSecondaryKeywordsCheck } from '../../../../../utils/seoDirectCheck';

import type { ChecklistItem } from '../types';

/**
 * Hook for evaluating Content Presentation checklist items
 */
export const useContentPresentationItems = (form: UseFormReturn<any>) => {
  // Get helper functions
  const isFieldValid = useFieldValidator(form);
  const { getFieldValue } = useFormFieldValues(form);

  // Get form values directly from the form using useMemo to avoid dependency issues
  const rawContentDescription = useMemo(() =>
    form.getValues('contentDescription') || form.getValues('step1.contentDescription') || ''
  , [form]);

  const rawPrimaryKeyword = useMemo(() =>
    form.getValues('primaryKeyword') || form.getValues('step1.primaryKeyword') || ''
  , [form]);

  const rawSecondaryKeywords = useMemo(() =>
    form.getValues('secondaryKeywords') || form.getValues('step1.secondaryKeywords') || []
  , [form]);

  // Log raw values for debugging
  useEffect(() => {
    debugFormValues(form, ['contentDescription', 'primaryKeyword', 'secondaryKeywords']);

    debugLog('Content Presentation Check:', {
      rawContentDescription,
      rawPrimaryKeyword,
      hasKeyword: enhancedContainsKeyword(rawContentDescription, rawPrimaryKeyword, { partialMatch: true, stemming: true }),
      rawSecondaryKeywords,
      hasSecondaryKeywords: Array.isArray(rawSecondaryKeywords) && rawSecondaryKeywords.length > 0
    });
  }, [form, rawContentDescription, rawPrimaryKeyword, rawSecondaryKeywords]);

  // Get form values through our helper (keep for backward compatibility)
  const contentDescription = useMemo(() => getFieldValue('contentDescription'), [getFieldValue]);

  // Generate Content Presentation checklist items
  const generateContentPresentationItems = useCallback((): ChecklistItem[] => [
      {
        id: 301,
        text: "Content description is detailed and comprehensive",
        status: !isFieldValid('contentDescription') ? 'pending' :
                contentDescription.length >= 100 ? 'success' : 'warning',
        score: !isFieldValid('contentDescription') ? 0 :
               contentDescription.length >= 100 ? 10 :
               contentDescription.length >= 50 ? 5 : 2,
        maxScore: 10,
        action: !isFieldValid('contentDescription') ? "Fill Required Fields" :
                contentDescription.length < 100 ? "Add more details" : null,
        tooltip: !isFieldValid('contentDescription') ?
                "Please add a content description" :
                contentDescription.length >= 100 ?
                "Great! Your content description is detailed and comprehensive." :
                `Your content description is too brief (${contentDescription.length} characters). Aim for at least 100 characters to provide a comprehensive description that helps search engines understand your content.`
      },
      {
        id: 302,
        text: "Content description includes primary keyword",
        status: (() => {
          // Get all possible values directly from the form
          const contentDesc = getAllPossibleValues(form, 'contentDescription');
          const primaryKw = getAllPossibleValues(form, 'primaryKeyword');

          // Debug the values
          debugLog('DIRECT CHECK - Content Presentation - Primary Keyword:', {
            contentDesc,
            primaryKw,
            hasKeyword: directKeywordCheck(contentDesc, primaryKw)
          });

          if (!contentDesc || !primaryKw) return 'pending';
          return directKeywordCheck(contentDesc, primaryKw) ? 'success' : 'error';
        })(),
        score: (() => {
          const contentDesc = getAllPossibleValues(form, 'contentDescription');
          const primaryKw = getAllPossibleValues(form, 'primaryKeyword');
          if (!contentDesc || !primaryKw) return 0;
          return directKeywordCheck(contentDesc, primaryKw) ? 10 : 0;
        })(),
        maxScore: 10,
        action: (() => {
          const contentDesc = getAllPossibleValues(form, 'contentDescription');
          const primaryKw = getAllPossibleValues(form, 'primaryKeyword');
          if (!contentDesc || !primaryKw) return "Fill Required Fields";
          return directKeywordCheck(contentDesc, primaryKw) ? null : "Add keyword to description";
        })(),
        tooltip: (() => {
          const contentDesc = getAllPossibleValues(form, 'contentDescription');
          const primaryKw = getAllPossibleValues(form, 'primaryKeyword');

          if (!contentDesc || !primaryKw) {
            return "Fill in both content description and primary keyword fields";
          }

          return directKeywordCheck(contentDesc, primaryKw)
            ? "Great! Your content description includes your primary keyword."
            : `Your content description doesn't include your primary keyword "${primaryKw}". Including it helps search engines understand what your content is about.`;
        })()
      },
      {
        id: 303,
        text: "Content description includes secondary keywords",
        status: (() => {
          // Get all possible values directly from the form
          const contentDesc = getAllPossibleValues(form, 'contentDescription');
          const secondaryKw = getAllPossibleValues(form, 'secondaryKeywords');

          // Debug the values
          debugLog('DIRECT CHECK - Content Presentation - Secondary Keywords:', {
            contentDesc,
            secondaryKw,
            isArray: Array.isArray(secondaryKw),
            length: Array.isArray(secondaryKw) ? secondaryKw.length : 0,
            hasKeywords: directSecondaryKeywordsCheck(secondaryKw)
          });

          if (!contentDesc || !directSecondaryKeywordsCheck(secondaryKw)) return 'pending';

          // Check if any secondary keyword is in the content description
          if (Array.isArray(secondaryKw) && secondaryKw.some(kw => directKeywordCheck(contentDesc, kw))) {
            return 'success';
          }

          return 'warning';
        })(),
        score: (() => {
          const contentDesc = getAllPossibleValues(form, 'contentDescription');
          const secondaryKw = getAllPossibleValues(form, 'secondaryKeywords');

          if (!contentDesc || !directSecondaryKeywordsCheck(secondaryKw)) return 0;

          if (Array.isArray(secondaryKw) && secondaryKw.some(kw => directKeywordCheck(contentDesc, kw))) {
            return 10;
          }

          return 0;
        })(),
        maxScore: 10,
        action: (() => {
          const contentDesc = getAllPossibleValues(form, 'contentDescription');
          const secondaryKw = getAllPossibleValues(form, 'secondaryKeywords');

          if (!contentDesc || !directSecondaryKeywordsCheck(secondaryKw)) return "Fill Required Fields";

          if (Array.isArray(secondaryKw) && secondaryKw.some(kw => directKeywordCheck(contentDesc, kw))) {
            return null;
          }

          return "Add secondary keywords to description";
        })(),
        tooltip: (() => {
          const contentDesc = getAllPossibleValues(form, 'contentDescription');
          const secondaryKw = getAllPossibleValues(form, 'secondaryKeywords');

          if (!contentDesc || !directSecondaryKeywordsCheck(secondaryKw)) {
            return "Fill in content description and add secondary keywords";
          }

          if (Array.isArray(secondaryKw) && secondaryKw.some(kw => directKeywordCheck(contentDesc, kw))) {
            return "Great! Your content description includes at least one of your secondary keywords.";
          }

          return "Your content description should include at least one of your secondary keywords to improve SEO and provide context.";
        })()
      },
      {
        id: 304,
        text: "Content description is clear and focused",
        status: !isFieldValid('contentDescription') ? 'pending' : 'success', // Simplified for demo
        score: !isFieldValid('contentDescription') ? 0 : 10, // Simplified for demo
        maxScore: 10,
        action: !isFieldValid('contentDescription') ? "Fill Required Fields" : null,
        tooltip: !isFieldValid('contentDescription')
                ? "Please add a content description"
                : "Your content description is clear and focused, which helps search engines understand your content."
      },
    ], [isFieldValid, contentDescription, form]);

  return {
    generateContentPresentationItems
  };
};
