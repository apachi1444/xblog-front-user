import type { AuthUser } from 'src/types/user';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

// Define auth state interface
export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  currentStore?: {
    id: string;
    name: string;
    storesRemaining: number;
    storesTotal: number;
    articlesRemaining: number;
    articlesTotal: number;
  };
}

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  onboardingCompleted: false,
  currentStore: {
    id: '0',
    name: 'My Store',
    storesRemaining: 0,
    storesTotal: 0,
    articlesRemaining: 0,
    articlesTotal: 0
  }
};

const loadAuthState = () => {
  try {
    const serializedAuth = localStorage.getItem('auth');
    if (serializedAuth === null) {
      return initialState;
    }
    return JSON.parse(serializedAuth);
  } catch (err) {
    return initialState;
  }
};


const authSlice = createSlice({
  name: 'auth',
  initialState : loadAuthState(),
  reducers: {
    setCredentials: (
      state, 
      action: { 
        payload: { 
          user?: AuthUser | null; 
          accessToken: string; 
          refreshToken?: string | null;
        } 
      }
    ) => {
      state.user = action.payload.user || null;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = !!action.payload.accessToken;

      // Save to localStorage
      localStorage.setItem('auth', JSON.stringify(state));
    },
    clearCredentials: (state) => {
       // Clear localStorage
       localStorage.removeItem('auth');

      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
    },
    
    setOnboardingCompleted: (state, action: PayloadAction<boolean>) => {
      state.onboardingCompleted = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

// Export actions
export const {
  setCredentials,
  setOnboardingCompleted,
  clearCredentials,
  logout,
} = authSlice.actions;

export default authSlice.reducer;