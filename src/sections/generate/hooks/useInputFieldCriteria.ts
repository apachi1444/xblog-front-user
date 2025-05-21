import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { EVALUATION_FUNCTIONS, getAffectedCriteriaByField } from '../../../utils/seo-criteria-evaluators';

import type { GenerateArticleFormData } from '../schemas';
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
export const useInputFieldCriteria = () => {
  const form = useFormContext<GenerateArticleFormData>()
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
    const formData = form.getValues();
    
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
  }, [form, getAffectedCriteria]);

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
