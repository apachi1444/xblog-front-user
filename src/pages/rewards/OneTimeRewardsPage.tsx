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
  Avatar,
  Alert,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface OneTimeReward {
  id: string;
  title: string;
  description: string;
  credits: number;
  status: 'available' | 'claimed' | 'completed';
  icon: string;
  category: 'app' | 'profile' | 'social' | 'referral';
  requirements?: string[];
  expirationTime?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const mockOneTimeRewards: OneTimeReward[] = [
  {
    id: 'download-app',
    title: 'Download Mobile App',
    description: 'Download and install our mobile application',
    credits: 30,
    status: 'available',
    icon: 'solar:download-bold',
    category: 'app',
    requirements: ['Install the app', 'Sign in with your account'],
    difficulty: 'easy',
  },
  {
    id: 'rate-app',
    title: 'Rate the App',
    description: 'Rate our app on the App Store or Google Play',
    credits: 30,
    status: 'available',
    icon: 'solar:star-bold',
    category: 'app',
    requirements: ['Rate 5 stars', 'Write a review'],
    difficulty: 'easy',
  },
  {
    id: 'customize-profile',
    title: 'Customize Your Profile',
    description: 'Complete your profile with avatar, bio, and preferences',
    credits: 10,
    status: 'completed',
    icon: 'solar:pen-bold',
    category: 'profile',
    requirements: ['Add profile picture', 'Write bio', 'Set preferences'],
    difficulty: 'easy',
  },
  {
    id: 'rewards-from-friends',
    title: 'Rewards from Friends',
    description: 'Earn credits when your friends complete tasks',
    credits: 60,
    status: 'available',
    icon: 'solar:gift-bold',
    category: 'referral',
    requirements: ['Invite at least 3 friends', 'Friends must complete tasks'],
    difficulty: 'medium',
    expirationTime: '2025-09-22',
  },
  {
    id: 'connect-social',
    title: 'Connect Social Media',
    description: 'Connect your social media accounts',
    credits: 25,
    status: 'claimed',
    icon: 'solar:share-bold',
    category: 'social',
    requirements: ['Connect Twitter', 'Connect LinkedIn', 'Connect Facebook'],
    difficulty: 'medium',
  },
  {
    id: 'first-article',
    title: 'Publish First Article',
    description: 'Publish your very first article',
    credits: 50,
    status: 'completed',
    icon: 'solar:document-text-bold',
    category: 'app',
    requirements: ['Create an article', 'Publish it'],
    difficulty: 'easy',
  },
];

// ----------------------------------------------------------------------

export default function OneTimeRewardsPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rewards, setRewards] = useState<OneTimeReward[]>(mockOneTimeRewards);
  const [claimingReward, setClaimingReward] = useState<string | null>(null);

  const handleClaimReward = async (rewardId: string) => {
    setClaimingReward(rewardId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setRewards(prev => prev.map(reward => 
      reward.id === rewardId 
        ? { ...reward, status: 'claimed' as const }
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return theme.palette.success.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'hard':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'app':
        return 'solar:smartphone-bold';
      case 'profile':
        return 'solar:user-bold';
      case 'social':
        return 'solar:share-bold';
      case 'referral':
        return 'solar:users-group-rounded-bold';
      default:
        return 'solar:gift-bold';
    }
  };

  const getButtonText = (reward: OneTimeReward) => {
    if (reward.status === 'claimed') return t('rewards.claimed', 'Claimed');
    if (reward.status === 'completed') return t('rewards.completed', 'Completed');
    if (claimingReward === reward.id) return t('rewards.claiming', 'Claiming...');
    return t('rewards.claim', 'Claim');
  };

  const isButtonDisabled = (reward: OneTimeReward) => 
    reward.status === 'claimed' || reward.status === 'completed' || claimingReward === reward.id;

  const completedRewards = rewards.filter(r => r.status === 'completed' || r.status === 'claimed').length;
  const totalRewards = rewards.length;
  const totalCredits = rewards
    .filter(r => r.status === 'completed' || r.status === 'claimed')
    .reduce((sum, r) => sum + r.credits, 0);

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
              {t('rewards.oneTimeRewards', 'One-Time Rewards')}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {t('rewards.oneTimeRewardsDescription', 'Complete these tasks once to earn permanent credits and unlock achievements')}
            </Typography>
          </Box>

          {/* Stats Summary */}
          <Slide direction="up" in timeout={800}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
              <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                        {completedRewards}/{totalRewards}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {t('rewards.tasksCompleted', 'Tasks Completed')}
                      </Typography>
                    </Box>
                    <Iconify icon="solar:check-circle-bold" width={40} height={40} sx={{ color: 'white' }} />
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                        {totalCredits}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {t('rewards.totalCreditsEarned', 'Total Credits Earned')}
                      </Typography>
                    </Box>
                    <Iconify icon="solar:flash-bold" width={40} height={40} sx={{ color: '#FFD700' }} />
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                        {Math.round((completedRewards / totalRewards) * 100)}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {t('rewards.completionRate', 'Completion Rate')}
                      </Typography>
                    </Box>
                    <Iconify icon="solar:chart-bold" width={40} height={40} sx={{ color: 'white' }} />
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Slide>

          {/* Category Filter */}
          <Slide direction="up" in timeout={1000}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {t('rewards.categories', 'Categories')}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {['all', 'app', 'profile', 'social', 'referral'].map((category) => (
                  <Chip
                    key={category}
                    label={t(`rewards.category.${category}`, category)}
                    variant={category === 'all' ? 'filled' : 'outlined'}
                    icon={category !== 'all' ? <Iconify icon={getCategoryIcon(category)} width={16} height={16} /> : undefined}
                    sx={{
                      fontWeight: 600,
                      ...(category === 'all' ? {
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                      } : {}),
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Slide>

          {/* Rewards List */}
          <Stack spacing={3}>
            {rewards.map((reward, index) => (
              <Slide direction="up" in timeout={1200 + index * 200} key={reward.id}>
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
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
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
                          <Chip
                            label={t(`rewards.difficulty.${reward.difficulty}`, reward.difficulty)}
                            size="small"
                            sx={{
                              bgcolor: alpha(getDifficultyColor(reward.difficulty), 0.1),
                              color: getDifficultyColor(reward.difficulty),
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          {reward.description}
                        </Typography>

                        {/* Requirements */}
                        {reward.requirements && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                              {t('rewards.requirements', 'Requirements')}:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              {reward.requirements.map((req, reqIndex) => (
                                <Chip
                                  key={reqIndex}
                                  label={req}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.75rem' }}
                                />
                              ))}
                            </Stack>
                          </Box>
                        )}

                        {/* Expiration Time */}
                        {reward.expirationTime && (
                          <Alert severity="warning" sx={{ mb: 2 }}>
                            <Typography variant="caption">
                              {t('rewards.expirationTime', 'Expiration Time')}: {reward.expirationTime}
                            </Typography>
                          </Alert>
                        )}
                      </Box>

                      {/* Credits and Action */}
                      <Box sx={{ textAlign: 'right', minWidth: 120 }}>
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

          {/* Achievement Badge */}
          <Slide direction="up" in timeout={2000}>
            <Card sx={{ mt: 4, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                      {t('rewards.achievement', 'Achievement Unlocked!')}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {t('rewards.achievementDescription', 'You\'ve completed multiple tasks and earned the "Task Master" badge!')}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Iconify icon="solar:medal-star-bold" width={60} height={60} sx={{ color: '#FFD700' }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
                      {t('rewards.taskMaster', 'Task Master')}
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
