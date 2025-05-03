import { Button, CircularProgress, Typography, useTheme } from '@mui/material';
import { Iconify } from 'src/components/iconify';

interface GenerationButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  isDisabled?: boolean;
  label: string;
  loadingLabel?: string;
  icon?: string;
  variant?: 'contained' | 'outlined';
  color?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

export function GenerationButton({
  onClick,
  isGenerating,
  isDisabled = false,
  label,
  loadingLabel = 'Generating...',
  icon = 'eva:flash-fill',
  variant = 'contained',
  color = 'primary',
  size = 'medium',
}: GenerationButtonProps) {
  const theme = useTheme();

  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      disabled={isGenerating || isDisabled}
      startIcon={
        isGenerating ? (
          <CircularProgress size={size === 'small' ? 16 : 20} color="inherit" />
        ) : (
          <Iconify icon={icon} />
        )
      }
      sx={{
        borderRadius: theme.spacing(3),
        px: 3,
        textTransform: 'none',
        transition: 'all 0.3s ease',
        opacity: isGenerating ? 0.8 : 1,
        ...(size === 'small' && {
          fontSize: theme.typography.pxToRem(12),
          py: 0.5,
        }),
      }}
    >
      {size === 'small' ? (
        <Typography
          variant="caption"
          sx={{
            color: 'inherit',
            fontWeight: 500,
          }}
        >
          {isGenerating ? loadingLabel : label}
        </Typography>
      ) : (
        isGenerating ? loadingLabel : label
      )}
    </Button>
  );
}
