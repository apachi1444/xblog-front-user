import type { Article } from 'src/types/article';

import { useState } from 'react';
import { format, isToday } from 'date-fns';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Grid,
  Chip,
  alpha,
  Button,
  Tooltip,
  useTheme,
  Typography,
  IconButton,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { ArticleListModal } from './ArticleListModal';

interface CalendarDayCellProps {
  day: Date;
  scheduledArticles: Article[];
  isInteractive: boolean;
  dayStatus: string;
  onDayClick: (day: Date) => void;
  onArticleClick: (article: Article) => void;
}

const MAX_VISIBLE_ARTICLES = 3;

export function CalendarDayCell({
  day,
  scheduledArticles,
  isInteractive,
  dayStatus,
  onDayClick,
  onArticleClick,
}: CalendarDayCellProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [showAllArticles, setShowAllArticles] = useState(false);

  const visibleArticles = scheduledArticles.slice(0, MAX_VISIBLE_ARTICLES);
  const hiddenCount = scheduledArticles.length - MAX_VISIBLE_ARTICLES;

  // Get background color based on day status
  let bgColor = 'transparent';
  if (isToday(day)) {
    bgColor = alpha(theme.palette.primary.main, 0.08);
  } else if (dayStatus === 'published') {
    bgColor = alpha(theme.palette.success.main, 0.08);
  } else if (dayStatus === 'upcoming') {
    bgColor = alpha(theme.palette.warning.main, 0.08);
  } else if (dayStatus === 'past-missed') {
    bgColor = alpha(theme.palette.error.main, 0.08);
  } else if (dayStatus === 'past-empty') {
    bgColor = alpha(theme.palette.grey[500], 0.15);
  }

  return (
    <>
      <Grid
        item
        xs={12 / 7}
        sx={{
          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          height: 120,
          position: 'relative',
          bgcolor: bgColor,
          opacity: isInteractive ? 1 : 0.7,
          padding: 1,
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          '&:hover': isInteractive ? {
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            borderColor: alpha(theme.palette.primary.main, 0.2),
          } : {},
        }}
      >
        {/* Day header with number and add button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
            height: 24,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: isToday(day) ? 700 : 500,
              color: isToday(day) ? theme.palette.primary.main : 'text.primary',
              fontSize: '0.875rem',
            }}
          >
            {format(day, 'd')}
          </Typography>

          {isInteractive && (
            <Tooltip title={t('calendar.addArticle', 'Add article')}>
              <IconButton
                size="small"
                onClick={() => onDayClick(day)}
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <Iconify icon="eva:plus-fill" width={12} height={12} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Articles container */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            height: 'calc(100% - 32px)',
            overflow: 'hidden',
          }}
        >
          {/* Visible articles */}
          {visibleArticles.map((article, idx) => (
            <Chip
              key={idx}
              label={article.title || `Article #${article.id}`}
              size="small"
              onClick={() => onArticleClick(article)}
              sx={{
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 500,
                bgcolor: article.status === 'publish' 
                  ? alpha(theme.palette.success.main, 0.9)
                  : alpha(theme.palette.warning.main, 0.9),
                color: theme.palette.getContrastText(
                  article.status === 'publish' 
                    ? theme.palette.success.main 
                    : theme.palette.warning.main
                ),
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '& .MuiChip-label': {
                  px: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%',
                },
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: theme.shadows[2],
                  filter: 'brightness(1.1)',
                },
              }}
            />
          ))}

          {/* Show more button if there are hidden articles */}
          {hiddenCount > 0 && (
            <Button
              size="small"
              variant="text"
              onClick={() => setShowAllArticles(true)}
              sx={{
                height: 20,
                minHeight: 20,
                fontSize: '0.65rem',
                fontWeight: 600,
                color: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                borderRadius: 1,
                px: 1,
                py: 0,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                },
                '& .MuiButton-startIcon': {
                  marginRight: 0.5,
                  marginLeft: 0,
                },
              }}
              startIcon={<Iconify icon="eva:more-horizontal-fill" width={12} height={12} />}
            >
              +{hiddenCount} more
            </Button>
          )}
        </Box>

        {/* Today indicator */}
        {isToday(day) && (
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: theme.palette.primary.main,
              boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          />
        )}
      </Grid>

      {/* Article list modal for overflow */}
      <ArticleListModal
        open={showAllArticles}
        onClose={() => setShowAllArticles(false)}
        articles={scheduledArticles}
        date={day}
        onArticleClick={(article) => {
          setShowAllArticles(false);
          onArticleClick(article);
        }}
      />
    </>
  );
}

export default CalendarDayCell;
