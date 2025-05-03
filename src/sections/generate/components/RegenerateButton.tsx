import { Box, Button, CircularProgress } from '@mui/material';
import { Iconify } from 'src/components/iconify';

interface RegenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  label?: string;
}

export function RegenerateButton({
  onClick,
  isGenerating,
  label = 'Regenerate',
}: RegenerateButtonProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        onClick={onClick}
        disabled={isGenerating}
        startIcon={isGenerating ? <CircularProgress size={20} /> : <Iconify icon="eva:refresh-fill" />}
        sx={{
          borderRadius: 6,
        }}
      >
        {isGenerating ? 'Regenerating...' : label}
      </Button>
    </Box>
  );
}
