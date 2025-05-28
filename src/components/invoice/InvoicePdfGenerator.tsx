import { Download } from 'lucide-react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, CircularProgress } from '@mui/material';

import { useReactToPdf, generateInvoiceFilename } from 'src/hooks/useReactToPdf';

import { InvoiceTemplate, type InvoiceData } from './InvoiceTemplate';

interface InvoicePdfGeneratorProps {
  data: InvoiceData;
  autoDownload?: boolean;
  showDownloadButton?: boolean;
  onDownloadComplete?: () => void;
  onDownloadError?: (error: Error) => void;
}

/**
 * Component that renders an invoice and provides PDF download functionality
 */
export const InvoicePdfGenerator: React.FC<InvoicePdfGeneratorProps> = ({
  data,
  autoDownload = false,
  showDownloadButton = true,
  onDownloadComplete,
  onDownloadError,
}) => {
  const { t } = useTranslation();

  const filename = generateInvoiceFilename(data.invoiceNumber, data.invoiceDate);

  const { targetRef, downloadPdf, isGenerating } = useReactToPdf({
    filename,
    page: {
      margin: 20,
      format: 'A4',
      orientation: 'portrait',
    },
  });

  // Auto-download if requested
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (autoDownload) {
      const timer = setTimeout(() => {
        downloadPdf()
          .then(() => {
            onDownloadComplete?.();
          })
          .catch((error) => {
            onDownloadError?.(error);
          });
      }, 1000); // Small delay to ensure component is fully rendered

      return () => clearTimeout(timer);
    }
  }, [autoDownload, downloadPdf, onDownloadComplete, onDownloadError]);

  const handleDownload = async () => {
    try {
      await downloadPdf();
      onDownloadComplete?.();
    } catch (error) {
      onDownloadError?.(error as Error);
    }
  };

  return (
    <Box>
      {/* Hidden invoice template for PDF generation */}
      <Box
        ref={targetRef}
        sx={{
          // Hide from view but keep in DOM for PDF generation
          position: autoDownload ? 'absolute' : 'relative',
          left: autoDownload ? '-9999px' : 'auto',
          top: autoDownload ? '-9999px' : 'auto',
          width: autoDownload ? '210mm' : 'auto', // A4 width
          minHeight: autoDownload ? '297mm' : 'auto', // A4 height
          backgroundColor: 'white',
          // Ensure proper styling for PDF
          '& *': {
            boxSizing: 'border-box',
          },
          // Print styles
          '@media print': {
            position: 'static',
            left: 'auto',
            top: 'auto',
            width: 'auto',
            minHeight: 'auto',
          },
        }}
      >
        <InvoiceTemplate data={data} />
      </Box>

      {/* Download button */}
      {showDownloadButton && !autoDownload && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={
              isGenerating ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Download size={20} />
              )
            }
            onClick={handleDownload}
            disabled={isGenerating}
            sx={{
              px: 3,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            {isGenerating
              ? t('invoice.generating', 'Generating PDF...')
              : t('invoice.downloadPdf', 'Download PDF')
            }
          </Button>
        </Box>
      )}

      {/* Preview mode - show the invoice */}
      {!autoDownload && (
        <Box sx={{ mt: 3 }}>
          <InvoiceTemplate data={data} />
        </Box>
      )}
    </Box>
  );
};

export default InvoicePdfGenerator;
