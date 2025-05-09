import type { UseFormReturn } from 'react-hook-form';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

// Utility imports
import { debounce } from '../../../utils/debounce';
import { calculateItemScore } from '../../../utils/seoScoringCalculator';
import { getScoringItemsForField } from '../../../utils/seoInputMapping';
import { formatPoints, sectionScores, getPointsForItem } from '../../../utils/seoScoringPoints';
import { determineSectionType, calculateOverallScore, calculateSectionProgress } from '../../../utils/seoScoring';
// SEO section hooks
import {
  usePrimarySEOItems,
  useAdditionalSEOItems,
  useTitleOptimizationItems,
  useContentPresentationItems
} from './seoScoring';

// Types
import type {
  ChecklistItem,
  ProgressSection,
  AffectedCriterion,
  SEOScoringHookResult
} from './seoScoring/types';

/**
 * Type for form values used in SEO scoring
 */
interface FormValues {
  title: string;
  metaTitle: string;
  metaDescription: string;
  urlSlug: string;
  content: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  contentDescription: string;
  language: string;
  targetCountry: string;
}

/**
 * Helper function to extract form values with fallbacks for step1/step3 fields
 */
const extractFormValues = (form: UseFormReturn<any>): FormValues => {
  const values = form.getValues();
  
  return {
    title: values.title || values.step1?.title || '',
    metaTitle: values.metaTitle || values.step1?.metaTitle || '',
    metaDescription: values.metaDescription || values.step1?.metaDescription || '',
    urlSlug: values.urlSlug || values.step1?.urlSlug || '',
    content: values.content || values.step1?.content || values.step3?.content || '',
    primaryKeyword: values.primaryKeyword || values.step1?.primaryKeyword || '',
    secondaryKeywords: values.secondaryKeywords || values.step1?.secondaryKeywords || [],
    contentDescription: values.contentDescription || values.step1?.contentDescription || '',
    language: values.language || values.step1?.language || '',
    targetCountry: values.targetCountry || values.step1?.targetCountry || ''
  };
};

/**
 * Main SEO scoring hook that combines all section modules
 */
export const useSEOScoring = (form: UseFormReturn<any>): SEOScoringHookResult => {
  // State for SEO scoring
  const [progressSections, setProgressSections] = useState<ProgressSection[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [changedCriteriaIds, setChangedCriteriaIds] = useState<number[]>([]);
  const [previousItems, setPreviousItems] = useState<Record<number, ChecklistItem>>({});
  
  // Get current form values
  const formValues = useMemo(() => extractFormValues(form), [form]);

  // Use refs to prevent unnecessary re-renders
  const prevValuesRef = useRef({
    sectionsHash: '',
    score: 0,
    maxScore: 100,
    lastUpdate: 0
  });

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
    const { primarySeo: primaryWeight, titleOptimization: titleWeight, 
            contentPresentation: contentWeight, additionalSeoFactors: additionalWeight } = sectionScores.weights;
    
    // Create sections with progress and type
    const sections: ProgressSection[] = [
      {
        id: 1,
        title: `Primary SEO Checklist (${primaryWeight}%)`,
        progress: primarySEOResult.progress,
        points: primarySEOResult.points,
        maxPoints: primarySEOResult.maxPoints,
        type: determineSectionType(primarySEOResult.progress),
        items: primarySEOItems.map(item => ({
          ...item,
          points: item.status === 'success' 
            ? calculateItemScore(item.id, item.text, {
                primaryKeyword: formValues.primaryKeyword,
                secondaryKeywords: formValues.secondaryKeywords,
                language: formValues.language,
                targetCountry: formValues.targetCountry,
                contentDescription: formValues.contentDescription
              }) 
            : 0,
          maxPoints: getPointsForItem(item.id)
        })),
        weight: primaryWeight
      },
      {
        id: 2,
        title: `Title Optimization (${titleWeight}%)`,
        progress: titleOptimizationResult.progress,
        points: titleOptimizationResult.points,
        maxPoints: titleOptimizationResult.maxPoints,
        type: determineSectionType(titleOptimizationResult.progress),
        items: titleOptimizationItems.map(item => ({
          ...item,
          points: item.status === 'success' 
            ? calculateItemScore(item.id, item.text, {
                primaryKeyword: formValues.primaryKeyword,
                title: formValues.title,
                metaTitle: formValues.metaTitle,
                metaDescription: formValues.metaDescription
              }) 
            : 0,
          maxPoints: getPointsForItem(item.id)
        })),
        weight: titleWeight
      },
      {
        id: 3,
        title: `Content Presentation (${contentWeight}%)`,
        progress: contentPresentationResult.progress,
        points: contentPresentationResult.points,
        maxPoints: contentPresentationResult.maxPoints,
        type: determineSectionType(contentPresentationResult.progress),
        items: contentPresentationItems.map(item => ({
          ...item,
          points: item.status === 'success' 
            ? calculateItemScore(item.id, item.text, {
                primaryKeyword: formValues.primaryKeyword,
                secondaryKeywords: formValues.secondaryKeywords,
                content: formValues.content,
                contentDescription: formValues.contentDescription
              }) 
            : 0,
          maxPoints: getPointsForItem(item.id)
        })),
        weight: contentWeight
      },
      {
        id: 4,
        title: `Additional SEO Factors (${additionalWeight}%)`,
        progress: additionalSEOResult.progress,
        points: additionalSEOResult.points,
        maxPoints: additionalSEOResult.maxPoints,
        type: determineSectionType(additionalSEOResult.progress),
        items: additionalSEOItems.map(item => ({
          ...item,
          points: item.status === 'success' 
            ? calculateItemScore(item.id, item.text, {
                primaryKeyword: formValues.primaryKeyword,
                secondaryKeywords: formValues.secondaryKeywords,
                language: formValues.language,
                targetCountry: formValues.targetCountry,
                urlSlug: formValues.urlSlug
              }) 
            : 0,
          maxPoints: getPointsForItem(item.id)
        })),
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
    formValues
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCalculateScores = useCallback(
    debounce(() => {
      // Generate checklist items and calculate scores
      const { sections, scoreResult } = generateChecklistItems();

      // Track changes in criteria
      const allItems = sections.flatMap((section: ProgressSection) => section.items);
      const newChangedIds: number[] = [];
      const currentItems: Record<number, ChecklistItem> = {};

      // Process all items
      allItems.forEach((item: ChecklistItem) => {
        currentItems[item.id] = item;

        // Check if this item has changed from its previous state
        const prevItem = previousItems[item.id];
        if (prevItem && (prevItem.status !== item.status || prevItem.score !== item.score)) {
          newChangedIds.push(item.id);
        }
      });

      // Get new values
      const newScore = scoreResult.score;
      const sectionsHash = JSON.stringify(sections);

      // Only update state if values have actually changed
      let stateChanged = false;

      // Check for changes
      if (sectionsHash !== prevValuesRef.current.sectionsHash) {
        setProgressSections(sections);
        prevValuesRef.current.sectionsHash = sectionsHash;
        stateChanged = true;
      }

      if (Math.round(newScore) !== Math.round(prevValuesRef.current.score)) {
        setOverallScore(newScore);
        prevValuesRef.current.score = newScore;
        stateChanged = true;
      }

      if (newChangedIds.length > 0) {
        setChangedCriteriaIds(newChangedIds);
        stateChanged = true;
      }

      // Only update previous items if something changed
      if (stateChanged) {
        setPreviousItems(currentItems);
        prevValuesRef.current.lastUpdate = Date.now();
      }
    }, 300), // 300ms debounce delay for better responsiveness
    [generateChecklistItems, previousItems]
  );

  // Trigger score calculation when form values change
  useEffect(() => {
    debouncedCalculateScores();
    // No cleanup needed as debounce handles it
    return () => {};
  }, [debouncedCalculateScores]);

  // Function to identify criteria affected by a specific field
  const getAffectedCriteriaByField = useCallback((fieldName: string): number[] =>
    getScoringItemsForField(fieldName), []);

  // Function to simulate how a field change would affect criteria
  const simulateFieldChange = useCallback((fieldName: string, newValue: any): AffectedCriterion[] => {
    // Get affected criteria IDs
    const affectedCriteriaIds = getAffectedCriteriaByField(fieldName);
    if (affectedCriteriaIds.length === 0) return [];

    // Create a temporary form with the new value
    const tempForm = { ...form };
    tempForm.getValues = (path?: any) => {
      if (path === fieldName) return newValue;
      return form.getValues(path);
    };

    // Generate items with the simulated change
    const tempFormValues = extractFormValues(tempForm);
    
    // We can't use hooks inside callbacks, so we need to manually create the sections
    // by calling the generate functions directly with the modified form values
    const primarySEOItems = generatePrimarySEOItems();
    const titleOptimizationItems = generateTitleOptimizationItems();
    const contentPresentationItems = generateContentPresentationItems();
    const additionalSEOItems = generateAdditionalSEOItems();
    
    // Create sections with the simulated values
    const sections = [
      {
        id: 1,
        title: 'Primary SEO Checklist',
        items: primarySEOItems.map(item => ({
          ...item,
          points: item.status === 'success' 
            ? calculateItemScore(item.id, item.text, {
                primaryKeyword: tempFormValues.primaryKeyword,
                secondaryKeywords: tempFormValues.secondaryKeywords,
                language: tempFormValues.language,
                targetCountry: tempFormValues.targetCountry,
                contentDescription: tempFormValues.contentDescription
              }) 
            : 0
        }))
      },
      {
        id: 2,
        title: 'Title Optimization',
        items: titleOptimizationItems.map(item => ({
          ...item,
          points: item.status === 'success' 
            ? calculateItemScore(item.id, item.text, {
                primaryKeyword: tempFormValues.primaryKeyword,
                title: tempFormValues.title,
                metaTitle: tempFormValues.metaTitle,
                metaDescription: tempFormValues.metaDescription
              }) 
            : 0
        }))
      },
      {
        id: 3,
        title: 'Content Presentation',
        items: contentPresentationItems.map(item => ({
          ...item,
          points: item.status === 'success' 
            ? calculateItemScore(item.id, item.text, {
                primaryKeyword: tempFormValues.primaryKeyword,
                secondaryKeywords: tempFormValues.secondaryKeywords,
                content: tempFormValues.content,
                contentDescription: tempFormValues.contentDescription
              }) 
            : 0
        }))
      },
      {
        id: 4,
        title: 'Additional SEO Factors',
        items: additionalSEOItems.map(item => ({
          ...item,
          points: item.status === 'success' 
            ? calculateItemScore(item.id, item.text, {
                primaryKeyword: tempFormValues.primaryKeyword,
                secondaryKeywords: tempFormValues.secondaryKeywords,
                language: tempFormValues.language,
                targetCountry: tempFormValues.targetCountry,
                urlSlug: tempFormValues.urlSlug
              }) 
            : 0
        }))
      }
    ];
    
    const allCurrentItems = sections.flatMap(section => section.items);

    // Find the current status of affected criteria
    const currentItems = progressSections.flatMap(section => section.items);

    // Compare current vs simulated status for affected criteria
    return affectedCriteriaIds
      .map(id => {
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
      })
      .filter(Boolean) as AffectedCriterion[];
  }, [
    form, 
    generatePrimarySEOItems,
    generateTitleOptimizationItems,
    generateContentPresentationItems,
    generateAdditionalSEOItems,
    getAffectedCriteriaByField, 
    progressSections
  ]);

  // Memoize the return values to prevent unnecessary re-renders
  return useMemo(() => ({
    progressSections,
    overallScore: Math.min(100, Math.round(overallScore)),
    totalMaxScore: 100,
    changedCriteriaIds,
    formattedScore: formatPoints(Math.min(100, Math.round(overallScore))),
    getAffectedCriteriaByField,
    simulateFieldChange
  }), [
    progressSections,
    overallScore,
    changedCriteriaIds,
    getAffectedCriteriaByField,
    simulateFieldChange
  ]);
};
