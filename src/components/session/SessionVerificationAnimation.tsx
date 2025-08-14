import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { 
  Star, 
  Error, 
  Close,
  CheckCircle,
  AutoAwesome 
} from '@mui/icons-material';
import {
  Box,
  Fade,
  Zoom,
  Modal,
  Button,
  useTheme,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';

interface SessionVerificationAnimationProps {
  open: boolean;
  onClose: () => void;
  isVerifying: boolean;
  isValid: boolean | null;
  error: string | null;
  sessionId: string | null;
}

export function SessionVerificationAnimation({
  open,
  onClose,
  isVerifying,
  isValid,
  error,
  sessionId
}: SessionVerificationAnimationProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (open) {
      // Delay content animation for a smooth entrance
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } 
      setShowContent(false);
    
  }, [open]);

  const handleClose = () => {
    setShowContent(false);
    setTimeout(onClose, 200); // Delay to allow exit animation
  };

  const handleContinue = () => {
    handleClose();
    // Navigate to dashboard after animation closes
    setTimeout(() => {
      navigate('/');
    }, 300);
  };

  const getIcon = () => {
    if (isVerifying) {
      return <CircularProgress size={80} sx={{ color: 'primary.main' }} />;
    }
    if (isValid === true) {
      return (
        <CheckCircle
          sx={{
            fontSize: 80,
            color: 'success.main',
            filter: 'drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))',
          }}
        />
      );
    }
    if (isValid === false) {
      return (
        <Error
          sx={{
            fontSize: 80,
            color: 'error.main',
            filter: 'drop-shadow(0 4px 8px rgba(244, 67, 54, 0.3))',
          }}
        />
      );
    }
    return null;
  };

  const getTitle = () => {
    if (isVerifying) {
      return t('session.verifying.title', 'Verifying Payment...');
    }
    if (isValid === true) {
      return t('session.success.title', 'Payment Verified!');
    }
    if (isValid === false) {
      return t('session.error.title', 'Verification Failed');
    }
    return '';
  };

  const getMessage = () => {
    if (isVerifying) {
      return t('session.verifying.message', 'Please wait while we verify your payment session...');
    }
    if (isValid === true) {
      return t('session.success.message', 'Your payment has been successfully verified and your account has been activated.');
    }
    if (isValid === false) {
      return error || t('session.error.message', 'We could not verify your payment session. Please contact support if you believe this is an error.');
    }
    return '';
  };

  const getBorderColor = () => {
    if (isVerifying) return theme.palette.primary.main;
    if (isValid === true) return theme.palette.success.main;
    if (isValid === false) return theme.palette.error.main;
    return theme.palette.divider;
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <Fade in={open} timeout={300}>
        <Box
          sx={{
            position: 'relative',
            width: { xs: '90%', sm: 500 },
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: theme.shadows[24],
            p: 4,
            textAlign: 'center',
            overflow: 'auto',
            border: `2px solid ${getBorderColor()}`,
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'text.secondary',
            }}
          >
            <Close />
          </IconButton>

          {/* Icon with Animation */}
          <Zoom in={showContent} timeout={600}>
            <Box
              sx={{
                mb: 3,
                position: 'relative',
                display: 'inline-block',
              }}
            >
              {getIcon()}
              
              {/* Animated stars for success */}
              {isValid === true && [...Array(3)].map((_, index) => (
                <Star
                  key={index}
                  sx={{
                    position: 'absolute',
                    fontSize: 20,
                    color: 'warning.main',
                    animation: `sparkle 2s ease-in-out infinite ${index * 0.5}s`,
                    top: index === 0 ? -10 : index === 1 ? 10 : 30,
                    left: index === 0 ? -20 : index === 1 ? 60 : -15,
                    '@keyframes sparkle': {
                      '0%, 100%': {
                        opacity: 0,
                        transform: 'scale(0.5) rotate(0deg)',
                      },
                      '50%': {
                        opacity: 1,
                        transform: 'scale(1) rotate(180deg)',
                      },
                    },
                  }}
                />
              ))}
            </Box>
          </Zoom>

          {/* Title */}
          <Fade in={showContent} timeout={800}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: isVerifying ? 'primary.main' : 
                       isValid === true ? 'success.main' : 
                       isValid === false ? 'error.main' : 'text.primary',
                mb: 2,
              }}
            >
              {getTitle()}
            </Typography>
          </Fade>

          {/* Message */}
          <Fade in={showContent} timeout={1000}>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: 'text.secondary',
                textAlign: 'center',
              }}
            >
              {getMessage()}
            </Typography>
          </Fade>

          {/* Session ID Display */}
          {sessionId && (
            <Fade in={showContent} timeout={1200}>
              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Session ID
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                  {sessionId}
                </Typography>
              </Box>
            </Fade>
          )}

          {/* Action Buttons */}
          {!isVerifying && (
            <Fade in={showContent} timeout={1400}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                {isValid === true && (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleContinue}
                    startIcon={<AutoAwesome />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
                      color: 'white',
                      fontWeight: 'bold',
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.success.dark}, ${theme.palette.primary.dark})`,
                      },
                    }}
                  >
                    Continue to Dashboard
                  </Button>
                )}
                
                {isValid === false && (
                  <>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleClose}
                      sx={{ px: 3, py: 1.5 }}
                    >
                      Close
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      // eslint-disable-next-line no-return-assign
                      onClick={() => window.location.href = 'mailto:support@xblog.com'}
                      sx={{ px: 3, py: 1.5 }}
                    >
                      Contact Support
                    </Button>
                  </>
                )}
              </Box>
            </Fade>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}
