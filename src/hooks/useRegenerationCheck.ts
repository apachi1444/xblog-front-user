import { useState } from 'react';

import { useRegenerateManager } from 'src/sections/generate/hooks/useRegenerateManager';

interface UseRegenerationCheckReturn {
  checkRegenerationCredits: () => boolean;
  showRegenerationDialog: boolean;
  setShowRegenerationDialog: (show: boolean) => void;
  regenerationsAvailable: number;
  regenerationsTotal: number;
}

/**
 * Hook to check if user has regeneration credits available
 * Returns a function to check credits and state to manage the dialog
 */
export const useRegenerationCheck = (): UseRegenerationCheckReturn => {
  const [showRegenerationDialog, setShowRegenerationDialog] = useState(false);
  
  // Get regeneration data from the regenerate manager
  const { 
    regenerationsAvailable, 
    regenerationsTotal,
    hasRegenerationsAvailable 
  } = useRegenerateManager();

  /**
   * Check if user has regeneration credits available
   * If not, show the dialog
   * @returns boolean - true if user has credits, false otherwise
   */
  const checkRegenerationCredits = (): boolean => {
    const hasCredits = hasRegenerationsAvailable();
    
    if (!hasCredits) {
      setShowRegenerationDialog(true);
    }
    
    return hasCredits;
  };

  return {
    checkRegenerationCredits,
    showRegenerationDialog,
    setShowRegenerationDialog,
    regenerationsAvailable,
    regenerationsTotal
  };
};
