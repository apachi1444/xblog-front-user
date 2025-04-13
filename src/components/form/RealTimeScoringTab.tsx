import { useState, useCallback } from "react";

import Add from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import Remove from "@mui/icons-material/Remove";
import {
  Box,
  Stack,
  Divider,
  IconButton,
  Typography,
  CardContent,
  LinearProgress,
} from "@mui/material";

import { ItemSection } from "./ItemSection";

// Types
interface ProgressSection {
  id: number;
  title: string;
  progress: number;
  type: "error" | "warning" | "success" | "inactive";
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: number;
  text: string;
  status: "error" | "warning" | "success" | "inactive";
  action?: string | null;
}

interface RealTimeScoringTabProps {
  progressSections: ProgressSection[];
  score?: number;
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

export function RealTimeScoringTab({ progressSections, score = 35 }: RealTimeScoringTabProps) {
  const theme = useTheme();
  
  // State management
  const [expanded, setExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

  // Event handlers
  const handleToggleBasicSEO = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  const handleToggleSection = useCallback((sectionId: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  // Calculate gauge rotation based on score
  const gaugeRotation = -45 + (score * 1.8); // 0 = -45deg, 100 = 135deg

  // Helper function to convert ChecklistItem to NotificationItem
  const convertToNotificationItem = (item: ChecklistItem): ChecklistItem => ({
    id: item.id,
    status: item.status === "inactive" ? "warning" : item.status, // Map inactive to warning for UI purposes
    text: item.text,
    action: item.action || null,
  });

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
      {/* Gauge section - unchanged */}
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
                transform: `rotate(${gaugeRotation}deg)`,
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
            {score}%
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
              {progressSections[0]?.title || "Primary SEO Checklist"}
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
            Progress: {progressSections[0]?.progress || 100}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progressSections[0]?.progress || 100}
          sx={{
            height: 6,
            borderRadius: 2,
            bgcolor: COLORS.inactive,
            "& .MuiLinearProgress-bar": {
              bgcolor: COLORS[progressSections[0]?.type || "success"],
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {expanded && progressSections[0] && (
        <Stack spacing={2} sx={{ mb: 3 }}>
          {/* Content Optimization Section - Now using ItemSection */}
          <Box sx={{ pl: 2 }}>
            <Stack spacing={1}>
              {progressSections[0].items.map((item) => (
                <ItemSection key={item.id} {...convertToNotificationItem(item)} />
              ))}
            </Stack>
          </Box>
        </Stack>
      )}

      {/* Progress Sections */}
      <Stack divider={<Divider />} spacing={2}>
        {progressSections.slice(1).map((section) => (
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
            
            {/* Expanded section with items - Now using ItemSection */}
            {expandedSections[section.id] && (
              <Box sx={{ pl: 2, pt: 2 }}>
                <Stack spacing={1}>
                  {section.items.map((item) => (
                    <ItemSection key={item.id} {...convertToNotificationItem(item)} />
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        ))}
      </Stack>
    </CardContent>
  );
}