// Types
import type { AffectedCriterion } from 'src/sections/generate/hooks/seoScoring/types';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@mui/material/styles';
// Icons
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Box,
  List,
  Divider,
  Tooltip,
  ListItem,
  Collapse,
  Typography,
  IconButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';

interface AffectedCriteriaListProps {
  criteria: AffectedCriterion[];
  title?: string;
  showImpactOnly?: boolean;
}

export function AffectedCriteriaList({
  criteria,
  title = 'Other affected criteria',
  showImpactOnly = false
}: AffectedCriteriaListProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);

  // Filter criteria if showImpactOnly is true
  const displayCriteria = showImpactOnly
    ? criteria.filter(criterion => criterion.impact !== 'neutral')
    : criteria;

  // If no criteria to display, return null
  if (displayCriteria.length === 0) {
    return null;
  }

  // Count positive and negative impacts
  const positiveCount = displayCriteria.filter(c => c.impact === 'positive').length;
  const negativeCount = displayCriteria.filter(c => c.impact === 'negative').length;

  // Get summary text
  const getSummaryText = () => {
    if (positiveCount > 0 && negativeCount > 0) {
      return t('This change will positively affect {{positiveCount}} criteria and negatively affect {{negativeCount}} criteria',
        { positiveCount, negativeCount });
    } if (positiveCount > 0) {
      return t('This change will positively affect {{count}} criteria', { count: positiveCount });
    } if (negativeCount > 0) {
      return t('This change will negatively affect {{count}} criteria', { count: negativeCount });
    }
    return t('This change will not affect other criteria');
  };

  // Get icon color based on impact
  const getIconColor = (impact: 'positive' | 'negative' | 'neutral') => {
    switch (impact) {
      case 'positive':
        return theme.palette.success.main;
      case 'negative':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  // Get icon based on impact
  const getImpactIcon = (impact: 'positive' | 'negative' | 'neutral') => {
    switch (impact) {
      case 'positive':
        return <TrendingUpIcon sx={{ color: getIconColor(impact) }} />;
      case 'negative':
        return <TrendingDownIcon sx={{ color: getIconColor(impact) }} />;
      default:
        return <TrendingFlatIcon sx={{ color: getIconColor(impact) }} />;
    }
  };

  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        bgcolor: theme.palette.background.neutral
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {t(title)}
        </Typography>
        <IconButton
          size="small"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? t('Collapse') : t('Expand')}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {getSummaryText()}
      </Typography>

      <Divider sx={{ my: 1 }} />

      <Collapse in={expanded}>
        <List dense disablePadding>
          {displayCriteria.map((criterion) => (
            <ListItem key={criterion.id} alignItems="flex-start" sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                {getImpactIcon(criterion.impact)}
              </ListItemIcon>
              <ListItemText
                primary={criterion.text}
                secondary={
                  <Typography
                    variant="body2"
                    color={getIconColor(criterion.impact)}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    {criterion.message}
                  </Typography>
                }
              />
              <Tooltip title={criterion.message}>
                <InfoOutlinedIcon
                  fontSize="small"
                  color="action"
                  sx={{ ml: 1, opacity: 0.6 }}
                />
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
}
