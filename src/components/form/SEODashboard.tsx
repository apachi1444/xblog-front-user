import React, { useState, useCallback } from "react";

// Icons
import Add from "@mui/icons-material/Add";
import Menu from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import Remove from "@mui/icons-material/Remove";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
// MUI Components
import {
  Box,
  Tab,
  Card,
  Tabs,
  Stack,
  Button,
  Divider,
  IconButton,
  Typography,
  CardContent,
  LinearProgress,
} from "@mui/material";

import { Iconify } from "src/components/iconify";
import { PreviewSEOTab } from "./PreviewSEOTab";
import { RealTimeScoringTab } from "./RealTimeScoringTab";

// Types
interface SEODashboardProps {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  urlSlug?: string;
  currentStep?: number;
  isVisible?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  onGenerateMeta?: () => void; // Add this prop for generating meta
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

// Types for notification and progress sections



export function SEODashboard({
  title,
  metaTitle,
  metaDescription,
  urlSlug,
  currentStep = 0,
  isVisible = true,
  onCollapseChange,
  onGenerateMeta
}: SEODashboardProps) {
  const theme = useTheme();
  
  // State management
  const [tabValue, setTabValue] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

  // Event handlers
  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  const handleToggleBasicSEO = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  const handleToggleSection = useCallback((sectionId: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  const handleToggleContent = useCallback(() => {
    const newState = !showContent;
    setShowContent(newState);
    // Notify parent component about collapse state change
    if (onCollapseChange) {
      onCollapseChange(newState);
    }
  }, [onCollapseChange, showContent]);

  // If not visible, return null
  if (!isVisible) {
    return null;
  }

  interface ChecklistItem {
    id: number;
    text: string;
    status: "error" | "warning" | "success" | "inactive";
    action?: string | null;
  }

  interface ProgressSection {
    id: number;
    title: string;
    progress: number;
    type: "error" | "warning" | "success" | "inactive";
    items: ChecklistItem[];
  }

  if (!isVisible) {
    return null;
  }

  const progressSections: ProgressSection[] = [
    {
      id: 1,
      title: "Primary SEO Checklist",
      progress: 100,
      type: "success",
      items: [
        {
          id: 101,
          text: "Focus keyword added to meta description",
          status: "success",
          action: null,
        },
        {
          id: 102,
          text: "Focus keyword present in the URL",
          status: "success",
          action: null,
        },
        {
          id: 103,
          text: "Focus keyword appears within the first 10% of content",
          status: "success",
          action: null,
        },
        {
          id: 104,
          text: "Focus keyword used throughout the content",
          status: "success",
          action: null,
        },
        {
          id: 105,
          text: "Content length: 970 words – Good job!",
          status: "success",
          action: null,
        },
        {
          id: 106,
          text: "You seem not to be using a table of contents",
          status: "error",
          action: "Fix",
        },
        {
          id: 107,
          text: "Meta description is well optimized",
          status: "success",
          action: null,
        },
        {
          id: 108,
          text: "You seem not to be using header tags properly",
          status: "warning",
          action: "Optimize",
        },
      ],
    },
    {
      id: 2,
      title: "Title Optimization",
      progress: 20,
      type: "error",
      items: [
        {
          id: 201,
          text: "Primary keyword appears at the start of the title",
          status: "success",
          action: null,
        },
        {
          id: 202,
          text: "Title evokes emotional sentiment (positive or negative)",
          status: "success",
          action: null,
        },
        {
          id: 203,
          text: "Includes at least 2 power words to drive engagement",
          status: "success",
          action: null,
        },
        {
          id: 204,
          text: "Focus keyword included in SEO title",
          status: "success",
          action: null,
        },
        {
          id: 205,
          text: "Title is too short (only 24 characters)",
          status: "error",
          action: "Fix",
        },
      ],
    },
    {
      id: 3,
      title: "Content Presentation Quality",
      progress: 50,
      type: "warning",
      items: [
        {
          id: 301,
          text: "Content uses short, easy-to-read paragraphs",
          status: "success",
          action: null,
        },
        {
          id: 302,
          text: "Content includes media (images and/or videos)",
          status: "success",
          action: null,
        },
        {
          id: 303,
          text: "Proper use of headings and subheadings",
          status: "warning",
          action: "Optimize",
        },
        {
          id: 304,
          text: "Content includes bullet points or numbered lists",
          status: "warning",
          action: "Add",
        },
      ],
    },
    {
      id: 4,
      title: "Additional SEO Factors",
      progress: 0,
      type: "inactive",
      items: [
        {
          id: 401,
          text: "Focus keyword found in subheadings (H2, H3, etc.)",
          status: "inactive",
          action: null,
        },
        {
          id: 402,
          text: "Keyword density is balanced (e.g. 2.47%) with 24 mentions",
          status: "inactive",
          action: null,
        },
        {
          id: 403,
          text: "URL length is optimal (e.g. 47 characters)",
          status: "inactive",
          action: null,
        },
        {
          id: 404,
          text: "You're linking to high-quality external resources",
          status: "inactive",
          action: null,
        },
        {
          id: 405,
          text: "Includes at least one external DoFollow link",
          status: "inactive",
          action: null,
        },
        {
          id: 406,
          text: "Internal links to related content on your website",
          status: "inactive",
          action: null,
        },
      ],
    },
  ];


  // Function to render SEO content based on tab value
  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return (
            <PreviewSEOTab
              title={title}
              metaTitle={metaTitle}
              metaDescription={metaDescription}
              urlSlug={urlSlug}
              onGenerateMeta={onGenerateMeta}
            />
        );
      
      case 1:
        return (
          <RealTimeScoringTab 
            progressSections={progressSections}
            score={35} // You can make this dynamic based on actual calculations
          />
        );
      
      default:
        return null;
  }}

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
            <Menu fontSize="small" />
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
              <Tab label="Real-time Scoring" />
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
            {renderTabContent()}
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
};