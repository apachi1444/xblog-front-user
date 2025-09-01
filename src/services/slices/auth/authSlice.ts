import type { AuthUser } from 'src/types/user';

import { createSlice } from '@reduxjs/toolkit';


export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  onboardingCompleted: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: {
        payload: {
          user?: AuthUser | null;
          accessToken: string;
        }
      }
    ) => {
      state.user = action.payload.user || null;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = !!action.payload.accessToken;
      state.onboardingCompleted = action.payload.user?.is_completed_onboarding || false;

      // Set the localStorage flag for onboarding status
      try {
        localStorage.setItem('is_onboarding_completed', state.onboardingCompleted.toString());
      } catch (error) {
        console.warn('Error setting onboarding status in localStorage:', error);
      }

      localStorage.setItem('xblog_auth_session_v2', JSON.stringify({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        onboardingCompleted: state.onboardingCompleted,
        avatar: state.user?.avatar,
      }));
    },

    rehydrateAuth: (state) => {
      // Try to get auth from new secure key first
      const savedAuth = localStorage.getItem('xblog_auth_session_v2');

      if (savedAuth) {
        try {
          const parsedAuth = JSON.parse(savedAuth);
          state.user = parsedAuth.user;
          state.accessToken = parsedAuth.accessToken;
          state.isAuthenticated = parsedAuth.isAuthenticated;

          // Use fallback strategy for onboarding status
          let onboardingCompleted = parsedAuth.onboardingCompleted || parsedAuth.user?.is_completed_onboarding || false;

          // Fallback to localStorage flag if not found in session
          if (!onboardingCompleted) {
            try {
              const localOnboardingStatus = localStorage.getItem('is_onboarding_completed');
              onboardingCompleted = localOnboardingStatus === 'true';
            } catch (error) {
              console.warn('Error reading onboarding status from localStorage:', error);
            }
          }

          state.onboardingCompleted = onboardingCompleted;
        } catch (error) {
          localStorage.removeItem('xblog_auth_session_v2');
        }
      }
    },
    logout: (state) => {
      // Remove both old and new keys for complete cleanup
      localStorage.removeItem('xblog_auth_session_v2');

      // Clear the onboarding status flag
      try {
        localStorage.removeItem('is_onboarding_completed');
      } catch (error) {
        console.warn('Error clearing onboarding status from localStorage:', error);
      }

      // Also clear session storage tokens
      try {
        sessionStorage.removeItem('xblog_secure_session_token_v2_8a7b6c5d4e3f2g1h');
        sessionStorage.removeItem('access_token'); // Legacy token key
      } catch (error) {
        console.error('Error clearing session storage:', error);
      }

      // Clear state
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.onboardingCompleted = false;
    },
  },
});

export const {
  setCredentials,
  logout,
  rehydrateAuth
} = authSlice.actions;

export default authSlice.reducer;
