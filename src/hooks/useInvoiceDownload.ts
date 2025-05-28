import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { generateInvoiceFilename, isPdfGenerationSupported, downloadInvoiceWithFileDownload } from 'src/utils/pdfUtils';

import { useDownloadInvoicePdfMutation } from 'src/services/apis/subscriptionApi';

interface UseInvoiceDownloadReturn {
  downloadInvoice: (paymentId: string, invoiceNumber: string, createdAt?: string) => Promise<void>;
  isDownloading: boolean;
  error: string | null;
}

/**
 * Custom hook for handling invoice PDF downloads
 */
export const useInvoiceDownload = (): UseInvoiceDownloadReturn => {
  const { t } = useTranslation();
  const [downloadInvoicePdf] = useDownloadInvoicePdfMutation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadInvoice = async (
    paymentId: string,
    invoiceNumber: string,
    createdAt?: string
  ): Promise<void> => {
    // Check if PDF generation is supported
    if (!isPdfGenerationSupported()) {
      const errorMsg = t('invoice.downloadNotSupported', 'PDF download is not supported in your browser');
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsDownloading(true);
    setError(null);

    try {
      // Show loading toast
      const loadingToast = toast.loading(
        t('invoice.downloadingPdf', 'Generating PDF invoice...')
      );

      // Call the API to get HTML content
      const response = await downloadInvoicePdf({ payment_id: paymentId }).unwrap();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Generate filename
      const filename = generateInvoiceFilename(invoiceNumber, createdAt);

      // Convert HTML to PDF and download using js-file-download
      await downloadInvoiceWithFileDownload(response, filename);

      // Show success message
      toast.success(
        t('invoice.downloadSuccess', 'Invoice downloaded successfully!')
      );

    } catch (err: any) {
      console.error('Error downloading invoice:', err);

      let errorMessage = t('invoice.downloadError', 'Failed to download invoice. Please try again.');

      // Handle specific error cases
      if (err?.status === 404) {
        errorMessage = t('invoice.notFound', 'Invoice not found.');
      } else if (err?.status === 403) {
        errorMessage = t('invoice.accessDenied', 'Access denied. You do not have permission to download this invoice.');
      } else if (err?.status >= 500) {
        errorMessage = t('invoice.serverError', 'Server error. Please try again later.');
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadInvoice,
    isDownloading,
    error,
  };
};

export default useInvoiceDownload;
