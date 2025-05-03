import { Box, useTheme } from '@mui/material';

interface KeywordChipProps {
  keyword: string;
  index: number;
  onDelete: (keyword: string) => void;
}

export function KeywordChip({ keyword, index, onDelete }: KeywordChipProps) {
  const theme = useTheme();

  return (
    <Box
      key={index}
      sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: theme.palette.primary.lighter,
        color: theme.palette.primary.dark,
        borderRadius: theme.shape.borderRadius * 2,
        py: 0.5,
        px: 1.5,
        fontSize: theme.typography.pxToRem(12),
        animation: `fadeIn 0.3s ease-in-out ${index * 0.05}s both`,
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(5px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {keyword}
      <Box
        component="span"
        onClick={() => onDelete(keyword)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ml: 0.5,
          cursor: 'pointer',
          fontSize: theme.typography.pxToRem(14),
          lineHeight: 1,
          transition: 'opacity 0.2s ease',
          '&:hover': { opacity: 0.7 },
        }}
      >
        ×
      </Box>
    </Box>
  );
}
