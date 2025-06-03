import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  alpha,
  Button,
  Tooltip,
  ListItem,
  useTheme,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { Link } from '../../sections/generate/schemas';

// ----------------------------------------------------------------------

interface LinkItemProps {
  link: Link;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (link: Partial<Link>) => void;
  onDelete: () => void;
  onCancel: () => void;
  urlError?: string;
  anchorTextError?: string;
  type: 'internal' | 'external';
}

export function LinkItem({
  link,
  index,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onCancel,
  urlError,
  anchorTextError,
  type,
}: LinkItemProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [editedLink, setEditedLink] = useState(link);

  // Real-time validation
  const isValidUrl = (url: string) => {
    if (!url.trim()) return false;
    try {
      return true;
    } catch {
      return false;
    }
  };

  const isValidAnchorText = (text: string) => text.trim().length > 0;

  const urlValidationError = editedLink.url.length > 0 && !isValidUrl(editedLink.url);
  const anchorTextValidationError = editedLink.anchorText.length > 0 && !isValidAnchorText(editedLink.anchorText);
  const isFormValid = isValidUrl(editedLink.url) && isValidAnchorText(editedLink.anchorText);

  const handleSave = () => {
    if (isFormValid) {
      onSave({
        url: editedLink.url.trim(),
        anchorText: editedLink.anchorText.trim(),
      });
    }
  };

  const handleCancel = () => {
    setEditedLink(link); // Reset to original values
    onCancel();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Don't render if link is empty AND not in editing mode
  if (!link.url && !link.anchorText && !isEditing) {
    return null;
  }

  if (isEditing) {
    return (
      <ListItem 
        sx={{ 
          p: 2, 
          bgcolor: alpha(theme.palette.primary.main, 0.02), 
          borderRadius: 1,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
            {t('links.editLink', 'Edit Link')}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              size="small"
              label={t('links.url', 'URL')}
              value={editedLink.url}
              onChange={(e) => setEditedLink({ ...editedLink, url: e.target.value })}
              onKeyDown={handleKeyPress}
              error={urlValidationError}
              helperText={
                urlValidationError
                  ? t('links.urlError', 'Please enter a valid URL (e.g., https://example.com)')
                  : urlError
              }
              placeholder={
                type === 'internal' 
                  ? 'https://yourwebsite.com/page' 
                  : 'https://example.com'
              }
              autoFocus
            />

            <TextField
              fullWidth
              size="small"
              label={t('links.anchorText', 'Anchor Text')}
              value={editedLink.anchorText}
              onChange={(e) => setEditedLink({ ...editedLink, anchorText: e.target.value })}
              onKeyDown={handleKeyPress}
              error={anchorTextValidationError}
              helperText={
                anchorTextValidationError
                  ? t('links.anchorTextError', 'Please enter anchor text')
                  : anchorTextError
              }
              placeholder={t('links.anchorTextPlaceholder', 'Click here to learn more')}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button size="small" onClick={handleCancel}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleSave}
              disabled={!isFormValid}
              sx={{
                opacity: isFormValid ? 1 : 0.6,
              }}
            >
              {t('common.save', 'Save')}
            </Button>
          </Box>
        </Box>
      </ListItem>
    );
  }

  return (
    <ListItem
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        '&:hover': {
          bgcolor: alpha(theme.palette.action.hover, 0.04),
          borderRadius: 1,
        },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={500} noWrap>
          {link.anchorText}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            mt: 0.5,
            wordBreak: 'break-all',
          }}
        >
          {link.url}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
        <Tooltip title={t('common.edit', 'Edit')}>
          <IconButton 
            size="small" 
            onClick={onEdit}
            sx={{
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            <Iconify icon="eva:edit-2-fill" width={16} height={16} />
          </IconButton>
        </Tooltip>

        <Tooltip title={t('common.delete', 'Delete')}>
          <IconButton 
            size="small" 
            onClick={onDelete} 
            color="error"
            sx={{
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.08),
              },
            }}
          >
            <Iconify icon="eva:trash-2-fill" width={16} height={16} />
          </IconButton>
        </Tooltip>
      </Box>
    </ListItem>
  );
}