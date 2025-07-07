// Import types

import { useCallback } from 'react';

// Import API hooks
import { useGetSubscriptionDetailsQuery } from 'src/services/apis/subscriptionApi';

/**
 * Hook to manage regeneration functionality
 */
export function useRegenerateManager() {
  // Use cached data only - don't trigger new requests
  const {data : subscription} = useGetSubscriptionDetailsQuery(undefined, {
    // Skip if data is already cached and fresh
    skip: false,
    // Don't refetch on mount
    refetchOnMountOrArgChange: false,
  })

  // Get regeneration count from user data
  const regenerationsAvailable = subscription?.regenerations_number || 0;
  const regenerationsTotal = subscription?.regenerations_limit || 10;

  /**
   * Check if user has regenerations available
   */
  const hasRegenerationsAvailable = useCallback(() => regenerationsAvailable > 0, [regenerationsAvailable]);


  return {
    regenerationsAvailable,
    regenerationsTotal,
    hasRegenerationsAvailable,
  };
}
