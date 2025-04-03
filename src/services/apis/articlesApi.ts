import type { Article } from 'src/types/article';

import { api } from '.';

const ARTICLES_BASE_URL = '/articles';

export const articlesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query<Article[], void>({
      query: () => ({
        url: `${ARTICLES_BASE_URL}/`,
        method: 'GET',
      }),
    }),
    getArticlesByStore: builder.query<Article[], string>({
      query: (storeId) => ({
        url: `${ARTICLES_BASE_URL}/store/${storeId}`,
        method: 'GET',
      }),
    }),
    getArticleById: builder.query<Article, string>({
      query: (id) => ({
        url: `${ARTICLES_BASE_URL}/${id}`,
        method: 'GET',
      }),
    }),
    createArticle: builder.mutation<Article, Partial<Article>>({
      query: (article) => ({
        url: ARTICLES_BASE_URL,
        method: 'POST',
        body: article,
      }),
    }),
    updateArticle: builder.mutation<Article, Partial<Article> & { id: string }>({
      query: ({ id, ...article }) => ({
        url: `${ARTICLES_BASE_URL}/${id}`,
        method: 'PUT',
        body: article,
      }),
    }),
    deleteArticle: builder.mutation<void, string>({
      query: (id) => ({
        url: `${ARTICLES_BASE_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useLazyGetArticlesQuery,
  useGetArticlesByStoreQuery,
  useGetArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articlesApi;