/**
 * Utility functions to access user data directly from localStorage
 * This avoids the need to use Redux selectors everywhere
 */

// Types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  is_completed_onboarding: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser | null;
  isAuthenticated: boolean;
  avatar?: string | null;
}

// Constants
const AUTH_STORAGE_KEY = 'xblog_auth_session_v2';

/**
 * Check if localStorage is available
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    return typeof window !== 'undefined' && window.localStorage !== undefined;
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
 * Get user avatar from localStorage
 */
export const getStoredUserAvatar = (): string | null => {
  const user = getStoredUser();
  return user?.avatar || null;
};

/**
 * Get user name from localStorage
 */
export const getStoredUserName = (): string | null => {
  const user = getStoredUser();
  return user?.name || null;
};

/**
 * Get user email from localStorage
 */
export const getStoredUserEmail = (): string | null => {
  const user = getStoredUser();
  return user?.email || null;
};

/**
 * Get user ID from localStorage
 */
export const getStoredUserId = (): string | null => {
  const user = getStoredUser();
  return user?.id || null;
};

/**
 * Check if user has completed onboarding
 */
export const getIsOnboardingCompleted = (): boolean => {
  const user = getStoredUser();
  return user?.is_completed_onboarding || false;
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
 * Update user data in localStorage (preserves other session data)
 */
export const updateStoredUser = (userData: AuthUser): void => {
  const currentSession = getAuthSession();
  if (!currentSession) return;

  const updatedSession: AuthSession = {
    ...currentSession,
    user: userData,
    avatar: userData.avatar || null,
  };

  saveAuthSession(updatedSession);
};

/**
 * Clear auth session from localStorage
 */
export const clearAuthSession = (): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing auth session from localStorage:', error);
  }
};

/**
 * Create a new auth session object
 */
export const createAuthSession = (
  user: AuthUser,
  accessToken: string,
  isAuthenticated: boolean = true
): AuthSession => ({
  user,
  accessToken,
  isAuthenticated,
  avatar: user.avatar || null,
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
  typeof session.isAuthenticated === 'boolean'
);

/**
 * Get user display name (fallback to email if name not available)
 */
export const getStoredUserDisplayName = (): string => {
  const user = getStoredUser();
  return user?.name || user?.email || 'User';
};

/**
 * Get user avatar with fallback to default
 */
export const getStoredUserAvatarWithFallback = (): string => {
  const avatar = getStoredUserAvatar();
  return avatar || '/assets/images/avatar/avatar-default.jpg';
};
