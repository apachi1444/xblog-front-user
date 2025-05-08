// SEO Input Mapping
// This file defines the mapping between user inputs and SEO scoring items

// Import shared types and scoring rules
import { SEO_SCORING_RULES } from './seoScoringRules';

import type { UserInputKey } from './seoTypes';

// Re-export UserInputKey for backward compatibility
export type { UserInputKey };

/**
 * Maps each user input category to the scoring item IDs it affects
 */
export type InputToScoringMap = {
  [key in UserInputKey]: number[];
};

// Generate the mapping dynamically from the scoring rules
const generateInputToScoringMap = (): InputToScoringMap => {
  const map: InputToScoringMap = {
    targetCountryLanguage: [],
    primaryKeyword: [],
    secondaryKeywords: [],
    seoTitle: [],
    metaInfo: [],
    contentDescription: [],
    tocAndContent: []
  };

  // Process primary SEO items
  SEO_SCORING_RULES.primary_seo.forEach(item => {
    if (item.input && item.input in map) {
      map[item.input].push(item.id);
    }
  });

  // Process title optimization items
  SEO_SCORING_RULES.title_optimization.forEach(item => {
    if (item.input && item.input in map) {
      map[item.input].push(item.id);
    }
  });

  // Process content presentation items
  SEO_SCORING_RULES.content_presentation.forEach(item => {
    if (item.input && item.input in map) {
      map[item.input].push(item.id);
    }
  });

  // Process additional SEO factors
  SEO_SCORING_RULES.additional_seo_factors.forEach(item => {
    if (item.input && item.input in map) {
      map[item.input].push(item.id);
    }
  });

  return map;
};

export const INPUT_TO_SCORING_MAP: InputToScoringMap = generateInputToScoringMap();

/**
 * Maps form field names to the user input categories they belong to
 */
export type FormFieldToInputMap = {
  [fieldName: string]: UserInputKey;
};

/**
 * Mapping of form field names to user input categories
 */
export const FORM_FIELD_TO_INPUT_MAP: FormFieldToInputMap = {
  // Step 1 fields
  'language': 'targetCountryLanguage',
  'targetCountry': 'targetCountryLanguage',
  'primaryKeyword': 'primaryKeyword',
  'secondaryKeywords': 'secondaryKeywords',

  // Step 2 fields
  'title': 'seoTitle',
  'metaTitle': 'seoTitle',
  'metaDescription': 'metaInfo',
  'urlSlug': 'metaInfo',

  // Step 3 fields
  'content': 'tocAndContent',
  'contentDescription': 'contentDescription',
  'internalLinks': 'tocAndContent',
  'externalLinks': 'tocAndContent',
};

/**
 * Gets the scoring item IDs affected by a specific form field
 * @param fieldName The name of the form field
 * @returns Array of scoring item IDs affected by the field
 */
export const getScoringItemsForField = (fieldName: string): number[] => {
  // Handle step-prefixed field names (e.g., 'step1.primaryKeyword')
  const baseFieldName = fieldName.includes('.') ? fieldName.split('.')[1] : fieldName;

  // Get the input category for this field
  const inputKey = FORM_FIELD_TO_INPUT_MAP[baseFieldName];

  // Return the scoring item IDs for this input category
  return inputKey ? INPUT_TO_SCORING_MAP[inputKey] : [];
};

/**
 * Gets the user input categories affected by a specific scoring item ID
 * @param scoringItemId The ID of the scoring item
 * @returns Array of user input categories that affect this scoring item
 */
export const getInputsForScoringItem = (scoringItemId: number): UserInputKey[] => Object.entries(INPUT_TO_SCORING_MAP)
    .filter(([_, itemIds]) => itemIds.includes(scoringItemId))
    .map(([key]) => key as UserInputKey);

/**
 * Gets the form fields that affect a specific scoring item ID
 * @param scoringItemId The ID of the scoring item
 * @returns Array of form field names that affect this scoring item
 */
export const getFormFieldsForScoringItem = (scoringItemId: number): string[] => {
  const inputKeys = getInputsForScoringItem(scoringItemId);

  return Object.entries(FORM_FIELD_TO_INPUT_MAP)
    .filter(([_, inputKey]) => inputKeys.includes(inputKey))
    .map(([fieldName]) => fieldName);
};
