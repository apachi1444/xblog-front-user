import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

import { CONFIG } from 'src/config-global';

import { toggleMocks } from '../apis';

import type { RootState } from '../store';

interface GlobalSliceState {
  isTestMode: boolean;
}

export const initialState: GlobalSliceState = {
  isTestMode: CONFIG.useMockApi,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setTestMode: (state, action: PayloadAction<boolean>) => {
      // Note: This action is now primarily for UI state management
      // The actual mock API state is controlled by the VITE_USE_MOCK_API environment variable
      state.isTestMode = action.payload;

      // Automatically toggle mocks when test mode changes
      try {
        toggleMocks(action.payload);
        console.log(`🔧 Mock API ${action.payload ? 'enabled' : 'disabled'} via test mode toggle`);
        console.warn('⚠️ Test mode is now controlled by VITE_USE_MOCK_API environment variable. This toggle is for UI state only.');
      } catch (error) {
        console.warn('Failed to toggle mocks:', error);
      }
    },
  },
});

export const { setTestMode } = globalSlice.actions;

export const selectIsTestMode = (state: RootState) => state.global.isTestMode;

export default globalSlice.reducer;
