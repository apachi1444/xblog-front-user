import type { DraftManagerState } from 'src/types/draft';
import type { GenerateArticleFormData } from 'src/sections/generate/schemas';

import { useRef, useState, useEffect, useCallback } from 'react';

import { debounce } from 'src/utils/debounce';
import { 
  getDraftTitle, 
  saveLocalDraft, 
  updateLocalDraft, 
  setCurrentDraftId,
  getCurrentDraftId 
} from 'src/utils/draftStorage';

import { DraftStatus } from 'src/types/draft';

// ----------------------------------------------------------------------

interface UseDraftManagerOptions {
  autoSaveDelay?: number; // Debounce delay in milliseconds
  enableLocalFallback?: boolean; // Enable localStorage fallback
}

interface UseDraftManagerReturn extends DraftManagerState {
  initializeDraft: (initialData?: Partial<GenerateArticleFormData>) => Promise<void>;
  saveDraft: (data: Partial<GenerateArticleFormData>, title?: string) => void;
  forceSave: () => Promise<void>;
  clearDraft: () => void;
  isFirstInput: boolean;
}

/**
 * Hook for managing draft creation and auto-saving
 * Handles API calls, debouncing, and localStorage fallback
 */
export const useDraftManager = (options: UseDraftManagerOptions = {}): UseDraftManagerReturn => {
  const {
    autoSaveDelay = 2000,
    enableLocalFallback = true,
  } = options;

  // State
  const [state, setState] = useState<DraftManagerState>({
    currentDraftId: null,
    status: DraftStatus.SAVED,
    lastSaved: null,
    hasUnsavedChanges: false,
    error: null,
  });

  const [isFirstInput, setIsFirstInput] = useState(true);
  
  // Refs for tracking data
  const currentDataRef = useRef<Partial<GenerateArticleFormData>>({});
  const currentTitleRef = useRef<string>('');

  // Initialize draft on mount
  useEffect(() => {
    const existingDraftId = getCurrentDraftId();
    if (existingDraftId) {
      setState(prev => ({
        ...prev,
        currentDraftId: existingDraftId,
      }));
    }
  }, []);

  /**
   * Update state helper
   */
  const updateState = useCallback((updates: Partial<DraftManagerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Save draft to API or localStorage
   */
  const performSave = useCallback(async (
    data: Partial<GenerateArticleFormData>, 
    title?: string
  ): Promise<void> => {
    const draftTitle = title || getDraftTitle(data);
    
    try {
      updateState({ status: DraftStatus.SAVING, error: null });

      if (state.currentDraftId && !state.currentDraftId.startsWith('local_')) {
        // Update existing remote draft
      
      } else {
        // Create new remote draft
    
      }

      updateState({
        status: DraftStatus.SAVED,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
      });

    } catch (error) {
      console.error('Failed to save draft to API:', error);
      
      if (enableLocalFallback) {
        // Fallback to localStorage
        try {
          let localDraftId = state.currentDraftId;
          
          if (!localDraftId || !localDraftId.startsWith('local_')) {
            localDraftId = saveLocalDraft(data, draftTitle);
          } else {
            updateLocalDraft(localDraftId, data, draftTitle);
          }
          
          updateState({
            currentDraftId: localDraftId,
            status: DraftStatus.OFFLINE,
            lastSaved: new Date(),
            hasUnsavedChanges: false,
            error: null,
          });
          
          setCurrentDraftId(localDraftId);
        } catch (localError) {
          console.error('Failed to save draft locally:', localError);
          updateState({
            status: DraftStatus.ERROR,
            error: 'Failed to save draft',
          });
        }
      } else {
        updateState({
          status: DraftStatus.ERROR,
          error: 'Failed to save draft',
        });
      }
    }
  }, [state.currentDraftId, enableLocalFallback, updateState]);

  /**
   * Debounced save function
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((data: Partial<GenerateArticleFormData>, title?: string) => {
      performSave(data, title);
    }, autoSaveDelay),
    [performSave, autoSaveDelay]
  );

  /**
   * Initialize draft (called when user starts typing)
   */
  const initializeDraft = useCallback(async (
    initialData: Partial<GenerateArticleFormData> = {}
  ): Promise<void> => {
    if (state.currentDraftId) return; // Already initialized
    
    updateState({ status: DraftStatus.CREATING });
    
    try {
      // create new draft remote !
    } catch (error) {
      console.error('Failed to create draft:', error);
      
      if (enableLocalFallback) {
        const localDraftId = saveLocalDraft(initialData);
        updateState({
          currentDraftId: localDraftId,
          status: DraftStatus.OFFLINE,
          lastSaved: new Date(),
        });
        setCurrentDraftId(localDraftId);
        setIsFirstInput(false);
      } else {
        updateState({
          status: DraftStatus.ERROR,
          error: 'Failed to create draft',
        });
      }
    }
  }, [state.currentDraftId, enableLocalFallback, updateState]);

  /**
   * Save draft (debounced)
   */
  const saveDraft = useCallback((
    data: Partial<GenerateArticleFormData>, 
    title?: string
  ) => {
    currentDataRef.current = data;
    currentTitleRef.current = title || '';
    
    updateState({ hasUnsavedChanges: true });
    
    // If this is the first input and no draft exists, initialize
    if (isFirstInput && !state.currentDraftId) {
      initializeDraft(data);
      return;
    }
    
    // Otherwise, use debounced save
    debouncedSave(data, title);
  }, [isFirstInput, state.currentDraftId, initializeDraft, debouncedSave, updateState]);

  /**
   * Force immediate save (bypass debounce)
   */
  const forceSave = useCallback(async (): Promise<void> => {
    if (currentDataRef.current) {
      await performSave(currentDataRef.current, currentTitleRef.current);
    }
  }, [performSave]);

  /**
   * Clear current draft
   */
  const clearDraft = useCallback(() => {
    setState({
      currentDraftId: null,
      status: DraftStatus.SAVED,
      lastSaved: null,
      hasUnsavedChanges: false,
      error: null,
    });
    setCurrentDraftId(null);
    setIsFirstInput(true);
    currentDataRef.current = {};
    currentTitleRef.current = '';
  }, []);

  return {
    ...state,
    initializeDraft,
    saveDraft,
    forceSave,
    clearDraft,
    isFirstInput,
  };
};
