import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { isAfter, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

import { useGetArticlesQuery } from 'src/services/apis/articlesApi';
import { selectCurrentStore } from 'src/services/slices/stores/selectors';

export interface ScheduledArticle {
  id: number;
  title: string;
  scheduledAt: string;
  status: string;
  timeRemaining?: {
    days: number;
    hours: number;
    minutes: number;
  };
}

export interface UseScheduledArticlesResult {
  nextScheduledArticle: ScheduledArticle | null;
  scheduledArticles: ScheduledArticle[];
  isLoading: boolean;
  error: any;
  refetch: () => void;
}

/**
 * Custom hook to fetch and filter scheduled articles
 * @param status - Optional status to filter articles by (default: 'scheduled')
 * @returns Object containing the next scheduled article, all scheduled articles, loading state, error, and refetch function
 */
export function useScheduledArticles(status: string = 'scheduled'): UseScheduledArticlesResult {
  // Get current store
  const currentStore = useSelector(selectCurrentStore);
  const storeId = currentStore?.id || 1;
  
  // Fetch articles
  const { data: articlesData, isLoading, error, refetch } = useGetArticlesQuery({ store_id: storeId });
  
  // Filter and process scheduled articles
  const scheduledArticles = useMemo(() => {
    if (!articlesData?.articles) return [];
    
    // Filter articles by status - use created_at as scheduled date since scheduledAt doesn't exist in API
    const filtered = articlesData.articles.filter(
      article => article.status === status
    );

    // Add time remaining information and sort by scheduled date (ascending)
    return filtered
      .map(article => {
        const now = new Date();
        const scheduledDate = new Date(article.created_at);

        // Only calculate time remaining for future dates
        const timeRemaining = isAfter(scheduledDate, now)
          ? {
              days: differenceInDays(scheduledDate, now),
              hours: differenceInHours(scheduledDate, now) % 24,
              minutes: differenceInMinutes(scheduledDate, now) % 60,
            }
          : undefined;

        return {
          id: article.id,
          title: article.article_title || article.title || 'Untitled Article',
          scheduledAt: article.created_at,
          status: article.status,
          timeRemaining
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.scheduledAt);
        const dateB = new Date(b.scheduledAt);
        return dateA.getTime() - dateB.getTime();
      });
  }, [articlesData, status]);
  
  // Get the next scheduled article (the first one after sorting)
  const nextScheduledArticle = useMemo(() => scheduledArticles.length > 0 ? scheduledArticles[0] : null, [scheduledArticles]);
  
  return {
    nextScheduledArticle,
    scheduledArticles,
    isLoading,
    error,
    refetch
  };
}
