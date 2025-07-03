import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme, keyframes } from '@mui/material/styles';

import { useArticleLimits } from 'src/hooks/useArticleLimits';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Animations
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 152, 0, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 152, 0, 0);
  }
`;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const shimmerAnimation = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

interface DraftGuardProps {
  children: React.ReactNode;
  onLimitExceeded?: () => void;
}

export function DraftGuard({ children, onLimitExceeded }: DraftGuardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  
  const { 
    canCreateMore, 
    articlesRemaining, 
    articlesLimit, 
    articlesCreated,
    isLoading 
  } = useArticleLimits();

  // Show loading state while checking limits
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
        }}
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          {t('draft.guard.checkingLimits', 'Checking article limits...')}
        </Typography>
      </Box>
    );
  }

  // Check if user can create more articles
  if (!canCreateMore) {
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            px: 3,
          }}
        >
          <Card
            sx={{
              maxWidth: 650,
              width: '100%',
              textAlign: 'center',
              p: 6,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.08)} 0%, ${alpha(theme.palette.error.main, 0.08)} 50%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `3px solid ${alpha(theme.palette.warning.main, 0.3)}`,
              borderRadius: 4,
              position: 'relative',
              overflow: 'visible',
              boxShadow: `0 20px 60px ${alpha(theme.palette.warning.main, 0.15)}`,
              animation: `${floatAnimation} 6s ease-in-out infinite`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(45deg, transparent 30%, ${alpha(theme.palette.warning.main, 0.1)} 50%, transparent 70%)`,
                backgroundSize: '200px 100%',
                animation: `${shimmerAnimation} 3s infinite`,
                borderRadius: 4,
                pointerEvents: 'none',
              }
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                top: -25,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 90,
                height: 90,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.error.main})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 15px 35px ${alpha(theme.palette.warning.main, 0.4)}`,
                animation: `${pulseAnimation} 2s infinite`,
                border: `4px solid ${theme.palette.background.paper}`,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -8,
                  left: -8,
                  right: -8,
                  bottom: -8,
                  borderRadius: '50%',
                  background: `linear-gradient(45deg, ${alpha(theme.palette.warning.main, 0.3)}, ${alpha(theme.palette.error.main, 0.3)})`,
                  zIndex: -1,
                  animation: `${pulseAnimation} 2s infinite 0.5s`,
                }
              }}
            >
              <Iconify
                icon="solar:shield-warning-bold"
                width={45}
                height={45}
                sx={{ color: 'white', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              />
            </Box>

            {/* Status chip */}
            <Box sx={{ mb: 3, mt: 5 }}>
              <Chip
                label={`🚫 ${articlesCreated}/${articlesLimit} Articles Used`}
                color="error"
                variant="filled"
                sx={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  py: 1,
                  px: 2,
                  background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.3)}`,
                  '& .MuiChip-label': {
                    px: 1,
                  }
                }}
              />
            </Box>

            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.warning.main}, ${theme.palette.primary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              🛑 Article Limit Reached!
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: theme.palette.text.primary,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.warning.main, 0.1)})`,
                borderRadius: 2,
                py: 1,
                px: 2,
                display: 'inline-block'
              }}
            >
              🚀 Ready to unlock unlimited creativity?
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                maxWidth: 500,
                mx: 'auto',
                lineHeight: 1.7,
                fontSize: '1.1rem',
                color: theme.palette.text.secondary,
                fontWeight: 500
              }}
            >
              ⚠️ <strong>Don t let limits stop your success!</strong> You ve reached your article creation limit.
              Upgrade now to continue creating amazing content and grow your audience without restrictions.
              <br />
              <Box component="span" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                💡 Join thousands of creators who ve already upgraded!
              </Box>
            </Typography>

            {/* Benefits list */}
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}
              >
                ✨ Upgrade to unlock premium features:
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
                {[
                  { icon: '∞', text: 'Unlimited Articles', color: theme.palette.success.main },
                  { icon: '🤖', text: 'Advanced AI Features', color: theme.palette.info.main },
                  { icon: '📈', text: 'SEO Optimization', color: theme.palette.warning.main },
                  { icon: '⚡', text: 'Priority Support', color: theme.palette.error.main }
                ].map((benefit, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 2,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${alpha(benefit.color, 0.1)}, ${alpha(benefit.color, 0.05)})`,
                      border: `2px solid ${alpha(benefit.color, 0.2)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 25px ${alpha(benefit.color, 0.2)}`,
                        border: `2px solid ${alpha(benefit.color, 0.4)}`,
                      }
                    }}
                  >
                    <Typography variant="h6" sx={{ fontSize: '1.5rem' }}>
                      {benefit.icon}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: benefit.color,
                        fontSize: '0.9rem'
                      }}
                    >
                      {benefit.text}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Urgency message */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)}, ${alpha(theme.palette.warning.main, 0.1)})`,
                  border: `2px dashed ${theme.palette.warning.main}`,
                  animation: `${pulseAnimation} 3s infinite`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.error.main,
                    textAlign: 'center'
                  }}
                >
                  ⏰ <strong>Limited Time:</strong> Upgrade now and get 30% off your first month!
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/blog')}
                startIcon={<Iconify icon="solar:arrow-left-outline" />}
                sx={{
                  minWidth: 140,
                  borderColor: theme.palette.text.secondary,
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    borderColor: theme.palette.text.primary,
                    color: theme.palette.text.primary,
                  }
                }}
              >
                {t('draft.guard.backToBlog', 'Back to Blog')}
              </Button>

              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/upgrade-license')}
                startIcon={<Iconify icon="solar:rocket-outline" />}
                sx={{
                  minWidth: 180,
                  py: 1.5,
                  px: 4,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.5)}`,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                {t('draft.guard.upgradePlan', '🚀 Upgrade Now')}
              </Button>
            </Box>
          </Card>
        </Box>

        {/* Limit exceeded dialog */}
        <Dialog
          open={showLimitDialog}
          onClose={() => setShowLimitDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify icon="mdi:alert-circle" color="warning.main" />
              {t('draft.guard.dialog.title', 'Article Limit Reached')}
            </Box>
          </DialogTitle>
          
          <DialogContent>
            <Typography variant="body1">
              {t(
                'draft.guard.dialog.message',
                'You have used all {{limit}} articles in your current plan. To create more articles, please upgrade your subscription.',
                { limit: articlesLimit }
              )}
            </Typography>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={() => setShowLimitDialog(false)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button 
              variant="contained" 
              onClick={() => navigate('/upgrade-license')}
            >
              {t('draft.guard.upgradePlan', 'Upgrade Plan')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // Show remaining articles info if close to limit
  const showWarning = articlesRemaining <= 3 && articlesRemaining > 0;

  return (
    <>
      {showWarning && (
        <Box
          sx={{
            mb: 3,
            p: 3,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.warning.main, 0.1),
            border: `2px solid ${theme.palette.warning.main}`,
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {/* Warning Icon */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: theme.palette.warning.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Iconify
              icon="solar:danger-triangle-bold"
              width={24}
              height={24}
              sx={{ color: 'white' }}
            />
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.warning.dark,
                }}
              >
                ⚠️ RUNNING LOW ON ARTICLES!
              </Typography>
              <Chip
                label={`${articlesRemaining} LEFT`}
                size="small"
                color="error"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            </Box>
          </Box>

          {/* CTA Button */}
          <Button
            variant="contained"
            onClick={() => navigate('/upgrade-license')}
            startIcon={<Iconify icon="solar:rocket-outline" />}
            sx={{
              minWidth: 140,
              fontWeight: 600,
              textTransform: 'none',
              flexShrink: 0,
            }}
          >
            🚀 Upgrade Now
          </Button>
        </Box>
      )}
      
      {children}
    </>
  );
}
