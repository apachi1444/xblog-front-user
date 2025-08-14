import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
  alpha,
  Button,
  useTheme,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { HtmlRenderer, HtmlBodyRenderer, HtmlIframeRenderer } from '../html-renderer';

interface ArticleHtmlPreviewProps {
  htmlContent: string;
  title?: string;
  onDownload?: () => void;
  onEdit?: () => void;
}

type RenderMode = 'body' | 'iframe' | 'full';

/**
 * Component to preview generated HTML article content
 * Supports multiple rendering modes for different use cases
 */
export function ArticleHtmlPreview({ 
  htmlContent, 
  title = 'Article Preview',
  onDownload,
  onEdit 
}: ArticleHtmlPreviewProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [renderMode, setRenderMode] = useState<RenderMode>('body');

  const handleRenderModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: RenderMode | null,
  ) => {
    if (newMode !== null) {
      setRenderMode(newMode);
    }
  };

  const renderContent = () => {
    switch (renderMode) {
      case 'iframe':
        return (
          <HtmlIframeRenderer 
            htmlContent={htmlContent}
            className="article-preview-iframe"
          />
        );
      case 'full':
        return (
          <HtmlRenderer 
            htmlContent={htmlContent}
            updateDocumentHead={false} // Don't update head in preview
            className="article-preview-full"
          />
        );
      case 'body':
      default:
        return (
          <HtmlBodyRenderer 
            htmlContent={htmlContent}
            className="article-preview-body"
          />
        );
    }
  };

  return (
    <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onEdit && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="eva:edit-2-outline" />}
              onClick={onEdit}
            >
              {t('common.edit', 'Edit')}
            </Button>
          )}
          
          {onDownload && (
            <Button
              variant="contained"
              size="small"
              startIcon={<Iconify icon="eva:download-outline" />}
              onClick={onDownload}
            >
              {t('common.download', 'Download')}
            </Button>
          )}
        </Box>
      </Box>

      {/* Render Mode Toggle */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={renderMode}
          exclusive
          onChange={handleRenderModeChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              px: 2,
              py: 0.5,
              fontSize: '0.875rem',
            },
          }}
        >
          <ToggleButton value="body">
            <Iconify icon="eva:file-text-outline" sx={{ mr: 1 }} />
            {t('preview.mode.body', 'Body Only')}
          </ToggleButton>
          <ToggleButton value="iframe">
            <Iconify icon="eva:browser-outline" sx={{ mr: 1 }} />
            {t('preview.mode.iframe', 'Full Page')}
          </ToggleButton>
          <ToggleButton value="full">
            <Iconify icon="eva:code-outline" sx={{ mr: 1 }} />
            {t('preview.mode.full', 'Raw HTML')}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Content Preview */}
      <Box 
        sx={{ 
          flex: 1,
          border: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
          borderRadius: 1,
          overflow: 'hidden',
          backgroundColor: renderMode === 'full' ? alpha(theme.palette.grey[100], 0.5) : 'white',
        }}
      >
        {htmlContent ? (
          renderContent()
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '200px',
              color: 'text.secondary'
            }}
          >
            <Typography variant="body2">
              {t('preview.noContent', 'No content to preview')}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Info */}
      <Box sx={{ mt: 2, p: 2, backgroundColor: alpha(theme.palette.info.main, 0.1), borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          <strong>{t('preview.mode.body', 'Body Only')}:</strong> {t('preview.info.body', 'Renders only the body content within the current page styles')}
          <br />
          <strong>{t('preview.mode.iframe', 'Full Page')}:</strong> {t('preview.info.iframe', 'Renders the complete HTML document in an isolated iframe')}
          <br />
          <strong>{t('preview.mode.full', 'Raw HTML')}:</strong> {t('preview.info.full', 'Renders the complete HTML including head tags (may affect current page)')}
        </Typography>
      </Box>
    </Card>
  );
}

/**
 * Simplified version for quick HTML preview
 */
export function SimpleHtmlPreview({ htmlContent }: { htmlContent: string }) {
  return (
    <Box 
      sx={{ 
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: 'white',
        minHeight: '300px',
      }}
    >
      <HtmlBodyRenderer htmlContent={htmlContent} />
    </Box>
  );
}

/**
 * Full-screen HTML preview modal
 */
export function FullScreenHtmlPreview({ 
  htmlContent, 
  open, 
  onClose 
}: { 
  htmlContent: string; 
  open: boolean; 
  onClose: () => void; 
}) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6">
          {t('preview.fullscreen', 'Full Screen Preview')}
        </Typography>
        <Button
          variant="outlined"
          onClick={onClose}
          startIcon={<Iconify icon="eva:close-outline" />}
        >
          {t('common.close', 'Close')}
        </Button>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <HtmlIframeRenderer htmlContent={htmlContent} />
      </Box>
    </Box>
  );
}
