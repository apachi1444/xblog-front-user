'use client';

import { useCallback } from 'react';

import { INPUT_TO_CRITERIA_MAP, CRITERIA_TO_INPUT_MAP } from '../../../utils/seo-criteria-definitions';
import { 
  EVALUATION_FUNCTIONS, 
  IMPROVEMENT_FUNCTIONS,
  getInputFieldsByCriterion,
  getAffectedCriteriaByField
} from '../../../utils/seo-criteria-evaluators';

import type { GenerateArticleFormData } from '../schemas';
import type { CriterionStatus } from '../../../types/criteria.types';

// Type for criteria evaluation result
export interface CriteriaResult {
  status: CriterionStatus;
  message: string;
  score: number;
}

/**
 * Hook for mapping between input fields and SEO criteria
 */
export function useInputCriteriaMapping() {
  // Get criteria IDs affected by an input field
  const getInputCriteriaIds = useCallback((inputKey: string): number[] => getAffectedCriteriaByField(inputKey), []);

  // Get input fields that affect a criterion
  const getCriterionInputFields = useCallback((criterionId: number): string[] => getInputFieldsByCriterion(criterionId), []);

  // Evaluate a specific input field
  const evaluateInput = useCallback((inputKey: string, value: any, formData: GenerateArticleFormData): CriteriaResult[] => {
    const criteriaIds = getInputCriteriaIds(inputKey);
    
    return criteriaIds.map((criterionId: any) => {
      const evaluationFn = EVALUATION_FUNCTIONS[criterionId];
      
      if (!evaluationFn) {
        return {
          status: 'error',
          message: `No evaluation function found for criterion ID ${criterionId}`,
          score: 0
        };
      }
      
      return evaluationFn(value, formData);
    });
  }, [getInputCriteriaIds]);

  // Get improvement suggestion for a specific criterion
  const getImprovement = useCallback((criterionId: number, formData: GenerateArticleFormData): any => {
    const improvementFn = IMPROVEMENT_FUNCTIONS[criterionId];
    
    if (!improvementFn) {
      return null;
    }
    
    return improvementFn(null, formData);
  }, []);

  // Check if an input field affects any SEO criteria
  const doesInputAffectCriteria = useCallback((inputKey: string): boolean => {
    const criteriaIds = getInputCriteriaIds(inputKey);
    return criteriaIds.length > 0;
  }, [getInputCriteriaIds]);

  // Get all input fields that affect SEO criteria
  const getAllSEOInputFields = useCallback((): string[] => Object.keys(INPUT_TO_CRITERIA_MAP), []);

  // Get all criteria IDs
  const getAllCriteriaIds = useCallback((): number[] => Object.keys(CRITERIA_TO_INPUT_MAP).map(id => parseInt(id, 10)), []);

  // Map input fields to their affected criteria
  const getInputToCriteriaMapping = useCallback(() => INPUT_TO_CRITERIA_MAP, []);

  // Map criteria to their affected input fields
  const getCriteriaToInputMapping = useCallback(() => CRITERIA_TO_INPUT_MAP, []);

  return {
    getInputCriteriaIds,
    getCriterionInputFields,
    evaluateInput,
    getImprovement,
    doesInputAffectCriteria,
    getAllSEOInputFields,
    getAllCriteriaIds,
    getInputToCriteriaMapping,
    getCriteriaToInputMapping,
    evaluationFunctions: EVALUATION_FUNCTIONS,
    improvementFunctions: IMPROVEMENT_FUNCTIONS
  };
}

export default useInputCriteriaMapping;
