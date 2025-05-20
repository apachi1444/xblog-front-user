import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { generateArticleSchema } from '../schemas';

import type { GenerateArticleFormData } from '../schemas';

export const useGenerateArticleForm = () => {
  const methods = useForm<GenerateArticleFormData>({
    resolver: zodResolver(generateArticleSchema) as any,
    defaultValues: {
      step1: {
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

  return {
    methods,
  };
};
