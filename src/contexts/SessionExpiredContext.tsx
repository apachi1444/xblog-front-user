import React, { useRef, useContext, useCallback, createContext } from 'react';

import { useToast } from './ToastContext';

interface SessionExpiredContextType {
  showSessionExpiredModal: () => void;
}

const SessionExpiredContext = createContext<SessionExpiredContextType | undefined>(undefined);

interface SessionExpiredProviderProps {
  children: React.ReactNode;
  onSessionExpired: () => void;
}

export function SessionExpiredProvider({ children, onSessionExpired }: SessionExpiredProviderProps) {
  const { showToast } = useToast();
  const logoutExecutedRef = useRef(false);

  const showSessionExpiredModal = useCallback(() => {
    // Prevent multiple logout executions
    if (logoutExecutedRef.current) return;

    logoutExecutedRef.current = true;

    // Show quick toast notification
    showToast('Session expired. Redirecting to login...', 'info');

    // Execute logout immediately
    setTimeout(() => {
      onSessionExpired();
    }, 100); // Very short delay to ensure toast is shown
  }, [onSessionExpired, showToast]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    showSessionExpiredModal,
  };

  return (
    <SessionExpiredContext.Provider value={value}>
      {children}
    </SessionExpiredContext.Provider>
  );
}

export function useSessionExpired() {
  const context = useContext(SessionExpiredContext);
  if (context === undefined) {
    throw new Error('useSessionExpired must be used within a SessionExpiredProvider');
  }
  return context;
}
