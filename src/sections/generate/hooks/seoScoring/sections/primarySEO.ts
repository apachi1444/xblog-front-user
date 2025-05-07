import type { UseFormReturn } from 'react-hook-form';

import { useMemo, useEffect, useCallback } from 'react';

import { enhancedContainsKeyword } from '../../../../../utils/seoScoringFixes';
import { debugLog, debugFormValues, debugKeywordCheck } from '../../../../../utils/seoDebug';
import { isKeywordInFirstPercentage } from '../../../../../utils/seoScoring';
import { directKeywordCheck, getAllPossibleValues, directSecondaryKeywordsCheck } from '../../../../../utils/seoDirectCheck';
import { useActionText, useFieldValidator, useFormFieldValues, useStatusBasedOnFields, useKeywordScoreCalculator } from '../utils';

import type { ChecklistItem } from '../types';

/**
 * Hook for evaluating Primary SEO checklist items
 */
export const usePrimarySEOItems = (form: UseFormReturn<any>) => {
  // Get helper functions
  const isFieldValid = useFieldValidator(form);
  const getStatusBasedOnFields = useStatusBasedOnFields(isFieldValid);
  const getActionText = useActionText(isFieldValid);
  const calculateKeywordScore = useKeywordScoreCalculator();
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
  }, [form]);

  // Get form values through our helper - only keep the ones we still need
  const content = useMemo(() => getFieldValue('content'), [getFieldValue]);
  const primaryKeyword = useMemo(() => getFieldValue('primaryKeyword'), [getFieldValue]);
  const language = useMemo(() => getFieldValue('language'), [getFieldValue]);
  const targetCountry = useMemo(() => getFieldValue('targetCountry'), [getFieldValue]);

  // Debug the keyword check for content description
  useEffect(() => {
    const contentDesc = getAllPossibleValues(form, 'contentDescription');
    const primaryKw = getAllPossibleValues(form, 'primaryKeyword');
    const secondaryKw = getAllPossibleValues(form, 'secondaryKeywords');

    debugLog('Content Description Check:', {
      contentDesc,
      primaryKw,
      rawContentDescription,
      rawPrimaryKeyword,
      hasKeyword: enhancedContainsKeyword(contentDesc, primaryKw, { partialMatch: true, stemming: true }),
      hasRawKeyword: enhancedContainsKeyword(rawContentDescription, rawPrimaryKeyword, { partialMatch: true, stemming: true }),
      secondaryKw,
      rawSecondaryKeywords,
      hasSecondaryKeywords: Array.isArray(secondaryKw) && secondaryKw.length > 0,
      hasRawSecondaryKeywords: Array.isArray(rawSecondaryKeywords) && rawSecondaryKeywords.length > 0
    });

    // Test keyword check with different options
    debugKeywordCheck(
      contentDesc,
      primaryKw,
      enhancedContainsKeyword(contentDesc, primaryKw, { partialMatch: true, stemming: true }),
      { partialMatch: true, stemming: true }
    );
  }, [form, rawContentDescription, rawPrimaryKeyword, rawSecondaryKeywords]);

  // These calculations are no longer needed as we're using direct checking
  // They are removed to clean up the code

  // Generate Primary SEO checklist items
  const generatePrimarySEOItems = useCallback((): ChecklistItem[] => [
      {
        id: 101,
        text: "Focus keyword added to meta description",
        status: (() => {
          // Get all possible values directly from the form
          const metaDesc = getAllPossibleValues(form, 'metaDescription');
          const primaryKw = getAllPossibleValues(form, 'primaryKeyword');

          // Debug the values
          debugLog('DIRECT CHECK - Meta Description:', {
            metaDesc,
            primaryKw,
            hasKeyword: directKeywordCheck(metaDesc, primaryKw)
          });

          if (!metaDesc || !primaryKw) return 'pending';
          return directKeywordCheck(metaDesc, primaryKw) ? 'success' : 'error';
        })(),
        score: (() => {
          const metaDesc = getAllPossibleValues(form, 'metaDescription');
          const primaryKw = getAllPossibleValues(form, 'primaryKeyword');
          if (!metaDesc || !primaryKw) return 0;
          return directKeywordCheck(metaDesc, primaryKw) ? 10 : 0;
        })(),
        maxScore: 10,
        action: (() => {
          const metaDesc = getAllPossibleValues(form, 'metaDescription');
          const primaryKw = getAllPossibleValues(form, 'primaryKeyword');
          if (!metaDesc || !primaryKw) return "Fill Required Fields";
          return directKeywordCheck(metaDesc, primaryKw) ? null : "Fix";
        })(),
        tooltip: (() => {
          const metaDesc = getAllPossibleValues(form, 'metaDescription');
          const primaryKw = getAllPossibleValues(form, 'primaryKeyword');

          if (!metaDesc || !primaryKw) {
            return "Fill in both meta description and primary keyword fields";
          }

          return directKeywordCheck(metaDesc, primaryKw)
            ? "Great! Your meta description includes your primary keyword."
            : `Your meta description doesn't include your primary keyword "${primaryKw}". Add the keyword to improve SEO.`;
        })()
      },
      {
        id: 102,
        text: "Focus keyword present in the URL",
        status: (() => {
          // Get all possible values directly from the form
          const urlSlugValue = getAllPossibleValues(form, 'urlSlug');
          const primaryKwValue = getAllPossibleValues(form, 'primaryKeyword');

          // Debug the values
          debugLog('DIRECT CHECK - URL Slug:', {
            urlSlug: urlSlugValue,
            primaryKw: primaryKwValue,
            hasKeyword: directKeywordCheck(urlSlugValue, primaryKwValue)
          });

          if (!urlSlugValue || !primaryKwValue) return 'pending';
          return directKeywordCheck(urlSlugValue, primaryKwValue) ? 'success' : 'error';
        })(),
        score: (() => {
          const urlSlugValue = getAllPossibleValues(form, 'urlSlug');
          const primaryKwValue = getAllPossibleValues(form, 'primaryKeyword');
          if (!urlSlugValue || !primaryKwValue) return 0;
          return directKeywordCheck(urlSlugValue, primaryKwValue) ? 10 : 0;
        })(),
        maxScore: 10,
        action: (() => {
          const urlSlugValue = getAllPossibleValues(form, 'urlSlug');
          const primaryKwValue = getAllPossibleValues(form, 'primaryKeyword');
          if (!urlSlugValue || !primaryKwValue) return "Fill Required Fields";
          return directKeywordCheck(urlSlugValue, primaryKwValue) ? null : "Fix";
        })(),
        tooltip: (() => {
          const urlSlugValue = getAllPossibleValues(form, 'urlSlug');
          const primaryKwValue = getAllPossibleValues(form, 'primaryKeyword');

          if (!urlSlugValue || !primaryKwValue) {
            return "Fill in both URL slug and primary keyword fields";
          }

          return directKeywordCheck(urlSlugValue, primaryKwValue)
            ? "Great! Your URL includes your primary keyword."
            : `Your URL slug doesn't include your primary keyword "${primaryKwValue}". Including it can improve SEO ranking.`;
        })()
      },
      {
        id: 103,
        text: "Focus keyword appears within the first 10% of content",
        status: getStatusBasedOnFields(
          ['content', 'primaryKeyword'],
          isKeywordInFirstPercentage(content, primaryKeyword, 10)
        ),
        score: calculateKeywordScore(content, primaryKeyword, {
          firstPercentage: 10,
          checkFirstParagraph: true,
          checkFirstSentence: true,
          exactMatch: true
        }),
        maxScore: 10,
        action: getActionText(
          ['content', 'primaryKeyword'],
          calculateKeywordScore(content, primaryKeyword, {
            firstPercentage: 10,
            checkFirstParagraph: true,
            checkFirstSentence: true,
            exactMatch: true
          }),
          4,
          8
        ),
        tooltip: !isFieldValid('content') || !isFieldValid('primaryKeyword')
          ? "Fill in both content and primary keyword fields"
          : !isKeywordInFirstPercentage(content, primaryKeyword, 10)
            ? `Your primary keyword "${primaryKeyword}" should appear in the first 10% of your content. Search engines give more weight to keywords that appear early in the text.`
            : "Great! Your primary keyword appears early in your content, which is good for SEO."
      },
      {
        id: 104,
        text: "Focus keyword included in content description",
        status: (() => {
          // Get all possible values directly from the form
          const contentDesc = getAllPossibleValues(form, 'contentDescription');
          const primaryKw = getAllPossibleValues(form, 'primaryKeyword');

          // Debug the values
          debugLog('DIRECT CHECK - Content Description:', {
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
          return directKeywordCheck(contentDesc, primaryKw) ? null : "Fix";
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
        id: 105,
        text: "Secondary keywords are defined",
        status: (() => {
          // Get secondary keywords directly from the form
          const secondaryKw = getAllPossibleValues(form, 'secondaryKeywords');

          // Debug the values
          debugLog('DIRECT CHECK - Secondary Keywords:', {
            secondaryKw,
            isArray: Array.isArray(secondaryKw),
            length: Array.isArray(secondaryKw) ? secondaryKw.length : 0,
            hasKeywords: directSecondaryKeywordsCheck(secondaryKw)
          });

          return directSecondaryKeywordsCheck(secondaryKw) ? 'success' : 'error';
        })(),
        score: (() => {
          const secondaryKw = getAllPossibleValues(form, 'secondaryKeywords');
          return directSecondaryKeywordsCheck(secondaryKw) ? 10 : 0;
        })(),
        maxScore: 10,
        action: (() => {
          const secondaryKw = getAllPossibleValues(form, 'secondaryKeywords');
          return directSecondaryKeywordsCheck(secondaryKw) ? null : "Fix";
        })(),
        tooltip: (() => {
          const secondaryKw = getAllPossibleValues(form, 'secondaryKeywords');

          if (!directSecondaryKeywordsCheck(secondaryKw)) {
            return "You should add secondary keywords to improve your content's SEO. Secondary keywords help search engines understand the context of your content and can increase your visibility for related searches.";
          }

          const count = Array.isArray(secondaryKw) ? secondaryKw.length : 0;
          return `Great! You have ${count} secondary keywords defined. This helps search engines understand your content better.`;
        })()
      },
      {
        id: 106,
        text: "Language and target country are specified",
        status: getStatusBasedOnFields(
          ['language', 'targetCountry'],
          !!language && !!targetCountry
        ),
        score: !!language && !!targetCountry ? 10 : 0,
        maxScore: 10,
        action: getActionText(
          ['language', 'targetCountry'],
          !!language && !!targetCountry ? 10 : 0,
          4,
          8
        ),
        tooltip: !isFieldValid('language') || !isFieldValid('targetCountry')
          ? "Please specify both language and target country"
          : !!language && !!targetCountry
            ? "Great! You've specified both language and target country, which helps search engines understand your content's target audience."
            : "Specifying both language and target country helps search engines understand your content's target audience."
      },
    ], [
      getStatusBasedOnFields,
      calculateKeywordScore,
      getActionText,
      isFieldValid,
      content,
      primaryKeyword,
      language,
      targetCountry,
      form
    ]);

  return {
    generatePrimarySEOItems
  };
};
