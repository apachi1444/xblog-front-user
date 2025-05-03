import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { step1Schema, step2Schema, step3Schema, generateArticleSchema } from '../schemas';

import type { Step1FormData, Step2FormData, Step3FormData, GenerateArticleFormData } from '../schemas';

export const useGenerateArticleForm = () => {
  const methods = useForm<GenerateArticleFormData>({
    resolver: zodResolver(generateArticleSchema) as any,
    defaultValues: {
      step1: {
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
      step2: {
        articleType: 'how-to',
        articleSize: 'small',
        toneOfVoice: 'friendly',
        pointOfView: 'first-person',
        aiContentCleaning: 'no-removal',
        imageSettingsQuality: 'high',
        imageSettingsPlacement: 'each-section',
        imageSettingsStyle: 'normal',
        imageSettingsCount: 2,
        internalLinking: 'none',
        externalLinking: 'none',
        includeVideos: false,
        numberOfVideos: 1,
      },
      step3: {
        sections: [],
      },
    },
  });

  // Step 1 form with specific validation
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

  // Step 2 form with specific validation
  const step2Form = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema) as any,
    defaultValues: {
      articleType: 'how-to',
      articleSize: 'small',
      toneOfVoice: 'friendly',
      pointOfView: 'first-person',
      aiContentCleaning: 'no-removal',
      imageSettingsQuality: 'high',
      imageSettingsPlacement: 'each-section',
      imageSettingsStyle: 'normal',
      imageSettingsCount: 2,
      internalLinking: 'none',
      externalLinking: 'none',
      includeVideos: false,
      numberOfVideos: 1,
    },
  });

  // Step 3 form with specific validation
  const step3Form = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema) as any,
    defaultValues: {
      sections: [],
    },
  });

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
    sections: {
      isGenerating: false,
    },
  });

  // Validation helper
  const validateRequiredFields = () => {
    const { primaryKeyword, language, targetCountry, contentDescription, secondaryKeywords } = step1Form.getValues();

    if (!primaryKeyword || !language || !targetCountry || !contentDescription || !secondaryKeywords?.length) {
      step1Form.trigger(['primaryKeyword', 'language', 'targetCountry', 'contentDescription', 'secondaryKeywords']);
      toast.error('Please fill in all required fields');
      return false;
    }

    return true;
  };

  // Keywords management
  const handleAddKeyword = (newValue: string) => {
    if (!newValue.trim()) return;

    const currentKeywords = step1Form.getValues('secondaryKeywords') || [];

    if (Array.isArray(currentKeywords) && currentKeywords.includes(newValue.trim())) {
      return;
    }

    step1Form.setValue('secondaryKeywords', Array.isArray(currentKeywords)
      ? [...currentKeywords, newValue.trim()]
      : [newValue.trim()]
    );
  };

  const handleDeleteKeyword = (keyword: string) => {
    const currentKeywords = step1Form.getValues('secondaryKeywords') || [];

    if (!Array.isArray(currentKeywords)) {
      step1Form.setValue('secondaryKeywords', []);
      return;
    }

    const updatedKeywords = currentKeywords.filter(k => k !== keyword);
    step1Form.setValue('secondaryKeywords', updatedKeywords);
  };

  // Sync step forms with main form
  useEffect(() => {
    const step1Subscription = step1Form.watch((value) => {
      methods.setValue('step1', value as Step1FormData);
    });

    const step2Subscription = step2Form.watch((value) => {
      methods.setValue('step2', value as Step2FormData);
    });

    const step3Subscription = step3Form.watch((value) => {
      methods.setValue('step3', value as Step3FormData);
    });

    return () => {
      step1Subscription.unsubscribe();
      step2Subscription.unsubscribe();
      step3Subscription.unsubscribe();
    };
  }, [methods, step1Form, step2Form, step3Form]);

  return {
    methods,
    step1Form,
    step2Form,
    step3Form,
    generationState,
    setGenerationState,
    validateRequiredFields,
    handleAddKeyword,
    handleDeleteKeyword,
  };
};
