import type { GenerateArticleFormData } from "src/sections/generate/schemas";

import { FormProvider, useFormContext } from "react-hook-form";
import { useMemo, useState, useEffect, useCallback } from "react";

// Icons
import { useTheme } from "@mui/material/styles";
// MUI Components
import {
  Box,
  Tab,
  Card,
  Tabs,
  IconButton,
  Typography,
} from "@mui/material";

import { TOTAL_POSSIBLE_SCORE } from "src/utils/seo-criteria-definitions";

import { Iconify } from "src/components/iconify";

import { useCriteriaEvaluation } from "src/sections/generate/hooks/useCriteriaEvaluation";

import { PreviewSEOTab } from "./PreviewSEOTab";
import { RealTimeScoringTabNew } from "./RealTimeScoringTabNew";

// Types
interface SEODashboardProps {
  defaultTab?: number;
  isGeneratingMeta?: boolean;
  onGenerateMeta?: () => Promise<{ metaTitle: string; metaDescription: string; urlSlug: string }>;
  onCollapseChange?: (collapsed: boolean) => void;
  isCollapsed?: boolean;
}

// Constants - using theme-aware colors
const getColors = (theme: any) => ({
  error: theme.palette.error.main,
  warning: theme.palette.warning.main,
  success: theme.palette.success.main,
  inactive: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
  primary: theme.palette.primary.main,
  border: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
  background: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
});

export function SEODashboard({
  defaultTab = 0,
  onCollapseChange,
  isCollapsed,
  isGeneratingMeta,
  onGenerateMeta,
}: SEODashboardProps) {

  const form = useFormContext<GenerateArticleFormData>()
  const formValuesGlobal = form.getValues();
  const formValues = formValuesGlobal.step1

  const theme = useTheme();
  const COLORS = getColors(theme);

  // Use criteria evaluation hook to get score information
  const { totalScore, evaluateAllCriteria } = useCriteriaEvaluation();


  // Calculate normalized score (out of 100)
  const normalizedScore = useMemo(() =>
    Math.round((totalScore / TOTAL_POSSIBLE_SCORE) * 100) || 0,
    [totalScore]
  );

  // Format the score for display - always show as X/100
  const formattedScore = useMemo(() =>
    `${normalizedScore}/100`,
    [normalizedScore]
  );

  useEffect(() => {
    evaluateAllCriteria();
  }, [evaluateAllCriteria]);

  const [tabValue, setTabValue] = useState(defaultTab);
  const [shouldAutoSwitchToScoring, setShouldAutoSwitchToScoring] = useState(false);

  const [internalShowContent, setInternalShowContent] = useState(true);

  const showContent = isCollapsed !== undefined ? !isCollapsed : internalShowContent;

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    if (newValue === 0) {
      evaluateAllCriteria();
    }
  }, [evaluateAllCriteria]);

  const handleToggleContent = useCallback(() => {
    if (isCollapsed !== undefined && onCollapseChange) {
      // If isCollapsed is controlled by parent, notify parent to change it
      onCollapseChange(!isCollapsed);
    } else {
      // Otherwise, toggle internal state
      setInternalShowContent(!internalShowContent);
    }
  }, [isCollapsed, internalShowContent, onCollapseChange]);

  // Handle criteria highlighting callback
  const handleCriteriaHighlighted = useCallback((hasHighlighted: boolean) => {
    if (hasHighlighted) {
      setTabValue(0);
      setShouldAutoSwitchToScoring(true);

      // Also expand the dashboard if it's collapsed
      if (isCollapsed && onCollapseChange) {
        onCollapseChange(false);
      } else if (!showContent) {
        setInternalShowContent(true);
      }
    } else {
      setShouldAutoSwitchToScoring(false);
    }
  }, [isCollapsed, onCollapseChange, showContent]);

  const isGenerateDisabled = !formValues.primaryKeyword || !formValues.secondaryKeywords.length || !formValues.contentDescription || !formValues.language || !formValues.targetCountry;

  // Memoize tab content to prevent unnecessary re-renders
  const tabContent = useMemo(() => {
    switch (tabValue) {
      case 0:
        return (
          <FormProvider {...form}>
            <RealTimeScoringTabNew
              totalMaxScore={totalScore}
              onCriteriaHighlighted={handleCriteriaHighlighted}
            />
          </FormProvider>
          
        );

      case 1:
        return (
          <PreviewSEOTab
            title={formValues.title}
            metaTitle={formValues.metaTitle}
            metaDescription={formValues.metaDescription}
            urlSlug={formValues.urlSlug}
            onGenerateMeta={onGenerateMeta}
            isGeneratingMeta={isGeneratingMeta}
            isGenerateDisabled={isGenerateDisabled}
          />
        );

      default:
        return null;
    }
  }, [tabValue, formValues.title, formValues.metaTitle, formValues.metaDescription, formValues.urlSlug, onGenerateMeta, isGeneratingMeta, isGenerateDisabled, form, totalScore, handleCriteriaHighlighted]);

  return (
    <Box sx={{
      width: showContent ? "100%" : "40px",
      height: "100%", // Always take full height
      minHeight: "600px", // Ensure minimum height even before scrolling
      transition: theme.transitions.create(['width'], {
        duration: theme.transitions.duration.standard,
      }),
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1, // Take available space
    }}>
      <Card
        sx={{
          width: "100%",
          height: "100%", // Take full height of parent
          minHeight: "600px", // Ensure minimum height even before scrolling
          borderRadius: "10px",
          overflow: "visible",
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1, // Take available space
        }}
      >
        {/* Tabs Header - Always visible */}
        <Box
          sx={{
            bgcolor: theme.palette.mode === 'dark'
              ? theme.palette.grey[800]
              : theme.palette.grey[100],
            width: "100%",
            borderRadius: "10px 10px 0 0",
            p: 0.5,
            display: "flex",
            alignItems: "center",
            justifyContent: showContent ? "flex-start" : "center",
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <IconButton
            size="small"
            sx={{ ml: showContent ? 0.5 : 0 }}
            onClick={handleToggleContent}
          >
            {showContent ? (
              <Iconify icon="material-symbols:zoom-in-map-rounded" fontSize="medium" />
            ) : (
              <Iconify icon="material-symbols:zoom-out-map-rounded" fontSize="medium" />
            )}
          </IconButton>

          {showContent && (
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                width: "100%",
                flexGrow: 1,
                "& .MuiTab-root": {
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: theme.palette.mode === 'dark'
                    ? theme.palette.text.primary
                    : theme.palette.text.primary,
                  textTransform: "none",
                  py: 1,
                  px: 2,
                  flexGrow: 1,
                  maxWidth: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.08) 100%)'
                    : 'linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.06) 100%)',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                  '&:hover': {
                    color: theme.palette.mode === 'dark'
                      ? '#ffffff'
                      : theme.palette.primary.main,
                    bgcolor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(102, 126, 234, 0.08)',
                    transform: 'translateY(-1px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 4px 12px rgba(0,0,0,0.3)'
                      : '0 4px 12px rgba(102, 126, 234, 0.15)',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(102, 126, 234, 0.3)'}`,
                  }
                },
                "& .Mui-selected": {
                  color: '#ffffff !important',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important',
                  borderRadius: "8px",
                  fontWeight: 700,
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 6px 20px rgba(102, 126, 234, 0.4)'
                    : '0 6px 20px rgba(102, 126, 234, 0.3)',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(102, 126, 234, 0.6)' : 'rgba(102, 126, 234, 0.4)'} !important`,
                  transform: 'translateY(-2px)',
                  '&:hover': {
                    color: '#ffffff !important',
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%) !important',
                    transform: 'translateY(-2px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 25px rgba(102, 126, 234, 0.5)'
                      : '0 8px 25px rgba(102, 126, 234, 0.4)',
                  }
                },
                "& .MuiTabs-indicator": {
                  display: "none",
                },
              }}
            >
              <Tab label={`Real-time Scoring (${formattedScore})`} />
              <Tab
                label="Preview SEO" 
                sx={shouldAutoSwitchToScoring ? {
                  animation: 'tabHighlight 1.5s ease-in-out',
                  '@keyframes tabHighlight': {
                    '0%': {
                      backgroundColor: 'transparent',
                    },
                    '50%': {
                      backgroundColor: theme.palette.mode === 'dark'
                        ? `${theme.palette.primary.main}20`
                        : `${theme.palette.primary.main}10`,
                    },
                    '100%': {
                      backgroundColor: 'transparent',
                    }
                  }
                } : {}}
              />
            </Tabs>
          )}
        </Box>

        {showContent && (
          <Box
            sx={{
              flexGrow: 1, // Take all available space
              bgcolor: theme.palette.background.paper,
              borderRadius: "0 0 10px 10px",
              overflow: "auto",
              borderLeft: `0.5px solid ${COLORS.border}`,
              borderRight: `0.5px solid ${COLORS.border}`,
              borderBottom: `0.5px solid ${COLORS.border}`,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {tabContent}
          </Box>
        )}

        {!showContent && (
          <Box
            sx={{
              flexGrow: 1, // Take all available space
              bgcolor: theme.palette.background.paper,
              borderRadius: "0 0 10px 10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderLeft: `0.5px solid ${COLORS.border}`,
              borderRight: `0.5px solid ${COLORS.border}`,
              borderBottom: `0.5px solid ${COLORS.border}`,
              position: 'relative', // For positioning the text
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                transform: "rotate(-90deg)",
                letterSpacing: 1,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                position: 'absolute',
                top: '50%',
              }}
            >
              SEO Dashboard
            </Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
}
