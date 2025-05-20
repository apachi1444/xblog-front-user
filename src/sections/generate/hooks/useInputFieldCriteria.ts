import type { UseFormReturn } from 'react-hook-form';

import { useCallback } from 'react';

import { EVALUATION_FUNCTIONS, getAffectedCriteriaByField } from '../../../utils/seo-criteria-evaluators';

import type { CriterionStatus } from '../../../types/criteria.types';

interface CriterionEvaluation {
  id: number;
  status: CriterionStatus;
  message: string;
  score: number;
}

/**
 * Hook to get and evaluate criteria affected by a specific input field
 */
export const useInputFieldCriteria = (form: UseFormReturn<any>) => {
  // Get all form values
  const getFormData = useCallback(() => {
    const formValues = form.getValues();
    
    // Handle nested form values (step1, step2, etc.)
    return {
      title: formValues.title || formValues.step1?.title || '',
      metaTitle: formValues.metaTitle || formValues.step2?.metaTitle || '',
      metaDescription: formValues.metaDescription || formValues.step2?.metaDescription || '',
      urlSlug: formValues.urlSlug || formValues.step2?.urlSlug || '',
      primaryKeyword: formValues.primaryKeyword || formValues.step1?.primaryKeyword || '',
      secondaryKeywords: formValues.secondaryKeywords || formValues.step1?.secondaryKeywords || [],
      content: formValues.content || formValues.step3?.content || '',
      contentDescription: formValues.contentDescription || formValues.step1?.contentDescription || '',
      language: formValues.language || formValues.step1?.language || '',
      targetCountry: formValues.targetCountry || formValues.step1?.targetCountry || '',
    };
  }, [form]);

  /**
   * Get criteria affected by a specific input field
   * @param inputField The input field name
   * @returns Array of affected criteria IDs
   */
  const getAffectedCriteria = useCallback((inputField: string) => getAffectedCriteriaByField(inputField), []);

  /**
   * Evaluate criteria affected by a specific input field
   * @param inputField The input field name
   * @returns Array of evaluated criteria
   */
  const evaluateAffectedCriteria = useCallback((inputField: string): CriterionEvaluation[] => {
    const affectedCriteriaIds = getAffectedCriteria(inputField);
    const formData = getFormData();
    
    return affectedCriteriaIds.map(criterionId => {
      const evaluationFunction = EVALUATION_FUNCTIONS[criterionId];
      
      if (!evaluationFunction) {
        return {
          id: criterionId,
          status: 'error',
          message: 'Evaluation function not found',
          score: 0
        };
      }
      
      const fieldValue = formData[inputField as keyof typeof formData];
      const evaluation = evaluationFunction(fieldValue, formData);
      
      return {
        id: criterionId,
        ...evaluation
      };
    });
  }, [getAffectedCriteria, getFormData]);

  /**
   * Check if a specific input field affects any criteria
   * @param inputField The input field name
   * @returns Boolean indicating if the field affects any criteria
   */
  const doesFieldAffectCriteria = useCallback((inputField: string): boolean => {
    const affectedCriteria = getAffectedCriteria(inputField);
    return affectedCriteria.length > 0;
  }, [getAffectedCriteria]);

  return {
    getAffectedCriteria,
    evaluateAffectedCriteria,
    doesFieldAffectCriteria
  };
};

export default useInputFieldCriteria;
