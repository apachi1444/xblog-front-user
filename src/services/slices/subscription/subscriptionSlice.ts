import type { PayloadAction } from '@reduxjs/toolkit';
import type { SubscriptionPlan, SubscriptionDetails } from 'src/services/apis/subscriptionApi';

import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../../store';

interface SubscriptionState {
  availablePlans: SubscriptionPlan[];
  currentPlan: SubscriptionPlan | null;
  subscriptionDetails: SubscriptionDetails | null;
}

const initialState: SubscriptionState = {
  availablePlans: [],
  currentPlan: null,
  subscriptionDetails: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setAvailablePlans: (state, action: PayloadAction<SubscriptionPlan[]>) => {
      state.availablePlans = action.payload;
    },
    setSubscriptionDetails: (state, action: PayloadAction<SubscriptionDetails>) => {
      state.subscriptionDetails = action.payload;
    },
    setCurrentPlan: (state, action: PayloadAction<SubscriptionPlan | null>) => {
      state.currentPlan = action.payload;
    },
    clearSubscription: (state) => {
      state.availablePlans = [];
      state.currentPlan = null;
      state.subscriptionDetails = null;
    },
  },
});

export const { 
  setAvailablePlans,
  setSubscriptionDetails,
  setCurrentPlan,
  clearSubscription
} = subscriptionSlice.actions;

// Selectors
export const selectAvailablePlans = (state: RootState) => state.subscription.availablePlans;
export const selectCurrentPlan = (state: RootState) => state.subscription.currentPlan;
export const selectSubscriptionDetails = (state: RootState) => state.subscription.subscriptionDetails;

export default subscriptionSlice.reducer;