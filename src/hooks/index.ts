// Auth hooks
export { useAuth } from './useAuth';
export { useAuthStorage } from './useAuthStorage';
export { useInvoiceDownload } from './useInvoiceDownload';

// Auth types
export type { AuthUser, AuthSession, UseAuthStorageReturn } from './useAuthStorage';
export type { UseAuthReturn } from './useAuth';

// Auth utilities (re-export from utils)
export {
  getAuthSession,
  getStoredUser,
  getStoredAccessToken,
  getIsAuthenticated,
  getOnboardingCompleted,
  saveAuthSession,
  saveUserToStorage,
  saveAccessTokenToStorage,
  updateStoredUser,
  setOnboardingCompletedInStorage,
  clearAuthStorage,
  getUserAvatar,
  getUserDisplayName,
  getUserEmail,
  hasCompletedOnboarding,
  createAuthSession,
  isValidAuthSession,
  isLocalStorageAvailable,
} from '../utils/authStorage';
