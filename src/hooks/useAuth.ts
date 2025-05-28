/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import { useAuthStorage } from './useAuthStorage';
import type { AuthUser } from './useAuthStorage';

export interface UseAuthReturn {
  // User data
  user: AuthUser | null;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  userAvatar: string;
  
  // Auth state
  isAuthenticated: boolean;
  isOnboardingCompleted: boolean;
  accessToken: string | null;
  
  // Actions
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<AuthUser>) => void;
  completeOnboarding: () => void;
  
  // Utilities
  isLoading: boolean;
}

/**
 * Simplified auth hook for common use cases
 * Provides easy access to user data and auth actions
 */
export const useAuth = (): UseAuthReturn => {
  const {
    user,
    accessToken,
    isAuthenticated,
    onboardingCompleted,
    saveSession,
    updateUser,
    setOnboardingCompleted,
    clearAuth,
    isStorageAvailable,
  } = useAuthStorage();

  // Derived user data
  const userId = user?.id || null;
  const userEmail = user?.email || null;
  const userName = user?.name || null;
  const userAvatar = user?.avatar || '/assets/images/avatar/avatar-default.jpg';

  // Auth state
  const isOnboardingCompleted = onboardingCompleted;
  const isLoading = !isStorageAvailable; // Consider loading if storage isn't available

  // Login action
  const login = (userData: AuthUser, token: string) => {
    saveSession({
      user: userData,
      accessToken: token,
      isAuthenticated: true,
      onboardingCompleted: userData.is_completed_onboarding,
    });
  };

  // Logout action
  const logout = () => {
    clearAuth();
  };

  // Update profile action
  const updateProfile = (updates: Partial<AuthUser>) => {
    updateUser(updates);
  };

  // Complete onboarding action
  const completeOnboarding = () => {
    setOnboardingCompleted(true);
  };

  return useMemo(() => ({
    // User data
    user,
    userId,
    userEmail,
    userName,
    userAvatar,
    
    // Auth state
    isAuthenticated,
    isOnboardingCompleted,
    accessToken,
    
    // Actions
    login,
    logout,
    updateProfile,
    completeOnboarding,
    
    // Utilities
    isLoading,
  }), [
    user,
    userId,
    userEmail,
    userName,
    userAvatar,
    isAuthenticated,
    isOnboardingCompleted,
    accessToken,
    isLoading,
    login,
    logout,
    updateProfile,
    completeOnboarding,
  ]);
};

export default useAuth;
