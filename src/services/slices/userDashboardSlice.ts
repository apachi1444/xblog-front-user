import type { Store } from 'src/types/store';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface UserPreferences {
  darkMode: boolean;
  language: string;
}

interface RecentActivity {
  id: string;
  type: 'article' | 'edit' | 'share';
  title: string;
  timestamp: number;
}

interface UserDashboardState {
  preferences: UserPreferences;
  recentActivities: RecentActivity[];
  selectedStore: Store | null;
}

const initialState: UserDashboardState = {
  preferences: {
    darkMode: false,
    language: 'en'
  },
  recentActivities: [],
  selectedStore: null,
};

const userDashboardSlice = createSlice({
  name: 'userDashboard',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.preferences.darkMode = !state.preferences.darkMode;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.preferences.language = action.payload;
    },
    // Simplified store selection action
    setSelectedStore: (state, action: PayloadAction<Store>) => {
      state.selectedStore = action.payload;
    },
    addActivity: (state, action: PayloadAction<Omit<RecentActivity, 'timestamp'>>) => {
      state.recentActivities.unshift({
        ...action.payload,
        timestamp: Date.now()
      });
      // Keep only the last 10 activities
      state.recentActivities = state.recentActivities.slice(0, 10);
    },
    clearActivities: (state) => {
      state.recentActivities = [];
    }
  }
});

export const {
  toggleDarkMode,
  setLanguage,
  setSelectedStore,
  addActivity,
  clearActivities
} = userDashboardSlice.actions;

export default userDashboardSlice.reducer;