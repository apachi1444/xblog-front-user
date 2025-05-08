import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

// Define the banner types
export enum BannerType {
  SUBSCRIPTION_EXPIRATION = 'subscription_expiration',
  SCHEDULED_ARTICLE = 'scheduled_article'
}

// Define the state interface
interface BannerState {
  // Track which banners have been dismissed in the current session
  dismissedBanners: Record<BannerType, boolean>;
  // Track when banners were last shown (timestamp)
  lastShownTimestamps: Record<BannerType, number | null>;
}

// Initial state - all banners are visible by default (not dismissed)
const initialState: BannerState = {
  dismissedBanners: {
    [BannerType.SUBSCRIPTION_EXPIRATION]: false,
    [BannerType.SCHEDULED_ARTICLE]: false
  },
  lastShownTimestamps: {
    [BannerType.SUBSCRIPTION_EXPIRATION]: null,
    [BannerType.SCHEDULED_ARTICLE]: null
  }
};

// Create the slice
const bannerSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {
    // Mark a banner as dismissed for the current session
    dismissBanner: (state, action: PayloadAction<BannerType>) => {
      state.dismissedBanners[action.payload] = true;
      // Update the last shown timestamp
      state.lastShownTimestamps[action.payload] = Date.now();
    },

    // Reset all banner dismissals (called on app initialization)
    resetBannerDismissals: (state) => {
      Object.keys(state.dismissedBanners).forEach(key => {
        state.dismissedBanners[key as BannerType] = false;
      });
    }
  }
});

// Export actions
export const { dismissBanner, resetBannerDismissals } = bannerSlice.actions;

// Export selectors
export const selectBannerDismissed = (state: RootState, bannerType: BannerType) =>
  state.banners.dismissedBanners[bannerType];

export const selectLastShownTimestamp = (state: RootState, bannerType: BannerType) =>
  state.banners.lastShownTimestamps[bannerType];

// Export reducer
export default bannerSlice.reducer;
