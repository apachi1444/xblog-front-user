import type { RootState } from 'src/services/store';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useGetSubscriptionPlansQuery } from 'src/services/apis/subscriptionApi';
import { setAvailablePlans } from 'src/services/slices/subscription/subscriptionSlice';

/**
 * Hook to initialize and cache subscription plans in Redux store
 * This ensures plans are available throughout the app lifecycle
 */
export function useInitializePlans() {
  const dispatch = useDispatch();
  const availablePlans = useSelector((state: RootState) => state.subscription.availablePlans);

  // Fetch plans from API
  const { data: plansData, isSuccess } = useGetSubscriptionPlansQuery();

  useEffect(() => {
    // Only update Redux if we have new data and the store is empty or different
    if (isSuccess && plansData && plansData.length > 0) {
      // Check if we need to update the store
      const shouldUpdate = 
        availablePlans.length === 0 || 
        JSON.stringify(availablePlans) !== JSON.stringify(plansData);

      if (shouldUpdate) {
        dispatch(setAvailablePlans(plansData));
        console.log('📦 Subscription plans cached in Redux store:', plansData.length, 'plans');
      }
    }
  }, [isSuccess, plansData, availablePlans, dispatch]);

  return {
    plans: availablePlans,
    isLoading: !isSuccess && availablePlans.length === 0,
    isInitialized: availablePlans.length > 0
  };
}
