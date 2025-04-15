import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../store';

interface GlobalSliceState {
  themeMode: 'light' | 'dark';
  language: 'en' | 'pt';
}

// Define the initial state
export const initialState: GlobalSliceState = {
  themeMode: 'light', // Default theme
  language: 'en', // Default language
};

/* eslint-disable no-param-reassign */
const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    
    setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.themeMode = action.payload;
    },

    setLanguage: (state, action: PayloadAction<'en' | 'pt'>) => {
      state.language = action.payload;
    },
  },
});

// Export actions
export const { setThemeMode, setLanguage } = globalSlice.actions;

// Selectors
export const selectGlobalDomain = (state: RootState) => state.global;
export const selectThemeMode = (state: RootState) => state.global.themeMode;
export const selectLanguage = (state: RootState) => state.global.language;

export default globalSlice.reducer;
