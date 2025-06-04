/**
 * Utility functions for draft localStorage operations
 * Provides fallback storage when API is unavailable
 */

import type { LocalDraft } from 'src/types/draft';
import type { GenerateArticleFormData } from 'src/sections/generate/schemas';

import { isLocalStorageAvailable } from './authStorage';

// Constants
const DRAFT_STORAGE_KEY = 'xblog_drafts_v1';
const CURRENT_DRAFT_KEY = 'xblog_current_draft_v1';

/**
 * Generate a unique ID for local drafts
 */
const generateLocalDraftId = (): string => `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Get all local drafts from localStorage
 */
export const getLocalDrafts = (): LocalDraft[] => {
  if (!isLocalStorageAvailable()) return [];
  
  try {
    const draftsData = localStorage.getItem(DRAFT_STORAGE_KEY);
    return draftsData ? JSON.parse(draftsData) : [];
  } catch (error) {
    console.error('Error retrieving local drafts:', error);
    return [];
  }
};

/**
 * Save a local draft to localStorage
 */
export const saveLocalDraft = (content: Partial<GenerateArticleFormData>, title?: string): string => {
  if (!isLocalStorageAvailable()) return '';
  
  try {
    const drafts = getLocalDrafts();
    const draftId = generateLocalDraftId();
    
    const newDraft: LocalDraft = {
      id: draftId,
      content,
      title,
      lastSaved: new Date().toISOString(),
      isLocal: true,
    };
    
    drafts.push(newDraft);
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
    
    return draftId;
  } catch (error) {
    console.error('Error saving local draft:', error);
    return '';
  }
};

/**
 * Update an existing local draft
 */
export const updateLocalDraft = (
  draftId: string, 
  content: Partial<GenerateArticleFormData>, 
  title?: string
): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    const drafts = getLocalDrafts();
    const draftIndex = drafts.findIndex(draft => draft.id === draftId);
    
    if (draftIndex === -1) return false;
    
    drafts[draftIndex] = {
      ...drafts[draftIndex],
      content,
      title,
      lastSaved: new Date().toISOString(),
    };
    
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
    return true;
  } catch (error) {
    console.error('Error updating local draft:', error);
    return false;
  }
};

/**
 * Get a specific local draft by ID
 */
export const getLocalDraftById = (draftId: string): LocalDraft | null => {
  const drafts = getLocalDrafts();
  return drafts.find(draft => draft.id === draftId) || null;
};

/**
 * Delete a local draft
 */
export const deleteLocalDraft = (draftId: string): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    const drafts = getLocalDrafts();
    const filteredDrafts = drafts.filter(draft => draft.id !== draftId);
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(filteredDrafts));
    return true;
  } catch (error) {
    console.error('Error deleting local draft:', error);
    return false;
  }
};

/**
 * Set current draft ID
 */
export const setCurrentDraftId = (draftId: string | null): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    if (draftId) {
      localStorage.setItem(CURRENT_DRAFT_KEY, draftId);
    } else {
      localStorage.removeItem(CURRENT_DRAFT_KEY);
    }
  } catch (error) {
    console.error('Error setting current draft ID:', error);
  }
};

/**
 * Get current draft ID
 */
export const getCurrentDraftId = (): string | null => {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    return localStorage.getItem(CURRENT_DRAFT_KEY);
  } catch (error) {
    console.error('Error getting current draft ID:', error);
    return null;
  }
};

/**
 * Clear all local drafts
 */
export const clearLocalDrafts = (): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    localStorage.removeItem(CURRENT_DRAFT_KEY);
  } catch (error) {
    console.error('Error clearing local drafts:', error);
  }
};

/**
 * Get the title from draft content for display purposes
 */
export const getDraftTitle = (content: Partial<GenerateArticleFormData>): string => {
  if (content.step1?.title) {
    return content.step1.title;
  }
  
  if (content.step1?.contentDescription) {
    // Truncate content description for title
    const description = content.step1.contentDescription;
    return description.length > 50 ? `${description.substring(0, 50)}...` : description;
  }
  
  if (content.step1?.primaryKeyword) {
    return `Draft: ${content.step1.primaryKeyword}`;
  }
  
  return 'Untitled Draft';
};
