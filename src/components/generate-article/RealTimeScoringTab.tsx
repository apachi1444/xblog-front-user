import type { ChecklistItem, ProgressSection } from "src/utils/seoScoring";

import toast from "react-hot-toast";
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
  CircularProgress,
} from "@mui/material";

import { ItemSection } from "./ItemSection";
import { EditItemModal } from "./EditItemModal";

interface RealTimeScoringTabProps {
  progressSections: ProgressSection[];
  score: number;
}

// Constants
// Update the COLORS constant to include a new color for pending items
const COLORS = {
  error: "#d81d1d",
  warning: "#ffb20d",
  success: "#2dc191",
  inactive: "#f7f7fa",
  pending: "#e0e0e0", // Light gray for pending items
  primary: "#5969cf",
  border: "#acb9f9",
  background: "#dbdbfa",
};


// Field mapping type
interface FieldConfig {
  field: string;
  type: 'text' | 'textarea'; // Keep type info if needed elsewhere, though EditItemModal infers it
}

// Map checklist item IDs to form fields
const FIELD_MAPPING: Record<number, FieldConfig> = {
  // Primary SEO Checklist
  101: { field: 'metaDescription', type: 'textarea' },
  102: { field: 'urlSlug', type: 'text' },
  103: { field: 'content', type: 'textarea' }, // Note: EditItemModal might not be ideal for large 'content' edits
  104: { field: 'content', type: 'textarea' },
  105: { field: 'content', type: 'textarea' },
  106: { field: 'tableOfContents', type: 'text' }, // Assuming 'tableOfContents' is a form field
  107: { field: 'metaDescription', type: 'textarea' },
  108: { field: 'content', type: 'textarea' },

  // Title Optimization
  201: { field: 'title', type: 'text' },
  202: { field: 'title', type: 'text' },
  203: { field: 'title', type: 'text' },
  204: { field: 'metaTitle', type: 'text' },
  205: { field: 'title', type: 'text' },

  // Content Presentation Quality
  301: { field: 'content', type: 'textarea' },
  302: { field: 'content', type: 'textarea' },
  303: { field: 'content', type: 'textarea' },
  304: { field: 'content', type: 'textarea' },

  // Additional SEO Factors
  401: { field: 'content', type: 'textarea' },
  402: { field: 'content', type: 'textarea' },
  403: { field: 'urlSlug', type: 'text' },
  404: { field: 'content', type: 'textarea' },
  405: { field: 'content', type: 'textarea' },
  406: { field: 'content', type: 'textarea' },
};

// Suggestions are not directly used by EditItemModal in this setup
// const FIELD_SUGGESTIONS: Record<string, string[]> = { ... };

export function RealTimeScoringTab({ progressSections, score }: RealTimeScoringTabProps) {
  const theme = useTheme();
  // State management
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);

  // Event handlers
  const handleToggleSection = useCallback((sectionId: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  // Helper function to determine color based on score
  const getScoreColor = () => {
    if (score < 33) return COLORS.error;
    if (score < 66) return COLORS.warning;
    return COLORS.success;
  };

  // Helper function to convert ChecklistItem to NotificationItem
  const convertToNotificationItem = (item: ChecklistItem): ChecklistItem => ({
    id: item.id,
    status: item.status === "inactive" ? "warning" : item.status, // Map inactive to warning for UI purposes
    text: item.text,
    action: item.action || null,
    score: item.score,
    maxScore: item.maxScore
  });

  // Handle action click (Fix or Optimize) - Opens the modal
  const handleActionClick = (item: ChecklistItem) => {
    // Ensure there's a mapping before trying to open the modal
    if (FIELD_MAPPING[item.id]) {
        setSelectedItem(item);
        setModalOpen(true);
    } else {
        toast.error(`Optimization not available for this item yet.`);
    }
  };

  // --- Define the Optimization Handler ---
  const handleOptimizeField = useCallback(async (fieldType: string, currentValue: string): Promise<string> => {
    console.log(`Optimizing field: ${fieldType} with value: ${currentValue}`);
    // Replace with your actual API endpoint and request structure
    const apiUrl = '/api/optimize-content'; // Placeholder API endpoint

    try {
      return "test !"

    } catch (error: any) {
  
      throw new Error(error.message || 'An unexpected error occurred during optimization.');
    }
  }, [/* Add dependencies like 'watch' if context is needed */]);



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
      {/* SEO Score */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          SEO Score
        </Typography>
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            value={score}
            size={60}
            thickness={5}
            sx={{ color: getScoreColor() }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="body2"
              component="div"
              sx={{ fontWeight: 600, fontSize: "1rem" }}
            >
              {score}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Progress Sections */}
      <Stack spacing={2}>
        {progressSections.map((section) => (
          <Box key={section.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {section.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ ml: 1, color: theme.palette.text.secondary }}
                >
                  ({section.progress}%)
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => handleToggleSection(section.id)}
              >
                {expandedSections[section.id] ? <Remove /> : <Add />}
              </IconButton>
            </Box>

            <LinearProgress
              variant="determinate"
              value={section.progress}
              sx={{
                height: 8,
                borderRadius: 1,
                mb: 1,
                bgcolor: COLORS.inactive,
                "& .MuiLinearProgress-bar": {
                  bgcolor: COLORS[section.type],
                },
              }}
            />

            {expandedSections[section.id] && (
              <Stack spacing={1} sx={{ mt: 2 }}>                
                {section.items.map((item) => (
                  <ItemSection
                    key={item.id}
                    id={item.id}
                    status={item.status}
                    text={item.text}
                    action={item.action || null}
                    score={item.score}
                    maxScore={item.maxScore}
                    onActionClick={() => handleActionClick(convertToNotificationItem(item))}
                  />
                ))}
              </Stack>
            )}
          </Box>
        ))}
      </Stack>

      {/* Replace SEOOptimizationModal with EditItemModal */}
      {selectedItem && FIELD_MAPPING[selectedItem.id] && (
        <EditItemModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onOptimize={handleOptimizeField}
          fieldType={FIELD_MAPPING[selectedItem.id].field}
          score={60}
          onUpdateScore={(newScore: number) => console.log(`New score: ${newScore}`)}
        />
      )}
    </CardContent>
  );
}
