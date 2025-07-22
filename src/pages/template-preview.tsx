import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Box, Button, Container, Typography, CircularProgress } from '@mui/material';

import { getTemplateById, decryptTemplateId } from 'src/utils/templateUtils';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function TemplatePreviewPage() {
  const { encryptedId } = useParams<{ encryptedId: string }>();
  const navigate = useNavigate();
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [templateName, setTemplateName] = useState<string>('');



  useEffect(() => {
    const loadTemplatePreview = async () => {
      if (!encryptedId) {
        setError('Invalid template ID');
        setIsLoading(false);
        return;
      }

      try {
        // Decrypt the template ID
        const templateId = decryptTemplateId(encryptedId);
        
        if (!templateId) {
          setError('Invalid template ID');
          setIsLoading(false);
          return;
        }

        // Get template information
        const template = getTemplateById(templateId);
        
        if (!template) {
          setError('Template not found');
          setIsLoading(false);
          return;
        }

        setTemplateName(template.title);

        // Load the template HTML file
        const htmlFile = template.htmlFile || 'aa.html';
        const response = await fetch(`/${htmlFile}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load template: ${response.status}`);
        }
        
        const htmlText = await response.text();
        setHtmlContent(htmlText);
        
        console.log(`✅ Loaded template preview: ${htmlFile} for template: ${templateId}`);
      } catch (errore) {
        setError('Failed to load template preview');
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplatePreview();
  }, [encryptedId]);

  // Loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="h6" color="text.secondary">
          Loading template preview...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 3,
          }}
        >
          <Iconify icon="mdi:alert-circle-outline" sx={{ fontSize: 64, color: 'error.main' }} />
          <Typography variant="h4" gutterBottom>
            Template Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:arrow-left" />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  // Success state - render the HTML content
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header with template info and close button */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 2,
          py: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: 1200,
            mx: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Iconify icon="mdi:eye-outline" sx={{ color: 'primary.main' }} />
            <Typography variant="h6">
              {templateName} - Preview
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Iconify icon="mdi:close" />}
            onClick={() => window.close()}
          >
            Close Preview
          </Button>
        </Box>
      </Box>

      {/* Template content */}
      <Box
        sx={{ pt: 8 }} // Add padding to account for fixed header
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </Box>
  );
}
