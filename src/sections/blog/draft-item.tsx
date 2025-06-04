import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import CardActionArea from '@mui/material/CardActionArea';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface DraftItemProps {
  draft: {
    id: string;
    title: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    keywords?: {
      primary?: string;
      secondary?: string[];
    };
    draftContent?: any;
  };
  latestPost?: boolean;
  latestPostLarge?: boolean;
}

export function DraftItem({ draft, latestPost, latestPostLarge }: DraftItemProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to generate view with draft ID to resume editing
    navigate(`/generate?draft=${draft.id}`);
  };

  const renderStatus = (
    <Chip
      size="small"
      icon={<Iconify icon="mdi:file-document-outline" />}
      label={t('blog.draft', 'Draft')}
      color="warning"
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 9,
        bgcolor: alpha(theme.palette.warning.main, 0.9),
        color: 'white',
        fontWeight: 'bold',
      }}
    />
  );

  const renderKeywords = draft.keywords?.primary && (
    <Box sx={{ mt: 1 }}>
      <Chip
        size="small"
        label={draft.keywords.primary}
        variant="outlined"
        sx={{
          fontSize: '0.7rem',
          height: 20,
          borderColor: alpha(theme.palette.primary.main, 0.3),
          color: theme.palette.primary.main,
        }}
      />
    </Box>
  );

  const renderDate = (
    <Typography variant="caption" color="text.disabled">
      {t('blog.updated', 'Updated {{date}}', { date: fDate(draft.updatedAt) })}
    </Typography>
  );

  const renderShape = (
    <Box
      sx={{
        top: 0,
        width: 1,
        height: 8,
        zIndex: 9,
        position: 'absolute',
        borderRadius: 1.5,
        bgcolor: 'warning.main',
      }}
    />
  );

  return (
    <Card
      sx={{
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      {renderShape}
      {renderStatus}

      <CardActionArea onClick={handleClick}>
        <Box
          sx={{
            p: 3,
            height: latestPostLarge ? 360 : 280,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Stack spacing={2}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
              }}
            >
              <Iconify 
                icon="mdi:file-document-edit" 
                width={20} 
                height={20} 
                sx={{ color: 'warning.main' }}
              />
              <Typography variant="caption" color="warning.main" fontWeight="bold">
                {t('blog.draftInProgress', 'DRAFT IN PROGRESS')}
              </Typography>
            </Box>

            <Typography
              variant={latestPostLarge ? 'h5' : 'h6'}
              sx={{
                overflow: 'hidden',
                WebkitLineClamp: latestPostLarge ? 3 : 2,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                fontWeight: 'bold',
                lineHeight: 1.3,
              }}
            >
              {draft.title}
            </Typography>

            {draft.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  WebkitLineClamp: latestPostLarge ? 4 : 3,
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.5,
                }}
              >
                {draft.description}
              </Typography>
            )}

            {renderKeywords}
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            {renderDate}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Iconify icon="mdi:pencil" width={14} height={14} />
              <Typography variant="caption" color="text.secondary">
                {t('blog.continueEditing', 'Continue editing')}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </CardActionArea>
    </Card>
  );
}
