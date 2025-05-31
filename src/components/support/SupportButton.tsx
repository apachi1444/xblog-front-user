import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import {
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { SupportModal } from './SupportModal';

export function SupportButton() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <>
      <Tooltip 
        title={t('support.button.tooltip', 'Contact Support')}
        placement="bottom"
      >
        <IconButton
          onClick={handleOpenModal}
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          sx={{
            p: 1,
            borderRadius: '50%',
            background: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.8)
              : alpha(theme.palette.background.paper, 0.9),
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              background: theme.palette.mode === 'dark'
                ? alpha(theme.palette.primary.main, 0.1)
                : alpha(theme.palette.primary.main, 0.05),
              borderColor: alpha(theme.palette.primary.main, 0.3),
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
          }}
        >
          <Iconify
            icon="material-symbols:help-outline"
            width={20}
            height={20}
            sx={{
              color: theme.palette.mode === 'dark' 
                ? theme.palette.text.primary 
                : theme.palette.text.secondary,
              transition: 'color 0.2s ease-in-out',
            }}
          />
        </IconButton>
      </Tooltip>

      <SupportModal
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
