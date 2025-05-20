import toast from 'react-hot-toast';

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
        py: 0.75,
        px: 2,
        fontSize: theme.typography.pxToRem(14),
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
        onClick={() => {
          // Show error toast when keyword is removed
          toast.error(`Keyword "${keyword}" removed`);
          // Call the onDelete function
          onDelete(keyword);
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ml: 1,
          cursor: 'pointer',
          fontSize: theme.typography.pxToRem(16),
          fontWeight: 'bold',
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
