import type { Article } from 'src/types/article';
import type { Theme, SxProps } from '@mui/material/styles';

import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Dialog,
  Button,
  Popover,
  MenuItem,
  MenuList,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import { navigateToArticle } from 'src/utils/articleIdEncoder';

import { useDeleteArticleMutation } from 'src/services/apis/articlesApi';

import { Iconify } from 'src/components/iconify';

import { PublishModal } from 'src/sections/generate/generate-steps/modals/PublishModal';

interface ArticleActionsMenuProps {
  article: Article;
  sections?: any[];
  buttonSize?: 'small' | 'medium' | 'large';
  buttonStyle?: 'overlay' | 'inline';
  position?: 'left' | 'right';
  onEdit?: () => void;
  onDelete?: () => void;
  onPublish?: () => void;
}

export function ArticleActionsMenu({
  article,
  sections = [],
  buttonSize = 'medium',
  buttonStyle = 'inline',
  position = 'right',
  onEdit,
  onDelete,
  onPublish,
}: ArticleActionsMenuProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  // State management
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [isThreeDotsHovered, setIsThreeDotsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuOpen = Boolean(anchorEl);

  // Delete mutation
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();

  // Auto-close menu when modals open
  useEffect(() => {
    if (deleteDialogOpen || publishModalOpen) {
      setAnchorEl(null);
    }
  }, [deleteDialogOpen, publishModalOpen]);

  // Prevent navigation when modals are open
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      if (deleteDialogOpen || publishModalOpen) {
        // Check if click is outside modal content
        const target = event.target as Element;
        const isModalClick = target.closest('[role="dialog"]') ||
                            target.closest('.MuiDialog-root') ||
                            target.closest('.MuiModal-root');

        if (!isModalClick) {
          event.stopPropagation();
          event.preventDefault();
        }
      }
    };

    if (deleteDialogOpen || publishModalOpen) {
      document.addEventListener('click', handleGlobalClick, true);
      return () => {
        document.removeEventListener('click', handleGlobalClick, true);
      };
    }
  }, [deleteDialogOpen, publishModalOpen]);

  // Menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent card click
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  // Mouse handlers
  const handleMouseEnter = () => {
    setIsThreeDotsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsThreeDotsHovered(false);
  };

  const handleEdit = (event?: React.MouseEvent) => {
    event?.stopPropagation(); // Prevent event bubbling
    if (onEdit) {
      onEdit();
    } else {
      navigateToArticle(navigate, article.id);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async (event?: React.MouseEvent) => {
    event?.stopPropagation(); // Prevent event bubbling
    if (onDelete) {
      onDelete();
    } else {
      try {
        toast.loading(t('common.deleting', 'Deleting article...'), { id: 'delete-article' });
        await deleteArticle(article.id.toString()).unwrap();
        toast.success(t('common.deleteSuccess', 'Article deleted successfully!'), { id: 'delete-article' });
      } catch (error) {
        toast.error(t('common.deleteError', 'Failed to delete article. Please try again.'), { id: 'delete-article' });
      }
    }
    setDeleteDialogOpen(false);
  };

  const handlePublishClick = (event?: React.MouseEvent) => {
    event?.stopPropagation(); // Prevent event bubbling
    if (onPublish) {
      onPublish();
    } else {
      setPublishModalOpen(true);
    }
    handleMenuClose();
  };

  // Button size configurations
  const buttonSizes = {
    small: { width: 32, height: 32, iconSize: 16 },
    medium: { width: 36, height: 36, iconSize: 18 },
    large: { width: 40, height: 40, iconSize: 20 },
  };

  const currentSize = buttonSizes[buttonSize];

  const parseSecondaryKeywords = useCallback((keywordsString: string) => {
      if (!keywordsString || keywordsString.trim() === '') return [];
  
      try {
        // Try to parse as JSON array first
        const parsed = JSON.parse(keywordsString);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean);
        }
      } catch {
        // If JSON parsing fails, treat as comma-separated string
        return keywordsString.split(',').map(k => k.trim()).filter(Boolean);
      }
  
      return [];
  }, []);

  // Get form data for final step actions
  const getArticleData = () => ({
      articleInfo: {
        title: article.title || article.article_title || '',
        urlSlug: article.url_slug || '',
        metaTitle: article.meta_title || '',
        metaDescription: article.meta_description || '',
        primaryKeyword: article.primary_keyword || '',
        secondaryKeywords: parseSecondaryKeywords(article.secondary_keywords || '') || [],
        language: article.language || 'en-us',
        targetCountry: article.target_country || 'us',
        contentDescription: article.content_description || '',
        createdAt: article.created_at
      },
      sections: article.sections || [],
      generatedHtml: article.content || ''
    });

  // Button style configurations
  const getButtonStyles = (): SxProps<Theme> => {
    const baseStyles = {
      color: 'text.secondary',
      width: currentSize.width,
      height: currentSize.height,
      '&:hover': {
        color: 'text.primary',
      },
    };

    if (buttonStyle === 'overlay') {
      if (position === 'left') {
        return {
          ...baseStyles,
          position: 'absolute' as const,
          top: 8,
          left: 8,
          zIndex: 10,
          bgcolor: alpha(theme.palette.common.white, 0.9),
          '&:hover': {
            ...baseStyles['&:hover'],
            bgcolor: alpha(theme.palette.common.white, 1),
          },
        };
      } 
        return {
          ...baseStyles,
          position: 'absolute' as const,
          top: 8,
          right: 8,
          zIndex: 10,
          bgcolor: alpha(theme.palette.common.white, 0.9),
          '&:hover': {
            ...baseStyles['&:hover'],
            bgcolor: alpha(theme.palette.common.white, 1),
          },
        };
      
    }

    return {
      ...baseStyles,
      '&:hover': {
        ...baseStyles['&:hover'],
        bgcolor: alpha(theme.palette.grey[500], 0.1),
      },
    };
  };
  return (
    <>
      {/* Backdrop to prevent navigation when modals are open */}
      {(deleteDialogOpen || publishModalOpen) && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1200,
            pointerEvents: 'auto',
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      )}

      {/* Three Dots Menu Button */}
      <IconButton
        onClick={handleMenuOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={getButtonStyles()}
      >
        <Iconify icon="mdi:dots-vertical" width={currentSize.iconSize} height={currentSize.iconSize} />
      </IconButton>

      {/* Popover Menu */}
      <Popover
        open={menuOpen}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        disableRestoreFocus
        slotProps={{
          paper: {
            sx: {
              minWidth: 160,
              boxShadow: theme.customShadows.dropdown,
              borderRadius: 1,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            },
          },
        }}
      >
        <MenuList disablePadding sx={{ py: 1 }}>
          <MenuItem onClick={handleEdit} sx={{ py: 1 }}>
            <Iconify icon="mdi:pencil" width={16} height={16} sx={{ mr: 1.5, color: 'text.secondary' }} />
            <Typography variant="body2">{t('common.edit', 'Edit')}</Typography>
          </MenuItem>

          <MenuItem
            onClick={handlePublishClick}
            sx={{ py: 1 }}
            disabled={article.status === 'publish'}
          >
            <Iconify icon="mdi:publish" width={16} height={16} sx={{ mr: 1.5, color: 'text.secondary' }} />
            <Typography variant="body2">{t('common.publish', 'Publish')}</Typography>
          </MenuItem>

          <MenuItem
            onClick={handleDeleteClick}
            sx={{
              py: 1,
              color: 'error.main',
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.08),
              },
            }}
          >
            <Iconify icon="mdi:delete" width={16} height={16} sx={{ mr: 1.5 }} />
            <Typography variant="body2">{t('common.delete', 'Delete')}</Typography>
          </MenuItem>
        </MenuList>
      </Popover>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="mdi:delete-alert" sx={{ color: 'error.main' }} />
            {t('common.confirmDelete', 'Confirm Deletion')}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('common.deleteConfirmMessage', 'Are you sure you want to delete this article? This action cannot be undone.')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {article.title || article.article_title || t('common.untitledArticle', 'Untitled Article')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : <Iconify icon="mdi:delete" />}
          >
            {isDeleting ? t('common.deleting', 'Deleting...') : t('common.delete', 'Delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Publish Modal */}
      <PublishModal
        open={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        articleId={article.id.toString()}
        articleInfo={getArticleData().articleInfo}
        sections={sections}
      />
    </>
  );
}
