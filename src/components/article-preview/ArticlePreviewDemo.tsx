import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { ArticlePreviewModal } from './ArticlePreviewModal';
import { mockArticleInfo, mockArticleSections } from './mockArticleData';

/**
 * Demo component to showcase the ArticlePreviewModal with various section types
 */
export const ArticlePreviewDemo: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {t('preview.demoTitle', 'Article Preview Demo')}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {t('preview.demoDescription', 'This demo showcases the article preview functionality with various section types including introduction, table of contents, paragraphs, bullet lists, tables, image galleries, and FAQs.')}
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mdi:eye" />}
            onClick={handleOpen}
            sx={{ mt: 2 }}
          >
            {t('preview.openPreview', 'Open Article Preview')}
          </Button>
        </CardContent>
      </Card>

      <ArticlePreviewModal
        open={open}
        onClose={handleClose}
        articleInfo={mockArticleInfo}
        sections={mockArticleSections}
      />
    </Box>
  );
};
