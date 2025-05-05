// Import types

import { useCallback } from 'react';

// Import API hooks
import { useGetSubscriptionDetailsQuery } from 'src/services/apis/subscriptionApi';

/**
 * Hook to manage regeneration functionality
 */
export function useRegenerateManager() {
  const {data : subscription} = useGetSubscriptionDetailsQuery()

  // Get regeneration count from user data
  const regenerationsAvailable = subscription?.regeneration_number || 0;
  const regenerationsTotal = subscription?.regeneration_limit || 10;

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
