import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import {
  Box,
  Button,
  Dialog,
  Rating,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (rating: number, comment?: string) => void;
}

export function FeedbackModal({ open, onClose, onSubmit }: FeedbackModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = () => {
    if (onSubmit && rating !== null) {
      onSubmit(rating, comment.trim() || undefined);
    }

    // Mark as submitted and show thank you toast
    setIsSubmitted(true);

    // Show thank you message based on rating
    const thankYouMessage = rating && rating >= 4
      ? t('feedback.thankYouHigh', '🎉 Thank you for your amazing feedback!')
      : t('feedback.thankYou', '💙 Thank you for your valuable feedback!');

    toast.success(thankYouMessage, {
      duration: 4000,
      position: 'top-center',
      style: {
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: 500,
      },
    });

    // Don't close modal - let user close it manually
  };

  const handleSkip = () => {
    onClose();
  };

  const handleClose = () => {
    // Reset form when modal closes
    setRating(0);
    setComment('');
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'visible',
        }
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'text.secondary',
          zIndex: 1,
        }}
      >
        <Iconify icon="eva:close-fill" />
      </IconButton>

      <DialogTitle sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <Iconify icon="eva:heart-fill" sx={{ color: 'white', fontSize: 32 }} />
          </Box>
        </Box>
        
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          {t('feedback.title', 'How was your experience?')}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
          {t('feedback.subtitle', 'Your feedback helps us improve our solution and enhance your experience')}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', py: 3 }}>
        {/* Optional Comment Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500, textAlign: 'left' }}>
            {t('feedback.commentLabel', 'Share your thoughts (optional)')}
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('feedback.commentPlaceholder', 'Tell us what you liked or what could be improved...')}
            variant="outlined"
            disabled={isSubmitted}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: isSubmitted ? theme.palette.success.main : theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: isSubmitted ? theme.palette.success.main : theme.palette.primary.main,
                },
                ...(isSubmitted && {
                  '& fieldset': {
                    borderColor: theme.palette.success.main,
                  },
                }),
              },
            }}
          />
        </Box>

        {/* Rating Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
            {t('feedback.rateExperience', 'Rate your content generation experience')}
          </Typography>
          
          <Rating
            value={rating}
            onChange={(event, newValue) => {
              if (!isSubmitted) {
                setRating(newValue);
              }
            }}
            size="large"
            readOnly={isSubmitted}
            sx={{
              '& .MuiRating-iconFilled': {
                color: isSubmitted ? theme.palette.success.main : theme.palette.warning.main,
              },
              '& .MuiRating-iconHover': {
                color: isSubmitted ? theme.palette.success.main : theme.palette.warning.dark,
              },
            }}
          />
        </Box>

        {rating && rating > 0 && !isSubmitted && (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.success.main, 0.08),
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <Typography variant="body2" color="success.dark">
              {rating <= 2 && t('feedback.lowRating', 'Thank you for your feedback. We\'ll work to improve!')}
              {rating === 3 && t('feedback.mediumRating', 'Thanks! We appreciate your feedback.')}
              {rating >= 4 && t('feedback.highRating', 'Awesome! We\'re glad you had a great experience!')}
            </Typography>
          </Box>
        )}

        {isSubmitted && (
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.success.main, 0.12),
              border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
              textAlign: 'center',
            }}
          >
            <Box sx={{ mb: 1 }}>
              <Iconify
                icon="eva:checkmark-circle-2-fill"
                sx={{
                  fontSize: 32,
                  color: theme.palette.success.main,
                  mb: 1
                }}
              />
            </Box>
            <Typography variant="subtitle2" color="success.dark" sx={{ fontWeight: 600, mb: 0.5 }}>
              {t('feedback.successTitle', 'Feedback Submitted Successfully!')}
            </Typography>
            <Typography variant="body2" color="success.dark">
              {t('feedback.successMessage', 'Thank you for helping us improve our solution. You can close this dialog now.')}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            flex: 1,
            borderRadius: 2,
            py: 1.5,
            borderColor: alpha(theme.palette.grey[500], 0.3),
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'text.secondary',
              bgcolor: alpha(theme.palette.grey[500], 0.04),
            }
          }}
        >
          {t('feedback.skip', 'Skip')}
        </Button>
        
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={(!rating || rating === 0) || isSubmitted}
          sx={{
            flex: 1,
            borderRadius: 2,
            py: 1.5,
            background: isSubmitted
              ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            '&:hover': {
              background: isSubmitted
                ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              filter: 'brightness(0.9)',
            },
            '&:disabled': {
              background: isSubmitted
                ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
                : alpha(theme.palette.grey[500], 0.2),
              color: isSubmitted
                ? theme.palette.success.contrastText
                : alpha(theme.palette.text.disabled, 0.5),
            }
          }}
        >
          {isSubmitted
            ? t('feedback.submitted', '✅ Feedback Submitted')
            : t('feedback.submit', 'Submit Feedback')
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
}
