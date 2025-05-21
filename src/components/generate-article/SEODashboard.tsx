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

import { Iconify } from "src/components/iconify";

import { useCriteriaEvaluation } from "src/sections/generate/hooks/useCriteriaEvaluation";

import { PreviewSEOTab } from "./PreviewSEOTab";
import { RealTimeScoringTabNew } from "./RealTimeScoringTabNew";

// Types
interface SEODashboardProps {
  defaultTab?: number; // 0 for Preview SEO, 1 for Real-time Scoring
  isGeneratingMeta?: boolean;
  onGenerateMeta?: () => Promise<void>;
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
  border: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.primary.lighter,
  background: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.primary.lighter,
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
  const { totalScore, evaluateAllCriteria } = useCriteriaEvaluation(form);


  // Calculate normalized score (out of 100)
  const normalizedScore = useMemo(() =>
    Math.round((totalScore / 98) * 100) || 0,
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

  // Use the isCollapsed prop if provided, otherwise use internal state
  const [internalShowContent, setInternalShowContent] = useState(true);

  // Compute showContent based on props or internal state
  const showContent = isCollapsed !== undefined ? !isCollapsed : internalShowContent;

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  const handleToggleContent = useCallback(() => {
    if (isCollapsed !== undefined && onCollapseChange) {
      // If isCollapsed is controlled by parent, notify parent to change it
      onCollapseChange(!isCollapsed);
    } else {
      // Otherwise, toggle internal state
      setInternalShowContent(!internalShowContent);
    }
  }, [isCollapsed, internalShowContent, onCollapseChange]);

  const isGenerateDisabled = !formValues.primaryKeyword || !formValues.secondaryKeywords.length || !formValues.contentDescription || !formValues.language || !formValues.targetCountry;

  // Memoize tab content to prevent unnecessary re-renders
  const tabContent = useMemo(() => {
    switch (tabValue) {
      case 0:
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

      case 1:
        return (
          <FormProvider {...form}>
            <RealTimeScoringTabNew/>
          </FormProvider>
        );

      default:
        return null;
    }
  }, [tabValue, formValues, onGenerateMeta, isGeneratingMeta, isGenerateDisabled, form]);

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
            bgcolor: COLORS.background,
            width: "100%",
            borderRadius: "10px 10px 0 0",
            p: 0.5,
            display: "flex",
            alignItems: "center",
            justifyContent: showContent ? "flex-start" : "center",
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
                  borderRadius: "5px",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: COLORS.primary,
                  textTransform: "none",
                  py: 0.5,
                  px: 1.5,
                  flexGrow: 1,
                  maxWidth: 'none',
                },
                "& .Mui-selected": {
                  bgcolor: "white",
                  borderRadius: "5px",
                },
                "& .MuiTabs-indicator": {
                  display: "none",
                },
              }}
            >
              <Tab label="Preview SEO" />
              <Tab label={`Real-time Scoring (${formattedScore})`} />
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
