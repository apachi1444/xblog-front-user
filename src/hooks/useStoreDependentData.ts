import { useSelector } from 'react-redux';

import { useGetArticlesQuery } from 'src/services/apis/articlesApi';
import { selectCurrentStore } from 'src/services/slices/stores/selectors';

export const useStoreDependentData = () => {
  const currentStore = useSelector(selectCurrentStore);
  
  const { 
    data: articles,
    isLoading: isLoadingArticles 
  } = useGetArticlesQuery({ store_id: currentStore?.id });

  const totalArticles = articles?.drafts_articles.concat(articles.published_articles) ?? []

  return { 
    isStoreSelected: !!currentStore?.id,
    isLoading: isLoadingArticles,
    totalArticles,
  };
};