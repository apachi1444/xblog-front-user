import type { UseFormReturn } from 'react-hook-form';

import { useMemo, useCallback } from 'react';

import { useFieldValidator, useFormFieldValues } from '../utils';

import type { ChecklistItem } from '../types';

/**
 * Hook for evaluating Additional SEO Factors checklist items
 */
export const useAdditionalSEOItems = (form: UseFormReturn<any>) => {
  // Get helper functions
  const isFieldValid = useFieldValidator(form);
  const { getFieldValue } = useFormFieldValues(form);

  // Get form values
  const urlSlug = useMemo(() => getFieldValue('urlSlug'), [getFieldValue]);
  const secondaryKeywords = useMemo(() => getFieldValue('secondaryKeywords'), [getFieldValue]);
  const language = useMemo(() => getFieldValue('language'), [getFieldValue]);
  const targetCountry = useMemo(() => getFieldValue('targetCountry'), [getFieldValue]);

  // Generate Additional SEO Factors checklist items
  const generateAdditionalSEOItems = useCallback((): ChecklistItem[] => [
      {
        id: 401,
        text: "URL slug is concise and descriptive",
        status: !isFieldValid('urlSlug') ? 'pending' :
                urlSlug.length > 0 && urlSlug.length <= 50 ? 'success' : 'warning',
        score: !isFieldValid('urlSlug') ? 0 :
               urlSlug.length > 0 && urlSlug.length <= 50 ? 10 :
               urlSlug.length > 50 && urlSlug.length <= 70 ? 7 :
               urlSlug.length > 70 ? 3 : 0,
        maxScore: 10,
        action: !isFieldValid('urlSlug') ? "Fill Required Fields" :
                urlSlug.length === 0 ? "Add URL slug" :
                urlSlug.length > 50 ? "Shorten URL slug" : null,
        tooltip: !isFieldValid('urlSlug') ?
                "Please add a URL slug" :
                urlSlug.length === 0 ?
                "Your URL slug is missing. Add a concise, descriptive slug that includes your primary keyword." :
                urlSlug.length > 0 && urlSlug.length <= 50 ?
                "Great! Your URL slug is concise and descriptive." :
                `Your URL slug is too long (${urlSlug.length} characters). Keep it under 50 characters for better SEO and user experience.`
      },
      {
        id: 402,
        text: "URL slug uses hyphens to separate words",
        status: !isFieldValid('urlSlug') ? 'pending' :
                urlSlug.includes('-') ? 'success' : 'warning',
        score: !isFieldValid('urlSlug') ? 0 :
               urlSlug.includes('-') ? 10 : 0,
        maxScore: 10,
        action: !isFieldValid('urlSlug') ? "Fill Required Fields" :
                !urlSlug.includes('-') ? "Use hyphens to separate words" : null,
        tooltip: !isFieldValid('urlSlug')
                ? "Please add a URL slug"
                : urlSlug.includes('-')
                  ? "Great! Your URL slug uses hyphens to separate words, which is optimal for SEO."
                  : "Use hyphens to separate words in your URL slug (e.g., 'my-article-title'). Search engines recognize hyphens as word separators."
      },
      {
        id: 403,
        text: "URL slug contains no special characters",
        status: !isFieldValid('urlSlug') ? 'pending' :
                /^[a-z0-9-]+$/.test(urlSlug) ? 'success' : 'error',
        score: !isFieldValid('urlSlug') ? 0 :
               /^[a-z0-9-]+$/.test(urlSlug) ? 10 : 0,
        maxScore: 10,
        action: !isFieldValid('urlSlug') ? "Fill Required Fields" :
                !/^[a-z0-9-]+$/.test(urlSlug) ? "Remove special characters" : null,
        tooltip: !isFieldValid('urlSlug')
                ? "Please add a URL slug"
                : /^[a-z0-9-]+$/.test(urlSlug)
                  ? "Great! Your URL slug contains only lowercase letters, numbers, and hyphens, which is optimal for SEO."
                  : "Your URL slug should only contain lowercase letters, numbers, and hyphens. Special characters can cause issues with URLs and are not SEO-friendly."
      },
      {
        id: 404,
        text: "Language and target country are compatible",
        status: !isFieldValid('language') || !isFieldValid('targetCountry') ? 'pending' :
                (language === 'en-us' && targetCountry === 'us') ||
                (language === 'en-gb' && targetCountry === 'uk') ||
                (language === 'fr-fr' && targetCountry === 'fr') ? 'success' : 'warning',
        score: !isFieldValid('language') || !isFieldValid('targetCountry') ? 0 :
               (language === 'en-us' && targetCountry === 'us') ||
               (language === 'en-gb' && targetCountry === 'uk') ||
               (language === 'fr-fr' && targetCountry === 'fr') ? 10 : 5,
        maxScore: 10,
        action: !isFieldValid('language') || !isFieldValid('targetCountry') ? "Fill Required Fields" :
                !((language === 'en-us' && targetCountry === 'us') ||
                  (language === 'en-gb' && targetCountry === 'uk') ||
                  (language === 'fr-fr' && targetCountry === 'fr')) ? "Ensure language and country match" : null,
        tooltip: !isFieldValid('language') || !isFieldValid('targetCountry')
                ? "Please specify both language and target country"
                : (language === 'en-us' && targetCountry === 'us') ||
                  (language === 'en-gb' && targetCountry === 'uk') ||
                  (language === 'fr-fr' && targetCountry === 'fr')
                  ? "Great! Your language and target country are compatible, which is optimal for SEO."
                  : "Your language and target country should be compatible (e.g., en-us with US, en-gb with UK). This helps search engines understand your content's target audience."
      },
      {
        id: 405,
        text: "Secondary keywords are relevant to primary keyword",
        status: !isFieldValid('primaryKeyword') || !isFieldValid('secondaryKeywords') || !Array.isArray(secondaryKeywords) || secondaryKeywords.length === 0 ? 'pending' : 'success',
        score: !isFieldValid('primaryKeyword') || !isFieldValid('secondaryKeywords') || !Array.isArray(secondaryKeywords) || secondaryKeywords.length === 0 ? 0 : 10,
        maxScore: 10,
        action: !isFieldValid('primaryKeyword') || !isFieldValid('secondaryKeywords') || !Array.isArray(secondaryKeywords) || secondaryKeywords.length === 0 ? "Fill Required Fields" : null,
        tooltip: !isFieldValid('primaryKeyword') || !isFieldValid('secondaryKeywords') || !Array.isArray(secondaryKeywords) || secondaryKeywords.length === 0
                ? "Please add both primary and secondary keywords"
                : "Your secondary keywords appear to be relevant to your primary keyword, which is good for SEO. Related keywords help search engines understand your content's context."
      },
      {
        id: 406,
        text: "Has sufficient number of secondary keywords",
        status: !isFieldValid('secondaryKeywords') || !Array.isArray(secondaryKeywords) ? 'pending' :
                secondaryKeywords.length >= 5 ? 'success' :
                secondaryKeywords.length > 0 ? 'warning' : 'error',
        score: !isFieldValid('secondaryKeywords') || !Array.isArray(secondaryKeywords) ? 0 :
               secondaryKeywords.length >= 5 ? 10 :
               secondaryKeywords.length > 0 ? secondaryKeywords.length * 2 : 0,
        maxScore: 10,
        action: !isFieldValid('secondaryKeywords') || !Array.isArray(secondaryKeywords) ? "Fill Required Fields" :
                secondaryKeywords.length < 5 ? "Add more secondary keywords" : null,
        tooltip: !isFieldValid('secondaryKeywords') || !Array.isArray(secondaryKeywords)
                ? "Please add secondary keywords"
                : secondaryKeywords.length >= 5
                  ? `Great! You have ${secondaryKeywords.length} secondary keywords, which is optimal for SEO.`
                  : secondaryKeywords.length > 0
                    ? `You have ${secondaryKeywords.length} secondary keywords. Adding more (aim for at least 5) will improve your SEO by providing more context for search engines.`
                    : "You haven't added any secondary keywords. Adding at least 5 secondary keywords will significantly improve your SEO."
      },
    ], [isFieldValid, urlSlug, secondaryKeywords, language, targetCountry]);

  return {
    generateAdditionalSEOItems
  };
};
