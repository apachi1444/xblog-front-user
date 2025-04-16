import type { RootState } from 'src/services/store';

export const selectAllArticles = (state: RootState) => state.articles.articles;
export const selectDraftArticles = (state: RootState) => state.articles.draftArticles;
export const selectPublishedArticles = (state: RootState) => state.articles.publishedArticles;
export const selectArticleCount = (state: RootState) => state.articles.count;
export const selectArticlesByStore = (state: RootState, storeId: string) => 
  state.articles.storeArticles[storeId] || [];
export const selectCurrentArticle = (state: RootState) => state.articles.currentArticle;
export const selectArticlesLoading = (state: RootState) => state.articles.loading;
export const selectArticlesError = (state: RootState) => state.articles.error;