import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
  useTheme,
  alpha,
  Fade,
  Slide,
  LinearProgress,
  Avatar,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface DailyReward {
  id: string;
  title: string;
  description: string;
  credits: number;
  status: 'available' | 'claimed' | 'completed';
  progress?: {
    current: number;
    total: number;
  };
  icon: string;
  cooldown?: number; // in hours
  lastClaimed?: string;
}

const mockDailyRewards: DailyReward[] = [
  {
    id: 'daily-login',
    title: 'Daily Login',
    description: 'Log in to the app to claim your daily reward',
    credits: 60,
    status: 'claimed',
    icon: 'solar:calendar-bold',
    lastClaimed: '2024-01-15T08:30:00Z',
  },
  {
    id: 'watch-ad',
    title: 'Watch Advertisement',
    description: 'Watch a short advertisement to earn credits',
    credits: 30,
    status: 'available',
    progress: { current: 0, total: 2 },
    icon: 'solar:ad-circle-bold',
  },
  {
    id: 'complete-profile',
    title: 'Complete Profile',
    description: 'Update your profile information',
    credits: 25,
    status: 'completed',
    icon: 'solar:user-bold',
  },
  {
    id: 'share-content',
    title: 'Share Content',
    description: 'Share an article on social media',
    credits: 20,
    status: 'available',
    icon: 'solar:share-bold',
  },
];

// ----------------------------------------------------------------------

export default function DailyRewardsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rewards, setRewards] = useState<DailyReward[]>(mockDailyRewards);
  const [claimingReward, setClaimingReward] = useState<string | null>(null);

  const handleClaimReward = async (rewardId: string) => {
    setClaimingReward(rewardId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setRewards(prev => prev.map(reward => 
      reward.id === rewardId 
        ? { ...reward, status: 'claimed' as const, lastClaimed: new Date().toISOString() }
        : reward
    ));
    
    setClaimingReward(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'claimed':
        return theme.palette.success.main;
      case 'completed':
        return theme.palette.primary.main;
      case 'available':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'claimed':
        return t('rewards.claimed', 'Claimed');
      case 'completed':
        return t('rewards.completed', 'Completed');
      case 'available':
        return t('rewards.available', 'Available');
      default:
        return status;
    }
  };

  const getButtonText = (reward: DailyReward) => {
    if (reward.status === 'claimed') return t('rewards.claimed', 'Claimed');
    if (reward.status === 'completed') return t('rewards.completed', 'Completed');
    if (claimingReward === reward.id) return t('rewards.claiming', 'Claiming...');
    return t('rewards.claim', 'Claim');
  };

  const isButtonDisabled = (reward: DailyReward) => 
    reward.status === 'claimed' || reward.status === 'completed' || claimingReward === reward.id;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<Iconify icon="solar:arrow-left-bold" />}
              onClick={() => navigate(-1)}
              sx={{ mb: 2 }}
            >
              {t('common.back', 'Back')}
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {t('rewards.dailyRewards', 'Daily Rewards')}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {t('rewards.dailyRewardsDescription', 'Complete daily tasks to earn credits and boost your account')}
            </Typography>
          </Box>

          {/* Stats Summary */}
          <Slide direction="up" in timeout={800}>
            <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                      {rewards.filter(r => r.status === 'claimed').length * 60 + 
                       rewards.filter(r => r.status === 'completed').length * 25}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {t('rewards.todayEarnings', 'Credits Earned Today')}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                      {rewards.filter(r => r.status === 'claimed' || r.status === 'completed').length} / {rewards.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {t('rewards.tasksCompleted', 'Tasks Completed')}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Slide>

          {/* Rewards List */}
          <Stack spacing={3}>
            {rewards.map((reward, index) => (
              <Slide direction="up" in timeout={1000 + index * 200} key={reward.id}>
                <Card
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      {/* Icon */}
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: alpha(getStatusColor(reward.status), 0.1),
                        }}
                      >
                        <Iconify
                          icon={reward.icon}
                          width={30}
                          height={30}
                          sx={{ color: getStatusColor(reward.status) }}
                        />
                      </Avatar>

                      {/* Content */}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {reward.title}
                          </Typography>
                          <Chip
                            label={getStatusText(reward.status)}
                            size="small"
                            sx={{
                              bgcolor: alpha(getStatusColor(reward.status), 0.1),
                              color: getStatusColor(reward.status),
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          {reward.description}
                        </Typography>

                        {/* Progress Bar for tasks with progress */}
                        {reward.progress && (
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                {t('rewards.progress', 'Progress')}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {reward.progress.current} / {reward.progress.total}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={(reward.progress.current / reward.progress.total) * 100}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                '& .MuiLinearProgress-bar': {
                                  background: `linear-gradient(135deg, ${getStatusColor(reward.status)} 0%, ${alpha(getStatusColor(reward.status), 0.7)} 100%)`,
                                  borderRadius: 3,
                                },
                              }}
                            />
                          </Box>
                        )}

                        {/* Last claimed time */}
                        {reward.lastClaimed && (
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {t('rewards.lastClaimed', 'Last claimed')}: {new Date(reward.lastClaimed).toLocaleString()}
                          </Typography>
                        )}
                      </Box>

                      {/* Credits and Action */}
                      <Box sx={{ textAlign: 'right' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Iconify icon="solar:flash-bold" width={20} height={20} sx={{ color: '#FFD700' }} />
                          <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700 }}>
                            +{reward.credits}
                          </Typography>
                        </Box>
                        <Button
                          variant={reward.status === 'claimed' || reward.status === 'completed' ? 'outlined' : 'contained'}
                          disabled={isButtonDisabled(reward)}
                          onClick={() => handleClaimReward(reward.id)}
                          sx={{
                            minWidth: 100,
                            height: 36,
                            textTransform: 'none',
                            fontWeight: 600,
                            ...(reward.status === 'claimed' || reward.status === 'completed' ? {
                              borderColor: getStatusColor(reward.status),
                              color: getStatusColor(reward.status),
                            } : {}),
                          }}
                        >
                          {getButtonText(reward)}
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Slide>
            ))}
          </Stack>

          {/* Daily Streak Info */}
          <Slide direction="up" in timeout={1600}>
            <Card sx={{ mt: 4, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                      {t('rewards.dailyStreak', 'Daily Streak')}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {t('rewards.streakDescription', 'Keep logging in daily to maintain your streak and earn bonus rewards!')}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ color: 'white', fontWeight: 700 }}>
                      7
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {t('rewards.days', 'Days')}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Slide>
        </Box>
      </Fade>
    </Container>
  );
}
