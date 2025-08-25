// API types and hooks

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// Custom hooks

import { getArticleIdFromParams } from 'src/utils/articleIdEncoder';

// Layout components
import { DashboardContent } from 'src/layouts/dashboard';
// API and selectors
import { useGetArticlesQuery } from 'src/services/apis/articlesApi';
import { selectCurrentStore } from 'src/services/slices/stores/selectors';

// Custom components
import { FeedbackModal } from 'src/components/feedback';

import { STEPS_KEYS } from './constants';
import { GenerateViewForm } from './generate-view-form';
import { StepNavigation } from './components/StepNavigation';
// Types and constants
import { generateArticleSchema, type GenerateArticleFormData } from './schemas';

// Status mapper utility function to handle DTO vs Form schema mismatch
// Article DTO uses: 'draft' | 'publish' | 'scheduled'
// Form schema uses: 'draft' | 'published' | 'scheduled'
const mapDtoStatusToFormStatus = (dtoStatus: 'draft' | 'publish' | 'scheduled'): 'draft' | 'published' | 'scheduled' => {
  switch (dtoStatus) {
    case 'publish':
      return 'published';
    case 'draft':
      return 'draft';
    case 'scheduled':
      return 'scheduled';
    default:
      return 'draft';
  }
};

export function GeneratingView() {
  const [activeStep, setActiveStep] = useState(0);
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  // State to store the generation trigger function
  const [generationTrigger, setGenerationTrigger] = useState<(() => void) | null>(null);

  // Feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSkipped, setFeedbackSkipped] = useState(false);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save functionality
  const setOriginalValuesRef = useRef<((values: GenerateArticleFormData) => void) | null>(null);
  const [autoSaveState, setAutoSaveState] = useState({
    hasChanges: false,
    isSaving: false,
    saveDraft: () => {},
  });

  // Check if we're editing an existing draft article
  const urlArticleId = getArticleIdFromParams(searchParams);
  const isNewArticle = localStorage.getItem('isNewArticle') === 'true';

  // Extract template ID from URL params
  const templateId = searchParams.get('template');

  // Clear localStorage when we have a URL param (editing existing draft)
  useEffect(() => {
    if (urlArticleId) {
      localStorage.removeItem('isNewArticle');
      localStorage.removeItem('articleCreationTimestamp');
      console.log('🧹 Cleared localStorage (editing existing draft)');
    }
  }, [urlArticleId]);

  // Cleanup localStorage when component unmounts
  useEffect(() => () => {
    if (isNewArticle && !urlArticleId) {
      localStorage.removeItem('isNewArticle');
      localStorage.removeItem('articleCreationTimestamp');
    }
    }, [isNewArticle, urlArticleId]);

  // Get current store
  const currentStore = useSelector(selectCurrentStore);
  const storeId = currentStore?.id || 1;

  // Fetch articles (needed for both editing existing and getting latest ID for new articles)
  const { data: articlesData, isLoading: isArticlesLoading } = useGetArticlesQuery({
    store_id: storeId
  });

  // Determine the selected article for form injection (URL takes priority)
  const selectedArticle = useMemo(() => {
    if (urlArticleId && articlesData?.articles) {
      // Editing existing article from URL - fetch its data
      const article = articlesData.articles.find(articleItem =>
        articleItem.id === urlArticleId
      ) || null;
      return article;
    } if (isNewArticle) {
      return null;
    }

    // Default case - no article data
    return null;
  }, [urlArticleId, isNewArticle, articlesData]);

  // Determine articleId for StepNavigation (for update API)
  const articleIdForNavigation = useMemo(() => {
    if (urlArticleId) {
      // Use URL article ID (convert to string for API compatibility)
      return urlArticleId.toString();
    } if (isNewArticle && articlesData?.articles?.length) {
      // For new articles, get the latest article ID (highest ID) for update API
      const latestArticle = articlesData.articles.reduce((latest, current) =>
        current.id > latest.id ? current : latest
      );
      return latestArticle.id.toString();
    }

    return null;
  }, [urlArticleId, isNewArticle, articlesData]);

  // Loading state - only show loading if we're editing an existing article
  const isArticleLoading = urlArticleId ? isArticlesLoading : false;

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
        featuredMedia: '',
      },
      step2: {
        articleType: 'how-to',
        articleSize: 'small',
        toneOfVoice: 'friendly',
        pointOfView: 'first-person',
        plagiaRemoval: false,
        includeCta: false,
        includeImages: true,
        includeVideos: false,
        internalLinks: [],
        externalLinks: [],
      },
      step3: {
        sections: [],
      },
      status: 'draft',
      images: '',
      faq: '',
      toc: '',
      generatedHtml: '',
      template_name: templateId || 'template1', // Use template from URL params or default
      template_id: templateId || 'template1',
      use_single_template: Boolean(templateId), // True if template was selected from URL
    };

    // If we have a draft article, use its values as initial form state
    if (selectedArticle) {
      // Parse links, sections, and toc once
      const internalLinks = parseLinksFromString(selectedArticle.internal_links || '', selectedArticle.id);
      const externalLinks = parseLinksFromString(selectedArticle.external_links || '', selectedArticle.id);
      const sections = parseSectionsFromString(selectedArticle.sections || '');


      const finalContentDescription = selectedArticle.content_description !== null ? (selectedArticle.content_description || '') : baseDefaults.step1.contentDescription;

      return {
        step1: {
          contentDescription: finalContentDescription,
          primaryKeyword: selectedArticle.primary_keyword !== null ? (selectedArticle.primary_keyword || '') : baseDefaults.step1.primaryKeyword,
          secondaryKeywords: selectedArticle.secondary_keywords !== null ? parseSecondaryKeywords(selectedArticle.secondary_keywords || '') : baseDefaults.step1.secondaryKeywords,
          language: selectedArticle.language !== null ? (selectedArticle.language || 'en') : baseDefaults.step1.language,
          targetCountry: selectedArticle.target_country !== null ? (selectedArticle.target_country || 'us') : baseDefaults.step1.targetCountry,
          title: selectedArticle.article_title !== null ? (selectedArticle.article_title || '') : (selectedArticle.title !== null ? (selectedArticle.title || '') : baseDefaults.step1.title),
          metaTitle: selectedArticle.meta_title !== null ? (selectedArticle.meta_title || '') : baseDefaults.step1.metaTitle,
          metaDescription: selectedArticle.meta_description !== null ? (selectedArticle.meta_description || '') : baseDefaults.step1.metaDescription,
          urlSlug: selectedArticle.url_slug !== null ? (selectedArticle.url_slug || '') : baseDefaults.step1.urlSlug,
          featuredMedia: selectedArticle.featured_media !== null ? (selectedArticle.featured_media || '') : baseDefaults.step1.featuredMedia,
        },
        step2: {
          includeCta: selectedArticle.include_cta !== null && selectedArticle.include_cta !== undefined ? selectedArticle.include_cta : baseDefaults.step2.includeCta,
          articleType: selectedArticle.article_type !== null ? (selectedArticle.article_type || 'how-to') : baseDefaults.step2.articleType,
          articleSize: selectedArticle.article_size !== null ? (selectedArticle.article_size || 'small') : baseDefaults.step2.articleSize,
          toneOfVoice: selectedArticle.tone_of_voice !== null ? (selectedArticle.tone_of_voice || 'friendly') : baseDefaults.step2.toneOfVoice,
          pointOfView: selectedArticle.point_of_view !== null ? (selectedArticle.point_of_view || 'first-person') : baseDefaults.step2.pointOfView,
          plagiaRemoval: selectedArticle.plagiat_removal !== null && selectedArticle.plagiat_removal !== undefined ? selectedArticle.plagiat_removal : baseDefaults.step2.plagiaRemoval,
          includeImages: selectedArticle.include_images !== null && selectedArticle.include_images !== undefined ? selectedArticle.include_images : baseDefaults.step2.includeImages,
          includeVideos: selectedArticle.include_videos !== null && selectedArticle.include_videos !== undefined ? selectedArticle.include_videos : baseDefaults.step2.includeVideos,
          internalLinks: selectedArticle.internal_links !== null ? internalLinks : baseDefaults.step2.internalLinks,
          externalLinks: selectedArticle.external_links !== null ? externalLinks : baseDefaults.step2.externalLinks,
        },
        step3: {
          sections: selectedArticle.sections !== null ? sections : baseDefaults.step3.sections,
        },
        images: selectedArticle.images || baseDefaults.images,
        faq: selectedArticle.faq || baseDefaults.faq,
        toc: selectedArticle.toc || baseDefaults.toc,
        generatedHtml: selectedArticle.content || baseDefaults.generatedHtml,
        template_name: selectedArticle.template_name || baseDefaults.template_name,
        template_id: selectedArticle.template_name || templateId || 'template1',
        use_single_template: Boolean(selectedArticle.template_name || templateId),
        status: mapDtoStatusToFormStatus(selectedArticle.status)
      };
    }

    // Return base defaults if no draft article
    return baseDefaults;
  }, [selectedArticle, templateId, parseLinksFromString, parseSecondaryKeywords, parseSectionsFromString]);

  const methods = useForm<GenerateArticleFormData>({
    resolver: zodResolver(generateArticleSchema) as any,
    defaultValues,
  });

  // Reset form when defaultValues change (when switching between articles)
  useEffect(() => {
    methods.reset(defaultValues);

    // Set original values for auto-save after form is reset with article data
    if (selectedArticle && setOriginalValuesRef.current) {
      // Small delay to ensure form is fully reset
      setTimeout(() => {
        if (setOriginalValuesRef.current) {
          setOriginalValuesRef.current(defaultValues);
        }
      }, 100);
    }
  }, [defaultValues, methods, selectedArticle]);

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

  const steps = STEPS_KEYS.map(step => {
    // Define fallback values for each step
    const fallbacks: Record<string, string> = {
      'generate.steps.contentSetup': 'Content Setup',
      'generate.steps.articleSettings': 'Article Settings',
      'generate.steps.publish': 'Publish'
    };

    return {
      id: step.id,
      label: t(step.labelKey, fallbacks[step.labelKey] || 'Step')
    };
  });

  const handleNextStep = () => {
    setActiveStep((prev) => {
      const newStep = Math.min(prev + 1, 3);
      // Scroll to top when moving to next step
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      return newStep;
    });
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => {
      const newStep = Math.max(prev - 1, 0);
      // Scroll to top when moving to previous step
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      return newStep;
    });
  };

  // Callback to receive generation trigger function from GenerateViewForm
  const handleGenerationTrigger = (triggerFunction: () => void) => {
    setGenerationTrigger(() => triggerFunction);
  };

  // Callback to receive setOriginalValues function from GenerateViewForm
  const handleOriginalValuesSet = useCallback((setOriginalValues: (values: GenerateArticleFormData) => void) => {
    setOriginalValuesRef.current = setOriginalValues;
  }, []);

  // Callback to receive auto-save state from GenerateViewForm
  const handleAutoSaveStateChange = useCallback((state: { hasChanges: boolean; isSaving: boolean; saveDraft: () => void }) => {
    setAutoSaveState(state);
  }, []);

  // Feedback modal handlers
  const handleFeedbackSubmit = (rating: number, comment?: string) => {
    console.log('📝 User feedback submitted:', {
      rating,
      comment,
      step: 'content-generation',
      timestamp: new Date().toISOString()
    });
    setShowFeedbackModal(false);
  };

  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
  };

  const handleFeedbackSkip = () => {
    setFeedbackSkipped(true);
    setShowFeedbackModal(false);
    // Clear any existing timeout
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  };

  // Scroll to top when activeStep changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStep]);

  // Feedback modal logic - trigger when user is in step 3 with generated content
  useEffect(() => {
    // Clear any existing timeout when step changes
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }

    // Only show feedback modal in step 3 (index 2) if not already skipped
    if (activeStep === 2 && !feedbackSkipped) {
      const formData = methods.getValues();
      if (formData.generatedHtml && formData.generatedHtml.trim()) {
        console.log("Setting feedback timeout for step 3");
        feedbackTimeoutRef.current = setTimeout(() => {
          setShowFeedbackModal(true);
          feedbackTimeoutRef.current = null;
        }, 20000);
      }
    }

    // Cleanup timeout when component unmounts or step changes
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
        feedbackTimeoutRef.current = null;
      }
    };
  }, [activeStep, feedbackSkipped, methods]);

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
        {/* Header - Hide in step 3 for full immersion */}
        {activeStep !== 2 && (
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              {selectedArticle ? (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Editing Draft: {selectedArticle.article_title || selectedArticle.title || 'Untitled Draft'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created on {new Date(selectedArticle.created_at || Date.now()).toLocaleDateString()}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="h5">
                  Create New Article
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Use the GenerateViewForm component */}
        <FormProvider {...methods}>
          <GenerateViewForm
            activeStep={activeStep}
            steps={steps}
            setActiveStep={setActiveStep}
            onGenerationTrigger={handleGenerationTrigger}
            articleId={articleIdForNavigation}
            isEditMode={!!selectedArticle}
            onOriginalValuesSet={handleOriginalValuesSet}
            onAutoSaveStateChange={handleAutoSaveStateChange}
          />
          {/* Navigation buttons with internal validation logic */}
          <StepNavigation
            activeStep={activeStep}
            totalSteps={steps.length}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            articleId={articleIdForNavigation}
            onTriggerGeneration={generationTrigger || undefined}
            hasChanges={autoSaveState.hasChanges}
            isSaving={autoSaveState.isSaving}
            onSaveDraft={autoSaveState.saveDraft}
            isEditMode={!!selectedArticle}
          />
        </FormProvider>

        {/* Feedback Modal */}
        <FeedbackModal
          open={showFeedbackModal}
          onClose={handleFeedbackClose}
          onSubmit={handleFeedbackSubmit}
          onSkip={handleFeedbackSkip}
        />
    </DashboardContent>
  );
}
