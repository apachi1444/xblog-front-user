'use client';

import type { UseFormReturn } from 'react-hook-form';

import { useMemo, useState, useCallback } from 'react';

import { SEO_CRITERIA, CRITERIA_TO_INPUT_MAP } from '../../../utils/seo-criteria-definitions';
import { 
  EVALUATION_FUNCTIONS, 
  IMPROVEMENT_FUNCTIONS,
  getAffectedCriteriaByField
} from '../../../utils/seo-criteria-evaluators';

import type { CriterionStatus } from '../../../types/criteria.types';
import type { 
  FormData} from '../../../utils/seo-criteria-evaluators';

// Type for criteria evaluation results
interface CriterionResult {
  status: CriterionStatus;
  message: string;
  score: number;
}

// Type for criteria state
interface CriteriaState {
  [criterionId: number]: CriterionResult;
}

/**
 * Hook for evaluating SEO criteria based on form input
 */
export function useCriteriaEvaluation(formMethods: UseFormReturn<any>) {
  const [criteriaState, setCriteriaState] = useState<CriteriaState>({});

  // Calculate total score
  const totalScore = useMemo(() => Object.values(criteriaState).reduce((total, result) => total + (result.score || 0), 0), [criteriaState]);

  // Calculate maximum possible score
  const maxScore = useMemo(() => {
    let total = 0;
    
    // Sum up the weights of all criteria
    Object.values(SEO_CRITERIA).forEach(section => {
      section.criteria.forEach(criterion => {
        total += criterion.weight;
      });
    });
    
    return total;
  }, []);

  // Get criteria affected by an input field
  const getInputCriteria = useCallback((inputKey: string) => getAffectedCriteriaByField(inputKey), []);

  // Get input fields that affect a criterion
  const getCriterionInputFields = useCallback((criterionId: number) => CRITERIA_TO_INPUT_MAP[criterionId] || [], []);

  // Evaluate criteria based on input changes
  const evaluateCriteria = useCallback(
    (inputKey: string, value: any) => {
      const criteriaIds = getInputCriteria(inputKey);

      if (!criteriaIds.length) return;

      setCriteriaState((prevState) => {
        const newState = { ...prevState };

        criteriaIds.forEach((criterionId) => {
          const evaluationFn = EVALUATION_FUNCTIONS[criterionId];
          if (evaluationFn) {
            // Get form values for evaluation
            const formData: FormData = {
              title: formMethods.getValues('title') || formMethods.getValues('step1.title') || '',
              metaTitle: formMethods.getValues('metaTitle') || formMethods.getValues('step2.metaTitle') || '',
              metaDescription: formMethods.getValues('metaDescription') || formMethods.getValues('step2.metaDescription') || '',
              urlSlug: formMethods.getValues('urlSlug') || formMethods.getValues('step2.urlSlug') || '',
              primaryKeyword: formMethods.getValues('primaryKeyword') || formMethods.getValues('step1.primaryKeyword') || '',
              secondaryKeywords: formMethods.getValues('secondaryKeywords') || formMethods.getValues('step1.secondaryKeywords') || [],
              content: formMethods.getValues('content') || formMethods.getValues('step3.content') || '',
              contentDescription: formMethods.getValues('contentDescription') || formMethods.getValues('step1.contentDescription') || '',
              language: formMethods.getValues('language') || formMethods.getValues('step1.language') || '',
              targetCountry: formMethods.getValues('targetCountry') || formMethods.getValues('step1.targetCountry') || '',
            };

            const result = evaluationFn(value, formData);
            newState[criterionId] = result;
          }
        });

        return newState;
      });
    },
    [getInputCriteria, formMethods]
  );

  // Improve input based on criterion
  const improveCriterion = useCallback(
    (criterionId: number) => {
      const inputFields = getCriterionInputFields(criterionId);
      if (!inputFields.length) return;

      const improvementFn = IMPROVEMENT_FUNCTIONS[criterionId];
      if (improvementFn) {
        // Get form values for improvement
        const formData: FormData = {
          title: formMethods.getValues('title') || formMethods.getValues('step1.title') || '',
          metaTitle: formMethods.getValues('metaTitle') || formMethods.getValues('step2.metaTitle') || '',
          metaDescription: formMethods.getValues('metaDescription') || formMethods.getValues('step2.metaDescription') || '',
          urlSlug: formMethods.getValues('urlSlug') || formMethods.getValues('step2.urlSlug') || '',
          primaryKeyword: formMethods.getValues('primaryKeyword') || formMethods.getValues('step1.primaryKeyword') || '',
          secondaryKeywords: formMethods.getValues('secondaryKeywords') || formMethods.getValues('step1.secondaryKeywords') || [],
          content: formMethods.getValues('content') || formMethods.getValues('step3.content') || '',
          contentDescription: formMethods.getValues('contentDescription') || formMethods.getValues('step1.contentDescription') || '',
          language: formMethods.getValues('language') || formMethods.getValues('step1.language') || '',
          targetCountry: formMethods.getValues('targetCountry') || formMethods.getValues('step1.targetCountry') || '',
        };

        const result = improvementFn(null, formData);

        // Handle composite criteria that return an object with field and value
        if (result && typeof result === 'object' && 'field' in result) {
          formMethods.setValue(result.field as any, result.value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });

          // Re-evaluate the criteria
          evaluateCriteria(result.field as string, result.value);
          return;
        }

        // Handle simple criteria that return a direct value
        const primaryInputField = inputFields[0]; // Use the first input field as primary
        
        // Get the path to the field (handling nested fields)
        let fieldPath = primaryInputField;
        if (formMethods.getValues(`step1.${primaryInputField}`) !== undefined) {
          fieldPath = `step1.${primaryInputField}`;
        } else if (formMethods.getValues(`step2.${primaryInputField}`) !== undefined) {
          fieldPath = `step2.${primaryInputField}`;
        } else if (formMethods.getValues(`step3.${primaryInputField}`) !== undefined) {
          fieldPath = `step3.${primaryInputField}`;
        }

        // Update the form value
        formMethods.setValue(fieldPath as any, result, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });

        // Re-evaluate the criteria
        evaluateCriteria(primaryInputField, result);
      }
    },
    [getCriterionInputFields, formMethods, evaluateCriteria]
  );

  // Evaluate all criteria at once (useful for initial load or form submission)
  const evaluateAllCriteria = useCallback(() => {
    // Get all form values
    const formData: FormData = {
      title: formMethods.getValues('title') || formMethods.getValues('step1.title') || '',
      metaTitle: formMethods.getValues('metaTitle') || formMethods.getValues('step2.metaTitle') || '',
      metaDescription: formMethods.getValues('metaDescription') || formMethods.getValues('step2.metaDescription') || '',
      urlSlug: formMethods.getValues('urlSlug') || formMethods.getValues('step2.urlSlug') || '',
      primaryKeyword: formMethods.getValues('primaryKeyword') || formMethods.getValues('step1.primaryKeyword') || '',
      secondaryKeywords: formMethods.getValues('secondaryKeywords') || formMethods.getValues('step1.secondaryKeywords') || [],
      content: formMethods.getValues('content') || formMethods.getValues('step3.content') || '',
      contentDescription: formMethods.getValues('contentDescription') || formMethods.getValues('step1.contentDescription') || '',
      language: formMethods.getValues('language') || formMethods.getValues('step1.language') || '',
      targetCountry: formMethods.getValues('targetCountry') || formMethods.getValues('step1.targetCountry') || '',
    };

    // Process all input fields
    Object.keys(formData).forEach((key) => {
      if (formData[key as keyof FormData] !== undefined) {
        evaluateCriteria(key, formData[key as keyof FormData]);
      }
    });

    // Evaluate all criteria directly
    setCriteriaState((prevState) => {
      const newState = { ...prevState };

      // Evaluate all criteria
      Object.values(SEO_CRITERIA).forEach(section => {
        section.criteria.forEach(criterion => {
          const evaluationFn = EVALUATION_FUNCTIONS[criterion.id];
          if (evaluationFn) {
            const result = evaluationFn(null, formData);
            newState[criterion.id] = result;
          }
        });
      });

      return newState;
    });
  }, [formMethods, evaluateCriteria]);

  // Get overall status based on criteria state
  const overallStatus = useMemo((): CriterionStatus => {
    const statuses = Object.values(criteriaState).map(result => result.status);
    
    if (statuses.includes('error')) {
      return 'error';
    }
    
    if (statuses.includes('warning')) {
      return 'warning';
    }
    
    if (statuses.length > 0) {
      return 'success';
    }
    
    return 'pending';
  }, [criteriaState]);

  return {
    criteriaState,
    criteriaDefinitions: SEO_CRITERIA,
    totalScore,
    maxScore,
    overallStatus,
    evaluateCriteria,
    improveCriterion,
    evaluateAllCriteria,
    getInputCriteria,
    getCriterionInputFields
  };
}

export default useCriteriaEvaluation;
