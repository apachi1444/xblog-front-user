import toast from 'react-hot-toast';
import { usePDF } from 'react-to-pdf';
import { useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface UseReactToPdfOptions {
  filename?: string;
  page?: {
    margin: number;
    format: 'A4' | 'letter';
    orientation: 'portrait' | 'landscape';
  };
}

interface UseReactToPdfReturn {
  targetRef: React.RefObject<HTMLDivElement>;
  downloadPdf: () => Promise<void>;
  isGenerating: boolean;
}

/**
 * Custom hook for generating PDFs from React components using react-to-pdf
 */
export const useReactToPdf = (options: UseReactToPdfOptions = {}): UseReactToPdfReturn => {
  const { t } = useTranslation();
  const targetRef = useRef<HTMLDivElement>(null);

  const {
    filename = 'invoice.pdf',
    page = {
      margin: 20,
      format: 'A4',
      orientation: 'portrait',
    },
  } = options;

  const { toPDF, targetRef: pdfTargetRef } = usePDF({
    filename,
    page: {
      margin: page.margin,
      format: page.format,
      orientation: page.orientation,
    },
    canvas: {
      mimeType: 'image/png',
      qualityRatio: 1,
    },
    overrides: {
      // Better PDF quality
      pdf: {
        compress: true,
      },
      // Ensure proper styling
      canvas: {
        useCORS: true,
      },
    },
  });

  // Sync the refs
  if (targetRef.current && pdfTargetRef) {
    (pdfTargetRef as React.MutableRefObject<HTMLDivElement>).current = targetRef.current;
  }

  const downloadPdf = useCallback(async (): Promise<void> => {
    try {
      // Show loading toast
      const loadingToast = toast.loading(
        t('invoice.generatingPdf', 'Generating PDF invoice...')
      );

      // Generate and download PDF
      await toPDF();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show success message
      toast.success(
        t('invoice.downloadSuccess', 'Invoice downloaded successfully!')
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Show error message
      toast.error(
        t('invoice.downloadError', 'Failed to generate PDF. Please try again.')
      );
    }
  }, [toPDF, t]);

  return {
    targetRef,
    downloadPdf,
    isGenerating: false, // react-to-pdf doesn't expose loading state directly
  };
};

/**
 * Generate filename for invoice PDF
 */
export const generateInvoiceFilename = (invoiceNumber: string, date?: string): string => {
  const dateStr = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  return `invoice-${invoiceNumber}-${dateStr}.pdf`;
};

export default useReactToPdf;
