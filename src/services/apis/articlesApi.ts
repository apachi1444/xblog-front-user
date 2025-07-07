import type { Article } from 'src/types/article';

import { api, CACHE_DURATION } from '.';

const ARTICLES_BASE_URL = '/articles';

// Interface for article query parameters
interface ArticleQueryParams {
  store_id?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

// Updated response interface to match the API
interface ArticlesResponse {
  count: number;
  articles: Article[];
}

// Article creation request
export interface CreateArticleRequest {
  title: string;
  content?: string;
  meta_description?: string;
  keywords?: string[];
  status?: 'draft' | 'published';
  website_id?: string;
}

// Article update request
export interface UpdateArticleRequest {
  article_title?: string | null;
  content_description?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  url_slug?: string | null;
  primary_keyword?: string | null;
  secondary_keywords?: string | null;
  target_country?: string;
  language?: string;
  article_type?: string | null;
  article_size?: string | null;
  tone_of_voice?: string | null;
  point_of_view?: string | null;
  plagiat_removal?: boolean;
  include_images?: boolean;
  include_videos?: boolean;
  internal_links?: string | null;
  external_links?: string | null;
  content?: string;
  status?: 'draft' | 'published';
}

// Article creation response
export interface CreateArticleResponse {
  id: string;
  title: string;
  content: string;
  meta_description: string;
  keywords: string[];
  status: 'draft' | 'published';
  website_id: string | null;
  created_at: string;
  updated_at: string;
}

// Article update response
export interface UpdateArticleResponse {
  id: string;
  title: string;
  content: string;
  meta_description: string;
  keywords: string[];
  status: 'draft' | 'published';
  website_id: string | null;
  updated_at: string;
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
      // Cache the articles for 1 hour
      keepUnusedDataFor: CACHE_DURATION.ARTICLES,
      providesTags : ['Articles'],
    }),

    // Create a new article (draft by default)
    createArticle: builder.mutation<CreateArticleResponse, CreateArticleRequest>({
      query: (article) => ({
        url: ARTICLES_BASE_URL,
        method: 'POST',
        body: article,
      }),
      invalidatesTags: ['Articles', 'Subscription'],
    }),

    // Update an existing article
    updateArticle: builder.mutation<UpdateArticleResponse, { id: string; data: UpdateArticleRequest }>({
      query: ({ id, data }) => ({
        url: `${ARTICLES_BASE_URL}/update/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Articles'],
    }),


    deleteArticle: builder.mutation<void, string>({
      query: (id) => ({
        url: `${ARTICLES_BASE_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Articles', 'Subscription'],
    }),

    unscheduleArticle: builder.mutation<Article, { article_id: string; store_id: number }>({
      query: (params) => ({
        url: `${ARTICLES_BASE_URL}/unschedule`,
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['Articles'],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useUnscheduleArticleMutation,
} = articlesApi;
