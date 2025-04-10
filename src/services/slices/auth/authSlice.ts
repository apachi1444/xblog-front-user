import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

// Define user interface
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

// Define auth state interface
export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
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
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      
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