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
  LinearProgress,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface ReferralData {
  code: string;
  totalEarnings: number;
  friendsInvited: number;
  friendsJoined: number;
  pendingRewards: number;
  history: Array<{
    id: string;
    friendName: string;
    status: 'pending' | 'joined' | 'completed';
    credits: number;
    date: string;
  }>;
}

const mockReferralData: ReferralData = {
  code: 'M2D62VR6',
  totalEarnings: 320,
  friendsInvited: 8,
  friendsJoined: 5,
  pendingRewards: 150,
  history: [
    {
      id: '1',
      friendName: 'Sarah Johnson',
      status: 'completed',
      credits: 50,
      date: '2024-01-15',
    },
    {
      id: '2',
      friendName: 'Mike Chen',
      status: 'completed',
      credits: 50,
      date: '2024-01-12',
    },
    {
      id: '3',
      friendName: 'Emma Wilson',
      status: 'joined',
      credits: 50,
      date: '2024-01-10',
    },
    {
      id: '4',
      friendName: 'Alex Rodriguez',
      status: 'pending',
      credits: 50,
      date: '2024-01-08',
    },
    {
      id: '5',
      friendName: 'Lisa Brown',
      status: 'completed',
      credits: 50,
      date: '2024-01-05',
    },
  ],
};

// ----------------------------------------------------------------------

export default function ReferEarnPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(mockReferralData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleShareCode = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on XBlog!',
        text: `Use my referral code ${mockReferralData.code} to get bonus credits!`,
        url: window.location.origin,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`Join me on XBlog! Use my referral code ${mockReferralData.code} to get bonus credits!`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.palette.success.main;
      case 'joined':
        return theme.palette.primary.main;
      case 'pending':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'solar:check-circle-bold';
      case 'joined':
        return 'solar:user-plus-bold';
      case 'pending':
        return 'solar:clock-circle-bold';
      default:
        return 'solar:user-bold';
    }
  };

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
              {t('rewards.referAndEarn', 'Refer & Earn')}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {t('rewards.referAndEarnDescription', 'Invite friends and earn credits for each successful referral')}
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Slide direction="up" in timeout={800}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
              <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                        {mockReferralData.totalEarnings}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {t('rewards.totalEarnings', 'Total Earnings')}
                      </Typography>
                    </Box>
                    <Iconify icon="solar:flash-bold" width={40} height={40} sx={{ color: '#FFD700' }} />
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                        {mockReferralData.friendsJoined}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {t('rewards.friendsJoined', 'Friends Joined')}
                      </Typography>
                    </Box>
                    <Iconify icon="solar:users-group-rounded-bold" width={40} height={40} sx={{ color: 'white' }} />
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                        {mockReferralData.pendingRewards}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {t('rewards.pendingRewards', 'Pending Rewards')}
                      </Typography>
                    </Box>
                    <Iconify icon="solar:clock-circle-bold" width={40} height={40} sx={{ color: 'white' }} />
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Slide>

          {/* Referral Code Section */}
          <Slide direction="up" in timeout={1000}>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  {t('rewards.yourReferralCode', 'Your Referral Code')}
                </Typography>
                
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textAlign: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 2, fontFamily: 'monospace' }}>
                    {mockReferralData.code}
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                      variant="contained"
                      startIcon={<Iconify icon="solar:copy-bold" />}
                      onClick={handleCopyCode}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                      }}
                    >
                      {copied ? t('common.copied', 'Copied!') : t('common.copy', 'Copy')}
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Iconify icon="solar:share-bold" />}
                      onClick={handleShareCode}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                      }}
                    >
                      {t('common.share', 'Share')}
                    </Button>
                  </Stack>
                </Box>

                {/* Progress Bar */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t('rewards.progress', 'Progress')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {mockReferralData.friendsJoined} / 5 {t('rewards.friends', 'friends')}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(mockReferralData.friendsJoined / 5) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                {/* Reward Tiers */}
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {t('rewards.rewardTiers', 'Reward Tiers')}
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="space-around">
                  {[
                    { friends: 1, credits: 50, achieved: mockReferralData.friendsJoined >= 1 },
                    { friends: 3, credits: 110, achieved: mockReferralData.friendsJoined >= 3 },
                    { friends: 5, credits: 140, achieved: mockReferralData.friendsJoined >= 5 },
                  ].map((tier, index) => (
                    <Box key={index} sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          bgcolor: tier.achieved ? theme.palette.success.main : alpha(theme.palette.grey[500], 0.2),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 1,
                        }}
                      >
                        <Iconify
                          icon={tier.achieved ? 'solar:check-circle-bold' : 'solar:user-bold'}
                          width={30}
                          height={30}
                          sx={{ color: tier.achieved ? 'white' : theme.palette.grey[500] }}
                        />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFD700' }}>
                        +{tier.credits}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {tier.friends} {t('rewards.friends', 'friends')}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Slide>

          {/* Referral History */}
          <Slide direction="up" in timeout={1200}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  {t('rewards.referralHistory', 'Referral History')}
                </Typography>
                <Stack spacing={2}>
                  {mockReferralData.history.map((referral, index) => (
                    <Fade in timeout={1400 + index * 200} key={referral.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.background.paper, 0.5),
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                      >
                        <Avatar sx={{ bgcolor: alpha(getStatusColor(referral.status), 0.1), mr: 2 }}>
                          <Iconify
                            icon={getStatusIcon(referral.status)}
                            width={20}
                            height={20}
                            sx={{ color: getStatusColor(referral.status) }}
                          />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {referral.friendName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {new Date(referral.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 600 }}>
                            +{referral.credits}
                          </Typography>
                          <Chip
                            label={t(`rewards.status.${referral.status}`, referral.status)}
                            size="small"
                            sx={{
                              bgcolor: alpha(getStatusColor(referral.status), 0.1),
                              color: getStatusColor(referral.status),
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      </Box>
                    </Fade>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Slide>
        </Box>
      </Fade>
    </Container>
  );
}
