import type { UseFormReturn } from 'react-hook-form';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { debounce } from '../../../utils/debounce';
import { calculateItemScore } from '../../../utils/seoScoringCalculator';
import { getScoringItemsForField } from '../../../utils/seoInputMapping';
import {
  formatPoints,
  sectionScores,
  getPointsForItem
} from '../../../utils/seoScoringPoints';
import {
  determineSectionType,
  calculateOverallScore,
  calculateSectionProgress
} from '../../../utils/seoScoring';
import {
  usePrimarySEOItems,
  useAdditionalSEOItems,
  useTitleOptimizationItems,
  useContentPresentationItems
} from './seoScoring';

import type {
  ChecklistItem,
  ProgressSection,
  AffectedCriterion,
  SEOScoringHookResult
} from './seoScoring/types';

/**
 * Main SEO scoring hook that combines all section modules
 */
export const useSEOScoring = (form: UseFormReturn<any>): SEOScoringHookResult => {
  const { watch } = form;

  // State for SEO scoring
  const [progressSections, setProgressSections] = useState<ProgressSection[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  // We don't need to track totalMaxScore as state since we're capping it at 100
  const [changedCriteriaIds, setChangedCriteriaIds] = useState<number[]>([]);
  const [previousItems, setPreviousItems] = useState<Record<number, ChecklistItem>>({});

  // Use refs to prevent unnecessary re-renders
  const prevValuesRef = useRef<{
    sectionsHash: string;
    score: number;
    maxScore: number;
    lastUpdate?: number; // Add lastUpdate field for forcing re-renders
  }>({
    sectionsHash: '',
    score: 0,
    maxScore: 100
  });

  // Watch all form fields that affect SEO scoring
  // This ensures the hook re-renders when any of these fields change
  // Use individual watch calls for each field to ensure more reliable updates
  const watchTitle = watch('title');
  const watchStep1Title = watch('step1.title');
  const watchMetaTitle = watch('metaTitle');
  const watchStep1MetaTitle = watch('step1.metaTitle');
  const watchMetaDescription = watch('metaDescription');
  const watchStep1MetaDescription = watch('step1.metaDescription');
  const watchUrlSlug = watch('urlSlug');
  const watchStep1UrlSlug = watch('step1.urlSlug');
  const watchContent = watch('content');
  const watchStep1Content = watch('step1.content');
  const watchStep3Content = watch('step3.content');
  const watchPrimaryKeyword = watch('primaryKeyword');
  const watchStep1PrimaryKeyword = watch('step1.primaryKeyword');
  const watchSecondaryKeywords = watch('secondaryKeywords');
  const watchStep1SecondaryKeywords = watch('step1.secondaryKeywords');
  const watchContentDescription = watch('contentDescription');
  const watchStep1ContentDescription = watch('step1.contentDescription');
  const watchLanguage = watch('language');
  const watchStep1Language = watch('step1.language');
  const watchTargetCountry = watch('targetCountry');
  const watchStep1TargetCountry = watch('step1.targetCountry');

  // Combine all watched fields into a single array for dependency tracking
  // Use useMemo to prevent the array from changing on every render
  const watchedFields = useMemo(() => [
    watchTitle, watchStep1Title,
    watchMetaTitle, watchStep1MetaTitle,
    watchMetaDescription, watchStep1MetaDescription,
    watchUrlSlug, watchStep1UrlSlug,
    watchContent, watchStep1Content, watchStep3Content,
    watchPrimaryKeyword, watchStep1PrimaryKeyword,
    watchSecondaryKeywords, watchStep1SecondaryKeywords,
    watchContentDescription, watchStep1ContentDescription,
    watchLanguage, watchStep1Language,
    watchTargetCountry, watchStep1TargetCountry
  ], [
    watchTitle, watchStep1Title,
    watchMetaTitle, watchStep1MetaTitle,
    watchMetaDescription, watchStep1MetaDescription,
    watchUrlSlug, watchStep1UrlSlug,
    watchContent, watchStep1Content, watchStep3Content,
    watchPrimaryKeyword, watchStep1PrimaryKeyword,
    watchSecondaryKeywords, watchStep1SecondaryKeywords,
    watchContentDescription, watchStep1ContentDescription,
    watchLanguage, watchStep1Language,
    watchTargetCountry, watchStep1TargetCountry
  ]);

  // Debug the form values
  useEffect(() => {
    prevValuesRef.current = {
      ...prevValuesRef.current,
      lastUpdate: Date.now()
    };
  }, [
    form,
    watchedFields,
    watchMetaDescription,
    watchStep1MetaDescription,
    watchUrlSlug,
    watchStep1UrlSlug,
    watchContentDescription,
    watchStep1ContentDescription,
    watchPrimaryKeyword,
    watchStep1PrimaryKeyword,
    watchSecondaryKeywords,
    watchStep1SecondaryKeywords
  ]);

  // Get section item generators
  const { generatePrimarySEOItems } = usePrimarySEOItems(form);
  const { generateTitleOptimizationItems } = useTitleOptimizationItems(form);
  const { generateContentPresentationItems } = useContentPresentationItems(form);
  const { generateAdditionalSEOItems } = useAdditionalSEOItems(form);

  // Generate checklist items for each section
  const generateChecklistItems = useCallback(() => {
    // Get items from each section
    const primarySEOItems = generatePrimarySEOItems();
    const titleOptimizationItems = generateTitleOptimizationItems();
    const contentPresentationItems = generateContentPresentationItems();
    const additionalSEOItems = generateAdditionalSEOItems();

    // Calculate progress for each section
    const primarySEOResult = calculateSectionProgress(primarySEOItems);
    const titleOptimizationResult = calculateSectionProgress(titleOptimizationItems);
    const contentPresentationResult = calculateSectionProgress(contentPresentationItems);
    const additionalSEOResult = calculateSectionProgress(additionalSEOItems);

    // Get the calculated weights from sectionScores
    const primaryWeight = sectionScores.weights.primarySeo;
    const titleWeight = sectionScores.weights.titleOptimization;
    const contentWeight = sectionScores.weights.contentPresentation;
    const additionalWeight = sectionScores.weights.additionalSeoFactors;

    // Create sections with progress and type
    const sections: ProgressSection[] = [
      {
        id: 1,
        title: `Primary SEO Checklist (${primaryWeight}%)`,
        progress: primarySEOResult.progress,
        points: primarySEOResult.points,
        maxPoints: primarySEOResult.maxPoints,
        type: determineSectionType(primarySEOResult.progress),
        items: primarySEOItems.map(item => {
          // Calculate the actual score based on the detailed rules
          const formValues = form.getValues();
          const context = {
            primaryKeyword: formValues.primaryKeyword || formValues.step1?.primaryKeyword || '',
            secondaryKeywords: formValues.secondaryKeywords || formValues.step1?.secondaryKeywords || [],
            language: formValues.language || formValues.step1?.language || '',
            targetCountry: formValues.targetCountry || formValues.step1?.targetCountry || '',
            contentDescription: formValues.contentDescription || formValues.step1?.contentDescription || ''
          };

          const itemScore = item.status === 'success'
            ? calculateItemScore(item.id, item.text, context)
            : 0;

          return {
            ...item,
            points: itemScore,
            maxPoints: getPointsForItem(item.id)
          };
        }),
        weight: primaryWeight
      },
      {
        id: 2,
        title: `Title Optimization (${titleWeight}%)`,
        progress: titleOptimizationResult.progress,
        points: titleOptimizationResult.points,
        maxPoints: titleOptimizationResult.maxPoints,
        type: determineSectionType(titleOptimizationResult.progress),
        items: titleOptimizationItems.map(item => {
          // Calculate the actual score based on the detailed rules
          const formValues = form.getValues();
          const context = {
            primaryKeyword: formValues.primaryKeyword || formValues.step1?.primaryKeyword || '',
            title: formValues.title || formValues.step1?.title || '',
            metaTitle: formValues.metaTitle || formValues.step1?.metaTitle || '',
            metaDescription: formValues.metaDescription || formValues.step1?.metaDescription || ''
          };

          const itemScore = item.status === 'success'
            ? calculateItemScore(item.id, item.text, context)
            : 0;

          return {
            ...item,
            points: itemScore,
            maxPoints: getPointsForItem(item.id)
          };
        }),
        weight: titleWeight
      },
      {
        id: 3,
        title: `Content Presentation (${contentWeight}%)`,
        progress: contentPresentationResult.progress,
        points: contentPresentationResult.points,
        maxPoints: contentPresentationResult.maxPoints,
        type: determineSectionType(contentPresentationResult.progress),
        items: contentPresentationItems.map(item => {
          // Calculate the actual score based on the detailed rules
          const formValues = form.getValues();
          const context = {
            primaryKeyword: formValues.primaryKeyword || formValues.step1?.primaryKeyword || '',
            secondaryKeywords: formValues.secondaryKeywords || formValues.step1?.secondaryKeywords || [],
            content: formValues.content || formValues.step1?.content || formValues.step3?.content || '',
            contentDescription: formValues.contentDescription || formValues.step1?.contentDescription || ''
          };

          const itemScore = item.status === 'success'
            ? calculateItemScore(item.id, item.text, context)
            : 0;

          return {
            ...item,
            points: itemScore,
            maxPoints: getPointsForItem(item.id)
          };
        }),
        weight: contentWeight
      },
      {
        id: 4,
        title: `Additional SEO Factors (${additionalWeight}%)`,
        progress: additionalSEOResult.progress,
        points: additionalSEOResult.points,
        maxPoints: additionalSEOResult.maxPoints,
        type: determineSectionType(additionalSEOResult.progress),
        items: additionalSEOItems.map(item => {
          // Calculate the actual score based on the detailed rules
          const formValues = form.getValues();
          const context = {
            primaryKeyword: formValues.primaryKeyword || formValues.step1?.primaryKeyword || '',
            secondaryKeywords: formValues.secondaryKeywords || formValues.step1?.secondaryKeywords || [],
            language: formValues.language || formValues.step1?.language || '',
            targetCountry: formValues.targetCountry || formValues.step1?.targetCountry || '',
            urlSlug: formValues.urlSlug || formValues.step1?.urlSlug || ''
          };

          const itemScore = item.status === 'success'
            ? calculateItemScore(item.id, item.text, context)
            : 0;

          return {
            ...item,
            points: itemScore,
            maxPoints: getPointsForItem(item.id)
          };
        }),
        weight: additionalWeight
      }
    ];

    return {
      sections,
      scoreResult: calculateOverallScore(sections)
    };
  }, [
    generatePrimarySEOItems,
    generateTitleOptimizationItems,
    generateContentPresentationItems,
    generateAdditionalSEOItems,
    form
  ]);

  // Create a debounced version of the score calculation function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCalculateScores = useCallback(
    debounce(() => {
      // Log that we're recalculating scores
      console.log('[SEO DEBUG] Recalculating SEO scores...');

      // Generate checklist items and calculate scores
      const { sections, scoreResult } = generateChecklistItems();

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
          if (prevItem.status !== item.status || prevItem.score !== item.score) {
            newChangedIds.push(item.id);

            // Log the change for debugging
            console.log(`[SEO DEBUG] Item ${item.id} changed:`, {
              text: item.text,
              oldStatus: prevItem.status,
              newStatus: item.status,
              oldScore: prevItem.score,
              newScore: item.score
            });
          }
        }
      });

      // Get new values
      const newScore = scoreResult.score;
      const newMaxScore = scoreResult.maxScore;

      // Get current values from refs to avoid unnecessary re-renders
      const currentSectionsHash = prevValuesRef.current.sectionsHash;
      const currentScore = prevValuesRef.current.score;
      const currentMaxScore = prevValuesRef.current.maxScore;
      const lastUpdate = prevValuesRef.current.lastUpdate || 0;

      // Create a hash of the sections to compare
      const sectionsHash = JSON.stringify(sections);

      // Only update state if values have actually changed
      let stateChanged = false;

      // Always update if the lastUpdate timestamp has changed (form values changed)
      const now = Date.now();
      if (now - lastUpdate < 1000) { // Only consider updates within the last second
        console.log('[SEO DEBUG] Forcing update due to form value change');
        stateChanged = true;
      }

      if (sectionsHash !== currentSectionsHash) {
        setProgressSections(sections);
        prevValuesRef.current.sectionsHash = sectionsHash;
        stateChanged = true;
        console.log('[SEO DEBUG] Sections changed');
      }

      if (Math.round(newScore) !== Math.round(currentScore)) {
        setOverallScore(newScore);
        prevValuesRef.current.score = newScore;
        stateChanged = true;
        console.log('[SEO DEBUG] Overall score changed:', { old: currentScore, new: newScore });
      }

      if (newMaxScore !== currentMaxScore) {
        // We don't need to update state for max score anymore
        prevValuesRef.current.maxScore = newMaxScore;
        stateChanged = true;
        console.log('[SEO DEBUG] Max score changed:', { old: currentMaxScore, new: newMaxScore });
      }

      if (newChangedIds.length > 0) {
        setChangedCriteriaIds(newChangedIds);
        stateChanged = true;
        console.log('[SEO DEBUG] Changed criteria IDs:', newChangedIds);
      }

      // Only update previous items if something changed
      if (stateChanged) {
        setPreviousItems(currentItems);
        console.log('[SEO DEBUG] State updated');
      } else {
        console.log('[SEO DEBUG] No state changes detected');
      }
    }, 500), // 500ms debounce delay
    [generateChecklistItems, previousItems]
  );

  // Use a single useEffect with optimized dependency array
  useEffect(() => {
    // Call the debounced function instead of doing the calculation directly
    debouncedCalculateScores();

    // Return a cleanup function that cancels any pending debounced calls
    return () => {
      // The debounce implementation doesn't expose a cancel method,
      // but the next call will clear any pending timeouts
    };
  }, [
    debouncedCalculateScores,
    watchedFields,
    // Add individual watched fields to ensure the effect runs when any of them change
    watchMetaDescription,
    watchStep1MetaDescription,
    watchUrlSlug,
    watchStep1UrlSlug,
    watchContentDescription,
    watchStep1ContentDescription,
    watchPrimaryKeyword,
    watchStep1PrimaryKeyword,
    watchSecondaryKeywords,
    watchStep1SecondaryKeywords
  ]);

  // Function to identify criteria affected by a specific field
  const getAffectedCriteriaByField = useCallback((fieldName: string): number[] => 
    // Use the new mapping utility to get affected scoring items
     getScoringItemsForField(fieldName)
  , []);

  // Function to simulate how a field change would affect criteria
  const simulateFieldChange = useCallback((
    fieldName: string,
    newValue: any
  ): AffectedCriterion[] => {
    // Get all criteria that would be affected by this field
    const affectedCriteriaIds = getAffectedCriteriaByField(fieldName);
    if (affectedCriteriaIds.length === 0) return [];

    // Create a temporary form with the new value to simulate the change
    const tempForm = { ...form };

    // Modify the getValues function to return the new value for the specified field
    tempForm.getValues = (path?: any) => {
      if (path === fieldName) return newValue;
      return form.getValues(path);
    };

    // Generate checklist items with the simulated change
    const { sections } = generateChecklistItems();
    const allCurrentItems = sections.flatMap(section => section.items);

    // Find the current status of affected criteria
    const currentItems = progressSections.flatMap(section => section.items);

    // Compare current vs simulated status for affected criteria
    return affectedCriteriaIds.map(id => {
      const currentItem = currentItems.find(item => item.id === id);
      const simulatedItem = allCurrentItems.find(item => item.id === id);

      if (!currentItem || !simulatedItem) return null;

      // Determine impact
      let impact: 'positive' | 'negative' | 'neutral' = 'neutral';
      let message = '';

      if (currentItem.status === 'success' && simulatedItem.status !== 'success') {
        impact = 'negative';
        message = `This change would negatively affect "${simulatedItem.text}"`;
      } else if (currentItem.status !== 'success' && simulatedItem.status === 'success') {
        impact = 'positive';
        message = `This change would satisfy "${simulatedItem.text}"`;
      } else if (simulatedItem.score !== undefined && currentItem.score !== undefined) {
        if (simulatedItem.score > currentItem.score) {
          impact = 'positive';
          message = `This change would improve "${simulatedItem.text}"`;
        } else if (simulatedItem.score < currentItem.score) {
          impact = 'negative';
          message = `This change would reduce the score for "${simulatedItem.text}"`;
        }
      }

      return {
        id,
        text: simulatedItem.text,
        status: simulatedItem.status,
        previousStatus: currentItem.status,
        message,
        impact
      };
    }).filter(Boolean) as AffectedCriterion[];
  }, [form, generateChecklistItems, getAffectedCriteriaByField, progressSections]);

  // Memoize the return values to prevent unnecessary re-renders
  return useMemo(() => {
    // Ensure the score never exceeds 100 points
    const cappedScore = Math.min(100, Math.round(overallScore));
    // Also cap the max score at 100 for display purposes
    const cappedMaxScore = 100;

    return {
      progressSections,
      overallScore: cappedScore,
      totalMaxScore: cappedMaxScore,
      changedCriteriaIds,
      formattedScore: formatPoints(cappedScore),
      getAffectedCriteriaByField,
      simulateFieldChange
    };
  }, [
    progressSections,
    overallScore,
    changedCriteriaIds,
    getAffectedCriteriaByField,
    simulateFieldChange
  ]);
};
