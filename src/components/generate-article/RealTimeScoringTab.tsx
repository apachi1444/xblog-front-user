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
import { optimizeInputForSEO } from "src/utils/aiGeneration";

import { useSEOScoring } from "src/sections/generate/hooks/useSEOScoring";

import { ItemSection } from "./ItemSection";
import { EditItemModal } from "./EditItemModal";
import { ScoringRulesButton } from "./ScoringRulesModal";
import { OptimizeInputModal } from "./OptimizeInputModal";

interface RealTimeScoringTabProps {
  progressSections: ProgressSection[];
  score: number;
  totalMaxScore?: number;
  formattedScore?: string;
  changedCriteriaIds?: number[];
}

// Constants - using theme-aware colors
const getColors = (theme: any) => ({
  error: theme.palette.error.main,
  warning: theme.palette.warning.main,
  success: theme.palette.success.main,
  inactive: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
  pending: theme.palette.mode === 'dark' ? theme.palette.grey[700] : "#e0e0e0", // Adjusted for dark mode
  primary: theme.palette.primary.main,
  border: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.primary.lighter,
  background: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.primary.lighter,
});


// Field mapping type
interface FieldConfig {
  field: string;
  type: 'text' | 'textarea';
}

// Define field types for each form field
const FIELD_TYPES: Record<string, 'text' | 'textarea'> = {
  'metaDescription': 'textarea',
  'urlSlug': 'text',
  'content': 'textarea',
  'contentDescription': 'textarea',
  'secondaryKeywords': 'text',
  'title': 'text',
  'metaTitle': 'text',
  'primaryKeyword': 'text',
  'language': 'text',
  'targetCountry': 'text',
  'internalLinks': 'text',
  'externalLinks': 'text'
};

// Function to get the primary form field for a scoring item
const getPrimaryFieldForScoringItem = (itemId: number): string => {
  // Define primary fields for each scoring item
  const SCORING_ITEM_TO_PRIMARY_FIELD: Record<number, string> = {
    // Primary SEO Checklist
    101: 'metaDescription', // Focus keyword in meta description
    102: 'urlSlug',         // Focus keyword in URL
    103: 'content',         // Keyword in first 10% of content
    104: 'contentDescription', // Primary keyword used naturally
    105: 'secondaryKeywords',  // Secondary keywords defined and relevant
    106: 'language',           // Language and target country are defined

    // Title Optimization
    201: 'title',           // Keyword at start of title
    202: 'title',           // Title includes emotional sentiment
    203: 'title',           // Title uses power words
    204: 'metaTitle',       // Focus keyword in SEO title
    205: 'title',           // Title length optimal
    206: 'metaTitle',       // Meta title length optimal
    207: 'metaDescription', // Meta description length optimal

    // Content Presentation
    301: 'contentDescription', // Content detailed and comprehensive
    302: 'contentDescription', // Content includes primary keyword
    303: 'contentDescription', // Content includes secondary keywords
    304: 'contentDescription', // Content clear and focused
    305: 'internalLinks',      // Internal links to relevant pages
    306: 'externalLinks',      // External links to high-authority sources

    // Additional SEO Factors
    401: 'urlSlug',            // URL slug concise and descriptive
    402: 'urlSlug',            // URL slug uses hyphens
    403: 'urlSlug',            // URL slug no special characters
    404: 'language',           // Language and target country compatible
    405: 'secondaryKeywords',  // Sufficient secondary keywords
    406: 'secondaryKeywords',  // Secondary keywords support main topic
  };

  return SCORING_ITEM_TO_PRIMARY_FIELD[itemId] || 'contentDescription';
};

// Map checklist item IDs to form fields
const FIELD_MAPPING: Record<number, FieldConfig> = {};

// Generate the field mapping directly from the primary field mapping
// eslint-disable-next-line no-plusplus
for (let i = 101; i <= 406; i++) {
  // Skip items that don't exist in our scoring system
  if ((i > 106 && i < 201) || (i > 207 && i < 301) || (i > 306 && i < 401) || i > 406) {
    // eslint-disable-next-line no-continue
    continue;
  }

  const field = getPrimaryFieldForScoringItem(i);
  if (field && FIELD_TYPES[field]) {
    FIELD_MAPPING[i] = {
      field,
      type: FIELD_TYPES[field]
    };
  }
}

// Suggestions are not directly used by EditItemModal in this setup
// const FIELD_SUGGESTIONS: Record<string, string[]> = { ... };

export function RealTimeScoringTab({ progressSections, score, totalMaxScore = 100, formattedScore, changedCriteriaIds = [] }: RealTimeScoringTabProps) {
  const theme = useTheme();
  const COLORS = getColors(theme);
  // State management
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [highlightedItems, setHighlightedItems] = useState<number[]>([]);

  // State for the optimize input modal
  const [optimizeModalOpen, setOptimizeModalOpen] = useState(false);
  const [itemToOptimize, setItemToOptimize] = useState<ChecklistItem | null>(null);
  const [inputTypeToOptimize, setInputTypeToOptimize] = useState<string>('');
  const [inputLabelToOptimize, setInputLabelToOptimize] = useState<string>('');
  const [currentInputValue, setCurrentInputValue] = useState<string>('');

  const prevChangedIdsRef = useRef<number[]>([]);

  const form = useFormContext();

  // Get the simulateFieldChange function from the useSEOScoring hook
  const { simulateFieldChange } = useSEOScoring(form);

  // getValues is used in the commented debug code
  // const { getValues } = form;

  // Debug logging has been disabled for better performance
  // If you need to debug form values, uncomment the following code:
  /*
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
  */


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

  // Debug logging has been disabled for better performance
  // If you need to debug form values, uncomment the following code:
  /*
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
  */

  // Utility function to update a field in all forms
  const syncFormField = useCallback((fieldType: string, value: any) => {
    // Debug logging disabled for better performance
    // console.log(`Syncing field ${fieldType} with value:`, value);

    // If we have the custom synchronization function, use it
    if ((formContext as any)?.updateFieldInAllForms) {
      // console.log(`Using custom updateFieldInAllForms for ${fieldType}`);
      (formContext as any).updateFieldInAllForms(fieldType, value);
    } else {
      // Otherwise, update in all possible locations
      // console.log(`Manually updating ${fieldType} in all forms`);

      const updateOptions = {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      };

      // Try to update in all possible locations to ensure the value is updated
      try {
        // Update direct field
        formContext?.setValue(fieldType, value, updateOptions);
        // console.log(`Updated direct field: ${fieldType}`);
      } catch (err) {
        console.warn(`Failed to update direct field: ${fieldType}`, err);
      }

      try {
        // Update in step1
        formContext?.setValue(`step1.${fieldType}`, value, updateOptions);
        // console.log(`Updated step1.${fieldType}`);
      } catch (err) {
        console.warn(`Failed to update step1.${fieldType}`, err);
      }

      try {
        // Update in step2
        formContext?.setValue(`step2.${fieldType}`, value, updateOptions);
        // console.log(`Updated step2.${fieldType}`);
      } catch (err) {
        console.warn(`Failed to update step2.${fieldType}`, err);
      }

      try {
        // Update in step3
        formContext?.setValue(`step3.${fieldType}`, value, updateOptions);
        // console.log(`Updated step3.${fieldType}`);
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

          // Debug logging disabled for better performance
          // console.log(`Current form values for ${fieldType}:`, {
          //   directValue,
          //   step1Value,
          //   step2Value,
          //   step3Value,
          //   fieldValue
          // });
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

  // Handle optimize button click
  const handleOptimizeClick = (item: ChecklistItem) => {
    // Only allow optimization for items with warning or error status
    if (item.status === 'success') {
      toast.success(`This item is already optimized!`);
      return;
    }

    // Don't allow optimization for pending items
    if (item.status === 'pending' || item.status === 'inactive') {
      toast.error(`This item is not ready for optimization yet.`);
      return;
    }

    if (FIELD_MAPPING[item.id]) {
      // Get the field type from the mapping
      const fieldType = FIELD_MAPPING[item.id].field;

      // Get a user-friendly label for the field
      const fieldLabels: Record<string, string> = {
        'metaDescription': 'Meta Description',
        'urlSlug': 'URL Slug',
        'content': 'Content',
        'contentDescription': 'Content Description',
        'secondaryKeywords': 'Secondary Keywords',
        'title': 'Title',
        'metaTitle': 'Meta Title',
        'primaryKeyword': 'Primary Keyword',
        'language': 'Language',
        'targetCountry': 'Target Country',
        'internalLinks': 'Internal Links',
        'externalLinks': 'External Links'
      };

      const fieldLabel = fieldLabels[fieldType] || fieldType;

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
      } catch (error) {
        console.error(`Error getting form value for ${fieldType}:`, error);
      }

      // Set up the optimization modal
      setItemToOptimize(item);
      setInputTypeToOptimize(fieldType);
      setInputLabelToOptimize(fieldLabel);
      setCurrentInputValue(fieldValue);
      setOptimizeModalOpen(true);
    } else {
      toast.error(`Optimization not available for this item yet.`);
    }
  };

  // Handle saving the optimized input
  const handleSaveOptimizedInput = useCallback((newValue: string) => {
    if (!itemToOptimize || !inputTypeToOptimize) return;

    // Update the form with the new value
    syncFormField(inputTypeToOptimize, newValue);

    // Simulate field change to update the SEO score
    simulateFieldChange(inputTypeToOptimize, newValue);

    // Show success toast
    toast.success(`${inputLabelToOptimize} optimized successfully!`);

    // Close the modal
    setOptimizeModalOpen(false);
  }, [itemToOptimize, inputTypeToOptimize, inputLabelToOptimize, syncFormField, simulateFieldChange]);

  // --- Define the Optimization Handler ---
  const handleOptimizeField = useCallback(async (fieldType: string, currentValue: string): Promise<string> => {
    // Debug logging disabled for better performance
    // console.log(`Optimizing field: ${fieldType} with value: ${currentValue}`);

    try {
      // Show loading toast
      toast.loading(`Optimizing ${fieldType}...`, { id: 'optimize-toast' });

      // Use the AI optimization function
      const optimizedValue = await optimizeInputForSEO(
        fieldType,
        currentValue,
        itemToOptimize?.id || 0,
        {
          primaryKeyword: formContext?.getValues('primaryKeyword') || formContext?.getValues('step1.primaryKeyword') || '',
          secondaryKeywords: formContext?.getValues('secondaryKeywords') || formContext?.getValues('step1.secondaryKeywords') || [],
          language: formContext?.getValues('language') || formContext?.getValues('step1.language') || 'en',
          targetCountry: formContext?.getValues('targetCountry') || formContext?.getValues('step1.targetCountry') || 'United States',
          title: formContext?.getValues('title') || formContext?.getValues('step1.title') || '',
          metaTitle: formContext?.getValues('metaTitle') || formContext?.getValues('step1.metaTitle') || '',
          metaDescription: formContext?.getValues('metaDescription') || formContext?.getValues('step1.metaDescription') || '',
          urlSlug: formContext?.getValues('urlSlug') || formContext?.getValues('step1.urlSlug') || '',
          content: formContext?.getValues('content') || formContext?.getValues('step3.content') || '',
          contentDescription: formContext?.getValues('contentDescription') || formContext?.getValues('step1.contentDescription') || ''
        }
      );

      toast.success(`${fieldType} optimized successfully!`, { id: 'optimize-toast' });

      return optimizedValue;
    } catch (error: any) {
      toast.error(`Failed to optimize ${fieldType}. Please try again.`, { id: 'optimize-toast' });
      throw new Error(error.message || 'An unexpected error occurred during optimization.');
    }
  }, [formContext, itemToOptimize?.id]);



  return (
    <CardContent
      sx={{
        p: 2,
        border: `0.5px solid ${COLORS.border}`,
        borderTop: "none",
        borderRadius: "0 0 10px 10px",
        bgcolor: theme.palette.background.paper,
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
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${theme.palette.background.neutral} 0%, ${theme.palette.grey[800]} 100%)`
            : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          boxShadow: theme.palette.mode === 'dark'
            ? `0 4px 20px 0 rgba(0,0,0,0.2)`
            : `0 4px 20px 0 rgba(0,0,0,0.05)`,
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            SEO Performance Score
          </Typography>
          <ScoringRulesButton />
        </Box>

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
              ${theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200]} ${Math.min(100, (score / totalMaxScore) * 100)}% 100%
            )`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 15px 0 ${getScoreColor()}${theme.palette.mode === 'dark' ? '60' : '40'}`,
            transition: 'all 0.5s ease-in-out',
          }}>
            {/* Inner white circle */}
            <Box sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 0 10px 0 rgba(0,0,0,0.3) inset'
                : '0 0 10px 0 rgba(0,0,0,0.1) inset',
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
          bgcolor: theme.palette.mode === 'dark'
            ? `${getScoreColor()}30`
            : `${getScoreColor()}20`,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          boxShadow: theme.palette.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
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
                ...(theme.palette.mode === 'dark' && {
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }),
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
                    onOptimizeClick={() => handleOptimizeClick(convertToNotificationItem(item))}
                    isHighlighted={highlightedItems.includes(item.id)}
                    showOptimizeButton={!!FIELD_MAPPING[item.id] && (item.status === 'warning' || item.status === 'error')} // Only show optimize button if there's a field mapping and status is warning or error
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
          selectedItem={selectedItem} // Pass the selected item to the modal
          onUpdateScore={(newScore: number) => {
            // In a real implementation, this would update the score in the store/context
            // For now, we'll just show a toast notification
            toast.success(`Score updated to ${newScore}`);
          }}
        />
      )}

      {/* Optimize Input Modal */}
      {itemToOptimize && (
        <OptimizeInputModal
          open={optimizeModalOpen}
          onClose={() => setOptimizeModalOpen(false)}
          inputType={inputTypeToOptimize}
          inputLabel={inputLabelToOptimize}
          currentValue={currentInputValue}
          scoringItemId={itemToOptimize.id}
          context={{
            primaryKeyword: formContext?.getValues('primaryKeyword') || formContext?.getValues('step1.primaryKeyword') || '',
            secondaryKeywords: formContext?.getValues('secondaryKeywords') || formContext?.getValues('step1.secondaryKeywords') || [],
            language: formContext?.getValues('language') || formContext?.getValues('step1.language') || 'en',
            targetCountry: formContext?.getValues('targetCountry') || formContext?.getValues('step1.targetCountry') || 'United States',
            title: formContext?.getValues('title') || formContext?.getValues('step1.title') || '',
            metaTitle: formContext?.getValues('metaTitle') || formContext?.getValues('step1.metaTitle') || '',
            metaDescription: formContext?.getValues('metaDescription') || formContext?.getValues('step1.metaDescription') || '',
            urlSlug: formContext?.getValues('urlSlug') || formContext?.getValues('step1.urlSlug') || '',
            content: formContext?.getValues('content') || formContext?.getValues('step3.content') || '',
            contentDescription: formContext?.getValues('contentDescription') || formContext?.getValues('step1.contentDescription') || ''
          }}
          onSave={handleSaveOptimizedInput}
        />
      )}
    </CardContent>
  );
}
