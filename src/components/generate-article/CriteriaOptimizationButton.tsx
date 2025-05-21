import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Tooltip } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';


interface CriteriaOptimizationButtonProps {
  criterionId: number;
  status: 'success' | 'warning' | 'error' | 'pending' | 'inactive';
}

/**
 * Button component that opens the CriteriaOptimizationModal
 * Only shows when status is not 'success'
 */
export function CriteriaOptimizationButton({ 
  criterionId, 
  status 
}: CriteriaOptimizationButtonProps) {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  
  // Don't render if status is success
  if (status === 'success') {
    return null;
  }
  
  return (
    <Tooltip title={t('Optimize this criterion')}>
        <Button
          size="small"
          variant="outlined"
          color={status === 'warning' ? 'warning' : 'error'}
          startIcon={<AutoFixHighIcon />}
          onClick={() => setModalOpen(true)}
          sx={{ ml: 1 }}
        >
          {t('Optimize')}
        </Button>
      </Tooltip>
  );
}

export default CriteriaOptimizationButton;
