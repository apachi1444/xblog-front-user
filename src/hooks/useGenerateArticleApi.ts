import { baseApi } from '../services/apis/baseApi';

// API slice for article generation
export const generateArticleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateArticle: builder.mutation<any, any>({
      query: (data) => ({
        url: '/articles/generate',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGenerateArticleMutation,
} = generateArticleApi;