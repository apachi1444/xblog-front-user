import type { Article } from 'src/types/article';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface ArticlesState {
  articles: Article[];
  draftArticles: Article[];
  publishedArticles: Article[];
  storeArticles: Record<string, Article[]>; // Map store IDs to their articles
  currentArticle: Article | null;
  count: number;
  loading: boolean;
  error: string | null;
}

const initialState: ArticlesState = {
  articles: [],
  draftArticles: [],
  publishedArticles: [],
  storeArticles: {},
  currentArticle: null,
  count: 0,
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
    setArticlesResponse: (state, action: PayloadAction<{
      count: number;
      drafts_articles: Article[];
      published_articles: Article[];
    }>) => {
      const { count, drafts_articles, published_articles } = action.payload;
      state.count = count;
      state.draftArticles = drafts_articles;
      state.publishedArticles = published_articles;
      // Combine both for backward compatibility
      state.articles = [...published_articles, ...drafts_articles];
    },
    setStoreArticles: (state, action: PayloadAction<{ storeId: string; articles: Article[] }>) => {
      const { storeId, articles } = action.payload;
      state.storeArticles[storeId] = articles;
    },
    addArticle: (state, action: PayloadAction<Article>) => {
      state.articles.push(action.payload);
      
      // Add to draft or published based on status
      if (action.payload.status === 'draft') {
        state.draftArticles.push(action.payload);
      } else {
        state.publishedArticles.push(action.payload);
      }
      
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
      
      // Update in draft or published arrays
      const draftIndex = state.draftArticles.findIndex(article => article.id === action.payload.id);
      if (draftIndex !== -1) {
        if (action.payload.status === 'draft') {
          state.draftArticles[draftIndex] = action.payload;
        } else {
          // Move from draft to published
          state.draftArticles = state.draftArticles.filter(article => article.id !== action.payload.id);
          state.publishedArticles.push(action.payload);
        }
      } else {
        const publishedIndex = state.publishedArticles.findIndex(article => article.id === action.payload.id);
        if (publishedIndex !== -1) {
          if (action.payload.status === 'published') {
            state.publishedArticles[publishedIndex] = action.payload;
          } else {
            // Move from published to draft
            state.publishedArticles = state.publishedArticles.filter(article => article.id !== action.payload.id);
            state.draftArticles.push(action.payload);
          }
        }
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
      state.draftArticles = state.draftArticles.filter(article => article.id !== action.payload);
      state.publishedArticles = state.publishedArticles.filter(article => article.id !== action.payload);
      
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
  setArticlesResponse,
  setStoreArticles, 
  addArticle, 
  updateArticle, 
  deleteArticle, 
  setCurrentArticle,
  setLoading,
  setError
} = articlesSlice.actions;

export default articlesSlice.reducer;