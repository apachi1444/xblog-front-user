/**
 * Direct SEO checking utilities that bypass all abstractions
 * This is a last resort for fixing critical SEO scoring issues
 */

/**
 * Directly check if a keyword is in text with very lenient matching
 */
export const directKeywordCheck = (
  text: string | null | undefined,
  keyword: string | null | undefined
): boolean => {
  // Handle null/undefined values
  if (!text || !keyword) return false;
  
  // Convert to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  
  // Most basic check - is the keyword anywhere in the text?
  if (lowerText.includes(lowerKeyword)) return true;
  
  // Check for keyword parts (for multi-word keywords)
  const keywordParts = lowerKeyword.split(/\s+/).filter(part => part.length > 2);
  if (keywordParts.length > 1) {
    // If at least half of the parts are found, consider it a match
    const foundParts = keywordParts.filter(part => lowerText.includes(part));
    if (foundParts.length >= Math.ceil(keywordParts.length / 2)) {
      return true;
    }
  }
  
  // Check for singular/plural forms
  const singularForm = lowerKeyword.endsWith('s') ? lowerKeyword.slice(0, -1) : lowerKeyword;
  const pluralForm = lowerKeyword.endsWith('s') ? lowerKeyword : `${lowerKeyword}s`;
  
  if (lowerText.includes(singularForm) || lowerText.includes(pluralForm)) {
    return true;
  }
  
  return false;
};

/**
 * Directly check if secondary keywords are defined
 */
export const directSecondaryKeywordsCheck = (
  secondaryKeywords: any
): boolean => {
  // Check if it's an array
  if (!Array.isArray(secondaryKeywords)) return false;
  
  // Check if it has any elements
  if (secondaryKeywords.length === 0) return false;
  
  // Check if any element is a non-empty string
  return secondaryKeywords.some(keyword => 
    typeof keyword === 'string' && keyword.trim() !== ''
  );
};

/**
 * Get all possible values for a field from a form
 */
export const getAllPossibleValues = (form: any, fieldName: string): any => {
  try {
    // Try all possible paths for the field
    const directValue = form.getValues(fieldName);
    const step1Value = form.getValues(`step1.${fieldName}`);
    const step3Value = fieldName === 'content' ? form.getValues('step3.content') : undefined;
    
    // Return the first non-empty value
    if (directValue !== undefined && directValue !== null && directValue !== '') {
      return directValue;
    }
    
    if (step1Value !== undefined && step1Value !== null && step1Value !== '') {
      return step1Value;
    }
    
    if (step3Value !== undefined && step3Value !== null && step3Value !== '') {
      return step3Value;
    }
    
    // If we get here, return an empty value based on the field type
    if (fieldName === 'secondaryKeywords') {
      return [];
    }
    
    return '';
  } catch (e) {
    console.error(`Error getting value for ${fieldName}:`, e);
    return fieldName === 'secondaryKeywords' ? [] : '';
  }
};
