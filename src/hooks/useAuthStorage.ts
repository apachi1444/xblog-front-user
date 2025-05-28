import { useState, useEffect, useCallback } from 'react';

// Constants
const AUTH_STORAGE_KEY = 'xblog_auth_session_v2';

// Types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  is_completed_onboarding: boolean;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
}

export interface UseAuthStorageReturn {
  // Data getters
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  session: AuthSession | null;
  
  // Data setters
  saveUser: (user: AuthUser) => void;
  saveAccessToken: (token: string) => void;
  saveSession: (session: AuthSession) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  
  // Utilities
  clearAuth: () => void;
  refreshFromStorage: () => void;
  isStorageAvailable: boolean;
}

/**
 * Custom hook for managing authentication data in localStorage
 * Provides easy access to user info, tokens, and auth state
 */
export const useAuthStorage = (): UseAuthStorageReturn => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isStorageAvailable, setIsStorageAvailable] = useState(true);

  // Check if localStorage is available
  const checkStorageAvailability = useCallback(() => {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Get session from localStorage
  const getSessionFromStorage = useCallback((): AuthSession | null => {
    if (!isStorageAvailable) return null;
    
    try {
      const storedData = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!storedData) return null;
      
      const parsedData = JSON.parse(storedData) as AuthSession;
      
      // Validate required fields
      if (!parsedData.user?.id || !parsedData.user?.email) {
        console.warn('Invalid auth session data in localStorage');
        return null;
      }
      
      return parsedData;
    } catch (error) {
      console.error('Error parsing auth session from localStorage:', error);
      return null;
    }
  }, [isStorageAvailable]);

  // Save session to localStorage
  const saveSessionToStorage = useCallback((sessionData: AuthSession) => {
    if (!isStorageAvailable) return;
    
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
      setSession(sessionData);
    } catch (error) {
      console.error('Error saving auth session to localStorage:', error);
    }
  }, [isStorageAvailable]);

  // Initialize from localStorage
  const refreshFromStorage = useCallback(() => {
    const storageAvailable = checkStorageAvailability();
    setIsStorageAvailable(storageAvailable);
    
    if (storageAvailable) {
      const storedSession = getSessionFromStorage();
      setSession(storedSession);
    }
  }, [checkStorageAvailability, getSessionFromStorage]);

  // Save user data
  const saveUser = useCallback((user: AuthUser) => {
    const currentSession = session || getSessionFromStorage();
    const newSession: AuthSession = {
      user,
      accessToken: currentSession?.accessToken || '',
      isAuthenticated: true,
      onboardingCompleted: user.is_completed_onboarding,
    };
    saveSessionToStorage(newSession);
  }, [session, getSessionFromStorage, saveSessionToStorage]);

  // Save access token
  const saveAccessToken = useCallback((token: string) => {
    const currentSession = session || getSessionFromStorage();
    if (!currentSession?.user) {
      console.warn('Cannot save access token without user data');
      return;
    }
    
    const newSession: AuthSession = {
      ...currentSession,
      accessToken: token,
      isAuthenticated: true,
    };
    saveSessionToStorage(newSession);
  }, [session, getSessionFromStorage, saveSessionToStorage]);

  // Save complete session
  const saveSession = useCallback((sessionData: AuthSession) => {
    saveSessionToStorage(sessionData);
  }, [saveSessionToStorage]);

  // Update user data partially
  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    const currentSession = session || getSessionFromStorage();
    if (!currentSession?.user) {
      console.warn('Cannot update user: no current user data');
      return;
    }
    
    const updatedUser = { ...currentSession.user, ...updates };
    const newSession: AuthSession = {
      ...currentSession,
      user: updatedUser,
      onboardingCompleted: updatedUser.is_completed_onboarding,
    };
    saveSessionToStorage(newSession);
  }, [session, getSessionFromStorage, saveSessionToStorage]);

  // Set onboarding completed status
  const setOnboardingCompleted = useCallback((completed: boolean) => {
    const currentSession = session || getSessionFromStorage();
    if (!currentSession?.user) {
      console.warn('Cannot update onboarding status: no current user data');
      return;
    }
    
    const updatedUser = { 
      ...currentSession.user, 
      is_completed_onboarding: completed 
    };
    const newSession: AuthSession = {
      ...currentSession,
      user: updatedUser,
      onboardingCompleted: completed,
    };
    saveSessionToStorage(newSession);
  }, [session, getSessionFromStorage, saveSessionToStorage]);

  // Clear all auth data
  const clearAuth = useCallback(() => {
    if (!isStorageAvailable) return;
    
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setSession(null);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }, [isStorageAvailable]);

  // Initialize on mount
  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);

  // Derived values
  const user = session?.user || null;
  const accessToken = session?.accessToken || null;
  const isAuthenticated = session?.isAuthenticated || false;
  const onboardingCompleted = session?.onboardingCompleted || false;

  return {
    // Data getters
    user,
    accessToken,
    isAuthenticated,
    onboardingCompleted,
    session,
    
    // Data setters
    saveUser,
    saveAccessToken,
    saveSession,
    updateUser,
    setOnboardingCompleted,
    
    // Utilities
    clearAuth,
    refreshFromStorage,
    isStorageAvailable,
  };
};

export default useAuthStorage;
