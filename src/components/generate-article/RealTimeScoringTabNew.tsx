// Custom hooks
import type { GenerateArticleFormData } from "src/sections/generate/schemas";

import { useTranslation } from 'react-i18next';
import { useFormContext } from "react-hook-form";
import { useMemo, useState, useEffect, useCallback } from "react";

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
import { SEO_CRITERIA } from "../../utils/seo-criteria-definitions";

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
}

export function RealTimeScoringTabNew({ totalMaxScore = 100 }: RealTimeScoringTabNewProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const COLORS = getColors(theme);

  // State for the optimization modal
  const [selectedCriterionId, setSelectedCriterionId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use criteria evaluation hook
  const {
    criteriaState,
    totalScore,
    evaluateAllCriteria
  } = useCriteriaEvaluation();

  console.log(criteriaState, " criteria state ! ");

  // Get form data to watch for changes
  const form = useFormContext<GenerateArticleFormData>();
  const formValues = form.watch();

  // Initialize criteria evaluation when the component mounts or form data changes
  useEffect(() => {
    console.log("RealTimeScoringTabNew: Initializing criteria evaluation");
    evaluateAllCriteria();
  }, [
    evaluateAllCriteria,
    formValues?.step1?.primaryKeyword,
    formValues?.step1?.title,
    formValues?.step1?.metaTitle,
    formValues?.step1?.metaDescription,
    formValues?.step1?.urlSlug,
    formValues?.step1?.contentDescription
  ]);


  // We're using a hardcoded value of 98 as the actual max score
  // but we'll display it as 100 for better user understanding

  // Calculate score percentage - always normalize to 100
  const scorePercentage = useMemo(() =>
    // Normalize to 100 using the hardcoded value of 98 as the actual max
    Math.round((totalScore / 98) * 100) || 0
  , [totalScore]);

  // Helper function to determine color based on score
  const getScoreColor = () => {
    if (scorePercentage < 33) return COLORS.error;
    if (scorePercentage < 66) return COLORS.warning;
    return COLORS.success;
  };

  // Handle opening the optimization modal
  const handleOpenModal = useCallback((criterionId: number) => {
    console.log(`Opening optimization modal for criterion ${criterionId}`);
    setSelectedCriterionId(criterionId);
    setIsModalOpen(true);
  }, []);

  // Handle closing the optimization modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
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
                {`${totalScore} / 100`}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Criteria Sections */}
      {Object.values(SEO_CRITERIA).map((group) => (
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
                  isHighlighted={false}
                />
              );
            })}
          </Stack>
        </Box>
      ))}

      {/* Optimization Modal */}
      <OptimizationModal
        open={isModalOpen}
        onClose={handleCloseModal}
        criterionId={selectedCriterionId}
      />
    </CardContent>
  );
}

export default RealTimeScoringTabNew;
