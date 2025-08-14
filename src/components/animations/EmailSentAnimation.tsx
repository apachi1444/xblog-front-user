import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Box, Paper, useTheme, Typography } from '@mui/material';

interface EmailSentAnimationProps {
  show: boolean;
  onComplete?: () => void;
  message?: string;
}

export const EmailSentAnimation = ({ show, onComplete, message }: EmailSentAnimationProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [animationComplete, setAnimationComplete] = useState(false);

  // Trigger onComplete callback after animation finishes
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
        if (onComplete) {
          onComplete();
        }
      }, 3000); // Animation duration + a bit extra

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
          }}
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 2,
              textAlign: 'center',
              maxWidth: 400,
              overflow: 'hidden',
              position: 'relative',
            }}
            component={motion.div}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Email icon with animation */}
            <Box sx={{ position: 'relative', height: 100, mb: 2 }}>
              {/* Envelope */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, times: [0, 0.6, 1] }}
                style={{ display: 'inline-block' }}
              >
                <Mail
                  size={80}
                  color={theme.palette.primary.main}
                  strokeWidth={1.5}
                />
              </motion.div>
              
              {/* Flying paper animation */}
              <motion.div
                initial={{ y: 0, x: 0, opacity: 0, scale: 0.5 }}
                animate={{ 
                  y: [-10, -60, -20], 
                  x: [0, 40, 80], 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.8]
                }}
                transition={{ 
                  duration: 1.5, 
                  times: [0, 0.6, 1],
                  delay: 0.5
                }}
                style={{ 
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginLeft: -10,
                  marginTop: -10,
                  width: 20,
                  height: 25,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  zIndex: -1
                }}
              />
              
              {/* Check mark that appears after email is "sent" */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: animationComplete ? 1 : 0, scale: animationComplete ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                style={{ 
                  position: 'absolute',
                  top: 0,
                  right: 0,
                }}
              >
                <CheckCircle
                  size={30}
                  color={theme.palette.success.main}
                  fill={theme.palette.success.main}
                  strokeWidth={1}
                />
              </motion.div>
            </Box>
            
            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                {message || t('demo.emailSent.title', 'Email Sent!')}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {t('demo.emailSent.message', 'We\'ve sent you a confirmation email with all the details.')}
              </Typography>
            </motion.div>
            
            {/* Progress bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2 }}
              style={{
                height: 4,
                backgroundColor: theme.palette.primary.main,
                borderRadius: 2,
                marginTop: 24,
              }}
            />
          </Paper>
        </Box>
      )}
    </AnimatePresence>
  );
};
