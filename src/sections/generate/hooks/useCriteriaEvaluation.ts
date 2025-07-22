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

    // Parse string data for logging
    let parsedImages = [];
    let parsedToc = [];
    let parsedFaq = [];

    try {
      if (formData.images && typeof formData.images === 'string') {
        parsedImages = JSON.parse(formData.images);
      }
      if (formData.toc && typeof formData.toc === 'string') {
        parsedToc = JSON.parse(formData.toc);
      }
      if (formData.faq && typeof formData.faq === 'string') {
        parsedFaq = JSON.parse(formData.faq);
      }
    } catch (error) {
      console.error('Error parsing form data for logging:', error);
    }

    console.log('🔍 Evaluating all criteria with complete form data:', {
      step1: !!formData.step1,
      step3: !!formData.step3,
      sections: formData.step3?.sections?.length || 0,
      generatedHtml: !!formData.generatedHtml,
      images: parsedImages.length || 0,
      toc: parsedToc.length || 0,
      faq: parsedFaq.length || 0
    });

    // Evaluate all criteria with complete form data
    setCriteriaState((prevState) => {
      const newState = { ...prevState };

      // Iterate through all criteria and evaluate them
      SEO_CRITERIA.forEach(section => {
        section.criteria.forEach(criterion => {
          const evaluationFn = EVALUATION_FUNCTIONS[criterion.id];
          if (evaluationFn) {
            try {
              const result = evaluationFn(null, formData); // Pass complete formData
              console.log(`✅ Criterion ${criterion.id} evaluated:`, result);
              newState[criterion.id] = result;
            } catch (error) {
              console.error(`❌ Error evaluating criterion ${criterion.id}:`, error);
              newState[criterion.id] = {
                status: 'error',
                message: 'Evaluation error',
                score: 0
              };
            }
          } else {
            console.warn(`⚠️ No evaluation function found for criterion ${criterion.id}`);
            // Keep existing state or set to pending
            if (!newState[criterion.id]) {
              newState[criterion.id] = {
                status: 'pending',
                message: 'Waiting for evaluation',
                score: 0
              };
            }
          }
        });
      });

      console.log('🎯 Final criteria state:', newState);
      return newState;
    });
  }, [formMethods]);

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