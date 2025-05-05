import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';

import { step1Schema } from '../schemas';

import type { Step1FormData } from '../schemas';

export const useContentSetupForm = () => {
  // Try to access the main form context if available
  const mainFormContext = useFormContext();

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
      language: '',
      targetCountry: '',
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
    setGenerationState(prev => ({
      ...prev,
      title: { ...prev.title, isGenerating: true }
    }));

    try {
      const { primaryKeyword, language, targetCountry, contentDescription, secondaryKeywords } = step1Form.getValues();

      if (!validateRequiredFields(['primaryKeyword', 'language', 'targetCountry', 'contentDescription', 'secondaryKeywords'])) {
        return;
      }

      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 6000));

      // Generate title (replace with actual API call when ready)
      const generatedTitle = `Best ${primaryKeyword} Guide for ${targetCountry}`;

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

    } catch (error) {
      toast.error('Failed to generate title');
    } finally {
      setGenerationState(prev => ({
        ...prev,
        title: { ...prev.title, isGenerating: false }
      }));
    }
  };

  // Meta generation handler
  const handleGenerateMeta = async () => {
    setGenerationState(prev => ({
      ...prev,
      meta: { ...prev.meta, isGenerating: true }
    }));

    try {
      const { primaryKeyword, language, targetCountry, contentDescription, secondaryKeywords } = step1Form.getValues();

      if (!validateRequiredFields(['primaryKeyword', 'language', 'targetCountry', 'contentDescription', 'secondaryKeywords'])) {
        return;
      }

      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Fallback data if API fails
      const metaData = {
        metaTitle: `${primaryKeyword} - Complete Guide ${new Date().getFullYear()}`,
        metaDescription: `Learn everything about ${primaryKeyword}. Comprehensive guide with tips, examples, and best practices for ${targetCountry}.`,
        urlSlug: primaryKeyword.toLowerCase().replace(/\s+/g, '-'),
      };

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

    } catch (error) {
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
    setGenerationState(prev => ({
      ...prev,
      secondaryKeywords: { isGenerating: true }
    }));

    try {
      const { primaryKeyword, language, targetCountry } = step1Form.getValues();

      if (!validateRequiredFields(['primaryKeyword', 'language', 'targetCountry'])) {
        return;
      }

      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Fallback keywords
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
      toast.success('Generated keywords successfully');
    } catch (error) {
      toast.error('Failed to generate keywords');
    } finally {
      setGenerationState(prev => ({
        ...prev,
        secondaryKeywords: { isGenerating: false }
      }));
    }
  };

  // Keyword management
  const handleAddKeyword = (keyword: string) => {
    if (!keyword.trim()) return;

    const currentKeywords = step1Form.getValues('secondaryKeywords') || [];
    if (currentKeywords.includes(keyword.trim())) {
      toast.error('This keyword already exists');
      return;
    }

    step1Form.setValue('secondaryKeywords', [...currentKeywords, keyword.trim()], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
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
  };
};
