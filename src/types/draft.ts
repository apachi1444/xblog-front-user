/**
 * Types for draft management system
 */

import type { GenerateArticleFormData } from 'src/sections/generate/schemas';

// Draft status enum
export enum DraftStatus {
  CREATING = 'creating',
  SAVING = 'saving',
  SAVED = 'saved',
  ERROR = 'error',
  OFFLINE = 'offline'
}

// Draft interface
export interface Draft {
  id: string;
  title?: string;
  content: Partial<GenerateArticleFormData>;
  status: 'draft';
  created_at: string;
  updated_at: string;
  store_id: number;
  user_id: string;
}

// Draft creation request
export interface CreateDraftRequest {
  title?: string;
  content: Partial<GenerateArticleFormData>;
  store_id: number;
}

// Draft update request
export interface UpdateDraftRequest {
  content: Partial<GenerateArticleFormData>;
  title?: string;
}

// Draft response from API
export interface DraftResponse {
  draft: Draft;
  success: boolean;
  message?: string;
}

// Drafts list response
export interface DraftsResponse {
  drafts: Draft[];
  total: number;
  page: number;
  limit: number;
}

// Local storage draft structure
export interface LocalDraft {
  id: string;
  content: Partial<GenerateArticleFormData>;
  title?: string;
  lastSaved: string;
  isLocal: true;
}

// Draft manager state
export interface DraftManagerState {
  currentDraftId: string | null;
  status: DraftStatus;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  error: string | null;
}

// Article limits interface
export interface ArticleLimits {
  articlesCreated: number;
  articlesLimit: number;
  articlesRemaining: number;
  canCreateMore: boolean;
}
