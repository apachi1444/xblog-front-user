import { AnimatePresence } from 'framer-motion';

import { Box, useTheme, Typography } from '@mui/material';

import { GenerationLoadingAnimation } from 'src/components/generate-article/GenerationLoadingAnimation';

import { GenerationButton } from './GenerationButton';

interface GenerationPlaceholderProps {
  title: string;
  buttonLabel: string;
  onGenerate: () => void;
  isGenerating: boolean;
  isDisabled?: boolean;
  height?: number;
}

export function GenerationPlaceholder({
  title,
  buttonLabel,
  onGenerate,
  isGenerating,
  isDisabled = false,
  height = 14,
}: GenerationPlaceholderProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        height: theme.spacing(height),
        borderRadius: theme.shape.borderRadius / 6,
        position: 'relative',
        overflow: 'hidden',
        mb: 2,
        bgcolor: theme.palette.background.neutral,
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed',
        borderColor: theme.palette.primary.main,
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 1, color: theme.palette.text.secondary }}>
        {title}
      </Typography>

      <GenerationButton
        onClick={onGenerate}
        isGenerating={isGenerating}
        isDisabled={isDisabled}
        label={buttonLabel}
      />

      <AnimatePresence>
        {isGenerating && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              zIndex: 10,
            }}
          >
            <GenerationLoadingAnimation
              isLoading={isGenerating}
              message={`Generating ${buttonLabel.toLowerCase()}...`}
              size="medium"
            />
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
}
