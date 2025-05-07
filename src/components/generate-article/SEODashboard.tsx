import type { Step1State } from "src/sections/generate/generate-steps/steps/step-one-content-setup";

import { FormProvider } from "react-hook-form";
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

import { useSEOScoring } from "src/sections/generate/hooks/useSEOScoring";

import { PreviewSEOTab } from "./PreviewSEOTab";
import { RealTimeScoringTab } from "./RealTimeScoringTab";

// Types
interface SEODashboardProps {
  state: Step1State;
  defaultTab?: number; // 0 for Preview SEO, 1 for Real-time Scoring
  onCollapseChange?: (collapsed: boolean) => void;
  isCollapsed?: boolean;
}

// Constants
const COLORS = {
  error: "#d81d1d",
  warning: "#ffb20d",
  success: "#2dc191",
  inactive: "#f7f7fa",
  primary: "#5969cf",
  border: "#acb9f9",
  background: "#dbdbfa",
};

export function SEODashboard({
  state,
  defaultTab = 0,
  onCollapseChange,
  isCollapsed
}: SEODashboardProps) {
  const {
    form,
    generation: {
      meta: { isGenerating: isGeneratingMeta, onGenerate: onGenerateMeta },
    },
  } = state;

  // Use the form values directly from the state object
  // This ensures we're using the correct form context
  const {
    primaryKeyword = '',
    secondaryKeywords = [],
    contentDescription = '',
    language = '',
    targetCountry = '',
    title = '',
    metaTitle = '',
    metaDescription = '',
    urlSlug = ''
  } = form.getValues();
  const theme = useTheme();

  const { progressSections, overallScore, totalMaxScore, formattedScore, changedCriteriaIds } = useSEOScoring(form);
  const [tabValue, setTabValue] = useState(defaultTab);

  // Auto-switch to real-time scoring tab when criteria change
  useEffect(() => {
    if (changedCriteriaIds.length > 0) {
      setTabValue(1); // Switch to real-time scoring tab
    }
  }, [changedCriteriaIds]);

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

  const isGenerateDisabled = !primaryKeyword || !secondaryKeywords || !contentDescription || !language || !targetCountry;

  // Memoize tab content to prevent unnecessary re-renders
  const tabContent = useMemo(() => {
    switch (tabValue) {
      case 0:
        return (
          <PreviewSEOTab
            title={title}
            metaTitle={metaTitle}
            metaDescription={metaDescription}
            urlSlug={urlSlug}
            onGenerateMeta={onGenerateMeta}
            isGeneratingMeta={isGeneratingMeta}
            isGenerateDisabled={isGenerateDisabled}
          />
        );

      case 1:
        return (
          <FormProvider {...form}>
            <RealTimeScoringTab
              progressSections={progressSections}
              score={overallScore}
              totalMaxScore={totalMaxScore}
              formattedScore={formattedScore}
              changedCriteriaIds={changedCriteriaIds}
            />
          </FormProvider>
        );

      default:
        return null;
    }
  }, [tabValue, title, metaTitle, metaDescription, urlSlug, onGenerateMeta, isGeneratingMeta, isGenerateDisabled, form, progressSections, overallScore, totalMaxScore, formattedScore, changedCriteriaIds]);

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
              <Tab label={`Real-time Scoring (${formattedScore || overallScore}/${totalMaxScore} pts)`} />
            </Tabs>
          )}
        </Box>

        {showContent && (
          <Box
            sx={{
              flexGrow: 1, // Take all available space
              bgcolor: "white",
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
              bgcolor: "white",
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
