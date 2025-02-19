import type { ArticleData } from 'src/types/article';

import { createSlice } from '@reduxjs/toolkit';


const initialState: ArticleData = {
  keywords: {
    primary: '',
    secondary: []
  },
  meta: {
    title: '',
    description: '',
    url: ''
  },
  contextDescription : "",
  tableOfContents : [],
  title : '',
  images: [],
  videos: null,
  generatingSection: null,

};

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    resetArticle: () => initialState
  }
});

export const {resetArticle} = articleSlice.actions;

export default articleSlice.reducer;