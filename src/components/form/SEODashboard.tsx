import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import Add from "@mui/icons-material/Add";
import Menu from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import Remove from "@mui/icons-material/Remove";
import Warning from "@mui/icons-material/Warning";
import CheckCircle from "@mui/icons-material/CheckCircle";
import HelpOutline from "@mui/icons-material/HelpOutline";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
// MUI Components
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
  Button,
} from "@mui/material";
import { Iconify } from "src/components/iconify";

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
interface NotificationItem {
  id: number;
  type: "error" | "warning" | "success";
  text: string;
  action: string | null;
}

interface ProgressSection {
  id: number;
  title: string;
  progress: number;
  type: "error" | "warning" | "success" | "inactive";
}

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

  // Data
  const notificationItems: NotificationItem[] = [
    {
      id: 1,
      type: "error",
      text: "You seem not to be using a table of contents",
      action: "Fix",
    },
    {
      id: 2,
      type: "success",
      text: "Meta description is well optimized",
      action: null,
    },
    {
      id: 3,
      type: "warning",
      text: "You seem not to be using header tags properly",
      action: "Optimize",
    },
  ];

  const progressSections: ProgressSection[] = [
    {
      id: 1,
      title: "Title Readability",
      progress: 20,
      type: "error",
    },
    {
      id: 2,
      title: "Content Readability",
      progress: 50,
      type: "warning",
    },
    {
      id: 3,
      title: "Image Optimization",
      progress: 0,
      type: "inactive",
    },
  ];

  // Get icon and color based on notification type
  const getNotificationDetails = (type: "error" | "warning" | "success") => {
    switch (type) {
      case "error":
        return {
          icon: <ErrorOutline sx={{ color: "white" }} />,
          color: COLORS.error,
        };
      case "warning":
        return {
          icon: <Warning sx={{ color: "white" }} />,
          color: COLORS.warning,
        };
      case "success":
        return {
          icon: <CheckCircle sx={{ color: "white" }} />,
          color: COLORS.success,
        };
      default:
        return {
          icon: <HelpOutline sx={{ color: "white" }} />,
          color: COLORS.inactive,
        };
    }
  };

  // Function to render SEO content based on tab value
  const renderTabContent = () => {
    switch (tabValue) {
      case 0: // Preview SEO tab
        return (
          <CardContent sx={{ p: 2 }}>
            {/* If meta information is not generated yet, show empty state */}
            {!metaTitle && !metaDescription && !urlSlug ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 4,
                  textAlign: 'center'
                }}
              >
                {/* Empty state content */}
                <Box 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    borderRadius: '50%',
                    bgcolor: 'primary.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Iconify 
                    icon="eva:alert-triangle-outline" 
                    width={48} 
                    height={48} 
                    sx={{ color: 'primary.main' }} 
                  />
                </Box>
                
                <Typography variant="h6" sx={{ mb: 1 }}>
                  You have to generate the SEO Meta information
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 3
                  }}
                >
                  to see the full preview!
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ 
                    borderRadius: 28,
                    px: 3
                  }}
                  onClick={onGenerateMeta}
                >
                  Generate now !
                </Button>
              </Box>
            ) : (
              // Show SEO preview when meta information is available
              <Box sx={{ width: '100%' }}>
                {/* Google Search Result Preview */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                    Google Search Result Preview
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      p: 2, 
                      border: '1px solid', 
                      borderColor: 'divider',
                      borderRadius: 1,
                      bgcolor: 'background.paper'
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        color: '#1a0dab', 
                        fontSize: '18px',
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {metaTitle || title || 'Title not available'}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#006621', 
                        fontSize: '14px',
                        mb: 0.5 
                      }}
                    >
                      yourdomain.com/{urlSlug || 'url-slug'}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: '14px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {metaDescription || 'Meta description not available. Add a meta description to improve your SEO.'}
                    </Typography>
                  </Box>
                </Box>
                
                {/* SEO Metadata Summary */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                    SEO Metadata
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Title
                      </Typography>
                      <Box 
                        sx={{ 
                          p: 1.5, 
                          bgcolor: 'background.neutral',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography variant="body2">
                          {title || 'Not set'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Meta Title
                      </Typography>
                      <Box 
                        sx={{ 
                          p: 1.5, 
                          bgcolor: 'background.neutral',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography variant="body2">
                          {metaTitle || 'Not set'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Meta Description
                      </Typography>
                      <Box 
                        sx={{ 
                          p: 1.5, 
                          bgcolor: 'background.neutral',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography variant="body2">
                          {metaDescription || 'Not set'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        URL Slug
                      </Typography>
                      <Box 
                        sx={{ 
                          p: 1.5, 
                          bgcolor: 'background.neutral',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography variant="body2">
                          /{urlSlug || 'Not set'}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            )}
          </CardContent>
        );
      
      case 1:
        return (
          <CardContent
            sx={{
              p: 2,
              border: `0.5px solid ${COLORS.border}`,
              borderTop: "none",
              borderRadius: "0 0 10px 10px",
              bgcolor: "white",
            }}
          >
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
                      border: `10px solid ${COLORS.error}`,
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
                  variant="caption"
                  sx={{
                    position: "absolute",
                    bottom: "15%",
                    left: "30%",
                    fontSize: "8px",
                    color: theme.palette.text.secondary,
                  }}
                >
                  00
                </Typography>

                {/* Max value */}
                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute",
                    bottom: "15%",
                    right: "30%",
                    fontSize: "8px",
                    color: theme.palette.text.secondary,
                  }}
                >
                  100
                </Typography>

                {/* Percentage */}
                <Typography
                  sx={{
                    position: "absolute",
                    top: "10%",
                    fontWeight: "bold",
                    fontSize: "16px",
                    color: COLORS.error,
                  }}
                >
                  35%
                </Typography>
              </Box>
            </Box>

            {/* Basic SEO Section */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={handleToggleBasicSEO}
                >
                  <IconButton size="small" sx={{ p: 0, mr: 1 }}>
                    {expanded ? (
                      <Remove fontSize="small" />
                    ) : (
                      <Add fontSize="small" />
                    )}
                  </IconButton>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Basic SEO
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                  }}
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
                  bgcolor: COLORS.inactive,
                  "& .MuiLinearProgress-bar": {
                    bgcolor: COLORS.success,
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            {expanded && (
              <Stack spacing={2} sx={{ mb: 3 }}>
                {notificationItems.map((item) => {
                  const { icon, color } = getNotificationDetails(item.type);
                  return (
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
                          bgcolor: color,
                          borderRadius: "4px 0 0 4px",
                        }}
                      >
                        {icon}
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
                          sx={{
                            fontSize: "12px",
                            color: theme.palette.text.secondary,
                          }}
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
                                color: theme.palette.text.primary,
                              }}
                            >
                              {item.action}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            )}

            {/* Progress Sections */}
            <Stack divider={<Divider />} spacing={2}>
              {progressSections.map((section) => (
                <Box key={section.id}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box 
                      sx={{ 
                        display: "flex", 
                        alignItems: "center",
                        cursor: "pointer" 
                      }}
                      onClick={() => handleToggleSection(section.id)}
                    >
                      <IconButton size="small" sx={{ p: 0, mr: 1 }}>
                        {expandedSections[section.id] ? (
                          <Remove fontSize="small" />
                        ) : (
                          <Add fontSize="small" />
                        )}
                      </IconButton>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "12px",
                          fontWeight: 500,
                          color: theme.palette.text.secondary,
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
                        color: theme.palette.text.secondary,
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
                      bgcolor: COLORS.inactive,
                      "& .MuiLinearProgress-bar": {
                        bgcolor: COLORS[section.type],
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </CardContent>
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

        {/* Content area */}
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
        
        {/* Collapsed view */}
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