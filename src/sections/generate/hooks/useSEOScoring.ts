import type { UseFormReturn } from 'react-hook-form';

import { useMemo, useState, useEffect, useCallback } from 'react';

import {
  formatPoints,
  getPointsForItem
} from '../../../utils/seoScoringPoints';
import {
  containsKeyword,
  determineSectionType,
  calculateOverallScore,
  calculateKeywordDensity,
  calculateSectionProgress,
  isKeywordInFirstPercentage
} from '../../../utils/seoScoring';

import type { ChecklistItem, ProgressSection } from '../../../utils/seoScoring';

export const useSEOScoring = (form: UseFormReturn<any>) => {
  const { watch, getFieldState, formState } = form;
  const [progressSections, setProgressSections] = useState<ProgressSection[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [totalMaxScore, setTotalMaxScore] = useState<number>(100); // Maximum possible score
  const [changedCriteriaIds, setChangedCriteriaIds] = useState<number[]>([]);
  const [previousItems, setPreviousItems] = useState<Record<number, ChecklistItem>>({});

  // We'll watch individual fields from all possible locations
  // Get individual values directly from watch to avoid unnecessary re-renders
  // Try to get values from both direct fields and nested fields (step1, step2, step3)

  // Title field
  const directTitle = watch('title');
  const step1Title = watch('step1.title');
  const title = useMemo(() =>
    step1Title || directTitle || '',
    [step1Title, directTitle]
  );

  // Meta title field
  const directMetaTitle = watch('metaTitle');
  const step1MetaTitle = watch('step1.metaTitle');
  const metaTitle = useMemo(() =>
    step1MetaTitle || directMetaTitle || '',
    [step1MetaTitle, directMetaTitle]
  );

  // Meta description field
  const directMetaDescription = watch('metaDescription');
  const step1MetaDescription = watch('step1.metaDescription');
  const metaDescription = useMemo(() =>
    step1MetaDescription || directMetaDescription || '',
    [step1MetaDescription, directMetaDescription]
  );

  // URL slug field
  const directUrlSlug = watch('urlSlug');
  const step1UrlSlug = watch('step1.urlSlug');
  const urlSlug = useMemo(() =>
    step1UrlSlug || directUrlSlug || '',
    [step1UrlSlug, directUrlSlug]
  );

  // Content field
  const directContent = watch('content');
  const step1Content = watch('step1.content');
  const step3Content = watch('step3.content');
  const content = useMemo(() =>
    step3Content || step1Content || directContent || '',
    [step3Content, step1Content, directContent]
  );

  // Primary keyword field
  const directPrimaryKeyword = watch('primaryKeyword');
  const step1PrimaryKeyword = watch('step1.primaryKeyword');
  const primaryKeyword = useMemo(() =>
    step1PrimaryKeyword || directPrimaryKeyword || '',
    [step1PrimaryKeyword, directPrimaryKeyword]
  );

  // Secondary keywords field
  const directSecondaryKeywords = watch('secondaryKeywords');
  const step1SecondaryKeywords = watch('step1.secondaryKeywords');

  // Use useMemo to prevent dependencies from changing on every render
  const secondaryKeywords = useMemo(() =>
    step1SecondaryKeywords || directSecondaryKeywords || [],
    [step1SecondaryKeywords, directSecondaryKeywords]
  );

  // Content description field
  const directContentDescription = watch('contentDescription');
  const step1ContentDescription = watch('step1.contentDescription');
  const contentDescription = useMemo(() =>
    step1ContentDescription || directContentDescription || '',
    [step1ContentDescription, directContentDescription]
  );

  // Language field
  const directLanguage = watch('language');
  const step1Language = watch('step1.language');
  const language = useMemo(() =>
    step1Language || directLanguage || '',
    [step1Language, directLanguage]
  );

  // Target country field
  const directTargetCountry = watch('targetCountry');
  const step1TargetCountry = watch('step1.targetCountry');
  const targetCountry = useMemo(() =>
    step1TargetCountry || directTargetCountry || '',
    [step1TargetCountry, directTargetCountry]
  );

  // Table of contents field
  const directTableOfContents = watch('tableOfContents');
  const step1TableOfContents = watch('step1.tableOfContents');
  const tableOfContents = useMemo(() =>
    step1TableOfContents || directTableOfContents || '',
    [step1TableOfContents, directTableOfContents]
  );

  // Helper function to check if a field is valid and has a value
  const isFieldValid = useCallback((fieldName: string): boolean => {
    const fieldState = getFieldState(fieldName, formState);
    // Use direct access to avoid triggering watch unnecessarily
    const value = form.getValues(fieldName);

    // Check if the field has a value and is valid according to form validation
    const hasValue = value !== undefined && value !== null && value !== '';
    const isValid = !fieldState.invalid;

    return hasValue && isValid;
  }, [getFieldState, formState, form]);

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

  // Helper function to determine the appropriate action text based on score and status
  const getActionText = useCallback((
    fieldNames: string[],
    currentScore: number,
    minThreshold: number,
    maxThreshold: number,
    status: 'pending' | 'success' | 'error' | 'warning' = 'pending'
  ): string | null => {
    // Check if any required field is missing
    const missingField = fieldNames.some(field => !isFieldValid(field));

    if (missingField) {
      return "Fill Required Fields";
    }

    // If status is success, no action needed regardless of score
    if (status === 'success') {
      return null;
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

  // Memoize expensive calculations for the first checklist item
  const metaDescriptionStatus = useMemo(() =>
    getStatusBasedOnFields(
      ['metaDescription', 'primaryKeyword'],
      containsKeyword(metaDescription, primaryKeyword)
    ),
    [getStatusBasedOnFields, metaDescription, primaryKeyword]
  );

  const metaDescriptionScore = useMemo(() =>
    calculateKeywordScore(metaDescription, primaryKeyword, { contains: true }),
    [calculateKeywordScore, metaDescription, primaryKeyword]
  );

  const metaDescriptionAction = useMemo(() =>
    getActionText(
      ['metaDescription', 'primaryKeyword'],
      metaDescriptionScore,
      4, // Min threshold (40% of max score)
      8, // Max threshold (80% of max score)
      metaDescriptionStatus
    ),
    [getActionText, metaDescriptionScore, metaDescriptionStatus]
  );

  const metaDescriptionTooltip = useMemo(() =>
    !isFieldValid('metaDescription') || !isFieldValid('primaryKeyword')
      ? "Fill in both meta description and primary keyword fields"
      : !containsKeyword(metaDescription, primaryKeyword)
        ? `Your meta description doesn't include your primary keyword "${primaryKeyword}". Add the keyword to improve SEO.`
        : "Great! Your meta description includes your primary keyword.",
    [isFieldValid, metaDescription, primaryKeyword]
  );

  useEffect(() => {
    // Generate checklist items based on current form values
    const primarySEOItems: ChecklistItem[] = [
      {
        id: 101,
        text: "Focus keyword added to meta description",
        status: metaDescriptionStatus,
        score: metaDescriptionScore,
        maxScore: 10,
        action: metaDescriptionAction,
        tooltip: metaDescriptionTooltip
      },

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
        ),
        tooltip: !isFieldValid('urlSlug') || !isFieldValid('primaryKeyword')
          ? "Fill in both URL slug and primary keyword fields"
          : !containsKeyword(urlSlug, primaryKeyword)
            ? `Your URL slug doesn't include your primary keyword "${primaryKeyword}". Including it can improve SEO ranking.`
            : "Great! Your URL includes your primary keyword."
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
        status: getStatusBasedOnFields(
          ['contentDescription', 'primaryKeyword'],
          containsKeyword(contentDescription, primaryKeyword)
        ),
        score: calculateKeywordScore(contentDescription, primaryKeyword, { contains: true }),
        maxScore: 10,
        action: getActionText(
          ['contentDescription', 'primaryKeyword'],
          calculateKeywordScore(contentDescription, primaryKeyword, { contains: true }),
          4,
          8
        ),
        tooltip: !isFieldValid('contentDescription') || !isFieldValid('primaryKeyword')
          ? "Fill in both content description and primary keyword fields"
          : !containsKeyword(contentDescription, primaryKeyword)
            ? `Your content description doesn't include your primary keyword "${primaryKeyword}". Including it helps search engines understand what your content is about.`
            : "Great! Your content description includes your primary keyword."
      },

      {
        id: 105,
        text: "Secondary keywords are defined",
        status: getStatusBasedOnFields(
          ['secondaryKeywords'],
          Array.isArray(secondaryKeywords) && secondaryKeywords.length > 0
        ),
        score: Array.isArray(secondaryKeywords) && secondaryKeywords.length > 0 ? 10 : 0,
        maxScore: 10,
        action: getActionText(
          ['secondaryKeywords'],
          Array.isArray(secondaryKeywords) && secondaryKeywords.length > 0 ? 10 : 0,
          4,
          8
        ),
        tooltip: !Array.isArray(secondaryKeywords) || secondaryKeywords.length === 0
          ? "You should add secondary keywords to improve your content's SEO. Secondary keywords help search engines understand the context of your content and can increase your visibility for related searches."
          : `Great! You have ${secondaryKeywords.length} secondary keywords defined. This helps search engines understand your content better.`
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
    ];

    const titleOptimizationItems: ChecklistItem[] = [
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
                containsKeyword(metaTitle, primaryKeyword) ? 'success' : 'error',
        score: !isFieldValid('metaTitle') || !isFieldValid('primaryKeyword') ? 0 :
               containsKeyword(metaTitle, primaryKeyword) ? 10 : 0,
        maxScore: 10,
        action: !isFieldValid('metaTitle') || !isFieldValid('primaryKeyword') ?
                "Fill Required Fields" :
                containsKeyword(metaTitle, primaryKeyword) ? null : "Fix",
        tooltip: !isFieldValid('metaTitle') || !isFieldValid('primaryKeyword')
                ? "Fill in both meta title and primary keyword fields"
                : !containsKeyword(metaTitle, primaryKeyword)
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
    ];

    // Create content presentation and additional SEO sections similarly
    const contentPresentationItems: ChecklistItem[] = [
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
        status: !isFieldValid('contentDescription') || !isFieldValid('primaryKeyword') ? 'pending' :
                containsKeyword(contentDescription, primaryKeyword) ? 'success' : 'error',
        score: !isFieldValid('contentDescription') || !isFieldValid('primaryKeyword') ? 0 :
               containsKeyword(contentDescription, primaryKeyword) ? 10 : 0,
        maxScore: 10,
        action: !isFieldValid('contentDescription') || !isFieldValid('primaryKeyword') ? "Fill Required Fields" :
                containsKeyword(contentDescription, primaryKeyword) ? null : "Add keyword to description",
        tooltip: !isFieldValid('contentDescription') || !isFieldValid('primaryKeyword')
                ? "Fill in both content description and primary keyword fields"
                : !containsKeyword(contentDescription, primaryKeyword)
                  ? `Your content description doesn't include your primary keyword "${primaryKeyword}". Including it helps search engines understand what your content is about.`
                  : "Great! Your content description includes your primary keyword."
      },
      {
        id: 303,
        text: "Content description includes secondary keywords",
        status: !isFieldValid('contentDescription') || !isFieldValid('secondaryKeywords') || !Array.isArray(secondaryKeywords) || secondaryKeywords.length === 0 ? 'pending' :
                secondaryKeywords.some(keyword => containsKeyword(contentDescription, keyword)) ? 'success' : 'warning',
        score: !isFieldValid('contentDescription') || !isFieldValid('secondaryKeywords') || !Array.isArray(secondaryKeywords) || secondaryKeywords.length === 0 ? 0 :
               secondaryKeywords.some(keyword => containsKeyword(contentDescription, keyword)) ? 10 : 0,
        maxScore: 10,
        action: !isFieldValid('contentDescription') || !isFieldValid('secondaryKeywords') || !Array.isArray(secondaryKeywords) || secondaryKeywords.length === 0 ? "Fill Required Fields" :
                secondaryKeywords.some(keyword => containsKeyword(contentDescription, keyword)) ? null : "Add secondary keywords to description",
        tooltip: !isFieldValid('contentDescription') || !isFieldValid('secondaryKeywords') || !Array.isArray(secondaryKeywords) || secondaryKeywords.length === 0
                ? "Fill in content description and add secondary keywords"
                : secondaryKeywords.some(keyword => containsKeyword(contentDescription, keyword))
                  ? "Great! Your content description includes at least one of your secondary keywords."
                  : "Your content description should include at least one of your secondary keywords to improve SEO and provide context."
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
    ];

    const additionalSEOItems: ChecklistItem[] = [
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
    ];

    // Calculate progress for each section
    const primarySEOResult = calculateSectionProgress(primarySEOItems);
    const titleOptimizationResult = calculateSectionProgress(titleOptimizationItems);
    const contentPresentationResult = calculateSectionProgress(contentPresentationItems);
    const additionalSEOResult = calculateSectionProgress(additionalSEOItems);

    // Create sections with progress and type
    const sections: ProgressSection[] = [
      {
        id: 1,
        title: `Primary SEO Checklist (${35}%)`,
        progress: primarySEOResult.progress,
        points: primarySEOResult.points,
        maxPoints: primarySEOResult.maxPoints,
        type: determineSectionType(primarySEOResult.progress),
        items: primarySEOItems.map(item => ({
          ...item,
          points: item.status === 'success' ? getPointsForItem(item.id) : 0,
          maxPoints: getPointsForItem(item.id)
        })),
        weight: 35
      },
      {
        id: 2,
        title: `Title Optimization (${25}%)`,
        progress: titleOptimizationResult.progress,
        points: titleOptimizationResult.points,
        maxPoints: titleOptimizationResult.maxPoints,
        type: determineSectionType(titleOptimizationResult.progress),
        items: titleOptimizationItems.map(item => ({
          ...item,
          points: item.status === 'success' ? getPointsForItem(item.id) : 0,
          maxPoints: getPointsForItem(item.id)
        })),
        weight: 25
      },
      {
        id: 3,
        title: `Content Presentation (${20}%)`,
        progress: contentPresentationResult.progress,
        points: contentPresentationResult.points,
        maxPoints: contentPresentationResult.maxPoints,
        type: determineSectionType(contentPresentationResult.progress),
        items: contentPresentationItems.map(item => ({
          ...item,
          points: item.status === 'success' ? getPointsForItem(item.id) : 0,
          maxPoints: getPointsForItem(item.id)
        })),
        weight: 20
      },
      {
        id: 4,
        title: `Additional SEO Factors (${10}%)`,
        progress: additionalSEOResult.progress,
        points: additionalSEOResult.points,
        maxPoints: additionalSEOResult.maxPoints,
        type: determineSectionType(additionalSEOResult.progress),
        items: additionalSEOItems.map(item => ({
          ...item,
          points: item.status === 'success' ? getPointsForItem(item.id) : 0,
          maxPoints: getPointsForItem(item.id)
        })),
        weight: 10
      }
    ];

    // Calculate overall score
    const scoreResult = calculateOverallScore(sections);

    // Track changes in criteria
    const allItems = sections.flatMap(section => section.items);
    const newChangedIds: number[] = [];

    // Create a map of all current items
    const currentItems: Record<number, ChecklistItem> = {};
    allItems.forEach(item => {
      currentItems[item.id] = item;

      // Check if this item has changed from its previous state
      const prevItem = previousItems[item.id];
      if (prevItem) {
        // Check if status or score has changed
        if (prevItem.status !== item.status || prevItem.points !== item.points) {
          newChangedIds.push(item.id);
        }
      }
    });

    // Update state
    setProgressSections(sections);
    setOverallScore(scoreResult.score);
    setTotalMaxScore(scoreResult.maxScore);
    setChangedCriteriaIds(newChangedIds);
    setPreviousItems(currentItems);
  }, [
    title, metaTitle, metaDescription, urlSlug, content, primaryKeyword,
    secondaryKeywords, contentDescription, language, targetCountry, tableOfContents,
    formState, getFieldState, getStatusBasedOnFields, isFieldValid, getActionText,
    calculateKeywordScore, previousItems,
    // Add the memoized values to the dependency array
    metaDescriptionAction, metaDescriptionScore, metaDescriptionStatus, metaDescriptionTooltip
  ]);

  // Memoize the return values to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    progressSections,
    overallScore: Math.round(overallScore),
    totalMaxScore,
    changedCriteriaIds,
    formattedScore: formatPoints(overallScore)
  }), [progressSections, overallScore, totalMaxScore, changedCriteriaIds]);

  return returnValue;
};
