import type { ArticleLimits } from 'src/types/draft';

import { useMemo } from 'react';

import { useGetSubscriptionDetailsQuery } from 'src/services/apis/subscriptionApi';

/**
 * Hook to manage article creation limits
 * Checks subscription details to determine if user can create more articles
 */
export const useArticleLimits = (): ArticleLimits & { isLoading: boolean; error: string | null } => {
  const { 
    data: subscriptionDetails, 
    isLoading, 
    error 
  } = useGetSubscriptionDetailsQuery();

  const limits = useMemo((): ArticleLimits => {
    const articlesCreated = subscriptionDetails?.articles_created || 0;
    const articlesLimit = subscriptionDetails?.articles_limit || 0;
    const articlesRemaining = Math.max(0, articlesLimit - articlesCreated);
    const canCreateMore = articlesRemaining > 0;

    return {
      articlesCreated,
      articlesLimit,
      articlesRemaining,
      canCreateMore,
    };
  }, [subscriptionDetails]);

  return {
    ...limits,
    isLoading,
    error: error ? 'Failed to load subscription details' : null,
  };
};
