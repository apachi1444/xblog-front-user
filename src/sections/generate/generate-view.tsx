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
import { SaveDraftToast } from './components/SaveDraftToast';
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
      // Reset unsaved changes flag after successful save
      articleDraft.setHasUnsavedChanges(false);
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

  // Helper function to parse sections from JSON string
  const parseSectionsFromString = useCallback((sectionsString: string) => {
    if (!sectionsString || sectionsString.trim() === '') return [];

    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(sectionsString);
      if (Array.isArray(parsed)) {
        console.log('📋 Parsed sections from draft:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('❌ Error parsing sections JSON:', error);
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

      // Parse links and sections once
      const internalLinks = parseLinksFromString(selectedArticle.internal_links || '', selectedArticle.id);
      const externalLinks = parseLinksFromString(selectedArticle.external_links || '', selectedArticle.id);
      const sections = parseSectionsFromString(selectedArticle.sections || '');

      console.log('📎 Parsed internal links:', internalLinks);
      console.log('📎 Parsed external links:', externalLinks);
      console.log('📋 Parsed sections:', sections);

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
          sections,
        },
      };
    }
    
    return baseDefaults;
  }, [selectedArticle, parseLinksFromString, parseSecondaryKeywords, parseSectionsFromString]);

  const methods = useForm<GenerateArticleFormData>({
    resolver: zodResolver(generateArticleSchema) as any,
    defaultValues,
  });

  // Helper function to deeply compare objects (memoized for performance)
  const hasChanges = useCallback((current: any, initial: any): boolean => {
    if (current === initial) return false;

    if (typeof current !== typeof initial) return true;

    if (Array.isArray(current) && Array.isArray(initial)) {
      if (current.length !== initial.length) return true;
      return current.some((item, index) => hasChanges(item, initial[index]));
    }

    if (typeof current === 'object' && current !== null && initial !== null) {
      const currentKeys = Object.keys(current);
      const initialKeys = Object.keys(initial);

      if (currentKeys.length !== initialKeys.length) return true;

      return currentKeys.some(key => hasChanges(current[key], initial[key]));
    }

    return current !== initial;
  }, []);

  // Stable function to handle form changes
  const handleFormChange = useCallback((data: any, { name, type }: any) => {
    // Trigger on ANY user input change to ANY field
    if (type === 'change' && name) {
      console.log('🔥 Field changed:', name, 'Type:', type);
      // Show save toast immediately when user changes any field
      articleDraft.setHasUnsavedChanges(true);
    }
  }, [articleDraft]);

  // Watch for form changes to show save button
  useEffect(() => {
    const subscription = methods.watch(handleFormChange);
    return () => subscription.unsubscribe();
  }, [methods, handleFormChange]);

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

          {/* Save Draft Toast - appears when there are unsaved changes */}
          <SaveDraftToast
            hasUnsavedChanges={articleDraft.hasUnsavedChanges}
            isSaving={articleDraft.isSaving}
            onSaveDraft={articleDraft.saveDraft}
          />
        </FormProvider>
      </DraftGuard>
    </DashboardContent>
  );
}
