
import type { Store } from 'src/types/store';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

// Helper functions for localStorage persistence
const CURRENT_STORE_KEY = 'currentStore';

const loadCurrentStoreFromStorage = (): Store | null => {
  try {
    const stored = localStorage.getItem(CURRENT_STORE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to load current store from localStorage:', error);
    return null;
  }
};

const saveCurrentStoreToStorage = (store: Store | null): void => {
  try {
    if (store) {
      localStorage.setItem(CURRENT_STORE_KEY, JSON.stringify(store));
    } else {
      localStorage.removeItem(CURRENT_STORE_KEY);
    }
  } catch (error) {
    console.warn('Failed to save current store to localStorage:', error);
  }
};

interface StoreState {
  currentStore: Store | null;
}

const initialState: StoreState = {
  currentStore: loadCurrentStoreFromStorage(),
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setCurrentStore: (state, action: PayloadAction<Store>) => {
      state.currentStore = action.payload;
      // Persist to localStorage
      saveCurrentStoreToStorage(action.payload);
    },
    clearCurrentStore: (state) => {
      state.currentStore = null;
      // Remove from localStorage
      saveCurrentStoreToStorage(null);
    },
  },
});

export const { setCurrentStore, clearCurrentStore } = storeSlice.actions;
export default storeSlice.reducer;
