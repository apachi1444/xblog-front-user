import type { RootState } from 'src/services/store';

export const selectAllArticles = (state: RootState) => state.articles.articles;
export const selectArticlesByStore = (state: RootState, storeId: string) => 
  state.articles.storeArticles[storeId] || [];
export const selectCurrentArticle = (state: RootState) => state.articles.currentArticle;
export const selectArticlesLoading = (state: RootState) => state.articles.loading;
export const selectArticlesError = (state: RootState) => state.articles.error;