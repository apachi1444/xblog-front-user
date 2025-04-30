import type { Step1FormData } from '../sections/generate/schemas';

export const canGenerateContent = (values: Partial<Step1FormData>) => {
  const secondaryKeywordsLength = values.secondaryKeywords?.length ?? 0;

  const isValid = Boolean(
    values.targetCountry?.trim() &&
    values.language?.trim() &&
    values.primaryKeyword?.trim() &&
    secondaryKeywordsLength > 0 &&
    values.contentDescription
  );


  console.log('Form validation:', {
    isValid,
    fields: {
      targetCountry: !!values.targetCountry?.trim(),
      language: !!values.language?.trim(),
      primaryKeyword: !!values.primaryKeyword?.trim(),
      secondaryKeywords: secondaryKeywordsLength > 0,
      contentDescription: !!values.contentDescription
    }
  });


  return isValid;
};


