import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Box,
  Fade,
  Modal,
  Paper,
  alpha,
  useTheme,
  Backdrop,
  Typography,
  IconButton,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { SupportForm } from './SupportForm';
import { SupportSuccessAnimation } from './SupportSuccessAnimation';

// Support form validation schema
const supportSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  subject: z.string().min(1, 'Subject is required').min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(1, 'Message is required').min(10, 'Message must be at least 10 characters'),
});

export type SupportFormData = z.infer<typeof supportSchema>;

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
}

export function SupportModal({ open, onClose }: SupportModalProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const methods = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      email: '',
      subject: '',
      message: '',
    },
    mode: 'onChange',
  });

  const handleSubmit = useCallback(async (data: SupportFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Support ticket submitted:', data);
      
      // Show success animation
      setShowSuccess(true);
      
      // Reset form after success
      methods.reset();
      
      // Close modal after animation
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting support ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [methods, onClose]);

  const handleClose = useCallback(() => {
    if (!isSubmitting && !showSuccess) {
      methods.reset();
      onClose();
    }
  }, [isSubmitting, showSuccess, methods, onClose]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backgroundColor: alpha(theme.palette.common.black, 0.7),
            backdropFilter: 'blur(8px)',
          },
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '90%', md: 600 },
            maxHeight: '90vh',
            outline: 'none',
          }}
        >
          <Paper
            component={motion.div}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            elevation={24}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              background: theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
                : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
              boxShadow: theme.customShadows.dialog,
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                p: 3,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: alpha(theme.palette.common.white, 0.1),
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: alpha(theme.palette.common.white, 0.05),
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: alpha(theme.palette.common.white, 0.2),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon="material-symbols:support-agent" width={24} height={24} />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {t('support.title', 'Contact Support')}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {t('support.subtitle', 'Complete the form below to file a ticket and our support team will get back to you as soon as possible.')}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={handleClose}
                  disabled={isSubmitting || showSuccess}
                  sx={{
                    color: 'white',
                    '&:hover': {
                      background: alpha(theme.palette.common.white, 0.1),
                    },
                  }}
                >
                  <Iconify icon="eva:close-fill" width={24} height={24} />
                </IconButton>
              </Box>
            </Box>

            {/* Content */}
            <Box sx={{ position: 'relative', minHeight: 400 }}>
              <AnimatePresence mode="wait">
                {showSuccess ? (
                  <SupportSuccessAnimation key="success" />
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SupportForm
                      methods={methods}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Modal>
  );
}
