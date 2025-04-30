import type { RootState } from 'src/services/store';

export const selectAllArticles = (state: RootState) => state.articles.articles;
export const selectArticleCount = (state: RootState) => state.articles.count;
export const selectArticlesLoading = (state: RootState) => state.articles.loading;
export const selectArticlesError = (state: RootState) => state.articles.error;