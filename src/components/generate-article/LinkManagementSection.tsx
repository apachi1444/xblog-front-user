import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';

import {
  Box,
  Card,
  alpha,
  Button,
  Collapse,
  useTheme,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { LinksList } from './LinksList';
import { EmptyLinksAlert } from './EmptyLinksAlert';

import type { Link, GenerateArticleFormData } from '../../sections/generate/schemas';

// ----------------------------------------------------------------------

interface LinkManagementSectionProps {
  type: 'internal' | 'external';
  title: string;
  icon: string;
  onGenerateLinks?: () => Promise<void>;
  isGenerating?: boolean;
  showWebsiteUrlInput?: boolean;
}

export function LinkManagementSection({
  type,
  title,
  icon,
  onGenerateLinks,
  isGenerating = false,
  showWebsiteUrlInput = false,
}: LinkManagementSectionProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingLink, setIsAddingLink] = useState(false);

  const { control, formState: { errors }, watch, register } = useFormContext<GenerateArticleFormData>();
  
  const fieldName = type === 'internal' ? 'step2.internalLinks' : 'step2.externalLinks';
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: fieldName,
  });

  const links = watch(fieldName) || [];
  const websiteUrl = watch("step2.websiteUrl");

  // Generate a unique ID for new links
  const generateId = () => `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleAddManualLink = () => {
    setIsAddingLink(true);
    // Expand the section if it's collapsed
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleSaveNewLink = (newLink: Omit<Link, 'id'>) => {
    const linkWithId: Link = {
      id: generateId(),
      ...newLink,
    };
    append(linkWithId);
    setIsAddingLink(false);
  };

  const handleCancelNewLink = () => {
    setIsAddingLink(false);
  };

  const handleEditLink = (index: number, updatedLink: Partial<Link>) => {
    const currentLink = links[index];
    update(index, { ...currentLink, ...updatedLink });
  };

  const handleDeleteLink = (index: number) => {
    remove(index);
  };

  const handleGenerateLinks = async () => {
    if (onGenerateLinks) {
      await onGenerateLinks();
      setIsExpanded(true);
    }
  };

  const getFieldError = (index: number, field: 'url' | 'anchorText') => {
    const fieldErrors = errors.step2?.[type === 'internal' ? 'internalLinks' : 'externalLinks'];
    return fieldErrors?.[index]?.[field]?.message;
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`
          : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.01)} 100%)`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: isExpanded ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Iconify icon={icon} width={20} height={20} color="primary.main" />
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
          {links.length > 0 && (
            <Box
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {links.length}
            </Box>
          )}
        </Box>
        
        <IconButton size="small">
          <Iconify
            icon={isExpanded ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'}
            width={20}
            height={20}
          />
        </IconButton>
      </Box>

      {/* Content */}
      <Collapse in={isExpanded}>
        <Box sx={{ p: 2, pt: 0 }}>
          {/* Website URL Input for Internal Links */}
          {showWebsiteUrlInput && (
            <Box sx={{ mb: 2, mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Enter your website URL to generate relevant internal links
              </Typography>
              <TextField
                fullWidth
                size="small"
                label="Your Website URL"
                value={websiteUrl || ''}
                {...register("step2.websiteUrl")}
                error={!!errors.step2?.websiteUrl}
                helperText={errors.step2?.websiteUrl?.message}
                placeholder="https://yourwebsite.com"
              />
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, mt: showWebsiteUrlInput ? 2 : 2 }}>
            {onGenerateLinks && (
              <Button
                variant={links.length === 0 ? "contained" : "outlined"}
                size={links.length === 0 ? "medium" : "small"}
                startIcon={
                  isGenerating ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Iconify icon="mdi:auto-fix" width={16} height={16} />
                  )
                }
                onClick={handleGenerateLinks}
                disabled={isGenerating}
                sx={{
                  borderRadius: 6,
                  ...(links.length === 0 && {
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    boxShadow: theme.shadows[2],
                  })
                }}
              >
                {isGenerating
                  ? t('links.generating', 'Generating...')
                  : t('links.generateLinks', 'Generate Links')}
              </Button>
            )}

            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="eva:plus-fill" width={16} height={16} />}
              onClick={handleAddManualLink}
              disabled={isAddingLink}
              sx={{ borderRadius: 6 }}
            >
              {t('links.addManual', 'Add Manual Link')}
            </Button>
          </Box>

          {/* New Link Form (when adding) */}
          {isAddingLink && (
            <NewLinkForm
              type={type}
              onSave={handleSaveNewLink}
              onCancel={handleCancelNewLink}
            />
          )}

          {/* Links List or Empty State */}
          {fields.length === 0 && !isAddingLink ? (
            <EmptyLinksAlert type={type} />
          ) : (
            fields.length > 0 && (
              <LinksList
                fields={fields}
                links={links}
                type={type}
                onEdit={handleEditLink}
                onDelete={handleDeleteLink}
                getFieldError={getFieldError}
              />
            )
          )}
        </Box>
      </Collapse>
    </Card>
  );
}

// ----------------------------------------------------------------------

interface NewLinkFormProps {
  type: 'internal' | 'external';
  onSave: (link: Omit<Link, 'id'>) => void;
  onCancel: () => void;
}

function NewLinkForm({ type, onSave, onCancel }: NewLinkFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [url, setUrl] = useState('');
  const [anchorText, setAnchorText] = useState('');

  // Real-time validation
  const isValidUrl = (urlValue: string) => {
    if (!urlValue.trim()) return false;
    try {
      return true;
    } catch {
      return false;
    }
  };

  const isValidAnchorText = (text: string) => text.trim().length > 0;

  const urlError = url.length > 0 && !isValidUrl(url);
  const anchorTextError = anchorText.length > 0 && !isValidAnchorText(anchorText);
  const isFormValid = isValidUrl(url) && isValidAnchorText(anchorText);

  const handleSave = () => {
    if (isFormValid) {
      onSave({
        url: url.trim(),
        anchorText: anchorText.trim(),
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid) {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        bgcolor: alpha(theme.palette.primary.main, 0.02),
        borderRadius: 1,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
        {type === 'internal' 
          ? t('links.addNewInternalLink', 'Add New Internal Link')
          : t('links.addNewExternalLink', 'Add New External Link')
        }
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          size="small"
          label={t('links.url', 'URL')}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyPress}
          error={urlError}
          helperText={
            urlError
              ? t('links.urlError', 'Please enter a valid URL (e.g., https://example.com)')
              : ''
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
          value={anchorText}
          onChange={(e) => setAnchorText(e.target.value)}
          onKeyDown={handleKeyPress}
          error={anchorTextError}
          helperText={
            anchorTextError
              ? t('links.anchorTextError', 'Please enter anchor text')
              : ''
          }
          placeholder={t('links.anchorTextPlaceholder', 'Click here to learn more')}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
        <Button size="small" onClick={onCancel}>
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
  );
}