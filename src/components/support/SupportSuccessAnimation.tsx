import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

export function SupportSuccessAnimation() {
  const theme = useTheme();
  const { t } = useTranslation();

  // Floating particles animation
  const particles = Array.from({ length: 8 }).map((_, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        x: Math.cos((i * Math.PI * 2) / 8) * 60,
        y: Math.sin((i * Math.PI * 2) / 8) * 60,
      }}
      transition={{
        duration: 2,
        delay: 0.5 + i * 0.1,
        ease: "easeOut"
      }}
      style={{
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: theme.palette.success.main,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  ));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        p: 4,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.success.main, 0.1)} 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      {/* Particles */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {particles}
      </Box>

      {/* Success Icon */}
      <Box sx={{ position: 'relative', zIndex: 2, mb: 3 }}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15,
            delay: 0.3 
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.3)}`,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -4,
                left: -4,
                right: -4,
                bottom: -4,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.2)} 0%, transparent 100%)`,
                zIndex: -1,
              },
            }}
          >
            <Iconify
              icon="eva:checkmark-fill"
              width={40}
              height={40}
              sx={{ color: 'white' }}
            />
          </Box>
        </motion.div>
      </Box>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: theme.palette.text.primary,
          }}
        >
          {t('support.success.title', 'Request Sent Successfully!')}
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: 400,
            lineHeight: 1.6,
            mb: 1,
          }}
        >
          {t('support.success.message', 'We have received your question and our support team will answer you soon!')}
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontStyle: 'italic',
          }}
        >
          {t('support.success.note', 'You will receive a confirmation email shortly.')}
        </Typography>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          zIndex: 0,
        }}
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Iconify
            icon="material-symbols:support-agent"
            width={24}
            height={24}
            sx={{ 
              color: alpha(theme.palette.primary.main, 0.3),
            }}
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '15%',
          zIndex: 0,
        }}
      >
        <motion.div
          animate={{
            y: [0, 10, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Iconify
            icon="material-symbols:mail-outline"
            width={20}
            height={20}
            sx={{ 
              color: alpha(theme.palette.success.main, 0.3),
            }}
          />
        </motion.div>
      </motion.div>
    </Box>
  );
}
