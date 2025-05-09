import type { RootState } from 'src/services/store';

import { useDispatch, useSelector } from 'react-redux';

import { BannerType, dismissBanner, selectBannerDismissed } from 'src/services/slices/banners/bannerSlice';

/**
 * Custom hook to manage banner display logic
 * - Provides functions to check if a banner should be displayed
 * - Provides functions to dismiss banners
 *
 * Note: Banner dismissals are reset on page reload in the App component,
 * not on navigation between pages
 */
export function useBannerDisplay() {
  const dispatch = useDispatch();

  // Get banner dismissed states from Redux
  const isSubscriptionBannerDismissed = useSelector(
    (state: RootState) => selectBannerDismissed(state, BannerType.SUBSCRIPTION_EXPIRATION)
  );

  const isScheduledArticleBannerDismissed = useSelector(
    (state: RootState) => selectBannerDismissed(state, BannerType.SCHEDULED_ARTICLE)
  );

  // Function to dismiss a specific banner
  const handleDismissBanner = (bannerType: BannerType) => {
    dispatch(dismissBanner(bannerType));
  };

  return {
    // Banner visibility states
    isSubscriptionBannerVisible: !isSubscriptionBannerDismissed,
    isScheduledArticleBannerVisible: !isScheduledArticleBannerDismissed,

    // Dismiss functions
    dismissSubscriptionBanner: () => handleDismissBanner(BannerType.SUBSCRIPTION_EXPIRATION),
    dismissScheduledArticleBanner: () => handleDismissBanner(BannerType.SCHEDULED_ARTICLE),
  };
}


