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

      localStorage.setItem('xblog_auth_session_v2', JSON.stringify({
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
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
        } catch (error) {
          localStorage.removeItem('xblog_auth_session_v2');
        }
      }
    },
    logout: (state) => {
      // Remove both old and new keys for complete cleanup
      localStorage.removeItem('xblog_auth_session_v2');

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
