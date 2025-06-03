import { useState } from 'react';
import toast from 'react-hot-toast';
import { useFormContext } from 'react-hook-form';

import { useGenerateInternalLinksMutation, useGenerateExternalLinksMutation } from 'src/services/apis/generateContentApi';

import type { Link, GenerateArticleFormData } from '../schemas';

// ----------------------------------------------------------------------

interface UseLinkGenerationReturn {
  isGeneratingInternal: boolean;
  isGeneratingExternal: boolean;
  websiteUrlError: string;
  generateInternalLinks: () => Promise<void>;
  generateExternalLinks: () => Promise<void>;
  setWebsiteUrlError: (error: string) => void;
}

export function useLinkGeneration(): UseLinkGenerationReturn {
  const [websiteUrlError, setWebsiteUrlError] = useState('');

  const { getValues, setValue } = useFormContext<GenerateArticleFormData>();

  // RTK Query mutations
  const [generateInternalLinksMutation, { isLoading: isGeneratingInternal }] = useGenerateInternalLinksMutation();
  const [generateExternalLinksMutation, { isLoading: isGeneratingExternal }] = useGenerateExternalLinksMutation();

  // Generate a unique ID for new links
  const generateId = (type: 'internal' | 'external') => 
    `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // API call for internal links generation
  const generateInternalLinks = async () => {
    setWebsiteUrlError(''); // Clear any previous errors

    try {
      const formData = getValues();
      const { websiteUrl } = formData.step2;

      if (!websiteUrl) {
        setWebsiteUrlError('Please enter your website URL first');
        return;
      }

      const response = await generateInternalLinksMutation({
        website_url: websiteUrl,
      }).unwrap();

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
      const existingLinks = formData.step2.internalLinks || [];
      const updatedLinks = [...existingLinks, ...newLinks];

      setValue('step2.internalLinks', updatedLinks, { shouldValidate: true });

      toast.success(`Generated ${newLinks.length} internal links`);
    } catch (error) {
      toast.error('Failed to generate internal links');
    }
  };

  // API call for external links generation
  const generateExternalLinks = async () => {
    try {
      const formData = getValues();
      const { contentDescription, primaryKeyword, secondaryKeywords, title } = formData.step1;

      const response = await generateExternalLinksMutation({
        primary_keyword: primaryKeyword,
        secondary_keywords: secondaryKeywords,
        content_description: contentDescription,
        title: title || '',
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
    } catch (error) {
      console.error('Error generating external links:', error);
      toast.error('Failed to generate external links');
    }
  };

  return {
    isGeneratingInternal,
    isGeneratingExternal,
    websiteUrlError,
    generateInternalLinks,
    generateExternalLinks,
    setWebsiteUrlError,
  };
}
