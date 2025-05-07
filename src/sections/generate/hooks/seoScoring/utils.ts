import type { UseFormReturn } from 'react-hook-form';

import { useCallback } from 'react';

import {
  containsKeyword
} from '../../../../utils/seoScoring';

import type { CriterionStatus, KeywordScoreOptions } from './types';

/**
 * Helper function to check if a field is valid and has a value
 */
export const useFieldValidator = (form: UseFormReturn<any>) => {
  const { getFieldState, formState, getValues } = form;

  return useCallback((fieldName: string): boolean => {
    // Try to get field state, but don't fail if it doesn't exist
    let fieldState;
    try {
      fieldState = getFieldState(fieldName, formState);
    } catch (e) {
      // If we can't get field state, assume it's valid
      fieldState = { invalid: false };
    }

    // Get values from all possible locations
    const value = getValues(fieldName);
    const step1Value = getValues(`step1.${fieldName}`);
    const step3Value = fieldName === 'content' ? getValues('step3.content') : undefined;

    // Helper function to check if a value is non-empty
    const isNonEmpty = (val: any): boolean => {
      if (val === undefined || val === null) return false;
      if (typeof val === 'string') return val.trim() !== '';
      if (Array.isArray(val)) return val.length > 0;
      return true;
    };

    // Check if the field has a value in any location
    const hasValue = isNonEmpty(value) || isNonEmpty(step1Value) || isNonEmpty(step3Value);

    // Consider the field valid if it's not explicitly invalid
    const isValid = !fieldState.invalid;

    return hasValue && isValid;
  }, [getFieldState, formState, getValues]);
};

/**
 * Helper function to determine status based on field validity
 */
export const useStatusBasedOnFields = (isFieldValid: (fieldName: string) => boolean) => useCallback((
    requiredFields: string[],
    successCondition: boolean
  ): CriterionStatus => {
    // Check if any required field is missing
    const missingField = requiredFields.some(field => !isFieldValid(field));

    if (missingField) {
      return 'pending';
    }

    return successCondition ? 'success' : 'error';
  }, [isFieldValid]);

/**
 * Helper function for action text
 */
export const useActionText = (isFieldValid: (fieldName: string) => boolean) => useCallback((
    fieldNames: string[],
    currentScore: number,
    minThreshold: number,
    maxThreshold: number,
    status: CriterionStatus = 'pending'
  ): string | null => {
    if (fieldNames.some(field => !isFieldValid(field))) {
      return "Fill Required Fields";
    }

    if (status === 'success' || currentScore >= maxThreshold) {
      return null;
    }

    return currentScore < minThreshold ? "Fix" : "Optimize";
  }, [isFieldValid]);

/**
 * Advanced helper function to calculate keyword score with professional SEO criteria
 */
export const useKeywordScoreCalculator = () => useCallback((
    text: string,
    keyword: string,
    options: KeywordScoreOptions = {}
  ): number => {
    if (!text || !keyword) return 0;

    let score = 0;
    const maxScore = 10;

    // Check if text starts with keyword (highest value in SEO)
    if (options.startsWith) {
      // Use exact match for more accurate scoring
      const regex = new RegExp(`^\\s*${keyword.toLowerCase()}\\b`, 'i');
      if (regex.test(text.toLowerCase())) {
        score += maxScore * 0.4; // 40% of score for starting with keyword
      } else if (text.toLowerCase().startsWith(keyword.toLowerCase())) {
        score += maxScore * 0.3; // 30% if it starts but not as a complete word
      }
    }

    // Check for keyword presence with various matching strategies
    if (options.contains) {
      // Check for exact match (highest value)
      if (options.exactMatch) {
        if (containsKeyword(text, keyword, { exactMatch: true })) {
          score += maxScore * 0.3;
        }
      }
      // Check for stemming variations (good value)
      else if (options.stemming) {
        if (containsKeyword(text, keyword, { stemming: true })) {
          score += maxScore * 0.25;
        }
      }
      // Check for basic contains (lowest value)
      else if (containsKeyword(text, keyword)) {
        score += maxScore * 0.2;
      }

      // Check for synonyms (additional value)
      if (options.synonyms && options.synonyms.length > 0) {
        if (containsKeyword(text, keyword, { synonyms: options.synonyms })) {
          score += maxScore * 0.1; // 10% bonus for synonym usage
        }
      }
    }

    return Math.min(maxScore, score); // Ensure score doesn't exceed maximum
  }, []);

/**
 * Helper function to get form field values
 */
export const useFormFieldValues = (form: UseFormReturn<any>) => {
  const { getValues } = form;

  const getFieldValue = useCallback((fieldName: string): any => {
    // Helper function to safely get values
    const safeGetValue = (path: string): any => {
      try {
        const value = getValues(path);
        return value;
      } catch (e) {
        return undefined;
      }
    };

    // Get values from all possible locations
    const directValue = safeGetValue(fieldName);
    const step1Value = safeGetValue(`step1.${fieldName}`);
    const step3Value = fieldName === 'content' ? safeGetValue('step3.content') : undefined;

    // Helper function to check if a value is non-empty
    const isNonEmpty = (val: any): boolean => {
      if (val === undefined || val === null) return false;
      if (typeof val === 'string') return val.trim() !== '';
      if (Array.isArray(val)) return val.length > 0;
      return true;
    };

    // Return the first non-empty value, or an empty string if all are empty
    if (isNonEmpty(step3Value)) return step3Value;
    if (isNonEmpty(step1Value)) return step1Value;
    if (isNonEmpty(directValue)) return directValue;

    return '';
  }, [getValues]);

  return {
    getFieldValue
  };
};
