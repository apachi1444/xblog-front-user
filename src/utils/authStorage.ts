/**
 * Utility functions for authentication localStorage operations
 * These are pure functions that can be used outside of React components
 */

import type { AuthUser, AuthSession } from 'src/hooks/useAuthStorage';

// Constants
export const AUTH_STORAGE_KEY = 'xblog_auth_session_v2';

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get the complete auth session from localStorage
 */
export const getAuthSession = (): AuthSession | null => {
  if (!isLocalStorageAvailable()) return null;
  
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
};

/**
 * Get user data from localStorage
 */
export const getStoredUser = (): AuthUser | null => {
  const session = getAuthSession();
  return session?.user || null;
};

/**
 * Get access token from localStorage
 */
export const getStoredAccessToken = (): string | null => {
  const session = getAuthSession();
  return session?.accessToken || null;
};

/**
 * Check if user is authenticated
 */
export const getIsAuthenticated = (): boolean => {
  const session = getAuthSession();
  return session?.isAuthenticated || false;
};


/**
 * Save complete auth session to localStorage
 */
export const saveAuthSession = (session: AuthSession): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving auth session to localStorage:', error);
  }
};

/**
 * Save user data to localStorage (updates existing session)
 */
export const saveUserToStorage = (user: AuthUser): void => {
  const currentSession = getAuthSession();
  const newSession: AuthSession = {
    user,
    accessToken: currentSession?.accessToken || '',
    isAuthenticated: true,
    onboardingCompleted: user.is_completed_onboarding,
  };
  saveAuthSession(newSession);
};

/**
 * Save access token to localStorage (updates existing session)
 */
export const saveAccessTokenToStorage = (token: string): void => {
  const currentSession = getAuthSession();
  if (!currentSession?.user) {
    console.warn('Cannot save access token without user data');
    return;
  }
  
  const newSession: AuthSession = {
    ...currentSession,
    accessToken: token,
    isAuthenticated: true,
  };
  saveAuthSession(newSession);
};

/**
 * Update user data partially
 */
export const updateStoredUser = (updates: Partial<AuthUser>): void => {
  const currentSession = getAuthSession();
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
  saveAuthSession(newSession);
};

/**
 * Update onboarding completion status
 */
export const setOnboardingCompletedInStorage = (completed: boolean): void => {
  const currentSession = getAuthSession();
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
  saveAuthSession(newSession);
};

/**
 * Clear all auth data from localStorage
 */
export const clearAuthStorage = (): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

/**
 * Get user avatar URL with fallback
 */
export const getUserAvatar = (fallbackUrl?: string): string => {
  const user = getStoredUser();
  return user?.avatar || fallbackUrl || '/assets/images/avatar/avatar-default.jpg';
};

/**
 * Get user display name with fallback
 */
export const getUserDisplayName = (fallback?: string): string => {
  const user = getStoredUser();
  return user?.name || fallback || 'User';
};

/**
 * Get user email with fallback
 */
export const getUserEmail = (fallback?: string): string => {
  const user = getStoredUser();
  return user?.email || fallback || '';
};

/**
 * Check if user has completed onboarding
 */
export const hasCompletedOnboarding = (): boolean => {
  const user = getStoredUser();
  return user?.is_completed_onboarding || false;
};

/**
 * Create a new auth session
 */
export const createAuthSession = (
  user: AuthUser,
  accessToken: string,
  isAuthenticated: boolean = true
): AuthSession => ({
    user,
    accessToken,
    isAuthenticated,
    onboardingCompleted: user.is_completed_onboarding,
  });

/**
 * Validate auth session data
 */
export const isValidAuthSession = (session: any): session is AuthSession => (
    session &&
    typeof session === 'object' &&
    session.user &&
    typeof session.user.id === 'string' &&
    typeof session.user.email === 'string' &&
    typeof session.user.name === 'string' &&
    typeof session.accessToken === 'string' &&
    typeof session.isAuthenticated === 'boolean' &&
    typeof session.onboardingCompleted === 'boolean'
  );
