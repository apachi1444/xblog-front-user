import React, { useRef, useState, useContext, useCallback, createContext } from 'react';

interface SessionExpiredContextType {
  showSessionExpiredModal: () => void;
  isModalOpen: boolean;
  countdown: number;
}

const SessionExpiredContext = createContext<SessionExpiredContextType | undefined>(undefined);

interface SessionExpiredProviderProps {
  children: React.ReactNode;
  onSessionExpired: () => void;
}

export function SessionExpiredProvider({ children, onSessionExpired }: SessionExpiredProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const showSessionExpiredModal = useCallback(() => {
    // Prevent multiple modals from opening
    if (isModalOpen) return;

    setIsModalOpen(true);
    setCountdown(3);

    // Start countdown
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Execute logout after 3 seconds
    timeoutRef.current = setTimeout(() => {
      setIsModalOpen(false);
      onSessionExpired();
    }, 1000);
  }, [isModalOpen, onSessionExpired]);

  // Cleanup timeouts on unmount
  React.useEffect(() => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, []);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    showSessionExpiredModal,
    isModalOpen,
    countdown,
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
