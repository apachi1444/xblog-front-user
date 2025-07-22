import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
  Grid,
  Chip,
  Stack,
  alpha,
  Button,
  useTheme,
  Typography,
  CardContent,
  CardActions
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// Mock draft articles for testing
const mockDraftArticles = [
  {
    id: 6,
    title: 'The Complete Guide to Digital Marketing Strategies for Modern Businesses',
    description: 'A comprehensive guide covering the essential digital marketing strategies that modern businesses need to succeed in today\'s competitive online landscape.',
    primaryKeyword: 'digital marketing strategies',
    secondaryKeywords: ['social media marketing', 'content marketing', 'email marketing', 'SEO optimization'],
    articleType: 'how-to',
    articleSize: 'large',
    toneOfVoice: 'professional',
    pointOfView: 'second-person',
    includeImages: true,
    includeVideos: false,
    created_at: '2025-06-18T00:53:09',
    completionLevel: 85, // 85% complete
  },
  {
    id: 7,
    title: 'E-commerce SEO: Boost Your Online Store\'s Visibility',
    description: 'Learn how to optimize your e-commerce website for search engines and increase organic traffic to boost sales.',
    primaryKeyword: 'e-commerce SEO',
    secondaryKeywords: ['product optimization', 'online store SEO', 'conversion rate optimization'],
    articleType: 'listicle',
    articleSize: 'medium',
    toneOfVoice: 'friendly',
    pointOfView: 'first-person',
    includeImages: true,
    includeVideos: true,
    created_at: '2025-06-17T14:30:00',
    completionLevel: 60, // 60% complete
  }
];

export default function TestDraftEditingPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleEditDraft = (draftId: number) => {
    console.log(`🔄 Testing draft editing for article ID: ${draftId}`);
    navigate(`/generate?draft=${draftId}`);
  };

  const getCompletionColor = (level: number) => {
    if (level >= 80) return 'success';
    if (level >= 50) return 'warning';
    return 'error';
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          🧪 Draft Editing Feature Test
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Test the new comprehensive draft editing feature. Click on any draft below to see how all form fields are pre-populated with existing data.
        </Typography>
        
        <Box sx={{ p: 2, bgcolor: 'info.lighter', borderRadius: 1, mb: 3 }}>
          <Typography variant="h6" color="info.main" gutterBottom>
            🎯 What to Test:
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2">• Click on a draft card to navigate to the generate view</Typography>
            <Typography variant="body2">• Verify Step 1 fields are pre-filled (title, keywords, description, meta data)</Typography>
            <Typography variant="body2">• Check Step 2 settings are preserved (article type, size, tone, etc.)</Typography>
            <Typography variant="body2">• Confirm links are properly parsed and displayed</Typography>
            <Typography variant="body2">• Test the save/update functionality</Typography>
          </Stack>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {mockDraftArticles.map((draft) => (
          <Grid key={draft.id} xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
              onClick={() => handleEditDraft(draft.id)}
            >
              <CardContent sx={{ pb: 1 }}>
                {/* Header with status */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Chip
                    size="small"
                    icon={<Iconify icon="mdi:file-document-edit" />}
                    label="DRAFT"
                    color="warning"
                    sx={{ fontWeight: 'bold' }}
                  />
                  <Chip
                    size="small"
                    label={`${draft.completionLevel}% Complete`}
                    color={getCompletionColor(draft.completionLevel)}
                    variant="outlined"
                  />
                </Box>

                {/* Title */}
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', lineHeight: 1.3 }}>
                  {draft.title}
                </Typography>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                  {draft.description}
                </Typography>

                {/* Keywords */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Primary Keyword:
                  </Typography>
                  <Chip
                    size="small"
                    label={draft.primaryKeyword}
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                </Box>

                {/* Settings Preview */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Article Settings:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip size="small" label={draft.articleType} variant="outlined" />
                    <Chip size="small" label={draft.articleSize} variant="outlined" />
                    <Chip size="small" label={draft.toneOfVoice} variant="outlined" />
                  </Stack>
                </Box>

                {/* Media Settings */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {draft.includeImages && (
                    <Chip
                      size="small"
                      icon={<Iconify icon="mdi:image" width={14} />}
                      label="Images"
                      color="success"
                      variant="outlined"
                    />
                  )}
                  {draft.includeVideos && (
                    <Chip
                      size="small"
                      icon={<Iconify icon="mdi:video" width={14} />}
                      label="Videos"
                      color="success"
                      variant="outlined"
                    />
                  )}
                </Box>

                {/* Created Date */}
                <Typography variant="caption" color="text.disabled">
                  Created: {new Date(draft.created_at).toLocaleDateString()}
                </Typography>
              </CardContent>

              <CardActions sx={{ pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Iconify icon="mdi:pencil" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditDraft(draft.id);
                  }}
                  sx={{
                    bgcolor: 'warning.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'warning.dark',
                    },
                  }}
                >
                  Continue Editing
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Instructions */}
      <Box sx={{ mt: 4, p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
        <Typography variant="h6" color="primary.main" gutterBottom>
          📋 Testing Instructions:
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2">
            1. <strong>Click on any draft card above</strong> to navigate to the generate view
          </Typography>
          <Typography variant="body2">
            2. <strong>Verify Step 1 is pre-filled:</strong> Check title, keywords, description, meta title, meta description, URL slug
          </Typography>
          <Typography variant="body2">
            3. <strong>Check Step 2 settings:</strong> Article type, size, tone, point of view, AI settings, media preferences
          </Typography>
          <Typography variant="body2">
            4. <strong>Verify links are parsed:</strong> Internal and external links should be properly displayed in the link management sections
          </Typography>
          <Typography variant="body2">
            5. <strong>Test editing:</strong> Make changes and verify the save functionality works
          </Typography>
        </Stack>
      </Box>
    </DashboardContent>
  );
}
