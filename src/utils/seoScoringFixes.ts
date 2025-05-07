/**
 * Enhanced version of containsKeyword that is more flexible in how it checks for keywords
 * @param text The text to search in
 * @param keyword The keyword to search for
 * @param options Matching options
 * @returns Boolean indicating if keyword is present
 */
export const enhancedContainsKeyword = (
  text: string,
  keyword: string,
  options: {
    exactMatch?: boolean,
    stemming?: boolean,
    synonyms?: string[],
    caseSensitive?: boolean,
    partialMatch?: boolean
  } = {}
): boolean => {
  if (!text || !keyword) return false;

  // Normalize text and keyword based on case sensitivity
  const textToSearch = options.caseSensitive ? text : text.toLowerCase();
  const keywordToSearch = options.caseSensitive ? keyword : keyword.toLowerCase();

  // Exact match check (word boundaries)
  if (options.exactMatch) {
    try {
      const escapedKeyword = keywordToSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedKeyword}\\b`, options.caseSensitive ? 'g' : 'gi');
      if (regex.test(textToSearch)) return true;
    } catch (e) {
      // If regex fails, fall back to basic contains
      console.warn('Regex failed in enhancedContainsKeyword, falling back to basic contains', e);
      if (textToSearch.includes(keywordToSearch)) return true;
    }
  }

  // Basic contains check
  if (textToSearch.includes(keywordToSearch)) return true;

  // Partial match check (more lenient)
  if (options.partialMatch) {
    // Check if any word in the keyword is in the text
    const keywordWords = keywordToSearch.split(/\s+/);
    if (keywordWords.length > 1) {
      if (keywordWords.some(word => textToSearch.includes(word))) return true;
    }
  }

  // Check for keyword variations with stemming
  if (options.stemming) {
    // Simple stemming: check for plural/singular forms
    const singularForm = keywordToSearch.endsWith('s') ? keywordToSearch.slice(0, -1) : keywordToSearch;
    const pluralForm = keywordToSearch.endsWith('s') ? keywordToSearch : `${keywordToSearch}s`;

    if (textToSearch.includes(singularForm) || textToSearch.includes(pluralForm)) {
      return true;
    }

    // Check for common verb endings
    const stemForms = ['ing', 'ed', 'er', 'es'].map(ending =>
      keywordToSearch.endsWith(ending)
        ? keywordToSearch.slice(0, -ending.length)
        : `${keywordToSearch}${ending}`
    );

    if (stemForms.some(form => textToSearch.includes(form))) {
      return true;
    }
  }

  // Check for synonyms
  if (options.synonyms && options.synonyms.length > 0) {
    if (options.synonyms.some(synonym => {
      const synonymToSearch = options.caseSensitive ? synonym : synonym.toLowerCase();
      return textToSearch.includes(synonymToSearch);
    })) {
      return true;
    }
  }

  return false;
};
