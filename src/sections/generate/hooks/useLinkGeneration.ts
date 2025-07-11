import type { InternalLinksRequest } from 'src/services/apis/generateContentApi';

import toast from 'react-hot-toast';
import { useFormContext } from 'react-hook-form';

import { useGenerateInternalLinksMutation, useGenerateExternalLinksMutation } from 'src/services/apis/generateContentApi';
import { useApiGenerationWithRetry } from 'src/hooks/useApiGenerationWithRetry';

import type { Link, GenerateArticleFormData } from '../schemas';

// ----------------------------------------------------------------------

interface UseLinkGenerationReturn {
  isGeneratingInternal: boolean;
  isGeneratingExternal: boolean;
  isRetryingInternal: boolean;
  isRetryingExternal: boolean;
  canRetryInternal: boolean;
  canRetryExternal: boolean;
  retryInternalLinks: () => Promise<void>;
  retryExternalLinks: () => Promise<void>;
  generateInternalLinks: (websiteUrl?: string) => Promise<void>;
  generateExternalLinks: () => Promise<void>;
}

export function useLinkGeneration(): UseLinkGenerationReturn {
  const { getValues, setValue } = useFormContext<GenerateArticleFormData>();

  // RTK Query mutations
  const [generateInternalLinksMutation, { isLoading: isGeneratingInternalBase }] = useGenerateInternalLinksMutation();
  const [generateExternalLinksMutation, { isLoading: isGeneratingExternalBase }] = useGenerateExternalLinksMutation();

  // Use retry mechanism for API calls
  const internalLinksRetryHandler = useApiGenerationWithRetry({
    maxRetries: 3,
    retryDelay: 2000, // 2 seconds delay between retries
  });

  const externalLinksRetryHandler = useApiGenerationWithRetry({
    maxRetries: 3,
    retryDelay: 2000, // 2 seconds delay between retries
  });

  // Generate a unique ID for new links
  const generateId = (type: 'internal' | 'external') => 
    `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // API call for internal links generation with retry
  const generateInternalLinks = async (websiteUrl?: string) => {
    const apiCall = async () => {
      console.log(websiteUrl, " url");

      const payload: InternalLinksRequest = {
        website_url: websiteUrl || ''
      };

      const response = await generateInternalLinksMutation(payload).unwrap();

      console.log(response, " response");

      if (!response.success) {
        throw new Error(response.message || 'Failed to generate internal links');
      }

      // Convert API response to our Link format
      const newLinks: Link[] = response.internal_links.map(link => ({
        id: generateId('internal'),
        url: link.link_url,
        anchorText: link.link_text,
      }));

      // Get existing internal links and append new ones
      const currentFormData = getValues();
      const existingLinks = currentFormData.step2.internalLinks || [];
      const updatedLinks = [...existingLinks, ...newLinks];

      setValue('step2.internalLinks', updatedLinks, { shouldValidate: true });

      toast.success(`Generated ${newLinks.length} internal links`);
      return newLinks;
    };

    try {
      await internalLinksRetryHandler.executeWithRetry(
        apiCall,
        'Internal Links Generation',
        'Failed to generate internal links. Server might be overloaded.'
      );
    } catch (error) {
      console.error('❌ Final error generating internal links:', error);
    }
  };

  // API call for external links generation with retry
  const generateExternalLinks = async () => {
    const apiCall = async () => {
      const formData = getValues();
      const { contentDescription, primaryKeyword, secondaryKeywords, title, language } = formData.step1;

      const response = await generateExternalLinksMutation({
        primary_keyword: primaryKeyword,
        secondary_keywords: secondaryKeywords,
        content_description: contentDescription,
        title: title || '',
        language: language || 'english'
      }).unwrap();

      if (!response.success) {
        throw new Error(response.message || 'Failed to generate external links');
      }

      // Convert API response to our Link format
      const newLinks: Link[] = response.external_links.map(link => ({
        id: generateId('external'),
        url: link.link_url,
        anchorText: link.link_text,
      }));

      // Get existing external links and append new ones
      const existingLinks = formData.step2.externalLinks || [];
      const updatedLinks = [...existingLinks, ...newLinks];

      setValue('step2.externalLinks', updatedLinks, { shouldValidate: true });

      toast.success(`Generated ${newLinks.length} external links`);
      return newLinks;
    };

    try {
      await externalLinksRetryHandler.executeWithRetry(
        apiCall,
        'External Links Generation',
        'Failed to generate external links. Server might be overloaded.'
      );
    } catch (error) {
      console.error('❌ Final error generating external links:', error);
    }
  };

  return {
    isGeneratingInternal: isGeneratingInternalBase || internalLinksRetryHandler.isLoading,
    isGeneratingExternal: isGeneratingExternalBase || externalLinksRetryHandler.isLoading,
    isRetryingInternal: internalLinksRetryHandler.isRetrying,
    isRetryingExternal: externalLinksRetryHandler.isRetrying,
    canRetryInternal: internalLinksRetryHandler.canRetry,
    canRetryExternal: externalLinksRetryHandler.canRetry,
    retryInternalLinks: internalLinksRetryHandler.retry,
    retryExternalLinks: externalLinksRetryHandler.retry,
    generateInternalLinks,
    generateExternalLinks,
  };
}
