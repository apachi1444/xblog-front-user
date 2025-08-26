import type { GenerateArticleFormData } from 'src/sections/generate/schemas';

import { isEqual } from 'lodash-es';
import toast from 'react-hot-toast';
import { useFormContext } from 'react-hook-form';
import { useRef, useMemo, useCallback } from 'react';

import { convertFormDataToApiRequest } from 'src/utils/articleUpdateUtils';

import { useUpdateArticleMutation } from 'src/services/apis/articlesApi';

interface UseAutoSaveDraftOptions {
  articleId?: string | null;
  isEditMode?: boolean;
  debounceMs?: number;
}

interface UseAutoSaveDraftReturn {
  hasChanges: boolean;
  isSaving: boolean;
  saveDraft: () => Promise<void>;
  setOriginalValues: (values: GenerateArticleFormData) => void;
  resetChanges: () => void;
}

/**
 * Hook to handle auto-save draft functionality for article generation form
 * Detects changes in form fields and provides save functionality
 */
export function useAutoSaveDraft({
  articleId,
  isEditMode = false,
  debounceMs = 1000,
}: UseAutoSaveDraftOptions): UseAutoSaveDraftReturn {
  const { watch, getValues } = useFormContext<GenerateArticleFormData>();
  const [updateArticle, { isLoading: isSaving }] = useUpdateArticleMutation();

  // Store original form values for comparison
  const originalValuesRef = useRef<GenerateArticleFormData | null>(null);
  // Set original values (called when form is first loaded with article data)
  const setOriginalValues = useCallback((values: GenerateArticleFormData) => {
    originalValuesRef.current = JSON.parse(JSON.stringify(values)); // Deep clone
  }, []);

  // Reset changes (called after successful save)
  const resetChanges = useCallback(() => {
    const currentValues = getValues();
    originalValuesRef.current = JSON.parse(JSON.stringify(currentValues));
  }, [getValues]);

  // Watch all form values for changes
  const currentValues = watch();

  // Detect if there are changes compared to original values
  const hasChanges = useMemo(() => {
    if (!isEditMode || !originalValuesRef.current || !articleId) {
      return false;
    }

    // Compare only the fields we care about for auto-save (steps 1 and 2)
    const originalStep1 = originalValuesRef.current.step1;
    const originalStep2 = originalValuesRef.current.step2;
    const currentStep1 = currentValues.step1;
    const currentStep2 = currentValues.step2;

    // Check for changes in step 1 fields
    const step1Changed = !isEqual(originalStep1, currentStep1);
    
    // Check for changes in step 2 fields
    const step2Changed = !isEqual(originalStep2, currentStep2);

    return step1Changed || step2Changed;
  }, [currentValues, isEditMode, articleId]);



  // Save draft function
  const saveDraft = useCallback(async () => {
    if (!articleId || !hasChanges) {
      return;
    }

    try {
      const currentFormData = getValues();
      const requestBody = convertFormDataToApiRequest(currentFormData);

      await updateArticle({
        id: articleId,
        data: requestBody,
      }).unwrap();

      // Reset changes after successful save
      resetChanges();
      
      toast.success('Draft saved successfully!');
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast.error('Failed to save draft. Please try again.');
      throw error;
    }
  }, [articleId, hasChanges, getValues, updateArticle, resetChanges]);

  return {
    hasChanges,
    isSaving,
    saveDraft,
    setOriginalValues,
    resetChanges,
  };
}
