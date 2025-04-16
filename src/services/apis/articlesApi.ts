import type { Article } from 'src/types/article';

import { api } from '.';

const ARTICLES_BASE_URL = '/articles';

// Interface for article query parameters
interface ArticleQueryParams {
  store_id?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

// Updated response interface to match the API
interface ArticlesResponse {
  count: number;
  drafts_articles: Article[];
  published_articles: Article[];
}

export const articlesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all articles with optional filtering by store_id
    getArticles: builder.query<ArticlesResponse, ArticleQueryParams | void>({
      query: (params) => ({
        url: `/all${ARTICLES_BASE_URL}/${params?.store_id ?? 1}`,
        method: 'GET',
        params: params || {},
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
  useGetArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articlesApi;