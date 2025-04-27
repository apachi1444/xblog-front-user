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

      localStorage.setItem('auth', JSON.stringify({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        onboardingCompleted: state.onboardingCompleted
      }));
    },
    
    rehydrateAuth: (state) => {
      const savedAuth = localStorage.getItem('auth');
      if (savedAuth) {
        const parsedAuth = JSON.parse(savedAuth);
        state.user = parsedAuth.user;
        state.accessToken = parsedAuth.accessToken;
        state.isAuthenticated = parsedAuth.isAuthenticated;
        state.onboardingCompleted = parsedAuth.onboardingCompleted;
      }
    },

    setOnboardingCompleted: (state, action: PayloadAction<boolean>) => {
      state.onboardingCompleted = action.payload;
      const savedAuth = localStorage.getItem('auth');
      if (savedAuth) {
        const parsedAuth = JSON.parse(savedAuth);
        localStorage.setItem('auth', JSON.stringify({
          ...parsedAuth,
          onboardingCompleted: action.payload
        }));
      }
    },

    logout: (state) => {
      localStorage.removeItem('auth');
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
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
