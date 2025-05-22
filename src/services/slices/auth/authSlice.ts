import type { AuthUser } from 'src/types/user';
import type { PayloadAction } from '@reduxjs/toolkit';

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
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        onboardingCompleted: state.onboardingCompleted
      }));

      console.log(
        localStorage.getItem('xblog_auth_session_v2')
      );
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
          state.onboardingCompleted = parsedAuth.onboardingCompleted;
        } catch (error) {
          localStorage.removeItem('xblog_auth_session_v2');
        }
      }
    },

    setOnboardingCompleted: (state, action: PayloadAction<boolean>) => {
      state.onboardingCompleted = action.payload;
      const savedAuth = localStorage.getItem('xblog_auth_session_v2');
      if (savedAuth) {
        try {
          const parsedAuth = JSON.parse(savedAuth);
          localStorage.setItem('xblog_auth_session_v2', JSON.stringify({
            ...parsedAuth,
            onboardingCompleted: action.payload
          }));
        } catch (error) {
          // If parsing fails, update with current state
          localStorage.setItem('xblog_auth_session_v2', JSON.stringify({
            user: state.user,
            accessToken: state.accessToken,
            isAuthenticated: state.isAuthenticated,
            onboardingCompleted: action.payload
          }));
        }
      }
    },

    logout: (state) => {
      // Remove both old and new keys for complete cleanup
      localStorage.removeItem('xblog_auth_session_v2');

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
  setOnboardingCompleted,
  rehydrateAuth
} = authSlice.actions;

export default authSlice.reducer;
