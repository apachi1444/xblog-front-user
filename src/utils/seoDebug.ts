/**
 * Debug utility for SEO scoring
 * This file contains functions to help debug SEO scoring issues
 */

// Global debug flag - set to true to enable debug logging
const DEBUG_ENABLED = true;

/**
 * Log debug information if debug is enabled
 */
export const debugLog = (message: string, ...args: any[]) => {
  if (DEBUG_ENABLED) {
    console.log(`[SEO DEBUG] ${message}`, ...args);
  }
};

/**
 * Debug function to log form values
 */
export const debugFormValues = (form: any, fieldNames: string[]) => {
  if (!DEBUG_ENABLED) return;

  const { getValues } = form;
  
  console.log('[SEO DEBUG] Form Values:');
  
  fieldNames.forEach(fieldName => {
    try {
      // Try to get values from all possible locations
      const directValue = getValues(fieldName);
      const step1Value = getValues(`step1.${fieldName}`);
      const step3Value = fieldName === 'content' ? getValues('step3.content') : undefined;
      
      console.log(`  ${fieldName}:`, {
        directValue: typeof directValue === 'string' ? directValue.substring(0, 50) : directValue,
        step1Value: typeof step1Value === 'string' ? step1Value.substring(0, 50) : step1Value,
        step3Value: typeof step3Value === 'string' ? step3Value.substring(0, 50) : step3Value
      });
    } catch (e) {
      console.log(`  ${fieldName}: Error getting value`, e);
    }
  });
};

/**
 * Debug function to log keyword check results
 */
export const debugKeywordCheck = (
  text: string, 
  keyword: string, 
  result: boolean,
  options: any = {}
) => {
  if (!DEBUG_ENABLED) return;
  
  console.log('[SEO DEBUG] Keyword Check:', {
    text: typeof text === 'string' ? text.substring(0, 50) : text,
    keyword,
    result,
    options
  });
};
