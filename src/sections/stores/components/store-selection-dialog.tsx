import type { Store } from 'src/types/store';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Box,
  Radio,
  Dialog,
  Button,
  RadioGroup,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
} from '@mui/material';

interface StoreSelectionDialogProps {
  open: boolean;
  stores: Store[];
  onClose: () => void;
  onSelect: (store: Store) => void;
}

export function StoreSelectionDialog({ 
  open, 
  stores, 
  onClose, 
  onSelect 
}: StoreSelectionDialogProps) {
  const { t } = useTranslation();
  const [selectedStoreId, setSelectedStoreId] = useState(stores[0]?.id || '');

  const handleConfirm = () => {
    const selectedStore = stores.find(store => store.id === selectedStoreId);
    if (selectedStore) {
      onSelect(selectedStore);
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        component: motion.div,
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.3 }
      }}
    >
      <DialogTitle>
        {t('store.selectNewStore')}
      </DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {t('store.selectNewStoreDescription')}
        </Typography>
        <RadioGroup
          value={selectedStoreId}
          onChange={(e) => setSelectedStoreId(e.target.value)}
        >
          <AnimatePresence>
            {stores.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FormControlLabel
                  value={store.id}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        component="img"
                        src={store.logo}
                        alt={store.name}
                        sx={{ width: 24, height: 24, borderRadius: '50%' }}
                      />
                      <Typography>{store.name}</Typography>
                    </Box>
                  }
                  sx={{ my: 1 }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button 
          variant="contained" 
          onClick={handleConfirm}
          disabled={!selectedStoreId}
        >
          {t('common.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}