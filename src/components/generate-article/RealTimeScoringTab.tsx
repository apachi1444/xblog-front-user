import type { ChecklistItem, ProgressSection } from "src/utils/seoScoring";

import toast from "react-hot-toast";
import { useFormContext } from "react-hook-form";
import { useRef, useMemo, useState, useEffect, useCallback } from "react";

import Add from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import Remove from "@mui/icons-material/Remove";
import {
  Box,
  Stack,
  Divider,
  Tooltip,
  IconButton,
  Typography,
  CardContent,
  LinearProgress,
} from "@mui/material";

import { formatPoints } from "src/utils/seoScoringPoints";
import { useSEOScoring } from "src/sections/generate/hooks/useSEOScoring";

import { ItemSection } from "./ItemSection";
import { EditItemModal } from "./EditItemModal";

interface RealTimeScoringTabProps {
  progressSections: ProgressSection[];
  score: number;
  totalMaxScore?: number;
  formattedScore?: string;
  changedCriteriaIds?: number[];
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
  type: 'text' | 'textarea';
}

// Map checklist item IDs to form fields
const FIELD_MAPPING: Record<number, FieldConfig> = {
  // Primary SEO Checklist
  101: { field: 'metaDescription', type: 'textarea' },
  102: { field: 'urlSlug', type: 'text' },
  103: { field: 'content', type: 'textarea' },
  104: { field: 'contentDescription', type: 'textarea' },
  105: { field: 'secondaryKeywords', type: 'text' },
  106: { field: 'language', type: 'text' },

  // Title Optimization
  201: { field: 'title', type: 'text' },
  202: { field: 'title', type: 'text' },
  203: { field: 'title', type: 'text' },
  204: { field: 'metaTitle', type: 'text' },
  205: { field: 'title', type: 'text' },
  206: { field: 'metaTitle', type: 'text' },
  207: { field: 'metaDescription', type: 'textarea' },

  // Content Presentation Quality
  301: { field: 'contentDescription', type: 'textarea' },
  302: { field: 'contentDescription', type: 'textarea' },
  303: { field: 'contentDescription', type: 'textarea' },
  304: { field: 'contentDescription', type: 'textarea' },

  // Additional SEO Factors
  401: { field: 'urlSlug', type: 'text' },
  402: { field: 'urlSlug', type: 'text' },
  403: { field: 'urlSlug', type: 'text' },
  404: { field: 'language', type: 'text' },
  405: { field: 'primaryKeyword', type: 'text' },
  406: { field: 'secondaryKeywords', type: 'text' },
};

// Suggestions are not directly used by EditItemModal in this setup
// const FIELD_SUGGESTIONS: Record<string, string[]> = { ... };

export function RealTimeScoringTab({ progressSections, score, totalMaxScore = 100, formattedScore, changedCriteriaIds = [] }: RealTimeScoringTabProps) {
  const theme = useTheme();
  // State management
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [highlightedItems, setHighlightedItems] = useState<number[]>([]);

  const prevChangedIdsRef = useRef<number[]>([]);

  const form = useFormContext();

  // Get the simulateFieldChange function from the useSEOScoring hook
  const { simulateFieldChange } = useSEOScoring(form);

  const { getValues } = form;

  // Log all form values to debug
  useEffect(() => {
    // Get all form values
    const allValues = getValues();
    console.log("All form values:", allValues);

    // Try to access contentDescription from different locations
    const formValues = {
      direct: allValues.contentDescription,
      step1: allValues.step1?.contentDescription,
      step2: allValues.step2?.contentDescription,
      step3: allValues.step3?.contentDescription
    };

    console.log("Content description values:", formValues);

    // Log all available keys in the form
    console.log("Available form keys:", Object.keys(allValues));
  }, [getValues]);


  const hasNewChanges = useMemo(() => changedCriteriaIds.length > 0 &&
      (prevChangedIdsRef.current.length !== changedCriteriaIds.length ||
       !prevChangedIdsRef.current.every(id => changedCriteriaIds.includes(id))), [changedCriteriaIds]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (hasNewChanges) {
      // Update ref with current changed IDs
      prevChangedIdsRef.current = [...changedCriteriaIds];

      // Set the highlighted items
      setHighlightedItems(changedCriteriaIds);

      // Auto-expand sections that contain changed criteria
      setExpandedSections(prev => {
        const sectionsToExpand = {...prev};

        progressSections.forEach(section => {
          const hasChangedItem = section.items.some(item =>
            changedCriteriaIds.includes(item.id)
          );

          if (hasChangedItem) {
            sectionsToExpand[section.id] = true;
          }
        });

        return sectionsToExpand;
      });

      // Clear highlights after 5 seconds
      const timer = setTimeout(() => {
        setHighlightedItems([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [hasNewChanges, changedCriteriaIds, progressSections]);

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
    maxScore: item.maxScore,
    tooltip: item.tooltip
  });

  // Add a useFormContext hook to access form values
  const formContext = useFormContext();

  // Check if the updateFieldInAllForms function is available
  // We'll use this directly in the syncFormField function

  // Debug: Log form values when component renders
  useEffect(() => {
    if (formContext) {
      // Log the main form values
      const mainFormValues = formContext.getValues();
      console.log('Main form values in RealTimeScoringTab:', mainFormValues);

      // Log specific fields that might be edited
      console.log('contentDescription:', formContext.getValues('step1.contentDescription'));
      console.log('title:', formContext.getValues('step1.title'));
      console.log('metaDescription:', formContext.getValues('step1.metaDescription'));
    }
  }, [formContext]);

  // Utility function to update a field in all forms
  const syncFormField = useCallback((fieldType: string, value: any) => {
    console.log(`Syncing field ${fieldType} with value:`, value);

    // If we have the custom synchronization function, use it
    if ((formContext as any)?.updateFieldInAllForms) {
      console.log(`Using custom updateFieldInAllForms for ${fieldType}`);
      (formContext as any).updateFieldInAllForms(fieldType, value);
    } else {
      // Otherwise, update in all possible locations
      console.log(`Manually updating ${fieldType} in all forms`);

      const updateOptions = {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      };

      // Try to update in all possible locations to ensure the value is updated
      try {
        // Update direct field
        formContext?.setValue(fieldType, value, updateOptions);
        console.log(`Updated direct field: ${fieldType}`);
      } catch (err) {
        console.warn(`Failed to update direct field: ${fieldType}`, err);
      }

      try {
        // Update in step1
        formContext?.setValue(`step1.${fieldType}`, value, updateOptions);
        console.log(`Updated step1.${fieldType}`);
      } catch (err) {
        console.warn(`Failed to update step1.${fieldType}`, err);
      }

      try {
        // Update in step2
        formContext?.setValue(`step2.${fieldType}`, value, updateOptions);
        console.log(`Updated step2.${fieldType}`);
      } catch (err) {
        console.warn(`Failed to update step2.${fieldType}`, err);
      }

      try {
        // Update in step3
        formContext?.setValue(`step3.${fieldType}`, value, updateOptions);
        console.log(`Updated step3.${fieldType}`);
      } catch (err) {
        console.warn(`Failed to update step3.${fieldType}`, err);
      }
    }
  }, [formContext]);

  const handleActionClick = (item: ChecklistItem) => {
    // Only allow optimization for items that aren't already at 100% (success status)
    if (item.status === 'success') {
      toast.success(`This item is already optimized!`);
      return;
    }

    if (FIELD_MAPPING[item.id]) {
        // Get the field type from the mapping
        const fieldType = FIELD_MAPPING[item.id].field;

        // Try to get the field value from all possible locations
        let fieldValue = '';
        try {
          // Try different paths to find the field value
          const directValue = formContext?.getValues(fieldType);
          const step1Value = formContext?.getValues(`step1.${fieldType}`);
          const step2Value = formContext?.getValues(`step2.${fieldType}`);
          const step3Value = formContext?.getValues(`step3.${fieldType}`);

          // Use the first non-empty value found
          fieldValue = directValue || step1Value || step2Value || step3Value || '';

          // Log the current form values
          console.log(`Current form values for ${fieldType}:`, {
            directValue,
            step1Value,
            step2Value,
            step3Value,
            fieldValue
          });
        } catch (error) {
          console.error(`Error getting form value for ${fieldType}:`, error);
        }

        // Set the selected item and open the modal
        setSelectedItem({
          ...item,
          // Update the text to include the actual field value for better context
          text: fieldValue || item.text
        });
        setModalOpen(true);
    } else {
        toast.error(`Optimization not available for this item yet.`);
    }
  };

  // --- Define the Optimization Handler ---
  const handleOptimizeField = useCallback(async (fieldType: string, currentValue: string): Promise<string> => {
    console.log(`Optimizing field: ${fieldType} with value: ${currentValue}`);

    try {
      // Show loading toast
      toast.loading(`Optimizing ${fieldType}...`, { id: 'optimize-toast' });

      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate optimized content based on field type
      let optimizedValue = currentValue;

      if (fieldType === 'title' || fieldType === 'metaTitle') {
        // For titles, ensure they include keywords and are properly formatted
        if (!optimizedValue.includes('SEO')) {
          optimizedValue = `SEO-Optimized: ${optimizedValue}`;
        }
        // Capitalize first letter of each word
        optimizedValue = optimizedValue
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
      else if (fieldType === 'metaDescription') {
        // For meta descriptions, ensure they're the right length and include call-to-action
        if (optimizedValue.length < 120) {
          optimizedValue += ' Learn more about this topic and improve your SEO strategy today.';
        } else if (optimizedValue.length > 160) {
          optimizedValue = `${optimizedValue.substring(0, 157)  }...`;
        }

        if (!optimizedValue.includes('Learn more')) {
          optimizedValue += ' Learn more now!';
        }
      }
      else if (fieldType === 'urlSlug') {
        // For URL slugs, ensure they're properly formatted
        optimizedValue = optimizedValue
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
      }
      else if (fieldType === 'primaryKeyword' || fieldType === 'secondaryKeywords') {
        // For keywords, ensure they're properly formatted and relevant
      }
      else if (fieldType === 'contentDescription') {
        // For content descriptions, ensure they include keywords and are detailed
        if (optimizedValue.length < 100) {
          optimizedValue += ' This content will provide valuable insights and actionable tips for readers interested in this topic.';
        }
      }

      syncFormField(fieldType, optimizedValue);

      toast.success(`${fieldType} optimized successfully!`, { id: 'optimize-toast' });

      return optimizedValue;
    } catch (error: any) {
      toast.error(`Failed to optimize ${fieldType}. Please try again.`, { id: 'optimize-toast' });
      throw new Error(error.message || 'An unexpected error occurred during optimization.');
    }
  }, [syncFormField]);



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
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          boxShadow: `0 4px 20px 0 rgba(0,0,0,0.05)`,
          position: 'relative',
          overflow: 'hidden',
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
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          SEO Performance Score
        </Typography>

        <Box sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          my: 1
        }}>
          {/* Background circle */}
          <Box sx={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: `conic-gradient(
              ${getScoreColor()} ${Math.min(100, (score / totalMaxScore) * 100)}%,
              ${theme.palette.grey[200]} ${Math.min(100, (score / totalMaxScore) * 100)}% 100%
            )`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 15px 0 ${getScoreColor()}40`,
            transition: 'all 0.5s ease-in-out',
          }}>
            {/* Inner white circle */}
            <Box sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              boxShadow: '0 0 10px 0 rgba(0,0,0,0.1) inset',
              position: 'relative',
            }}>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: getScoreColor(),
                  lineHeight: 1,
                  mb: 0.5
                }}
              >
                {formattedScore || score}
              </Typography>
              <Typography
                variant="caption"
                component="div"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                points
              </Typography>

              <Tooltip title={`${score} out of ${totalMaxScore} possible points`}>
                <Typography
                  variant="caption"
                  component="div"
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    fontWeight: 400,
                    color: theme.palette.text.secondary,
                    fontSize: '0.7rem'
                  }}
                >
                  {`${Math.min(100, Math.round((score / totalMaxScore) * 100))}%`}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* Score rating text */}
        <Box sx={{
          mt: 1,
          py: 0.5,
          px: 2,
          borderRadius: 10,
          bgcolor: `${getScoreColor()}20`,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: getScoreColor(),
              display: 'inline-block'
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: getScoreColor()
            }}
          >
            {score < 33 ? 'Needs Improvement' : score < 66 ? 'Good' : 'Excellent'}
          </Typography>
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
                <Tooltip title={`${Math.min(100, Math.round(section.progress))}% complete`}>
                  <Typography
                    variant="body2"
                    sx={{ ml: 1, color: theme.palette.text.secondary }}
                  >
                    ({formatPoints(section.points)} / {formatPoints(section.maxPoints)} pts)
                  </Typography>
                </Tooltip>
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
              value={Math.min(100, section.progress)}
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
                    tooltip={item.tooltip}
                    onActionClick={() => handleActionClick(convertToNotificationItem(item))}
                    isHighlighted={highlightedItems.includes(item.id)}
                  />
                ))}
              </Stack>
            )}
          </Box>
        ))}
      </Stack>

      {/* EditItemModal with enhanced props */}
      {selectedItem && FIELD_MAPPING[selectedItem.id] && (
        <EditItemModal
          initialValue={selectedItem.text}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onOptimize={handleOptimizeField}
          fieldType={FIELD_MAPPING[selectedItem.id].field}
          score={selectedItem.score || 0}
          maxScore={selectedItem.maxScore || 10} // Default to 10 if not provided
          weight={
            // Find the section that contains this item to get its weight
            progressSections.find(section =>
              section.items.some(item => item.id === selectedItem.id)
            )?.weight || 1 // Default to 1 if not found
          }
          tooltip={selectedItem.tooltip}
          simulateFieldChange={simulateFieldChange}
          onUpdateScore={(newScore: number) => {
            // In a real implementation, this would update the score in the store/context
            // For now, we'll just show a toast notification
            toast.success(`Score updated to ${newScore}`);
          }}
        />
      )}
    </CardContent>
  );
}
