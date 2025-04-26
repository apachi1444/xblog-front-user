import { api } from '.';
import type { ArticleTemplate } from 'src/sections/templates/template-types';

const TEMPLATES_BASE_URL = '/templates';

interface UseTemplateRequest {
  template_id: number;
}

interface UseTemplateResponse {
  success: boolean;
  message?: string;
}

export const templatesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all available templates
    getTemplates: builder.query<ArticleTemplate[], void>({
      query: () => ({
        url: TEMPLATES_BASE_URL,
        method: 'GET',
      }),
    }),

    // Get template by ID
    getTemplateById: builder.query<ArticleTemplate, string>({
      query: (templateId) => ({
        url: `${TEMPLATES_BASE_URL}/${templateId}`,
        method: 'GET',
      }),
    }),

    // Use template
    useTemplate: builder.mutation<UseTemplateResponse, UseTemplateRequest>({
      query: (data) => ({
        url: TEMPLATES_BASE_URL,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useGetTemplateByIdQuery,
  useUseTemplateMutation,
} = templatesApi;