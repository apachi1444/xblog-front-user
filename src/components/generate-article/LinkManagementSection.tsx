import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, useFieldArray, useFormContext } from 'react-hook-form';

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

// Form data for manual link addition
interface ManualLinkFormData {
  url: string;
  anchorText: string;
}

// ----------------------------------------------------------------------

interface LinkManagementSectionProps {
  type: 'internal' | 'external';
  title: string;
  icon: string;
  onGenerateLinks?: (websiteUrl?: string) => Promise<void>;
  isGenerating?: boolean;
  showWebsiteUrlInput?: boolean;
  websiteUrlError?: string;
}

export function LinkManagementSection({
  type,
  title,
  icon,
  onGenerateLinks,
  isGenerating = false,
  showWebsiteUrlInput = false,
  websiteUrlError,
}: LinkManagementSectionProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false); // Collapsed by default
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [areLinksVisible, setAreLinksVisible] = useState(true); // State for showing/hiding links list

  const { control, formState: { errors }, watch } = useFormContext<GenerateArticleFormData>();
  
  const fieldName = type === 'internal' ? 'step2.internalLinks' : 'step2.externalLinks';
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: fieldName,
  });

  const links = watch(fieldName) || [];

  // Generate a unique ID for new links
  const generateId = () => `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // URL validation function (same as in manual link form)
  const isValidUrl = (url: string) => {
    if (!url || !url.trim()) return false;
    try {
      // eslint-disable-next-line no-new
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Real-time website URL validation for internal links
  const websiteUrlHasValidationError = type === 'internal' && websiteUrl && websiteUrl.length > 0 && !isValidUrl(websiteUrl);
  const finalWebsiteUrlError = websiteUrlHasValidationError
    ? 'Please enter a valid URL (e.g., https://yourwebsite.com)'
    : websiteUrlError;

  // Check if generate button should be disabled for internal links
  const isGenerateDisabled = type === 'internal'
    ? (!websiteUrl || !websiteUrl.trim() || !isValidUrl(websiteUrl) || isGenerating)
    : isGenerating;

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
      // For internal links, pass the local websiteUrl state
      const urlToPass = type === 'internal' ? websiteUrl : undefined;
      await onGenerateLinks(urlToPass);
      setIsExpanded(true);
    }
  };

  const handleToggleLinksVisibility = () => {
    setAreLinksVisible(!areLinksVisible);
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
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.primary.main, 0.2)
                  : alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.mode === 'dark'
                  ? theme.palette.primary.light
                  : theme.palette.primary.main,
                fontSize: '0.875rem', // Bigger font size
                fontWeight: 700, // Bolder
                minWidth: '24px',
                textAlign: 'center',
                border: theme.palette.mode === 'dark'
                  ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                  : `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: theme.palette.mode === 'dark'
                  ? `0 2px 4px ${alpha(theme.palette.common.black, 0.3)}`
                  : `0 2px 4px ${alpha(theme.palette.primary.main, 0.1)}`,
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
                onChange={(e) => setWebsiteUrl(e.target.value)}
                error={!!finalWebsiteUrlError}
                helperText={finalWebsiteUrlError}
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
                disabled={isGenerateDisabled}
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

            {/* Eye Icon for Links Visibility - Only show if there are links */}
            {fields.length > 0 && (
              <IconButton
                size="small"
                onClick={handleToggleLinksVisibility}
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  }
                }}
              >
                <Iconify
                  icon={areLinksVisible ? 'eva:eye-off-fill' : 'eva:eye-fill'}
                  width={18}
                  height={18}
                />
              </IconButton>
            )}
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
            fields.length > 0 && areLinksVisible && (
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

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<ManualLinkFormData>({
    mode: 'onChange',
    defaultValues: {
      url: '',
      anchorText: '',
    },
  });

  // URL validation function
  const validateUrl = (value: string) => {
    if (!value.trim()) return 'URL is required';
    try {
      // eslint-disable-next-line no-new
      new URL(value);
      return true;
    } catch {
      return 'Please enter a valid URL (e.g., https://example.com)';
    }
  };

  // Anchor text validation function
  const validateAnchorText = (value: string) => {
    if (!value.trim()) return 'Anchor text is required';
    return true;
  };

  const onSubmit = (data: ManualLinkFormData) => {
    onSave({
      url: data.url.trim(),
      anchorText: data.anchorText.trim(),
    });
    reset();
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      handleSubmit(onSubmit)();
    } else if (e.key === 'Escape') {
      handleCancel();
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
        <Controller
          name="url"
          control={control}
          rules={{ validate: validateUrl }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label={t('links.url', 'URL')}
              onKeyDown={handleKeyPress}
              error={!!error}
              helperText={error?.message || ''}
              placeholder={
                type === 'internal'
                  ? 'https://yourwebsite.com/page'
                  : 'https://example.com'
              }
              autoFocus
            />
          )}
        />

        <Controller
          name="anchorText"
          control={control}
          rules={{ validate: validateAnchorText }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label={t('links.anchorText', 'Anchor Text')}
              onKeyDown={handleKeyPress}
              error={!!error}
              helperText={error?.message || ''}
              placeholder={t('links.anchorTextPlaceholder', 'Click here to learn more')}
            />
          )}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
        <Button size="small" onClick={handleCancel}>
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
          sx={{
            opacity: isValid ? 1 : 0.6,
          }}
        >
          {t('common.save', 'Save')}
        </Button>
      </Box>
    </Box>
  );
}