import type { FC } from "react";

import { t } from "i18next";
import PropTypes from "prop-types";
import { CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Box, Paper, Typography } from "@mui/material";

interface SuccessAnimationProps {
  integrationSuccess: boolean;
}

export const SuccessAnimation: FC<SuccessAnimationProps> = ({ integrationSuccess }) => (
  <AnimatePresence>
    {integrationSuccess && (
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
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 2,
              textAlign: 'center',
              maxWidth: 400,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.6, times: [0, 0.6, 1] }}
            >
              <CheckCircle
                size={80}
                color="green"
                strokeWidth={1}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                {t('store.integrationSuccess', 'Integration Successful!')}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {t('store.redirecting', 'Redirecting to your stores...')}
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 2.5 }}
              style={{
                height: 4,
                backgroundColor: 'green',
                borderRadius: 2,
                marginTop: 24,
              }}
            />
          </Paper>
        </motion.div>
      </Box>
    )}
  </AnimatePresence>
);

// PropTypes definition for runtime type checking
SuccessAnimation.propTypes = {
  integrationSuccess: PropTypes.bool.isRequired,
};

// Default export
export default SuccessAnimation;
