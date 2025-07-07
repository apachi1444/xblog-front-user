import {
  useUpdateArticleMutation,
  type UpdateArticleRequest,
} from 'src/services/apis/articlesApi';

interface UseArticleDraftReturn {
  updateArticle: (articleId: string, requestBody: UpdateArticleRequest) => Promise<any>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: any;
}

export function useArticleDraft(): UseArticleDraftReturn {
  const [updateArticleMutation, { isLoading, isSuccess, isError, error }] = useUpdateArticleMutation();

  const updateArticle = async (articleId: string, requestBody: UpdateArticleRequest) => {
    try {
      const result = await updateArticleMutation({
        id: articleId,
        data: requestBody
      }).unwrap();

      return result;
    } catch (err) {
      console.error('Failed to update article:', err);
      throw err;
    }
  };

  return {
    updateArticle,
    isLoading,
    isSuccess,
    isError,
    error,
  };
}
