import type { CardProps } from '@mui/material/Card';
import type { ColorType } from 'src/theme/core/palette';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fShortenNumber } from 'src/utils/format-number';

import { varAlpha, bgGradient } from 'src/theme/styles';

import { SvgColor } from 'src/components/svg-color';

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
        ...bgGradient({
          color: isDarkMode
            ? `135deg, ${varAlpha(theme.palette[color].darkerChannel, 0.8)}, ${varAlpha(theme.palette[color].darkChannel, 0.8)}`
            : `135deg, ${varAlpha(theme.palette[color].lighterChannel, 0.48)}, ${varAlpha(theme.palette[color].lightChannel, 0.48)}`,
        }),
        p: 3,
        boxShadow: isDarkMode ? `0 8px 16px 0 ${varAlpha(theme.palette[color].darkChannel, 0.24)}` : 'none',
        position: 'relative',
        color: isDarkMode ? `${color}.lighter` : `${color}.darker`,
        backgroundColor: isDarkMode ? 'transparent' : 'common.white',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: isDarkMode
            ? `0 12px 20px 0 ${varAlpha(theme.palette[color].darkChannel, 0.3)}`
            : theme.customShadows.z8,
        },
        ...sx,
      }}
      {...other}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          mb: 3,
          color: isDarkMode ? `${color}.light` : `${color}.main`,
          transition: 'transform 0.3s ease-in-out',
          '& svg': {
            filter: isDarkMode ? 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.2))' : 'none'
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
            color: isDarkMode ? 'grey.100' : 'inherit'
          }}>
            {title}
          </Box>
          <Box sx={{
            typography: 'h4',
            color: isDarkMode ? 'common.white' : 'inherit',
            textShadow: isDarkMode ? '0 0 8px rgba(255, 255, 255, 0.15)' : 'none'
          }}>
            {fShortenNumber(total)}
          </Box>
        </Box>

        <Box
          sx={{
            typography: 'subtitle2',
            color: percent >= 0
              ? (isDarkMode ? 'success.light' : 'success.main')
              : (isDarkMode ? 'error.light' : 'error.main'),
            display: 'flex',
            alignItems: 'center',
            padding: '4px 8px',
            borderRadius: '12px',
            backgroundColor: percent >= 0
              ? (isDarkMode ? varAlpha(theme.palette.success.mainChannel, 0.16) : varAlpha(theme.palette.success.mainChannel, 0.08))
              : (isDarkMode ? varAlpha(theme.palette.error.mainChannel, 0.16) : varAlpha(theme.palette.error.mainChannel, 0.08)),
          }}
        >
          {percent > 0 && '+'}
          {percent}%
        </Box>
      </Box>

      <SvgColor
        src="/assets/background/shape-square.svg"
        sx={{
          top: 0,
          left: -20,
          width: 240,
          zIndex: -1,
          height: 240,
          opacity: isDarkMode ? 0.16 : 0.24,
          position: 'absolute',
          color: `${color}.main`,
          filter: isDarkMode ? 'blur(2px)' : 'none',
        }}
      />
    </Card>
  );
}
