import type { CardProps } from '@mui/material/Card';
import type { ColorType } from 'src/theme/core/palette';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fShortenNumber } from 'src/utils/format-number';

import { varAlpha } from 'src/theme/styles';


// ----------------------------------------------------------------------

type Props = CardProps & {
  title: string;
  total: number;
  percent: number;
  color?: ColorType;
  icon: React.ReactNode;
};

export function AnalyticsWidgetSummary({
  icon,
  title,
  total,
  percent,
  color = 'primary',
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        p: 3,
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        borderRadius: 2,
        border: `1px solid ${isDarkMode ? varAlpha(theme.palette.grey['500Channel'], 0.2) : varAlpha(theme.palette.grey['500Channel'], 0.15)}`,
        backgroundColor: isDarkMode
          ? varAlpha(theme.palette.background.paper, 0.8)
          : theme.palette.common.white,
        backgroundImage: isDarkMode
          ? `linear-gradient(135deg, ${varAlpha(theme.palette[color].main, 0.05)} 0%, ${varAlpha(theme.palette.background.paper, 0.95)} 100%)`
          : `linear-gradient(135deg, ${varAlpha(theme.palette[color].main, 0.02)} 0%, ${varAlpha(theme.palette.common.whiteChannel, 1)} 100%)`,
        boxShadow: isDarkMode
          ? `0 6px 16px ${varAlpha(theme.palette.common.blackChannel, 0.3)}`
          : `0 3px 12px ${varAlpha(theme.palette.grey['500Channel'], 0.12)}`,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: isDarkMode
            ? `0 10px 28px ${varAlpha(theme.palette.common.blackChannel, 0.5)}`
            : `0 8px 24px ${varAlpha(theme.palette.grey['500Channel'], 0.18)}`,
        },
        ...sx,
      }}
      {...other}
    >
      {/* Icon with refined styling */}
      <Box
        sx={{
          width: 56,
          height: 56,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          backgroundColor: isDarkMode
            ? varAlpha(theme.palette[color].main, 0.15)
            : varAlpha(theme.palette[color].main, 0.08),
          color: theme.palette[color].main,
          transition: 'all 0.3s ease-in-out',
          '& svg': {
            filter: isDarkMode ? `drop-shadow(0 2px 4px ${varAlpha(theme.palette[color].main, 0.3)})` : 'none'
          }
        }}
      >
        {icon}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 112 }}>
          <Box sx={{
            mb: 1,
            typography: 'subtitle2',
            color: 'text.secondary',
            fontWeight: 500,
          }}>
            {title}
          </Box>
          <Box sx={{
            typography: 'h4',
            color: 'text.primary',
            fontWeight: 700,
          }}>
            {fShortenNumber(total)}
          </Box>
        </Box>

        {/* Refined percentage indicator */}
        <Box
          sx={{
            typography: 'caption',
            fontWeight: 600,
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            padding: '6px 12px',
            borderRadius: 2,
            backgroundColor: isDarkMode
              ? varAlpha(theme.palette.background.default, 0.6)
              : varAlpha(theme.palette.grey['100Channel'], 0.8),
            border: `1px solid ${isDarkMode ? varAlpha(theme.palette.grey['500Channel'], 0.1) : varAlpha(theme.palette.grey['500Channel'], 0.05)}`,
          }}
        >
          {percent}%
        </Box>
      </Box>

      {/* Subtle background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -10,
          right: -10,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${varAlpha(theme.palette[color].main, 0.03)}, transparent)`,
          zIndex: -1,
        }}
      />
    </Card>
  );
}
