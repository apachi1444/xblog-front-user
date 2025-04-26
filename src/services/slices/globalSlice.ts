import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../store';

interface GlobalSliceState {
  isDarkMode: boolean;
  language: string;
  isTestMode: boolean;
}

export const initialState: GlobalSliceState = {
  isDarkMode: false,
  language: 'en',
  isTestMode: localStorage.getItem('isTestMode') === 'true' || false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setThemeMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setTestMode: (state, action: PayloadAction<boolean>) => {
      state.isTestMode = action.payload;
      localStorage.setItem('isTestMode', action.payload.toString());
    },
  },
});

export const { setThemeMode, setLanguage, setTestMode } = globalSlice.actions;

// Selectors
export const selectGlobalDomain = (state: RootState) => state.global;
export const selectThemeMode = (state: RootState) => state.global.isDarkMode;
export const selectLanguage = (state: RootState) => state.global.language;
export const selectIsTestMode = (state: RootState) => state.global.isTestMode;

export default globalSlice.reducer;
