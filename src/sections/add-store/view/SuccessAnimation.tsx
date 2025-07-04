import type { FC } from "react";

import { t } from "i18next";
import PropTypes from "prop-types";
import { CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Box, Paper, Typography } from "@mui/material";

interface SuccessAnimationProps {
  integrationSuccess: boolean;
  integrationError: boolean;
  errorMessage?: string;
}

export const SuccessAnimation: FC<SuccessAnimationProps> = ({ integrationSuccess, integrationError, errorMessage }) => (
  <AnimatePresence>
    {(integrationSuccess || integrationError) && (
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
              {integrationSuccess ? (
                <CheckCircle
                  size={80}
                  color="green"
                  strokeWidth={1}
                />
              ) : (
                <XCircle
                  size={80}
                  color="red"
                  strokeWidth={1}
                />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                {integrationSuccess
                  ? t('store.integrationSuccess', 'Integration Successful!')
                  : t('store.integrationError', 'Integration Failed!')
                }
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {integrationSuccess
                  ? t('store.redirecting', 'Redirecting to your stores...')
                  : (errorMessage || t('store.errorMessage', 'Please check your credentials and try again.'))
                }
              </Typography>
            </motion.div>

            {integrationSuccess && (
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
            )}
          </Paper>
        </motion.div>
      </Box>
    )}
  </AnimatePresence>
);

// PropTypes definition for runtime type checking
SuccessAnimation.propTypes = {
  integrationSuccess: PropTypes.bool.isRequired,
  integrationError: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
};

// Default export
export default SuccessAnimation;
