import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import { toggleMocks } from '../apis';

interface GlobalSliceState {
  isTestMode: boolean;
}

export const initialState: GlobalSliceState = {
  isTestMode: localStorage.getItem('isTestMode') === 'true' || false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setTestMode: (state, action: PayloadAction<boolean>) => {
      state.isTestMode = action.payload;
      localStorage.setItem('isTestMode', action.payload.toString());

      // Automatically toggle mocks when test mode changes
      try {
        toggleMocks(action.payload);
        console.log(`🔧 Mock API ${action.payload ? 'enabled' : 'disabled'} via test mode toggle`);
      } catch (error) {
        console.warn('Failed to toggle mocks:', error);
      }
    },
  },
});

export const { setTestMode } = globalSlice.actions;

export const selectIsTestMode = (state: RootState) => state.global.isTestMode;

export default globalSlice.reducer;
