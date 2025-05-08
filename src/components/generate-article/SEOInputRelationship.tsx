import type {
  UserInputKey} from 'src/utils/seoInputMapping';

import { useState } from 'react';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Chip,
  Paper,
  Divider,
  Typography,
  CardHeader,
  CardContent,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';

import { SEO_SCORING_ITEMS } from 'src/utils/seoScoringPoints';
import {
  INPUT_TO_SCORING_MAP,
  FORM_FIELD_TO_INPUT_MAP,
  getFormFieldsForScoringItem
} from 'src/utils/seoInputMapping';

// Define colors for each category
const CATEGORY_COLORS = {
  primary: '#4caf50', // Green
  title: '#2196f3',   // Blue
  content: '#ff9800',  // Orange
  additional: '#9c27b0' // Purple
};

// Define colors for each input category
const INPUT_COLORS: Record<UserInputKey, string> = {
  targetCountryLanguage: '#8bc34a', // Light Green
  primaryKeyword: '#f44336',       // Red
  secondaryKeywords: '#ff9800',    // Orange
  seoTitle: '#2196f3',             // Blue
  metaInfo: '#9c27b0',             // Purple
  contentDescription: '#4db6ac',   // Teal
  tocAndContent: '#00bcd4'         // Cyan
};

// Define friendly names for input categories
const INPUT_NAMES: Record<UserInputKey, string> = {
  targetCountryLanguage: 'Language & Country',
  primaryKeyword: 'Primary Keyword',
  secondaryKeywords: 'Secondary Keywords',
  seoTitle: 'SEO Title',
  metaInfo: 'Meta Information',
  contentDescription: 'Content Description',
  tocAndContent: 'Content Structure & Links'
};

// Define friendly names for form fields
const FIELD_NAMES: Record<string, string> = {
  language: 'Language',
  targetCountry: 'Target Country',
  primaryKeyword: 'Primary Keyword',
  secondaryKeywords: 'Secondary Keywords',
  title: 'Article Title',
  metaTitle: 'Meta Title',
  metaDescription: 'Meta Description',
  urlSlug: 'URL Slug',
  content: 'Article Content',
  contentDescription: 'Content Description',
  internalLinks: 'Internal Links',
  externalLinks: 'External Links'
};

type ViewMode = 'inputs' | 'scoring';

export function SEOInputRelationship() {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('inputs');
  const [selectedInput, setSelectedInput] = useState<UserInputKey | null>(null);
  const [selectedScoringItem, setSelectedScoringItem] = useState<number | null>(null);

  const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
    if (newMode !== null) {
      setViewMode(newMode);
      // Reset selections when changing view mode
      setSelectedInput(null);
      setSelectedScoringItem(null);
    }
  };

  const handleInputClick = (input: UserInputKey) => {
    setSelectedInput(input === selectedInput ? null : input);
    setSelectedScoringItem(null); // Clear scoring item selection
  };

  const handleScoringItemClick = (itemId: number) => {
    setSelectedScoringItem(itemId === selectedScoringItem ? null : itemId);
    setSelectedInput(null); // Clear input selection
  };

  // Get scoring items affected by a selected input
  const getAffectedScoringItems = (input: UserInputKey) => INPUT_TO_SCORING_MAP[input] || [];

  // Get inputs that affect a selected scoring item
  const getAffectingInputs = (itemId: number) => Object.entries(INPUT_TO_SCORING_MAP)
      .filter(([_, itemIds]) => itemIds.includes(itemId))
      .map(([key]) => key as UserInputKey);

  // Get form fields for a specific input category
  const getFieldsForInput = (input: UserInputKey) => Object.entries(FORM_FIELD_TO_INPUT_MAP)
      .filter(([_, inputKey]) => inputKey === input)
      .map(([field]) => field);

  return (
    <Card>
      <CardHeader
        title="SEO Input Relationships"
        subheader="Visualize how form inputs affect SEO scoring"
        action={
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
            aria-label="view mode"
          >
            <ToggleButton value="inputs" aria-label="inputs view">
              By Input
            </ToggleButton>
            <ToggleButton value="scoring" aria-label="scoring view">
              By Scoring Item
            </ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <Divider />
      <CardContent>
        {viewMode === 'inputs' ? (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              User Input Categories
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {Object.keys(INPUT_TO_SCORING_MAP).map((input) => (
                <Chip
                  key={input}
                  label={INPUT_NAMES[input as UserInputKey]}
                  onClick={() => handleInputClick(input as UserInputKey)}
                  color="primary"
                  variant={selectedInput === input ? 'filled' : 'outlined'}
                  sx={{
                    bgcolor: selectedInput === input ? INPUT_COLORS[input as UserInputKey] : 'transparent',
                    borderColor: INPUT_COLORS[input as UserInputKey],
                    color: selectedInput === input ? 'white' : INPUT_COLORS[input as UserInputKey],
                    '&:hover': {
                      bgcolor: `${INPUT_COLORS[input as UserInputKey]}20`,
                    }
                  }}
                />
              ))}
            </Box>

            {selectedInput && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Form Fields in {INPUT_NAMES[selectedInput]}:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {getFieldsForInput(selectedInput).map((field) => (
                    <Chip
                      key={field}
                      label={FIELD_NAMES[field] || field}
                      size="small"
                      sx={{
                        bgcolor: `${INPUT_COLORS[selectedInput]}20`,
                        color: theme.palette.mode === 'dark' ? 'white' : 'inherit'
                      }}
                    />
                  ))}
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Affected Scoring Items:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {getAffectedScoringItems(selectedInput).map((itemId) => {
                    const item = SEO_SCORING_ITEMS.find(i => i.id === itemId);
                    if (!item) return null;

                    return (
                      <Paper
                        key={itemId}
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: `${CATEGORY_COLORS[item.category]}10`,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {item.description}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            ID: {item.id} • Category: {item.category} • Points: {item.points}
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          label={item.category}
                          sx={{
                            bgcolor: CATEGORY_COLORS[item.category],
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Paper>
                    );
                  })}
                </Box>
              </Box>
            )}
          </Box>
        ) : (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              SEO Scoring Categories
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {['primary', 'title', 'content', 'additional'].map((category) => (
                <Chip
                  key={category}
                  label={`${category.charAt(0).toUpperCase()}${category.slice(1)}`}
                  sx={{
                    bgcolor: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS],
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              ))}
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Scoring Items
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {SEO_SCORING_ITEMS.map((item) => (
                <Paper
                  key={item.id}
                  elevation={0}
                  onClick={() => handleScoringItemClick(item.id)}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: selectedScoringItem === item.id ? CATEGORY_COLORS[item.category] : 'divider',
                    bgcolor: selectedScoringItem === item.id
                      ? `${CATEGORY_COLORS[item.category]}20`
                      : `${CATEGORY_COLORS[item.category]}10`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: `${CATEGORY_COLORS[item.category]}20`,
                    }
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {item.description}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      ID: {item.id} • Points: {item.points}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={item.category}
                    sx={{
                      bgcolor: CATEGORY_COLORS[item.category],
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Paper>
              ))}
            </Box>

            {selectedScoringItem && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Affected by Input Categories:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {getAffectingInputs(selectedScoringItem).map((input) => (
                    <Chip
                      key={input}
                      label={INPUT_NAMES[input]}
                      sx={{
                        bgcolor: INPUT_COLORS[input],
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  ))}
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Related Form Fields:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {getFormFieldsForScoringItem(selectedScoringItem).map((field) => (
                    <Chip
                      key={field}
                      label={FIELD_NAMES[field] || field}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.mode === 'dark' ? 'white' : 'inherit'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
