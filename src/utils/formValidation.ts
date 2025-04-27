import type { Step1FormData } from '../sections/generate/schemas';

export const canGenerateContent = (values: Partial<Step1FormData>) => {
  // Add console.log to debug values
  console.log('Validation values:', {
    targetCountry: values.targetCountry,
    language: values.language,
    primaryKeyword: values.primaryKeyword,
    secondaryKeywords: values.secondaryKeywords,
    contentDescription: values.contentDescription
  });

  const secondaryKeywordsLength = values.secondaryKeywords?.length ?? 0;
  
  const isValid = Boolean(
    values.targetCountry?.trim() &&
    values.language?.trim() &&
    values.primaryKeyword?.trim() &&
    secondaryKeywordsLength > 0 &&
    values.contentDescription
  );

  // Log the result
  console.log('Is valid:', isValid);

  return isValid;
};


