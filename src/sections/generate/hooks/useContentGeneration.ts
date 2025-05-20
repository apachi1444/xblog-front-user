import { useState } from 'react';
import toast from 'react-hot-toast';
import type { UseFormReturn } from 'react-hook-form';

import {
  type GeneratedSection,
  useGenerateMetaMutation,
  useGenerateTitleMutation,
  useGenerateTopicMutation,
  type GenerateMetaRequest,
  type GenerateTitleRequest,
  type GenerateTopicRequest,
  useGenerateKeywordsMutation,
  useGenerateSectionsMutation,
  type GenerateKeywordsRequest,
  type GenerateSectionsRequest
} from 'src/services/apis/generateContentApi';

import type { ArticleSection, GenerateArticleFormData } from '../schemas';

/**
 * Custom hook for handling content generation operations
 * @param formMethods - The form methods from useForm or FormProvider
 */
export const useContentGeneration = (formMethods: UseFormReturn<GenerateArticleFormData>) => {
  const { getValues, setValue } = formMethods;

  // State for tracking loading states
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [isOptimizingDescription, setIsOptimizingDescription] = useState(false);
  const [isGeneratingSections, setIsGeneratingSections] = useState(false);

  // RTK Query mutation hooks
  const [generateTitleMutation] = useGenerateTitleMutation();
  const [generateMetaMutation] = useGenerateMetaMutation();
  const [generateKeywordsMutation] = useGenerateKeywordsMutation();
  const [generateTopicMutation] = useGenerateTopicMutation();
  const [generateSectionsMutation] = useGenerateSectionsMutation();

  /**
   * Generate article title
   */
  const handleGenerateTitle = async () => {
    try {
      setIsGeneratingTitle(true);

      // Get current form values
      const formData = getValues();
      const primaryKeyword = formData.step1?.primaryKeyword || '';
      const secondaryKeywords = formData.step1?.secondaryKeywords || [];
      const contentDescription = formData.step1?.contentDescription || '';

      if (!primaryKeyword || !contentDescription) {
        toast.error('Please enter a primary keyword and content description first');
        return;
      }

      // Prepare request data
      const requestData: GenerateTitleRequest = {
        primary_keyword: primaryKeyword,
        secondary_keywords: secondaryKeywords,
        content_description: contentDescription
      };

      // Call the API
      const response = await generateTitleMutation(requestData).unwrap();

      if (response.success) {
        // Update form with generated title
        setValue('step1.title', response.title, { shouldValidate: true });
        toast.success('Title generated successfully');
      } else {
        toast.error(response.message || 'Failed to generate title');
      }
    } catch (error) {
      console.error('Error generating title:', error);
      toast.error('Failed to generate title');
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  /**
   * Generate meta information (title, description)
   */
  const handleGenerateMeta = async () => {
    try {
      setIsGeneratingMeta(true);

      // Get current form values
      const formData = getValues();
      const title = formData.step1?.title || '';
      const primaryKeyword = formData.step1?.primaryKeyword || '';
      const secondaryKeywords = formData.step1?.secondaryKeywords || [];
      const contentDescription = formData.step1?.contentDescription || '';
      const language = formData.step1?.language || 'en';

      if (!title || !primaryKeyword) {
        toast.error('Please enter a title and primary keyword first');
        return;
      }

      // Prepare request data
      const requestData: GenerateMetaRequest = {
        title,
        primary_keyword: primaryKeyword,
        secondary_keywords: secondaryKeywords,
        content_description: contentDescription,
        language
      };

      // Call the API
      const response = await generateMetaMutation(requestData).unwrap();

      if (response.success) {
        // Update form with generated meta information
        setValue('step1.metaTitle', response.metaTitle, { shouldValidate: true });
        setValue('step1.metaDescription', response.metaDescription, { shouldValidate: true });
        setValue('step1.urlSlug', response.urlSlug, { shouldValidate: true });
        toast.success('Meta information generated successfully');
      } else {
        toast.error(response.message || 'Failed to generate meta information');
      }
    } catch (error) {
      console.error('Error generating meta:', error);
      toast.error('Failed to generate meta information');
    } finally {
      setIsGeneratingMeta(false);
    }
  };

  /**
   * Generate secondary keywords
   */
  const handleGenerateSecondaryKeywords = async () => {
    try {
      setIsGeneratingKeywords(true);

      // Get current form values
      const formData = getValues();
      const primaryKeyword = formData.step1?.primaryKeyword || '';

      if (!primaryKeyword) {
        toast.error('Please enter a primary keyword first');
        return;
      }

      // Prepare request data
      const requestData: GenerateKeywordsRequest = {
        primary_keyword: primaryKeyword
      };

      // Call the API
      const response = await generateKeywordsMutation(requestData).unwrap();

      if (response.success) {
        // Parse the keywords string into an array
        const keywords = response.keywords.split(',').map(k => k.trim());

        // Update form with generated keywords
        setValue('step1.secondaryKeywords', keywords, { shouldValidate: true });
        toast.success('Secondary keywords generated successfully');
      } else {
        toast.error(response.message || 'Failed to generate secondary keywords');
      }
    } catch (error) {
      console.error('Error generating keywords:', error);
      toast.error('Failed to generate secondary keywords');
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  /**
   * Optimize content description
   */
  const handleOptimizeContentDescription = async () => {
    try {
      setIsOptimizingDescription(true);

      // Get current form values
      const formData = getValues();
      const primaryKeyword = formData.step1?.primaryKeyword || '';
      const secondaryKeywords = formData.step1?.secondaryKeywords || [];

      if (!primaryKeyword) {
        toast.error('Please enter a primary keyword first');
        return;
      }

      // Prepare request data
      const requestData: GenerateTopicRequest = {
        primary_keyword: primaryKeyword,
        secondary_keywords: secondaryKeywords
      };

      // Call the API
      const response = await generateTopicMutation(requestData).unwrap();

      if (response.success) {
        // Update form with optimized description
        setValue('step1.contentDescription', response.content, { shouldValidate: true });
        toast.success('Content description optimized successfully');
      } else {
        toast.error(response.message || 'Failed to optimize content description');
      }
    } catch (error) {
      console.error('Error optimizing description:', error);
      toast.error('Failed to optimize content description');
    } finally {
      setIsOptimizingDescription(false);
    }
  };

  /**
   * Generate table of contents (sections)
   */
  const handleGenerateSections = async (): Promise<boolean> => {
    try {
      setIsGeneratingSections(true);

      // Get current form values
      const formData = getValues();
      const step1Values = formData.step1 || {};
      const step2Values = formData.step2 || {};

      const title = step1Values.title || '';
      const primaryKeyword = step1Values.primaryKeyword || '';
      const secondaryKeywords = step1Values.secondaryKeywords || [];
      const language = step1Values.language || 'en';
      const targetCountry = step1Values.targetCountry || 'United States';
      const contentType = step2Values.articleType || 'blog';
      const articleSize = step2Values.articleSize || 'medium';
      const toneOfVoice = step2Values.toneOfVoice || 'professional';

      if (!title || !primaryKeyword) {
        toast.error('Please enter a title and primary keyword first');
        return false;
      }

      // Prepare request data
      const requestData: GenerateSectionsRequest = {
        title,
        keyword: primaryKeyword,
        secondaryKeywords,
        language,
        contentType,
        articleSize,
        toneOfVoice,
        targetCountry
      };

      // do a delay of 3s !
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Call the API
      const response = await generateSectionsMutation(requestData).unwrap();

      if (response.success) {
        // Convert API sections to our ArticleSection format
        const convertedSections = convertApiSectionsToArticleSections(response.sections);

        // Update form with generated sections
        setValue('step3.sections', convertedSections, { shouldValidate: true });
        toast.success('Table of contents generated successfully');
        return true;
      }

      toast.error(response.message || 'Failed to generate table of contents');
      return false;

    } catch (error) {
      console.error('Error generating sections:', error);
      toast.error('Failed to generate table of contents');
      return false;
    } finally {
      setIsGeneratingSections(false);
    }
  };

  /**
   * Convert API section format to our ArticleSection format
   */
  const convertApiSectionsToArticleSections = (apiSections: GeneratedSection[]): ArticleSection[] => apiSections.map((section, index) => {
      const articleSection: ArticleSection = {
        id: section.id || (index + 1).toString(),
        title: section.title,
        content: section.content || '',
        status: section.status || 'draft',
        type: index === 0 ? 'introduction' : index === apiSections.length - 1 ? 'conclusion' : 'regular',
        contentType: 'paragraph'
      };

      return articleSection;
    });

  return {
    // Loading states
    isGeneratingTitle,
    isGeneratingMeta,
    isGeneratingKeywords,
    isOptimizingDescription,
    isGeneratingSections,

    // Handler functions
    handleGenerateTitle,
    handleGenerateMeta,
    handleGenerateSecondaryKeywords,
    handleOptimizeContentDescription,
    handleGenerateSections
  };
};
