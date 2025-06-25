// API types and hooks
import type { CreateArticleResponse } from 'src/services/apis/articlesApi';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
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

import { STEPS_KEYS } from './constants';
// Custom components
import { DraftGuard } from './components/DraftGuard';
import { GenerateViewForm } from './generate-view-form';
import { StepNavigation } from './components/StepNavigation';
// Types and constants
import { generateArticleSchema, type GenerateArticleFormData } from './schemas';


export function GeneratingView() {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  // Check if we're editing an existing draft article
  const articleId = searchParams.get('articleId') || searchParams.get('draft');

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
      navigate('/generate');
    },
    onError: (error) => {
      console.error('❌ Article error:', error);
    }
  });

  // Helper function to parse links from string format with stable IDs
  const parseLinksFromString = useCallback((linksString: string, article_id?: number) => {
    if (!linksString || linksString.trim() === '') return [];

    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(linksString);
      if (Array.isArray(parsed)) {
        return parsed.map((link, index) => ({
          id: `article-${article_id || 'new'}-link-${index}-${link.url?.slice(-10) || 'default'}`,
          url: link.url || link.link_url || '',
          anchorText: link.anchorText || link.anchor_text || link.text || link.label || link.link_text || ''
        })).filter(link => link.url && link.anchorText);
      }
    } catch {
      // If JSON parsing fails, treat as comma-separated URLs
      return linksString.split(',').map((url, index) => ({
        id: `article-${article_id || 'new'}-simple-${index}-${url.slice(-10)}`,
        url: url.trim(),
        anchorText: url.trim()
      })).filter(link => link.url);
    }

    return [];
  }, []);

  // Helper function to parse secondary keywords
  const parseSecondaryKeywords = useCallback((keywordsString: string) => {
    if (!keywordsString || keywordsString.trim() === '') return [];

    try {
      // Try to parse as JSON array first
      const parsed = JSON.parse(keywordsString);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean);
      }
    } catch {
      // If JSON parsing fails, treat as comma-separated string
      return keywordsString.split(',').map(k => k.trim()).filter(Boolean);
    }

    return [];
  }, []);

  // Calculate initial form values - either from draft or defaults
  const defaultValues = useMemo((): GenerateArticleFormData => {
    // Base default values for new articles
    const baseDefaults: GenerateArticleFormData = {
      step1: {
        contentDescription: '',
        primaryKeyword: '',
        secondaryKeywords: [],
        language: 'en', // Default to English for new articles
        targetCountry: 'us', // Default to United States for new articles
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
        plagiaRemoval: false,
        includeImages: true,
        includeVideos: false,
        internalLinks: [],
        externalLinks: [],
      },
      step3: {
        sections: [],
      },
    };

    // If we have a draft article, use its values as initial form state
    if (selectedArticle) {
      console.log('🔄 Using draft article values as initial form state:', selectedArticle);

      // Parse links once
      const internalLinks = parseLinksFromString(selectedArticle.internal_links || '', selectedArticle.id);
      const externalLinks = parseLinksFromString(selectedArticle.external_links || '', selectedArticle.id);

      console.log('📎 Parsed internal links:', internalLinks);
      console.log('📎 Parsed external links:', externalLinks);

      return {
        step1: {
          contentDescription: selectedArticle.content_description || selectedArticle.content || '',
          primaryKeyword: selectedArticle.primary_keyword || '',
          secondaryKeywords: parseSecondaryKeywords(selectedArticle.secondary_keywords || ''),
          language: selectedArticle.language || 'en',
          targetCountry: selectedArticle.target_country || 'us',
          title: selectedArticle.article_title || selectedArticle.title || '',
          metaTitle: selectedArticle.meta_title || '',
          metaDescription: selectedArticle.meta_description || '',
          urlSlug: selectedArticle.url_slug || '',
        },
        step2: {
          articleType: selectedArticle.article_type || 'how-to',
          articleSize: selectedArticle.article_size || 'small',
          toneOfVoice: selectedArticle.tone_of_voice || 'friendly',
          pointOfView: selectedArticle.point_of_view || 'first-person',
          plagiaRemoval: selectedArticle.plagiat_removal || false,
          includeImages: selectedArticle.include_images ?? true,
          includeVideos: selectedArticle.include_videos ?? false,
          internalLinks,
          externalLinks,
        },
        step3: {
          sections: [], // Will be populated if content exists
        },
      };
    }

    // Return base defaults for new article creation
    console.log('📝 Using default values for new article creation');
    return baseDefaults;
  }, [selectedArticle, parseLinksFromString, parseSecondaryKeywords]);

  const methods = useForm<GenerateArticleFormData>({
    resolver: zodResolver(generateArticleSchema) as any,
    defaultValues,
  });

  // Set current article for draft system when selectedArticle changes
  useEffect(() => {
    if (selectedArticle) {
      console.log('📝 Setting current article for draft system:', selectedArticle);

      // Set the current article for the draft system
      const articleResponse: CreateArticleResponse = {
        id: selectedArticle.id.toString(),
        title: selectedArticle.article_title || selectedArticle.title || '',
        content: selectedArticle.content || '',
        meta_description: selectedArticle.meta_description || '',
        keywords: [],
        status: (selectedArticle.status as 'draft' | 'published') || 'draft',
        website_id: null,
        created_at: selectedArticle.created_at,
        updated_at: selectedArticle.created_at,
      };

      articleDraft.setCurrentArticle(articleResponse);
      articleDraft.setHasUnsavedChanges(false);
    }
  }, [selectedArticle, articleDraft]);

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



  // Dynamic steps with translations
  const steps = STEPS_KEYS.map(step => {
    // Define fallback values for each step
    const fallbacks: Record<string, string> = {
      'generate.steps.contentSetup': 'Content Setup',
      'generate.steps.articleSettings': 'Article Settings',
      'generate.steps.contentStructuring': 'Content Structuring',
      'generate.steps.publish': 'Publish'
    };

    return {
      id: step.id,
      label: t(step.labelKey, fallbacks[step.labelKey] || 'Step')
    };
  });

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
