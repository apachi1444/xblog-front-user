import type { Step1State } from "src/sections/generate/generate-steps/steps/Step1ContentSetup";

import { useState, useCallback, useMemo } from "react";

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

import { useSEOScoring } from "src/hooks/useSEOScoring";

import { Iconify } from "src/components/iconify";

import { PreviewSEOTab } from "./PreviewSEOTab";
import { RealTimeScoringTab } from "./RealTimeScoringTab";

// Types
interface SEODashboardProps {
  state: Step1State;
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

export function SEODashboard({ state }: SEODashboardProps) {
  const {
    form,
    generation: {
      meta: { isGenerating: isGeneratingMeta, onGenerate: onGenerateMeta },
    },
  } = state;

  const { watch } = form;

  const title = watch('title');
  const metaTitle = watch('metaTitle');
  const metaDescription = watch('metaDescription');
  const urlSlug = watch('urlSlug');
  const theme = useTheme();

  // Get real-time SEO scoring - only recalculate when form values change
  const { progressSections, overallScore } = useSEOScoring();

  // State management
  const [tabValue, setTabValue] = useState(0);
  const [showContent, setShowContent] = useState(true);

  // Event handlers
  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  const handleToggleContent = useCallback(() => {
    setShowContent(prevState => !prevState);
  }, []);

  const isGenerateDisabled = false;

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
          <RealTimeScoringTab
            progressSections={progressSections}
            score={overallScore}
          />
        );

      default:
        return null;
    }
  }, [
    tabValue,
    title,
    metaTitle,
    metaDescription,
    urlSlug,
    onGenerateMeta,
    isGeneratingMeta,
    isGenerateDisabled,
    progressSections,
    overallScore
  ]);

  return (
    <Box sx={{
      width: showContent ? "100%" : "40px",
      height: showContent ? null : "100%",
      transition: theme.transitions.create(['width'], {
        duration: theme.transitions.duration.standard,
      }),
    }}>
      <Card
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          overflow: "visible",
          transition: theme.transitions.create(["height"]),
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
              <Tab label={`Real-time Scoring (${overallScore})`} />
            </Tabs>
          )}
        </Box>

        {showContent && (
          <Box
            sx={{
              height: "calc(100% - 46px)",
              bgcolor: "white",
              borderRadius: "0 0 10px 10px",
              overflow: "auto",
              borderLeft: `0.5px solid ${COLORS.border}`,
              borderRight: `0.5px solid ${COLORS.border}`,
              borderBottom: `0.5px solid ${COLORS.border}`
            }}
          >
            {tabContent}
          </Box>
        )}

        {!showContent && (
          <Box
            sx={{
              height: "calc(100% - 46px)",
              bgcolor: "white",
              borderRadius: "0 0 10px 10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderLeft: `0.5px solid ${COLORS.border}`,
              borderRight: `0.5px solid ${COLORS.border}`,
              borderBottom: `0.5px solid ${COLORS.border}`
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                transform: "rotate(-90deg)",
                letterSpacing: 1,
                fontWeight: 500
              }}
            >
              Expand
            </Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
}
