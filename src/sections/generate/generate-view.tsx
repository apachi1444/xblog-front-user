// API types and hooks
import type { CreateArticleResponse } from 'src/services/apis/articlesApi';

import { useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// Custom hooks
import { useArticleDraft } from 'src/hooks/useArticleDraft';

// Layout components
import { DashboardContent } from 'src/layouts/dashboard';
// API and selectors
import { useGetArticlesQuery } from 'src/services/apis/articlesApi';
import { selectCurrentStore } from 'src/services/slices/stores/selectors';

// Custom components
import { DraftGuard } from './components/DraftGuard';
import { GenerateViewForm } from './generate-view-form';
import { StepNavigation } from './components/StepNavigation';
// Types
import { generateArticleSchema, type GenerateArticleFormData } from './schemas';


export function GeneratingView() {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if we're editing an existing draft article
  const articleId = searchParams.get('articleId');

  // Get current store
  const currentStore = useSelector(selectCurrentStore);
  const storeId = currentStore?.id || 1;

  // Fetch all articles
  const { data: articlesData, isLoading: isArticlesLoading } = useGetArticlesQuery({
    store_id: storeId
  });

  // Find the specific article by ID from the list
  const selectedArticle = useMemo(() => {
    if (!articleId || !articlesData?.articles) return null;
    return articlesData.articles.find(article =>
      article.id.toString() === articleId.toString()
    ) || null;
  }, [articleId, articlesData]);

  // Loading state - only show loading if we're expecting to find an article
  const isArticleLoading = articleId ? isArticlesLoading : false;

  // Article draft management
  const articleDraft = useArticleDraft({
    onSave: (article) => {
      console.log('✅ Article created:', article);
      navigate(`/generate?articleId=${article.id}`, { replace: true });
    },
    onError: (error) => {
      console.error('❌ Article error:', error);
    }
  });

  // Get default values, potentially from draft
  const getDefaultValues = useCallback((): GenerateArticleFormData => {
    const defaults: GenerateArticleFormData = {
      step1: {
        contentDescription: '',
        primaryKeyword: '',
        secondaryKeywords: [],
        language: 'en-us',
        targetCountry: 'us',
        title: '',
        metaTitle: '',
        metaDescription: '',
        urlSlug: '',
      },
      step2: {
        articleType: 'how-to',
        articleSize: 'small',
        toneOfVoice: 'friendly',
        pointOfView: 'first-person',
        aiContentCleaning: 'no-removal',
        includeImages: true,
        includeVideos: false,
        internalLinks: [],
        externalLinks: [],
      },
      step3: {
        sections: [],
      },
    };

    // If we have selected article (draft), convert it to form format
    if (selectedArticle) {
      return {
        step1: {
          ...defaults.step1,
          title: selectedArticle.title || '',
          contentDescription: selectedArticle.content || '',
          metaDescription: '',
          primaryKeyword: '',
          secondaryKeywords: [],
        },
        step2: { ...defaults.step2 },
        step3: { ...defaults.step3 },
      };
    }

    return defaults;
  }, [selectedArticle]);

  const methods = useForm<GenerateArticleFormData>({
    resolver: zodResolver(generateArticleSchema) as any,
    defaultValues: getDefaultValues(),
  });

  // Load existing article when editing
  useEffect(() => {
    if (selectedArticle) {
      // Editing existing article - load form with data
      const formData = getDefaultValues();
      methods.reset(formData);

      // Set the current article for the draft system
      const articleResponse: CreateArticleResponse = {
        id: selectedArticle.id.toString(),
        title: selectedArticle.title || '',
        content: selectedArticle.content || '',
        meta_description: '',
        keywords: [],
        status: (selectedArticle.status as 'draft' | 'published') || 'draft',
        website_id: null,
        created_at: selectedArticle.created_at,
        updated_at: selectedArticle.created_at,
      };

      articleDraft.setCurrentArticle(articleResponse);
      articleDraft.setHasUnsavedChanges(false);
    }
  }, [selectedArticle, getDefaultValues, methods, articleDraft]);

  // Watch for form changes to show save button
  useEffect(() => {
    const subscription = methods.watch((data) => {
      // Show save button when form has content (for both new and existing articles)
      const hasContent = data.step1?.title || data.step1?.contentDescription || data.step1?.primaryKeyword;
      if (hasContent) {
        articleDraft.setHasUnsavedChanges(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [methods, articleDraft]);



  const steps = [
    { id: 1, label: "Content Setup" },
    { id: 2, label: "Article Settings" },
    { id: 3, label: "Content Structuring" },
    { id: 4, label: "Publish" }
  ];

  const handleNextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  // Show loading state while fetching article
  if (isArticleLoading) {
    return (
      <DashboardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography variant="body1" color="text.secondary">
            Loading article...
          </Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <DraftGuard>
        {/* Header with draft info */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            {articleDraft.currentArticle && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Editing Draft: {articleDraft.currentArticle.title || 'Untitled Draft'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Created on {new Date(articleDraft.currentArticle.created_at || Date.now()).toLocaleDateString()}
                </Typography>
              </Box>
            )}
            {!articleDraft.currentArticle && (
              <Typography variant="h5">
                Create New Article
              </Typography>
            )}
          </Box>

          {/* Status Indicator Only */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!articleDraft.hasUnsavedChanges && articleDraft.currentArticle && (
              <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                ✓ All changes saved
              </Typography>
            )}
            {articleDraft.hasUnsavedChanges && articleDraft.currentArticle && (
              <Typography variant="body2" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                ● Unsaved changes
              </Typography>
            )}
            {articleDraft.isCreating && (
              <Typography variant="body2" color="info.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                ● Creating article...
              </Typography>
            )}
          </Box>
        </Box>

        {/* Use the GenerateViewForm component */}
        <FormProvider {...methods}>
          <GenerateViewForm
            activeStep={activeStep}
            steps={steps}
            setActiveStep={setActiveStep}
          />
          {/* Navigation buttons with internal validation logic */}
          <StepNavigation
            activeStep={activeStep}
            totalSteps={steps.length}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            hasUnsavedChanges={articleDraft.hasUnsavedChanges}
            isSaving={articleDraft.isSaving}
            onSaveDraft={articleDraft.saveDraft}
          />
        </FormProvider>
      </DraftGuard>
    </DashboardContent>
  );
}
