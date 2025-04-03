import type { Article } from 'src/types/article';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface ArticlesState {
  articles: Article[];
  storeArticles: Record<string, Article[]>; // Map store IDs to their articles
  currentArticle: Article | null;
  loading: boolean;
  error: string | null;
}

const initialState: ArticlesState = {
  articles: [],
  storeArticles: {},
  currentArticle: null,
  loading: false,
  error: null,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setArticles: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload;
    },
    setStoreArticles: (state, action: PayloadAction<{ storeId: string; articles: Article[] }>) => {
      const { storeId, articles } = action.payload;
      state.storeArticles[storeId] = articles;
    },
    addArticle: (state, action: PayloadAction<Article>) => {
      state.articles.push(action.payload);
      
      // If the article has a storeId, add it to that store's articles as well
      if (action.payload.storeId) {
        if (!state.storeArticles[action.payload.storeId]) {
          state.storeArticles[action.payload.storeId] = [];
        }
        state.storeArticles[action.payload.storeId].push(action.payload);
      }
    },
    updateArticle: (state, action: PayloadAction<Article>) => {
      const index = state.articles.findIndex(article => article.id === action.payload.id);
      if (index !== -1) {
        state.articles[index] = action.payload;
      }
      
      // Update in store articles if applicable
      if (action.payload.storeId && state.storeArticles[action.payload.storeId]) {
        const storeIndex = state.storeArticles[action.payload.storeId].findIndex(
          article => article.id === action.payload.id
        );
        if (storeIndex !== -1) {
          state.storeArticles[action.payload.storeId][storeIndex] = action.payload;
        }
      }
    },
    deleteArticle: (state, action: PayloadAction<string>) => {
      const articleToDelete = state.articles.find(article => article.id === action.payload);
      state.articles = state.articles.filter(article => article.id !== action.payload);
      
      // Remove from store articles if applicable
      if (articleToDelete?.storeId && state.storeArticles[articleToDelete.storeId]) {
        state.storeArticles[articleToDelete.storeId] = state.storeArticles[articleToDelete.storeId].filter(
          article => article.id !== action.payload
        );
      }
    },
    setCurrentArticle: (state, action: PayloadAction<Article | null>) => {
      state.currentArticle = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setArticles, 
  setStoreArticles, 
  addArticle, 
  updateArticle, 
  deleteArticle, 
  setCurrentArticle,
  setLoading,
  setError
} = articlesSlice.actions;

export default articlesSlice.reducer;