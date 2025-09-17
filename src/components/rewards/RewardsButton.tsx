import { useTranslation } from 'react-i18next';

import { Box, Button, useTheme, alpha } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { useRewards } from 'src/contexts/RewardsContext';
import { RewardsSidebar } from './RewardsSidebar';

// ----------------------------------------------------------------------

export function RewardsButton() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isRewardsSidebarOpen, openRewardsSidebar, closeRewardsSidebar } = useRewards();

  return (
    <>
      <Button
        onClick={openRewardsSidebar}
        variant="outlined"
        startIcon={
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: 0.5,
              background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon="solar:gift-bold" width={14} height={14} sx={{ color: 'white' }} />
          </Box>
        }
        sx={{
          px: 2,
          py: 0.75,
          borderRadius: 2,
          borderColor: alpha(theme.palette.primary.main, 0.3),
          color: theme.palette.text.primary,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          '&:hover': {
            borderColor: alpha(theme.palette.primary.main, 0.5),
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          },
        }}
      >
        {t('rewards.earnRewards', 'Earn Rewards')}
      </Button>

      <RewardsSidebar open={isRewardsSidebarOpen} onClose={closeRewardsSidebar} />
    </>
  );
}
