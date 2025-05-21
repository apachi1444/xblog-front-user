/* eslint-disable no-restricted-syntax */
import { useFormContext } from "react-hook-form"
import { useMemo, useState, useCallback } from 'react';

import {
  EVALUATION_FUNCTIONS,
  getAffectedCriteriaByField
} from '../../../utils/seo-criteria-evaluators';
import { SEO_CRITERIA, CRITERIA_TO_INPUT_MAP, INPUT_TO_CRITERIA_MAP } from '../../../utils/seo-criteria-definitions';

import type { GenerateArticleFormData } from '../schemas';
import type { InputKey, CriterionStatus } from '../../../types/criteria.types';

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
  const formMethods = useFormContext<GenerateArticleFormData>()
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

  // implement this function here ! getCriterionById
  // eslint-disable-next-line no-restricted-syntax
  const getCriterionById = useCallback((criterionId: number) => {
  for (const section of SEO_CRITERIA) {
    for (const criterion of section.criteria) {
      if (criterion.id === criterionId) {
        return criterion;
      }
    }
  }
  // Add this return statement to handle the case when no criterion is found
  return null;
}, []);
  // Evaluate criteria based on input changes
  const evaluateCriteria = useCallback(
    (inputKey: InputKey, value: any) => {

      const criteriaKeys = INPUT_TO_CRITERIA_MAP[inputKey] || []
      console.log(criteriaKeys);

      if (!criteriaKeys.length) return

      setCriteriaState((prevState) => {
        const newState = { ...prevState }

        criteriaKeys.forEach((criteriaKey) => {
          const evaluationFn = EVALUATION_FUNCTIONS[criteriaKey]

          if (evaluationFn) {
            const result = evaluationFn(value, formMethods.getValues())
            console.log(result, " result !");
            newState[criteriaKey] = result
          }
        })

        console.log(newState, " new state !");


        return newState
      })
    },
    [formMethods],
  )


  // Evaluate all criteria at once (useful for initial load or form submission)
  const evaluateAllCriteria = useCallback(() => {
    const formData = formMethods.getValues();
    console.log('Evaluating all criteria with form data:', formData);

    // Process step1 fields specifically since they're the ones used in criteria
    if (formData.step1) {
      const step1Data = formData.step1;

      // Evaluate primary keyword first as it affects many criteria
      if (step1Data.primaryKeyword) {
        console.log('Evaluating primary keyword:', step1Data.primaryKeyword);

        // Get all criteria that use primaryKeyword
        const affectedCriteria: number[] = [];

        // Scan through all criteria to find those that use primaryKeyword
        SEO_CRITERIA.forEach(section => {
          section.criteria.forEach(criterion => {
            if (criterion.inputKeys.includes("primaryKeyword")) {
              affectedCriteria.push(criterion.id);
            }
          });
        });

        console.log('Primary keyword affects these criteria:', affectedCriteria);

        // Directly update all affected criteria
        setCriteriaState((prevState) => {
          const newState = { ...prevState };

          affectedCriteria.forEach(criteriaId => {
            const evaluationFn = EVALUATION_FUNCTIONS[criteriaId];
            if (evaluationFn) {
              const result = evaluationFn(step1Data.primaryKeyword, formData);
              console.log(`Evaluating criterion ${criteriaId} with result:`, result);
              newState[criteriaId] = result;
            } else {
              console.warn(`No evaluation function found for criterion ${criteriaId}`);
            }
          });

          return newState;
        });
      }

      // Then evaluate other fields
      if (step1Data.title) evaluateCriteria("title", step1Data.title);
      if (step1Data.metaDescription) evaluateCriteria("metaDescription", step1Data.metaDescription);
      if (step1Data.urlSlug) evaluateCriteria("urlSlug", step1Data.urlSlug);
      if (step1Data.contentDescription) evaluateCriteria("content", step1Data.contentDescription);
    }

    // Evaluate all criteria directly to ensure complete coverage
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
    evaluateAllCriteria,
    getInputCriteria,
    getCriterionInputFields,
    getCriterionById

  };
}

export default useCriteriaEvaluation;