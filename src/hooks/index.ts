// Auth hooks
export { useAuth } from './useAuth';
export type { UseAuthReturn } from './useAuth';
export { useAuthStorage } from './useAuthStorage';

// Auth types
export type { AuthUser, AuthSession, UseAuthStorageReturn } from './useAuthStorage';

// Auth utilities (re-export from utils)
export {
  getUserEmail,
  getStoredUser,
  getUserAvatar,
  getAuthSession,
  saveAuthSession,
  updateStoredUser,
  clearAuthStorage,
  saveUserToStorage,
  createAuthSession,
  getIsAuthenticated,
  getUserDisplayName,
  isValidAuthSession,
  getStoredAccessToken,
  getOnboardingCompleted,
  hasCompletedOnboarding,
  isLocalStorageAvailable,
  saveAccessTokenToStorage,
  setOnboardingCompletedInStorage,
} from '../utils/authStorage';
