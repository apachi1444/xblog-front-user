import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { differenceInDays } from 'date-fns';

import { useGetSubscriptionDetailsQuery } from 'src/services/apis/subscriptionApi';
import { selectSubscriptionDetails } from 'src/services/slices/subscription/subscriptionSlice';

export interface SubscriptionExpirationResult {
  isExpiringSoon: boolean;
  daysRemaining: number | null;
  expirationDate: Date | null;
  isLoading: boolean;
  error: any;
  refetch: () => void;
}

/**
 * Custom hook to check if the user's subscription is about to expire
 * @param warningThresholdDays - Number of days before expiration to start showing warning (default: 3)
 * @returns Object containing expiration information and loading state
 */
export function useSubscriptionExpiration(warningThresholdDays: number = 3): SubscriptionExpirationResult {
  // Get subscription details from Redux store and API
  const subscriptionDetails = useSelector(selectSubscriptionDetails);
  const { isLoading, error, refetch } = useGetSubscriptionDetailsQuery(undefined, {
    // Don't refetch on mount - use cached data
    refetchOnMountOrArgChange: false,
    // Only fetch if we don't have subscription details in Redux
    skip: !!subscriptionDetails,
  });
  
  // Calculate days remaining and check if expiring soon
  const { isExpiringSoon, daysRemaining, expirationDate } = useMemo(() => {
    // Default values
    const defaultResult = {
      isExpiringSoon: false,
      daysRemaining: null,
      expirationDate: null
    };
    
    // If no subscription details or expiration date, return default values
    if (!subscriptionDetails?.expiration_date) {
      return defaultResult;
    }
    
    try {
      // Parse expiration date
      const expDate = new Date(subscriptionDetails.expiration_date);
      
      // Calculate days remaining
      const now = new Date();
      const days = differenceInDays(expDate, now);
      
      // Check if expiring soon (within threshold days)
      const expiringSoon = days <= warningThresholdDays && days >= 0;
      
      return {
        isExpiringSoon: expiringSoon,
        daysRemaining: days,
        expirationDate: expDate
      };
    } catch (err) {
      console.error('Error calculating subscription expiration:', err);
      return defaultResult;
    }
  }, [subscriptionDetails, warningThresholdDays]);
  
  return {
    isExpiringSoon,
    daysRemaining,
    expirationDate,
    isLoading,
    error,
    refetch
  };
}
