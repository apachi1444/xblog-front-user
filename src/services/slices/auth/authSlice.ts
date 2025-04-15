import type { AuthUser } from 'src/types/user';

import { createSlice } from '@reduxjs/toolkit';

// Define auth state interface
export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
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
  currentStore: {
    id: '1',
    name: 'My Store',
    storesRemaining: 3,
    storesTotal: 5,
    articlesRemaining: 45,
    articlesTotal: 100
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
  initialState: loadAuthState(),
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
      
      // Reset state
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
    }
  }
});

// Export actions
export const {
  setCredentials,
  clearCredentials,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;