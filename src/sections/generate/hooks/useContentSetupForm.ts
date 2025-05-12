import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';

import { useRegenerationCheck } from 'src/hooks/useRegenerationCheck';

import {
  useTitleGeneration,
  useTopicGeneration,
  useKeywordGeneration,
  useMetaTagsGeneration
} from 'src/utils/generation';

import { step1Schema } from '../schemas';

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

  // Initialize API hooks for content generation
  const { generateSecondaryKeywords, isGenerating: isGeneratingKeywords } = useKeywordGeneration();
  const { generateArticleTitle, isGenerating: isGeneratingTitle } = useTitleGeneration();
  const { generateMetaTags, isGenerating: isGeneratingMeta } = useMetaTagsGeneration();
  const { generateContentDescription, isGenerating: isGeneratingTopic } = useTopicGeneration();

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
    contentDescription: {
      isOptimizing: false,
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
      const { primaryKeyword, secondaryKeywords, contentDescription } = step1Form.getValues();

      if (!validateRequiredFields(['primaryKeyword', 'contentDescription'])) {
        return;
      }

      // Call the API to generate a title
      // Example response: { "title": "What is SEO? A Beginner's Guide to Ranking #1", "success": true, "message": null }
      const generatedTitle = await generateArticleTitle(
        primaryKeyword,
        secondaryKeywords,
        contentDescription
      );

      if (generatedTitle) {
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
      } else {
        throw new Error('No title returned from API');
      }
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
    // Check if user has regeneration credits
    if (!checkRegenerationCredits()) {
      return; // Exit if no credits available
    }

    setGenerationState(prev => ({
      ...prev,
      meta: { ...prev.meta, isGenerating: true }
    }));

    try {
      const { primaryKeyword, secondaryKeywords, title, contentDescription } = step1Form.getValues();

      if (!validateRequiredFields(['primaryKeyword', 'title', 'contentDescription'])) {
        return;
      }

      const metaData = await generateMetaTags(
        primaryKeyword,
        secondaryKeywords,
        contentDescription,
        title || ""
      );

      if (metaData && metaData.success) {
        // Update form values - map API response fields to form fields
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
      } else {
        throw new Error('Meta generation failed or returned invalid data');
      }
    } catch (error) {
      toast.error('Failed to generate meta information');
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

      // Call the API to generate secondary keywords
      const keywords = await generateSecondaryKeywords(primaryKeyword);

      // Example response: "what is SEO, SEO meaning, how does SEO work, SEO basics for beginners, SEO strategies for 2024, SEO tutorial for small business, SEO optimization techniques, what is on page SEO, learn SEO online, best SEO tools for beginners"

      if (keywords && keywords.length > 0) {
        step1Form.setValue('secondaryKeywords', keywords, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });

        toast.success('Generated keywords successfully');
      } else {
        throw new Error('No keywords returned from API');
      }
    } catch (error) {
      toast.error('Failed to generate keywords');
      
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

  // Content description optimization handler
  const handleOptimizeContentDescription = async () => {
    // Check if user has regeneration credits
    if (!checkRegenerationCredits()) {
      return; // Exit if no credits available
    }

    setGenerationState(prev => ({
      ...prev,
      contentDescription: { isOptimizing: true }
    }));

    try {
      const { primaryKeyword, secondaryKeywords } = step1Form.getValues();

      if (!validateRequiredFields(['primaryKeyword'])) {
        return;
      }

      // Call the API to generate content description
      // Example response: {
      //   "content": "Explain \"what is SEO\" for beginners. Define SEO meaning, and generally how it works. Touch on ranking factors or SEO benefits.",
      //   "success": true,
      //   "message": null
      // }
      const generatedContent = await generateContentDescription(primaryKeyword, secondaryKeywords);

      if (generatedContent) {
        // Update form value
        step1Form.setValue('contentDescription', generatedContent, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });

        toast.success('Content description generated successfully');
      } else {
        throw new Error('Content description generation failed');
      }
    } catch (error) {
      toast.error('Failed to generate content description');
    } finally {
      setGenerationState(prev => ({
        ...prev,
        contentDescription: { isOptimizing: false }
      }));
    }
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
    handleOptimizeContentDescription,
    validateRequiredFields,
    // Regeneration dialog state
    showRegenerationDialog,
    setShowRegenerationDialog,
    regenerationsAvailable,
  };
};
