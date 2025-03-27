import React, { useState } from "react";

import Add from "@mui/icons-material/Add";
import Menu from "@mui/icons-material/Menu";
import Remove from "@mui/icons-material/Remove";
import Warning from "@mui/icons-material/Warning";
import CheckCircle from "@mui/icons-material/CheckCircle";
import HelpOutline from "@mui/icons-material/HelpOutline";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import {
  Box,
  Tab,
  Card,
  Tabs,
  Stack,
  Divider,
  IconButton,
  Typography,
  CardContent,
  LinearProgress,
} from "@mui/material";

interface SEODashboardProps {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  urlSlug?: string;
  currentStep?: number; // Add current step prop
  isVisible?: boolean; // Add visibility control
}

export function SEODashboard({ 
  title, 
  metaTitle, 
  metaDescription, 
  urlSlug,
  currentStep = 0,
  isVisible = true
}: SEODashboardProps) {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: any, newValue: React.SetStateAction<number>) => {
    setTabValue(newValue);
  };

  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  // Determine dashboard features based on current step
  const isPreviewEnabled = currentStep !== 1; // Disable preview in Article Settings step
  const isPreviewSEOEnabled = currentStep === 0 || currentStep === 3; // Enable in Content Setup and Publish steps
  const isRealTimeScoringEnabled = currentStep === 2 || currentStep === 3; // Enable in Content Structuring and Publish steps

  // If not visible, return null
  if (!isVisible) {
    return null;
  }

  // Data for notification items
  const notificationItems = [
    {
      id: 1,
      icon: <ErrorOutline sx={{ color: "white" }} />,
      bgColor: "#d81d1d",
      text: "You seem not to be using a table of contents",
      action: "Fix",
    },
    {
      id: 2,
      icon: <CheckCircle sx={{ color: "white" }} />,
      bgColor: "#2dc191",
      text: "You seem not to be using a table of contents",
      action: null,
    },
    {
      id: 3,
      icon: <Warning sx={{ color: "white" }} />,
      bgColor: "#ffb20d",
      text: "You seem not to be using a table of contents",
      action: "Optimize",
    },
  ];

  // Data for progress sections
  const progressSections = [
    {
      id: 1,
      title: "Title Readability",
      progress: 20,
      color: "#d81d1d",
    },
    {
      id: 2,
      title: "Content Readability",
      progress: 50,
      color: "#ffb20d",
    },
    {
      id: 3,
      title: "Content Readability",
      progress: 0,
      color: "#f7f7fa",
    },
  ];

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      <Card
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          overflow: "visible",
        }}
      >
        {/* Tabs Header */}
        <Box
          sx={{
            bgcolor: "#dbdbfa",
            borderRadius: "10px 10px 0 0",
            p: 0.5,
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton size="small" sx={{ ml: 0.5 }}>
            <Menu fontSize="small" />
          </IconButton>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              minHeight: "40px",
              "& .MuiTab-root": {
                minHeight: "32px",
                borderRadius: "5px",
                fontSize: "12px",
                fontWeight: 500,
                color: "#5969cf",
                textTransform: "none",
                py: 0.5,
                px: 1.5,
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
            <Tab label="Preview Article" />
            <Tab label="Preview SEO" />
            <Tab label="Real-time Scoring" />
          </Tabs>
        </Box>

        {/* Main Content */}
        <CardContent
          sx={{
            height: "calc(100% - 46px)",
            p: 2,
            border: "0.5px solid #acb9f9",
            borderTop: "none",
            borderRadius: "0 0 10px 10px",
          }}
        >
          {/* Gauge */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: 164,
                height: 164,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Gauge background circles */}
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: "1px solid #f0f0f0",
                }}
              />

              {/* Red gauge arc (35% filled) */}
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  clipPath: "polygon(50% 50%, 0 0, 0 50%, 0 100%, 50% 100%)",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    border: "10px solid #d81d1d",
                  }}
                />
              </Box>

              {/* Inner white circle */}
              <Box
                sx={{
                  position: "absolute",
                  width: "70%",
                  height: "70%",
                  borderRadius: "50%",
                  bgcolor: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* Gauge needle */}
                <Box
                  sx={{
                    position: "absolute",
                    width: "40%",
                    height: "2px",
                    bgcolor: "#333",
                    transform: "rotate(125deg)",
                    transformOrigin: "left center",
                    left: "50%",
                  }}
                />

                {/* Center dot */}
                <Box
                  sx={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    bgcolor: "#333",
                  }}
                />
              </Box>

              {/* Min value */}
              <Typography
                sx={{
                  position: "absolute",
                  bottom: "15%",
                  left: "30%",
                  fontSize: "8px",
                  color: "gray.600",
                }}
              >
                00
              </Typography>

              {/* Max value */}
              <Typography
                sx={{
                  position: "absolute",
                  bottom: "15%",
                  right: "30%",
                  fontSize: "8px",
                  color: "gray.600",
                }}
              >
                100
              </Typography>

              {/* Percentage */}
              <Typography
                sx={{
                  position: "absolute",
                  bottom: "5%",
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#d81d1d",
                }}
              >
                35%
              </Typography>
            </Box>
          </Box>

          {/* Basic SEO Section */}
          <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
  <Box 
    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
    onClick={handleToggle}
  >
    <IconButton size="small" sx={{ p: 0, mr: 1 }}>
      {expanded ? <Remove fontSize="small" /> : <Add fontSize="small" />}
    </IconButton>
    <Typography
      variant="body2"
      sx={{ fontSize: '12px', fontWeight: 500, color: 'gray.600' }}
    >
      Basic SEO
    </Typography>
  </Box>
  <Box sx={{ flexGrow: 1 }} />
  <Typography
    variant="body2"
    sx={{ fontSize: '12px', fontWeight: 500, color: 'gray.600' }}
  >
    Progress: 100%
  </Typography>
</Box>
<LinearProgress
            variant="determinate"
            value={100}
            sx={{
              height: 6,
              borderRadius: 2,
              bgcolor: '#f7f7fa',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#2dc191',
                borderRadius: 2,
              },
            }}
          />
    </Box>

         {expanded ? 
          <Stack spacing={2} sx={{ mb: 3 }}>
            {notificationItems.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 36,
                    height: 36,
                    bgcolor: item.bgColor,
                    borderRadius: "4px 0 0 4px",
                  }}
                >
                  {item.icon}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flex: 1,
                    p: 1.5,
                    bgcolor: "white",
                    borderRadius: "0 4px 4px 0",
                    border: "1px solid #f0f0f0",
                    borderLeft: "none",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "12px", color: "gray.600" }}
                  >
                    {item.text}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton size="small">
                      <HelpOutline sx={{ fontSize: 12 }} />
                    </IconButton>
                    {item.action && (
                      <Typography
                        variant="body2"
                        sx={{
                          ml: 1,
                          fontSize: "12px",
                          fontWeight: 500,
                          color: "gray.800",
                        }}
                      >
                        {item.action}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>

          : null}

          {/* Progress Sections */}
          <Stack divider={<Divider />} spacing={2}>
            {progressSections.map((section) => (
              <Box key={section.id}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                   <IconButton size="small" sx={{ p: 0, mr: 1 }}>
                     {expanded ? <Remove fontSize="small" /> : <Add fontSize="small" />}
                    </IconButton>
                    <Typography
                      variant="body2"
                      sx={{
                        ml: 1,
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "gray.600",
                      }}
                    >
                      {section.title}
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "gray.600",
                    }}
                  >
                    Progress: {section.progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={section.progress}
                  sx={{
                    height: 6,
                    borderRadius: 2,
                    bgcolor: "#f7f7fa",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: section.color,
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};