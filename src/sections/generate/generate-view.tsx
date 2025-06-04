import { useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// Custom hooks
import { useDraftManager } from 'src/hooks/useDraftManager';

// Layout components
import { DashboardContent } from 'src/layouts/dashboard';
// API and selectors
import { useGetArticlesQuery } from 'src/services/apis/articlesApi';
import { selectCurrentStore } from 'src/services/slices/stores/selectors';

// Custom components
import { DraftStatus } from 'src/components/draft-status/DraftStatus';

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

  // Draft management
  const draftManager = useDraftManager({
    autoSaveDelay: 2000,
    enableLocalFallback: true,
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
          contentDescription: selectedArticle.description || '',
          // Note: We'll need to store form data in article metadata or separate field
          // For now, just populate basic fields
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

  // Update form when article data loads
  useEffect(() => {
    if (selectedArticle) {
      // Reset form with article data
      const formData = getDefaultValues();
      methods.reset(formData);

      // Update draft manager state to reflect we're editing an existing article
      if (articleId && draftManager) {
        draftManager.currentDraftId = articleId;
        draftManager.isFirstInput = false;
      }
    }
  }, [selectedArticle, getDefaultValues, methods, articleId, draftManager]);

  // Force save before navigation
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (draftManager.hasUnsavedChanges) {
        await draftManager.forceSave();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [draftManager]);

  const onSubmit = useCallback(async (data: GenerateArticleFormData) => {
    console.log("Form submitted:", data);
    // Force save before submission
    await draftManager.forceSave();
    // Clear draft after successful submission
    draftManager.clearDraft();
    navigate('/blog');
    return Promise.resolve();
  }, [navigate, draftManager]);

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
            {articleId && selectedArticle && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Editing Draft: {selectedArticle.title || 'Untitled Draft'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Created on {new Date(selectedArticle.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            )}
            {!articleId && (
              <Typography variant="h5">
                Create New Article
              </Typography>
            )}
          </Box>

          {/* Draft Status Indicator */}
          <DraftStatus
            status={draftManager.status}
            lastSaved={draftManager.lastSaved}
            compact
          />
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
          />
        </FormProvider>
      </DraftGuard>
    </DashboardContent>
  );
}
