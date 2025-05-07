import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';

import { useRegenerationCheck } from 'src/hooks/useRegenerationCheck';

import { step1Schema } from '../schemas';
import { generateMeta, generateTitle, generateSecondaryKeywords } from '../../../utils/aiGeneration';

import type { Step1FormData } from '../schemas';

export const useContentSetupForm = () => {
  // Try to access the main form context if available
  const mainFormContext = useFormContext();

  // Use the regeneration check hook
  const {
    checkRegenerationCredits,
    showRegenerationDialog,
    setShowRegenerationDialog,
    regenerationsAvailable
  } = useRegenerationCheck();

  // Generation states
  const [generationState, setGenerationState] = useState({
    title: {
      isGenerating: false,
      isGenerated: false,
    },
    meta: {
      isGenerating: false,
      isGenerated: false,
    },
    secondaryKeywords: {
      isGenerating: false,
    },
  });

  // Initialize form with schema validation
  const step1Form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      contentDescription: '',
      primaryKeyword: '',
      secondaryKeywords: [],
      language: 'en-us', // Default to English (US)
      targetCountry: 'us', // Default to United States
      title: '',
      metaTitle: '',
      metaDescription: '',
      urlSlug: '',
    },
  });

  // Synchronize with main form if available
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (mainFormContext) {
      // Listen for changes in the main form's step1 fields
      const subscription = mainFormContext.watch((value, { name, type }) => {
        if (!name || type !== 'change' || !name.startsWith('step1.')) return;

        // Extract the field name from step1.fieldName
        const fieldName = name.replace('step1.', '');

        // Get the value from the main form
        const fieldValue = mainFormContext.getValues(name);

        // Only update if the value is different to avoid infinite loops
        const currentValue = step1Form.getValues(fieldName as any);
        if (JSON.stringify(currentValue) !== JSON.stringify(fieldValue)) {
          console.log(`Syncing ${name} from main form to step1Form`, fieldValue);
          step1Form.setValue(fieldName as any, fieldValue, {
            shouldValidate: false,
            shouldDirty: true,
            shouldTouch: true
          });
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [mainFormContext, step1Form]);

  // Helper function to validate required fields
  const validateRequiredFields = (fields: string[]) => {
    const values = step1Form.getValues();
    const missingFields = fields.filter(field => !values[field as keyof Step1FormData]);

    if (missingFields.length > 0) {
      step1Form.trigger(missingFields as any);
      toast.error('Please fill in all required fields');
      return false;
    }

    return true;
  };

  // Title generation handler
  const handleGenerateTitle = async () => {
    // Check if user has regeneration credits
    if (!checkRegenerationCredits()) {
      return; // Exit if no credits available
    }

    setGenerationState(prev => ({
      ...prev,
      title: { ...prev.title, isGenerating: true }
    }));

    try {
      const { primaryKeyword, language, targetCountry } = step1Form.getValues();

      if (!validateRequiredFields(['primaryKeyword', 'language', 'targetCountry'])) {
        return;
      }

      // Call the Gemini API to generate a title
      const generatedTitle = await generateTitle(
        primaryKeyword,
        targetCountry,
        language
      );

      // Update form values
      step1Form.setValue('title', generatedTitle, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });

      setGenerationState(prev => ({
        ...prev,
        title: { isGenerating: false, isGenerated: true }
      }));

      toast.success('Title generated successfully');

    } catch (error) {
      toast.error('Failed to generate title');

      // Fallback title in case of API failure
      const { primaryKeyword, targetCountry } = step1Form.getValues();
      const fallbackTitle = `Best ${primaryKeyword} Guide for ${targetCountry}`;

      step1Form.setValue('title', fallbackTitle, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });

    } finally {
      setGenerationState(prev => ({
        ...prev,
        title: { ...prev.title, isGenerating: false }
      }));
    }
  };

  // Meta generation handler
  const handleGenerateMeta = async () => {
    // Check if user has regeneration credits
    if (!checkRegenerationCredits()) {
      return; // Exit if no credits available
    }

    setGenerationState(prev => ({
      ...prev,
      meta: { ...prev.meta, isGenerating: true }
    }));

    try {
      const { primaryKeyword, language, targetCountry, contentDescription } = step1Form.getValues();

      if (!validateRequiredFields(['primaryKeyword', 'language', 'targetCountry', 'contentDescription'])) {
        return;
      }

      // Call the Gemini API to generate meta information
      const metaData = await generateMeta(
        primaryKeyword,
        targetCountry,
        language,
        contentDescription
      );

      // Update form values
      step1Form.setValue('metaTitle', metaData.metaTitle, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
      step1Form.setValue('metaDescription', metaData.metaDescription, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
      step1Form.setValue('urlSlug', metaData.urlSlug, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });

      setGenerationState(prev => ({
        ...prev,
        meta: { isGenerating: false, isGenerated: true }
      }));

      toast.success('Meta information generated successfully');

    } catch (error) {
      console.error('Meta generation error:', error);
      toast.error('Failed to generate meta information');

      // Fallback data if API fails
      const { primaryKeyword, targetCountry } = step1Form.getValues();
      const fallbackMetaData = {
        metaTitle: `${primaryKeyword} - Complete Guide ${new Date().getFullYear()}`,
        metaDescription: `Learn everything about ${primaryKeyword}. Comprehensive guide with tips, examples, and best practices for ${targetCountry}.`,
        urlSlug: primaryKeyword.toLowerCase().replace(/\s+/g, '-'),
      };

      // Update form values with fallback data
      step1Form.setValue('metaTitle', fallbackMetaData.metaTitle, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
      step1Form.setValue('metaDescription', fallbackMetaData.metaDescription, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
      step1Form.setValue('urlSlug', fallbackMetaData.urlSlug, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });

      toast.success('Generated meta with fallback data');
    } finally {
      setGenerationState(prev => ({
        ...prev,
        meta: { ...prev.meta, isGenerating: false }
      }));
    }
  };

  // Secondary keywords generation handler
  const handleGenerateSecondaryKeywords = async () => {
    // Check if user has regeneration credits
    if (!checkRegenerationCredits()) {
      return; // Exit if no credits available
    }

    setGenerationState(prev => ({
      ...prev,
      secondaryKeywords: { isGenerating: true }
    }));

    try {
      const { primaryKeyword, language, targetCountry } = step1Form.getValues();

      if (!validateRequiredFields(['primaryKeyword', 'language', 'targetCountry'])) {
        return;
      }

      // Call the Gemini API to generate secondary keywords
      const keywords = await generateSecondaryKeywords(
        primaryKeyword,
        targetCountry,
        language
      );

      step1Form.setValue('secondaryKeywords', keywords, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });

      toast.success('Generated keywords successfully');
    } catch (error) {
      console.error('Secondary keywords generation error:', error);
      toast.error('Failed to generate keywords');

      // Fallback keywords in case of API failure
      const { primaryKeyword } = step1Form.getValues();
      const fallbackKeywords = [
        `${primaryKeyword} guide`,
        `best ${primaryKeyword}`,
        `${primaryKeyword} tips`,
        `${primaryKeyword} tutorial`,
        `${primaryKeyword} examples`,
        `${primaryKeyword} for beginners`,
        `professional ${primaryKeyword}`,
        `${primaryKeyword} ${new Date().getFullYear()}`
      ];

      step1Form.setValue('secondaryKeywords', fallbackKeywords, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });

      toast.success('Generated keywords with fallback data');
    } finally {
      setGenerationState(prev => ({
        ...prev,
        secondaryKeywords: { isGenerating: false }
      }));
    }
  };

  const handleAddKeyword = (keyword: string) => {
    if (!keyword.trim()) return;

    const currentKeywords = step1Form.getValues('secondaryKeywords') || [];
    // Check if keyword already exists, but don't show an error toast
    if (currentKeywords.includes(keyword.trim())) {
      return; // Silently return without adding the duplicate keyword
    }

    step1Form.setValue('secondaryKeywords', [...currentKeywords, keyword.trim()], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });

    // Note: We don't show a success toast here because it's already shown in useKeywordManagement
    // This prevents duplicate toasts when adding keywords
  };

  const handleDeleteKeyword = (keyword: string) => {
    const currentKeywords = step1Form.getValues('secondaryKeywords') || [];
    step1Form.setValue(
      'secondaryKeywords',
      currentKeywords.filter(k => k !== keyword),
      {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      }
    );

    // Note: We don't show an error toast here because it's already shown in useKeywordManagement
    // This prevents duplicate toasts when removing keywords
  };

  return {
    step1Form,
    generationState,
    setGenerationState,
    handleGenerateTitle,
    handleGenerateMeta,
    handleGenerateSecondaryKeywords,
    handleAddKeyword,
    handleDeleteKeyword,
    validateRequiredFields,
    // Regeneration dialog state
    showRegenerationDialog,
    setShowRegenerationDialog,
    regenerationsAvailable,
  };
};
