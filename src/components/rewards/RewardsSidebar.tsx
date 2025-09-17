import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Button,
  Stack,
  Divider,
  useTheme,
  alpha,
  Tooltip,
  Fade,
  Slide,
  Zoom,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface RewardsSidebarProps {
  open: boolean;
  onClose: () => void;
}

interface RewardItem {
  id: string;
  title: string;
  description?: string;
  credits: number;
  status: 'available' | 'claimed' | 'completed';
  actionText: string;
  icon: string;
  progress?: {
    current: number;
    total: number;
  };
  expirationTime?: string;
}

// Static data for rewards
const rewardsData = {
  referAndEarn: {
    referralCode: 'M2D62VR6',
    rewards: [
      { friends: 1, credits: 50 },
      { friends: 3, credits: 110 },
      { friends: 5, credits: 140 },
    ],
  },
  dailyRewards: [
    {
      id: 'daily-login',
      title: 'Daily Login',
      credits: 60,
      status: 'claimed' as const,
      actionText: 'Claimed',
      icon: 'solar:calendar-bold',
    },
    {
      id: 'watch-ad',
      title: 'Watch a short ad (0/2)',
      credits: 30,
      status: 'available' as const,
      actionText: 'Start',
      icon: 'solar:ad-circle-bold',
      progress: { current: 0, total: 2 },
    },
  ],
  oneTimeRewards: [
    {
      id: 'download-app',
      title: 'Download App',
      credits: 30,
      status: 'available' as const,
      actionText: 'Start',
      icon: 'solar:download-bold',
    },
    {
      id: 'rate-app',
      title: 'Rate App',
      credits: 30,
      status: 'available' as const,
      actionText: 'Start',
      icon: 'solar:star-bold',
    },
    {
      id: 'customize-profile',
      title: 'Customize Your Profile',
      credits: 10,
      status: 'available' as const,
      actionText: 'Start',
      icon: 'solar:pen-bold',
    },
    {
      id: 'rewards-from-friends',
      title: 'Rewards from Friends',
      credits: 60,
      status: 'available' as const,
      actionText: 'Start',
      icon: 'solar:gift-bold',
      expirationTime: '2025-09-22',
    },
  ],
};

// ----------------------------------------------------------------------

const RewardItemComponent = ({ item, onNavigate }: { item: RewardItem; onNavigate: (path: string) => void }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const getStatusColor = () => {
    switch (item.status) {
      case 'claimed':
        return theme.palette.success.main;
      case 'completed':
        return theme.palette.primary.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getButtonVariant = () => {
    switch (item.status) {
      case 'claimed':
        return 'outlined';
      case 'completed':
        return 'contained';
      default:
        return 'outlined';
    }
  };

  const getNavigationPath = () => {
    switch (item.id) {
      case 'daily-login':
      case 'watch-ad':
        return '/rewards/daily';
      case 'download-app':
      case 'rate-app':
      case 'customize-profile':
      case 'rewards-from-friends':
        return '/rewards/one-time';
      default:
        return '/rewards/refer-earn';
    }
  };

  const handleClick = () => {
    if (item.status !== 'claimed') {
      onNavigate(getNavigationPath());
    }
  };

  return (
    <Zoom in timeout={600}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderRadius: 1,
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          mb: 1,
          cursor: item.status !== 'claimed' ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateX(4px)',
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderColor: alpha(theme.palette.primary.main, 0.2),
          },
        }}
        onClick={handleClick}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
          >
            <Iconify icon={item.icon} width={20} height={20} sx={{ color: theme.palette.primary.main }} />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {item.title}
            </Typography>
            {item.description && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {item.description}
              </Typography>
            )}
            {item.progress && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                ({item.progress.current}/{item.progress.total})
              </Typography>
            )}
            {item.expirationTime && (
              <Typography variant="caption" sx={{ color: 'warning.main', display: 'block' }}>
                Expiration Time {item.expirationTime}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1 }}>
            <Iconify icon="solar:flash-bold" width={16} height={16} sx={{ color: '#FFD700' }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFD700' }}>
              {item.credits}
            </Typography>
          </Box>
          
          <Button
            size="small"
            variant={getButtonVariant()}
            disabled={item.status === 'claimed'}
            endIcon={item.status !== 'claimed' ? <Iconify icon="solar:arrow-right-bold" width={14} height={14} /> : undefined}
            sx={{
              minWidth: 60,
              height: 32,
              fontSize: '0.75rem',
              textTransform: 'none',
              borderColor: getStatusColor(),
              color: item.status === 'claimed' ? getStatusColor() : 'text.primary',
              '&:hover': {
                borderColor: getStatusColor(),
                bgcolor: alpha(getStatusColor(), 0.1),
                transform: 'scale(1.05)',
              },
            }}
          >
            {item.actionText}
          </Button>
        </Box>
      </Box>
    </Zoom>
  );
};

// ----------------------------------------------------------------------

export function RewardsSidebar({ open, onClose }: RewardsSidebarProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(rewardsData.referAndEarn.referralCode);
    // You can add a toast notification here
  };

  const handleShareReferralCode = () => {
    // You can implement sharing functionality here
    console.log('Share referral code');
  };

  const handleNavigateToReward = (path: string) => {
    onClose(); // Close sidebar first
    setTimeout(() => {
      navigate(path);
    }, 300); // Small delay for smooth transition
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 400,
          bgcolor: theme.palette.background.default,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%)
          `,
        },
      }}
    >
      <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon="solar:gift-bold" width={20} height={20} sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {t('rewards.title', 'Earn Rewards')}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Iconify icon="solar:close-circle-bold" width={20} height={20} />
          </IconButton>
        </Box>

        {/* Refer & Earn Section */}
        <Fade in timeout={800}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t('rewards.referAndEarn', 'Refer & Earn')}
              </Typography>
              <Tooltip title={t('rewards.referAndEarnTooltip', 'Invite friends to earn bonus credits')}>
                <Iconify icon="solar:info-circle-bold" width={16} height={16} sx={{ color: 'text.secondary' }} />
              </Tooltip>
            </Box>
            
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {t('rewards.inviteFriends', 'Invite Friends to Get Bonus')}
            </Typography>

            {/* Referral Code */}
            <Slide direction="up" in timeout={1000}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  textAlign: 'center',
                  mb: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: 'monospace' }}>
                  {rewardsData.referAndEarn.referralCode}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <IconButton size="small" onClick={handleCopyReferralCode}>
                    <Iconify icon="solar:copy-bold" width={16} height={16} />
                  </IconButton>
                  <IconButton size="small" onClick={handleShareReferralCode}>
                    <Iconify icon="solar:share-bold" width={16} height={16} />
                  </IconButton>
                </Box>
              </Box>
            </Slide>

            {/* Reward Tiers */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
              {rewardsData.referAndEarn.rewards.map((reward, index) => (
                <Zoom in timeout={1200 + index * 200} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                      <Iconify icon="solar:flash-bold" width={16} height={16} sx={{ color: '#FFD700' }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFD700' }}>
                        +{reward.credits}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <Iconify icon="solar:user-bold" width={16} height={16} sx={{ color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {reward.friends}
                      </Typography>
                    </Box>
                  </Box>
                </Zoom>
              ))}
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={() => handleNavigateToReward('/rewards/refer-earn')}
              endIcon={<Iconify icon="solar:arrow-right-bold" width={16} height={16} />}
              sx={{
                mb: 1,
                bgcolor: theme.palette.grey[800],
                '&:hover': {
                  bgcolor: theme.palette.grey[700],
                  transform: 'scale(1.02)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {t('rewards.inviteFriends', 'Invite friends')}
            </Button>
            
            <Typography
              variant="caption"
              onClick={() => handleNavigateToReward('/rewards/refer-earn')}
              sx={{
                color: 'primary.main',
                textAlign: 'center',
                display: 'block',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {t('rewards.seeWhosJoined', 'See who\'s joined >')}
            </Typography>
          </Box>
        </Fade>

        <Divider sx={{ mb: 3 }} />

        {/* Daily Rewards Section */}
        <Fade in timeout={1200}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t('rewards.dailyRewards', 'Daily Rewards')}
              </Typography>
              <Tooltip title={t('rewards.dailyRewardsTooltip', 'Complete daily tasks to earn credits')}>
                <Iconify icon="solar:info-circle-bold" width={16} height={16} sx={{ color: 'text.secondary' }} />
              </Tooltip>
            </Box>

            <Stack spacing={1}>
              {rewardsData.dailyRewards.map((item, index) => (
                <RewardItemComponent 
                  key={item.id} 
                  item={item} 
                  onNavigate={handleNavigateToReward}
                />
              ))}
            </Stack>
          </Box>
        </Fade>

        <Divider sx={{ mb: 3 }} />

        {/* One-Time Rewards Section */}
        <Fade in timeout={1400}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t('rewards.oneTimeRewards', 'One-Time Rewards')}
              </Typography>
              <Tooltip title={t('rewards.oneTimeRewardsTooltip', 'Complete these tasks once to earn credits')}>
                <Iconify icon="solar:info-circle-bold" width={16} height={16} sx={{ color: 'text.secondary' }} />
              </Tooltip>
            </Box>

            <Stack spacing={1}>
              {rewardsData.oneTimeRewards.map((item, index) => (
                <RewardItemComponent 
                  key={item.id} 
                  item={item} 
                  onNavigate={handleNavigateToReward}
                />
              ))}
            </Stack>
          </Box>
        </Fade>
      </Box>
    </Drawer>
  );
}
