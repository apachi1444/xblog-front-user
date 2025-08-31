/* eslint-disable consistent-return */
// Custom hooks
import type { GenerateArticleFormData } from "src/sections/generate/schemas";

import { useTranslation } from 'react-i18next';
import { useFormContext } from "react-hook-form";
import { useRef, useMemo, useState, useEffect, useCallback } from "react";

import { useTheme } from "@mui/material/styles";
import {
  Box,
  Stack,
  Typography,
  CardContent,
} from "@mui/material";

import { useCriteriaEvaluation } from "src/sections/generate/hooks/useCriteriaEvaluation";

import { ItemSectionNew } from "./ItemSectionNew";
import { OptimizationModal } from "./OptimizationModal";
import { CriterionDetailsModal } from "./CriterionDetailsModal";
import { SEO_CRITERIA, TOTAL_POSSIBLE_SCORE, CRITERIA_TO_INPUT_MAP, INPUT_TO_CRITERIA_MAP } from "../../utils/seo-criteria-definitions";

// Types

// Constants - using theme-aware colors
const getColors = (theme: any) => ({
  error: theme.palette.error.main,
  warning: theme.palette.warning.main,
  success: theme.palette.success.main,
  inactive: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
  pending: theme.palette.mode === 'dark' ? theme.palette.grey[700] : "#e0e0e0",
  primary: theme.palette.primary.main,
  border: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
  background: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.background.paper,
});

interface RealTimeScoringTabNewProps {
  totalMaxScore?: number;
  onCriteriaHighlighted?: (hasHighlighted: boolean) => void;
  activeStep?: number;
}

export function RealTimeScoringTabNew({ totalMaxScore = 100, onCriteriaHighlighted, activeStep = 0 }: RealTimeScoringTabNewProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const COLORS = getColors(theme);

  // State for the modals
  const [selectedCriterionId, setSelectedCriterionId] = useState<number | null>(null);
  const [isOptimizationModalOpen, setIsOptimizationModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // State for highlighting criteria when inputs change
  const [highlightedCriteria, setHighlightedCriteria] = useState<Set<number>>(new Set());
  const previousFormValues = useRef<any>(null);

  // Use criteria evaluation hook
  const {
    criteriaState,
    totalScore,
    evaluateAllCriteria
  } = useCriteriaEvaluation();

  // Get form data to watch for changes
  const form = useFormContext<GenerateArticleFormData>();
  const formValues = form.watch();

  // Function to detect which criteria should be highlighted based on input changes
  const detectChangedCriteria = useCallback((currentValues: any, previousValues: any) => {
    if (!previousValues) return new Set<number>();

    const changedCriteria = new Set<number>();
    const currentStep1 = currentValues?.step1 || {};
    const previousStep1 = previousValues?.step1 || {};

    // Check each input field for changes
    const inputFields = ['primaryKeyword', 'title', 'metaDescription', 'urlSlug', 'contentDescription'];

    inputFields.forEach(field => {
      const currentValue = currentStep1[field] || '';
      const previousValue = previousStep1[field] || '';

      // If the field has changed, add all affected criteria to highlight set
      if (currentValue !== previousValue) {
        const affectedCriteria = INPUT_TO_CRITERIA_MAP[field] || [];
        affectedCriteria.forEach(criteriaId => {
          changedCriteria.add(criteriaId);
        });
      }
    });

    // Check generated content fields for changes
    const generatedContentFields = [
      { key: 'sections', path: 'step3.sections' },
      { key: 'generatedHtml', path: 'generatedHtml' },
      { key: 'images', path: 'images' },
      { key: 'toc', path: 'toc' },
      { key: 'faq', path: 'faq' }
    ];

    generatedContentFields.forEach(({ key, path }) => {
      const currentValue = path.includes('.')
        ? currentValues?.[path.split('.')[0]]?.[path.split('.')[1]]
        : currentValues?.[path];
      const previousValue = path.includes('.')
        ? previousValues?.[path.split('.')[0]]?.[path.split('.')[1]]
        : previousValues?.[path];

      // For arrays, check length and content changes
      if (Array.isArray(currentValue) && Array.isArray(previousValue)) {
        if (currentValue.length !== previousValue.length ||
            JSON.stringify(currentValue) !== JSON.stringify(previousValue)) {
          const affectedCriteria = INPUT_TO_CRITERIA_MAP[key] || [];
          affectedCriteria.forEach(criteriaId => changedCriteria.add(criteriaId));
        }
      } else if (currentValue !== previousValue) {
        const affectedCriteria = INPUT_TO_CRITERIA_MAP[key] || [];
        affectedCriteria.forEach(criteriaId => changedCriteria.add(criteriaId));
      }
    });

    return changedCriteria;
  }, []);

  // Effect to detect form changes and highlight affected criteria
  useEffect(() => {
    if (previousFormValues.current) {
      const changedCriteria = detectChangedCriteria(formValues, previousFormValues.current);

      if (changedCriteria.size > 0) {
        setHighlightedCriteria(changedCriteria);

        // Notify parent that criteria are highlighted
        onCriteriaHighlighted?.(true);

        // Clear highlights after 3 seconds
        const timer = setTimeout(() => {
          setHighlightedCriteria(new Set());
          onCriteriaHighlighted?.(false);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }

    // Update previous values
    previousFormValues.current = formValues;
  }, [formValues, detectChangedCriteria, onCriteriaHighlighted]);

  // Initialize criteria evaluation when the component mounts or form data changes
  useEffect(() => {
    evaluateAllCriteria();
  }, [
    evaluateAllCriteria,
    formValues?.step1?.primaryKeyword,
    formValues?.step1?.title,
    formValues?.step1?.metaTitle,
    formValues?.step1?.metaDescription,
    formValues?.step1?.urlSlug,
    formValues?.step1?.contentDescription,
    // Generated content fields
    formValues?.step3?.sections,
    formValues?.generatedHtml,
    formValues?.images,
    formValues?.toc,
    formValues?.faq,
    // Also watch for changes in the length of arrays to detect additions/removals
    formValues?.step3?.sections?.length,
    formValues?.images?.length,
    formValues?.toc?.length,
    formValues?.faq?.length
  ]);


  // Calculate score percentage - always normalize to 100
  const scorePercentage = useMemo(() =>
    // Normalize to 100 using the actual total possible score
    Math.round((totalScore / TOTAL_POSSIBLE_SCORE) * 100) || 0
  , [totalScore]);

  // Helper function to determine color based on score
  const getScoreColor = () => {
    if (scorePercentage < 33) return COLORS.error;
    if (scorePercentage < 66) return COLORS.warning;
    return COLORS.success;
  };

  // Function to reorder criteria sections based on active step
  const getOrderedCriteriaSections = useMemo(() => {
    const sections = [...SEO_CRITERIA];

    switch (activeStep) {
      case 0: // Step 1: Content Setup
        // Put Title Optimization and SEO Core Essentials first
        return sections.sort((a, b) => {
          const priorityOrder = [3, 1, 2, 4]; // title_optimization, core_essentials, boosters, content_clarity
          const aIndex = priorityOrder.indexOf(a.id);
          const bIndex = priorityOrder.indexOf(b.id);
          return aIndex - bIndex;
        });

      case 1: // Step 2: Article Settings
        // Put SEO Boosters first (contains internal/external links)
        return sections.sort((a, b) => {
          const priorityOrder = [2, 1, 3, 4]; // boosters, core_essentials, title_optimization, content_clarity
          const aIndex = priorityOrder.indexOf(a.id);
          const bIndex = priorityOrder.indexOf(b.id);
          return aIndex - bIndex;
        });

      case 2: // Step 3: Publish
        // Put Content Clarity and SEO Boosters first
        return sections.sort((a, b) => {
          const priorityOrder = [4, 2, 1, 3]; // content_clarity, boosters, core_essentials, title_optimization
          const aIndex = priorityOrder.indexOf(a.id);
          const bIndex = priorityOrder.indexOf(b.id);
          return aIndex - bIndex;
        });

      default:
        // Default order for any other step
        return sections;
    }
  }, [activeStep]);

  // Helper function to get field path and current value for a criterion
  const getCriterionFieldInfo = useCallback((criterionId: number) => {
    const inputKeys = CRITERIA_TO_INPUT_MAP[criterionId];
    if (!inputKeys || inputKeys.length === 0) {
      return { fieldPath: 'step1.title', currentValue: '' }; // fallback
    }

    // Get the primary field (first non-primaryKeyword field or first field)
    const primaryField = inputKeys.find(key => key !== 'primaryKeyword') || inputKeys[0];

    // All current fields are in step1
    const fieldPath = `step1.${primaryField}`;

    // Get current value from form
    const currentValue = formValues?.step1?.[primaryField as keyof typeof formValues.step1] as string || '';

    console.log(`Criterion ${criterionId}: fieldPath=${fieldPath}, currentValue="${currentValue}"`);

    return { fieldPath, currentValue };
  }, [formValues]);

  // Handle opening the appropriate modal based on criterion type
  const handleOpenModal = useCallback((criterionId: number) => {
    console.log(`Opening modal for criterion ${criterionId}`);

    // Find the criterion to check if it's optimizable
    const criterion = SEO_CRITERIA
      .flatMap(section => section.criteria)
      .find(c => c.id === criterionId);

    setSelectedCriterionId(criterionId);

    if (criterion?.optimizable === false) {
      // Open details modal for non-optimizable criteria
      setIsDetailsModalOpen(true);
    } else {
      // Open optimization modal for optimizable criteria
      setIsOptimizationModalOpen(true);
    }
  }, []);

  // Handle closing modals
  const handleCloseOptimizationModal = useCallback(() => {
    setIsOptimizationModalOpen(false);
    setSelectedCriterionId(null);
    // Re-evaluate criteria after modal closes
    evaluateAllCriteria();
  }, [evaluateAllCriteria]);

  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedCriterionId(null);
    // Re-evaluate criteria after modal closes
    evaluateAllCriteria();
  }, [evaluateAllCriteria]);


  return (
    <CardContent
      sx={{
        p: 2,
        border: `0.5px solid ${COLORS.border}`,
        borderTop: "none",
        borderRadius: "0 0 10px 10px",
        bgcolor: theme.palette.background.paper,
      }}
    >
      {/* SEO Score - Enhanced Version */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
          p: 2,
          borderRadius: 2,
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`
            : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          boxShadow: theme.palette.mode === 'dark'
            ? `0 4px 20px 0 rgba(0,0,0,0.3)`
            : `0 4px 20px 0 rgba(0,0,0,0.05)`,
          position: 'relative',
          overflow: 'hidden',
          border: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.grey[800]}` : 'none',

          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${COLORS.error} 0%, ${COLORS.warning} 50%, ${COLORS.success} 100%)`,
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              textAlign: 'center',
              letterSpacing: '0.5px'
            }}
          >
            SEO Performance Score
          </Typography>
        </Box>

        <Box sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          my: 2
        }}>
          {/* Background circle */}
          <Box sx={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: `conic-gradient(
              ${getScoreColor()} ${scorePercentage}%,
              ${theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200]} ${scorePercentage}% 100%
            )`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 15px 0 ${getScoreColor()}${theme.palette.mode === 'dark' ? '40' : '30'}`,
          }}>
            {/* Inner circle with score */}
            <Box sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: theme.palette.mode === 'dark'
                ? theme.palette.grey[900]
                : theme.palette.background.paper,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: theme.palette.mode === 'dark'
                ? 'inset 0 0 15px rgba(0,0,0,0.5), 0 0 10px rgba(255,255,255,0.1)'
                : 'inset 0 0 10px rgba(0,0,0,0.1)',
              border: theme.palette.mode === 'dark'
                ? `3px solid ${theme.palette.grey[800]}`
                : `2px solid ${theme.palette.grey[200]}`,
              position: 'relative',
              zIndex: 1,
            }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: getScoreColor(),
                  textShadow: theme.palette.mode === 'dark'
                    ? '0 0 10px currentColor'
                    : 'none'
                }}
              >
                {scorePercentage}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.8,
                  color: theme.palette.text.secondary,
                  fontWeight: 500
                }}
              >
                {`${scorePercentage} / 100`}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Criteria Sections */}
      {getOrderedCriteriaSections.map((group) => (
        <Box key={group.id} sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {t(group.title)}
            </Typography>
          </Box>

          <Stack spacing={1}>
            {group.criteria.map((criterion) => {
              const result = criteriaState[criterion.id];
              const status = result?.status || 'pending';
              // Get the message from the result or use a default
              const message = result?.message || 'Not evaluated';

              // Check if the message is a translation key (starts with 'seo.')
              const needsTranslation = message.startsWith('seo.');
              const score = result?.score || 0;

              return (
                <ItemSectionNew
                  key={criterion.id}
                  id={criterion.id}
                  status={status}
                  text={t(criterion.description)}
                  score={score}
                  tooltip={needsTranslation ? t(message) : message}
                  onImprove={() => handleOpenModal(criterion.id)}
                  onAdvancedOptimize={handleOpenModal}
                  isHighlighted={highlightedCriteria.has(criterion.id)}
                />
              );
            })}
          </Stack>
        </Box>
      ))}

      {/* Optimization Modal for optimizable criteria */}
      {selectedCriterionId && (
        <OptimizationModal
          open={isOptimizationModalOpen}
          onClose={handleCloseOptimizationModal}
          criterionId={selectedCriterionId}
          fieldPath={getCriterionFieldInfo(selectedCriterionId).fieldPath}
          currentValue={getCriterionFieldInfo(selectedCriterionId).currentValue}
        />
      )}

      {/* Details Modal for non-optimizable criteria */}
      {selectedCriterionId && (
        <CriterionDetailsModal
          open={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          criterionId={selectedCriterionId}
          fieldPath={getCriterionFieldInfo(selectedCriterionId).fieldPath}
          currentValue={getCriterionFieldInfo(selectedCriterionId).currentValue}
        />
      )}
    </CardContent>
  );
}

export default RealTimeScoringTabNew;
