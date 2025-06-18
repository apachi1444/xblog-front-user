import type { Article } from 'src/types/article';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface ArticlesState {
  articles: Article[];
  count: number;
  loading: boolean;
  error: string | null;
}

const initialState: ArticlesState = {
  articles: [],
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
      all_articles?: Article[];
    }>) => {
      const { count, all_articles, } = action.payload;
      state.count = count;

      if (all_articles) {
        state.articles = all_articles;
      }
    },

    addArticle: (state, action: PayloadAction<Article>) => {
      state.articles.push(action.payload);
      state.count += 1;   
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
  addArticle,
  setLoading,
  setError
} = articlesSlice.actions;

export default articlesSlice.reducer;