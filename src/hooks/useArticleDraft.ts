import { toast } from 'react-hot-toast';
import { useState, useCallback } from 'react';

import {
  useCreateArticleMutation,
  useUpdateArticleMutation,
  type CreateArticleRequest,
  type UpdateArticleRequest,
  type CreateArticleResponse
} from 'src/services/apis/articlesApi';

interface UseArticleDraftOptions {
  onSave?: (article: CreateArticleResponse) => void;
  onError?: (error: any) => void;
}

interface UseArticleDraftReturn {
  currentArticle: CreateArticleResponse | null;
  hasUnsavedChanges: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isSaving: boolean;
  saveDraft: (formData: any) => Promise<void>;
  setCurrentArticle: (article: CreateArticleResponse | null) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}

export function useArticleDraft(options: UseArticleDraftOptions = {}): UseArticleDraftReturn {
  const { onSave, onError } = options;

  const [createArticle, { isLoading: isCreating }] = useCreateArticleMutation();
  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();

  const [currentArticle, setCurrentArticle] = useState<CreateArticleResponse | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const saveDraft = useCallback(async (formData: any) => {
    try {
      if (!currentArticle) {

        const createData: CreateArticleRequest = {
          title: formData.step1?.title || 'Untitled Article',
          content: formData.step1?.contentDescription || '',
          meta_description: formData.step1?.metaDescription || '',
          keywords: [
            formData.step1?.primaryKeyword || '',
            ...(formData.step1?.secondaryKeywords || [])
          ].filter(Boolean),
          status: 'draft',
          website_id: undefined,
        };

        const response = await createArticle(createData).unwrap();
        console.log('✅ Article created:', response);

        setCurrentArticle(response);
        setHasUnsavedChanges(false);
        onSave?.(response);

        toast.success('Article draft created successfully!');
      } else {

        const updateData: UpdateArticleRequest = {
          title: formData.step1?.title || 'Untitled Article',
          content: formData.step1?.contentDescription || '',
          meta_description: formData.step1?.metaDescription || '',
          keywords: [
            formData.step1?.primaryKeyword || '',
            ...(formData.step1?.secondaryKeywords || [])
          ].filter(Boolean),
          status: 'draft',
          website_id: undefined,
        };

        await updateArticle({
          id: currentArticle.id,
          data: updateData
        }).unwrap();

        console.log('✅ Article updated');
        setHasUnsavedChanges(false);

        toast.success('Article saved successfully!');
      }
    } catch (error) {
      onError?.(error);
      toast.error('Failed to save article');
      throw error;
    }
  }, [currentArticle, createArticle, updateArticle, onSave, onError]);

  const isSaving = isCreating || isUpdating;

  return {
    currentArticle,
    hasUnsavedChanges,
    isCreating,
    isUpdating,
    isSaving,
    saveDraft,
    setCurrentArticle,
    setHasUnsavedChanges,
  };
}
