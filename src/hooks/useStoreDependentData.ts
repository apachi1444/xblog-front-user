import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useLazyGetArticlesQuery } from 'src/services/apis/articlesApi';
import { selectCurrentStore } from 'src/services/slices/stores/selectors';
import { useLazyGetScheduledArticlesQuery } from 'src/services/apis/calendarApis';
// Import other necessary APIs

export const useStoreDependentData = () => {
  const currentStore = useSelector(selectCurrentStore);
  
  const [fetchArticles] = useLazyGetArticlesQuery();
  const [fetchScheduledArticles] = useLazyGetScheduledArticlesQuery();
  // Add other fetch functions as needed

  useEffect(() => {
    if (currentStore?.id) {
      // Refetch all store-dependent data
      const fetchData = async () => {
        try {
          await Promise.all([
            fetchArticles().unwrap(),
            fetchScheduledArticles().unwrap(),
          ]);
        } catch (error) {
          console.error('Failed to fetch store-dependent data:', error);
        }
      };

      fetchData();
    }
  }, [currentStore?.id, fetchArticles, fetchScheduledArticles]);

  return { isStoreSelected: !!currentStore?.id };
};