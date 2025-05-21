'use client';

import { useFormContext } from 'react-hook-form';
import { useMemo, useState, useCallback } from 'react';

import { SEO_CRITERIA, CRITERIA_TO_INPUT_MAP } from '../../../utils/seo-criteria-definitions';
import { 
  EVALUATION_FUNCTIONS, 
  IMPROVEMENT_FUNCTIONS,
  getAffectedCriteriaByField
} from '../../../utils/seo-criteria-evaluators';

import type { GenerateArticleFormData } from '../schemas';
import type { CriterionStatus } from '../../../types/criteria.types';

// Type for criteria evaluation results
interface CriterionResult {
  status: CriterionStatus;
  message: string;
  score: number;
}

// Type for criteria state
export interface CriteriaState {
  [criterionId: number]: CriterionResult;
}

/**
 * Hook for evaluating SEO criteria based on form input
 */
export function useCriteriaEvaluation() {
  const formMethods = useFormContext<GenerateArticleFormData>();
  const [criteriaState, setCriteriaState] = useState<CriteriaState>({});

  // Calculate total score
  const totalScore = useMemo(() => 
    Object.values(criteriaState).reduce((total, result) => total + (result.score || 0), 0), 
    [criteriaState]
  );

  // Calculate maximum possible score
  const maxScore = useMemo(() => Object.values(SEO_CRITERIA).reduce((total, section) => 
      total + section.criteria.reduce((sectionTotal, criterion) => 
        sectionTotal + criterion.weight, 0), 0), []);

  // Get form data by combining all possible field locations
  const getFormData = useCallback((): GenerateArticleFormData => {
    const fieldKeys = [
      'title', 'metaTitle', 'metaDescription', 'urlSlug', 'primaryKeyword',
      'secondaryKeywords', 'content', 'contentDescription', 'language', 'targetCountry'
    ];
    
    return fieldKeys.reduce((data, key) => {
      const fieldKey = key as keyof GenerateArticleFormData;
      data[fieldKey] = 
        formMethods.getValues(fieldKey) || 
        formMethods.getValues(`step1.${fieldKey}` as any) || 
        formMethods.getValues(`step2.${fieldKey}` as any) || 
        formMethods.getValues(`step3.${fieldKey}` as any) || 
        (Array.isArray(data[fieldKey]) ? [] : '');
      return data;
    }, {} as GenerateArticleFormData);
  }, [formMethods]);

  // Get criteria affected by an input field
  const getInputCriteria = useCallback((inputKey: string) => 
    getAffectedCriteriaByField(inputKey), 
    []
  );

  // Get input fields that affect a criterion
  const getCriterionInputFields = useCallback((criterionId: number) => 
    CRITERIA_TO_INPUT_MAP[criterionId] || [], 
    []
  );

  // Evaluate criteria based on input changes
  const evaluateCriteria = useCallback(
    (inputKey: string, value: any) => {
      const criteriaIds = getInputCriteria(inputKey);
      if (!criteriaIds.length) return;

      const formData = getFormData();

      setCriteriaState((prevState) => {
        const newState = { ...prevState };

        criteriaIds.forEach((criterionId) => {
          const evaluationFn = EVALUATION_FUNCTIONS[criterionId];
          if (evaluationFn) {
            const result = evaluationFn(value, formData);
            newState[criterionId] = result;
          }
        });

        return newState;
      });
    },
    [getInputCriteria, getFormData]
  );

  // Improve input based on criterion
  const improveCriterion = useCallback(
    (criterionId: number) => {
      const inputFields = getCriterionInputFields(criterionId);
      if (!inputFields.length) return;

      const improvementFn = IMPROVEMENT_FUNCTIONS[criterionId];
      if (!improvementFn) return;
      
      const formData = getFormData();
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
      
      // Find the correct field path
      const possiblePaths = [
        primaryInputField,
        `step1.${primaryInputField}`,
        `step2.${primaryInputField}`,
        `step3.${primaryInputField}`
      ];
      
      const fieldPath = possiblePaths.find(path => 
        formMethods.getValues(path as any) !== undefined
      ) || primaryInputField;

      // Update the form value
      formMethods.setValue(fieldPath as any, result, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      // Re-evaluate the criteria
      evaluateCriteria(primaryInputField, result);
    },
    [getCriterionInputFields, formMethods, evaluateCriteria, getFormData]
  );

  // Evaluate all criteria at once (useful for initial load or form submission)
  const evaluateAllCriteria = useCallback(() => {
    const formData = getFormData();

    // Process all input fields
    Object.keys(formData).forEach((key) => {
      if (formData[key as keyof GenerateArticleFormData] !== undefined) {
        evaluateCriteria(key, formData[key as keyof GenerateArticleFormData]);
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
  }, [getFormData, evaluateCriteria]);

  // Get overall status based on criteria state
  const overallStatus = useMemo((): CriterionStatus => {
    const statuses = Object.values(criteriaState).map(result => result.status);
    
    if (statuses.includes('error')) return 'error';
    if (statuses.includes('warning')) return 'warning';
    if (statuses.length > 0) return 'success';
    
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