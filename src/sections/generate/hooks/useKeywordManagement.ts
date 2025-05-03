import type { UseFormReturn } from 'react-hook-form';

import { useState } from 'react';

import type { Step1FormData } from '../schemas';

export const useKeywordManagement = (
  form: UseFormReturn<Step1FormData>,
  externalHandleAddKeyword?: (keyword: string) => void,
  externalHandleDeleteKeyword?: (keyword: string) => void
) => {
  const { setValue, watch } = form;
  const [keywordInput, setKeywordInput] = useState('');
  
  const secondaryKeywords = watch('secondaryKeywords') || [];
  
  const handleAddKeyword = (keyword: string) => {
    if (!keyword.trim()) return;

    // Ensure secondaryKeywords is always an array
    const currentKeywords = Array.isArray(secondaryKeywords) ? secondaryKeywords : [];

    // Check if keyword already exists
    if (currentKeywords.includes(keyword.trim())) {
      return;
    }

    // Add the new keyword to the array
    const updatedKeywords = [...currentKeywords, keyword.trim()];
    setValue('secondaryKeywords', updatedKeywords, { shouldValidate: true });

    // Clear the input field
    setKeywordInput('');

    // Call the external handler if provided
    if (externalHandleAddKeyword) {
      externalHandleAddKeyword(keyword.trim());
    }
  };

  const handleDeleteKeyword = (keyword: string) => {
    // Ensure secondaryKeywords is always an array
    const currentKeywords = Array.isArray(secondaryKeywords) ? secondaryKeywords : [];

    // Remove the keyword from the array
    const updatedKeywords = currentKeywords.filter(k => k !== keyword);
    setValue('secondaryKeywords', updatedKeywords, { shouldValidate: true });

    // Call the external handler if provided
    if (externalHandleDeleteKeyword) {
      externalHandleDeleteKeyword(keyword);
    }
  };

  return {
    keywordInput,
    setKeywordInput,
    secondaryKeywords,
    handleAddKeyword,
    handleDeleteKeyword,
  };
};
