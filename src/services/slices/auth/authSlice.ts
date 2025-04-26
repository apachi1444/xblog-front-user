import type { AuthUser } from 'src/types/user';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Plan } from 'src/services/apis/plansApi';
import type { SubscriptionDetails } from 'src/services/apis/subscriptionApi';

import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  availablePlans: Plan[];
  subscriptionDetails: SubscriptionDetails | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  onboardingCompleted: false,
  availablePlans: [],
  subscriptionDetails: null,
};

// Create the slice
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
          refreshToken?: string | null;
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
    clearCredentials: (state) => {
      localStorage.removeItem('auth');
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
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
    
    // Add a new reducer to set available plans
    setAvailablePlans: (state, action: PayloadAction<Plan[]>) => {
      state.availablePlans = action.payload;
    },
    setSubscriptionDetails: (state, action: PayloadAction<SubscriptionDetails>) => {
      state.subscriptionDetails = action.payload;
    },
  },
});

export const { 
  setCredentials, 
  logout, 
  clearCredentials,
  setOnboardingCompleted, 
  setAvailablePlans,
  setSubscriptionDetails,
  rehydrateAuth
} = authSlice.actions;

export const selectAvailablePlans = (state: { auth: AuthState }) => state.auth.availablePlans;
export default authSlice.reducer;
