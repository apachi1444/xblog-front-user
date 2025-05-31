import jsPDF  from 'jspdf';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';
import { Download, RefreshCw } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from 'react';

import {
  Box,
  Card,
  Chip,
  Table,
  Button,
  Tooltip,
  TableRow,
  Container,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CircularProgress,
} from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";
import {
  useGetUserInvoicesQuery,
  useLazyGetUserInvoicesQuery,
  useGetSubscriptionPlansQuery
} from 'src/services/apis/subscriptionApi';

import { ResponsivePricingPlans } from 'src/components/pricing';
import ExactInvoice, { type ExactInvoiceData } from 'src/components/ExactInvoice';
import { generatePDF } from '.';

export function UpgradeLicenseView() {
  const { t } = useTranslation();
  const [isRefreshingAfterReturn, setIsRefreshingAfterReturn] = useState(false);
  const [showInvoiceForPdf, setShowInvoiceForPdf] = useState<ExactInvoiceData | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  // Fetch subscription plans
  const {
    isLoading: isLoadingPlans,
    refetch: refetchPlans
  } = useGetSubscriptionPlansQuery();

  // Fetch user invoices with user_id
  const {
    data: invoicesData,
    isLoading: isLoadingInvoices,
    refetch: refetchInvoices
  } = useGetUserInvoicesQuery();

  const [
    triggerRefreshInvoices,
    { isLoading: isRefreshingInvoices }
  ] = useLazyGetUserInvoicesQuery();

  // Handle refreshing all data
  const refreshAllData = useCallback(async (isAfterReturn = false) => {
    try {
      if (isAfterReturn) {
        setIsRefreshingAfterReturn(true);
      }

      await Promise.all([
        refetchPlans(),
        refetchInvoices()
      ]);

      if (isAfterReturn) {
        toast.success('Data updated after returning to the app');
      } else {
        toast.success('Data refreshed successfully');
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    } finally {
      if (isAfterReturn) {
        setIsRefreshingAfterReturn(false);
      }
    }
  }, [refetchPlans, refetchInvoices]);

  // Convert invoice data to ExactInvoiceData format
  const convertToExactInvoiceData = useCallback((invoice: any): ExactInvoiceData => ({
      // Company details
      companyName: 'Your Company Inc.',
      companyAddress: '1234 Company St.',
      companyCity: 'Company Town, ST 12345',

      // Customer details
      customerName: 'Customer Name',
      customerAddress: '1234 Customer St.',
      customerCity: 'Customer Town, ST 12345',

      // Invoice details
      invoiceNumber: invoice.invoiceNumber || '0000007',
      invoiceDate: invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }) : '10-02-2023',
      dueDate: invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }) : '10-16-2023',

      // Invoice items - using the exact format from your image
      items: [
        {
          quantity: 1.00,
          description: invoice.plan || 'Professional Plan Subscription',
          unitPrice: invoice.amount || 40.00,
          amount: invoice.amount || 40.00,
        }
      ],

      // Totals
      subtotal: invoice.amount || 40.00,
      salesTax: (invoice.amount || 40.00) * 0.05, // 5% tax
      total: (invoice.amount || 40.00) * 1.05,
    }), []);

  // Handle refreshing invoices
  const handleRefreshInvoices = async () => {
    try {
      await triggerRefreshInvoices().unwrap();
      toast.success(t('upgrade.invoicesRefreshed', 'Invoices refreshed successfully'));
    } catch (error) {
      toast.error(t('upgrade.invoicesRefreshError', 'Failed to refresh invoices'));
    }
  };

  // Handle PDF download for specific invoice
  const handleDownloadInvoicePdf = async (invoice: any) => {
    try {
      // Convert invoice data
      const exactInvoiceData = convertToExactInvoiceData(invoice);

      // Set the invoice data to render the component
      setShowInvoiceForPdf(exactInvoiceData);

      // Small delay to ensure content is rendered
      await new Promise(resolve => setTimeout(resolve, 300));

      // Ensure fonts are loaded
      if (document.fonts) {
        await document.fonts.ready;
      }

      // Get the invoice element
      const invoiceElement = invoiceRef.current;
      if (!invoiceElement) {
        throw new Error('Invoice element not found');
      }

      // Generate canvas from the invoice element
      const canvas = await html2canvas(invoiceElement, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI (210mm)
        height: 1123, // A4 height in pixels at 96 DPI (297mm)
      });

      // Create PDF
      // eslint-disable-next-line new-cap
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Calculate dimensions to fit the canvas exactly to A4
      const imgWidth = 210; // A4 width in mm
      const imgHeight = 297; // A4 height in mm

      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/png');

      // Add image to PDF with exact A4 dimensions
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Download the PDF
      const fileName = `invoice-${exactInvoiceData.invoiceNumber}.pdf`;
      pdf.save(fileName);

      // Clear the invoice data after a short delay
      setTimeout(() => {
        setShowInvoiceForPdf(null);
      }, 1000);

      toast.success('Invoice PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
      // Clear the invoice data on error
      setShowInvoiceForPdf(null);
    }
  };

  // Handle opening plan in new tab
  const handleChoosePlan = useCallback((planId: string) => {
    console.log(`Opening plan ${planId} in new tab`);
    // Open the plan URL in a new tab
    const planUrl = `https://example.com/checkout?plan=${planId}`;
    window.open(planUrl, '_blank');
  }, []);

  // Set up visibility change listener to detect when user returns to the app
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('User returned to the app, refreshing data...');
        refreshAllData(true); // Pass true to indicate this is after returning to the app
      }
    };

    // Add event listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshAllData]);


  return (
    <DashboardContent>
      {/* Loading overlay when refreshing after return */}
      {isRefreshingAfterReturn && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <CircularProgress color="primary" size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Updating data...
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please wait while we refresh your subscription information
          </Typography>
        </Box>
      )}

      <Container maxWidth={false}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
          <Typography variant="h4" gutterBottom>
            Upgrade License
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => refreshAllData(false)} // Pass false to indicate this is a manual refresh
              disabled={isLoadingPlans || isLoadingInvoices || isRefreshingInvoices || isRefreshingAfterReturn}
              startIcon={
                isLoadingPlans || isLoadingInvoices || isRefreshingInvoices ?
                <CircularProgress size={16} /> :
                <RefreshCw size={16} />
              }
            >
              Refresh All
            </Button>
            {isLoadingPlans && (
              <CircularProgress size={24} />
            )}
          </Box>
        </Box>

        <Box
          mb={4}
          mt={4}
        >
          {/* Use the ResponsivePricingPlans component */}
          <ResponsivePricingPlans
            onSelectPlan={handleChoosePlan}
            gridColumns={{ xs: 1, sm: 1, md: 3 }}
            title=""
            subtitle=""
          />
        </Box>

        <Box sx={{ mt: 6 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" gutterBottom>
              Billing History
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleRefreshInvoices}
              disabled={isRefreshingInvoices}
              startIcon={isRefreshingInvoices ? <CircularProgress size={16} /> : <RefreshCw size={16} />}
            >
              Refresh
            </Button>
          </Box>

          <Card variant="outlined">
            {isLoadingInvoices ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Loading invoices...
                </Typography>
              </Box>
            ) : invoicesData?.invoices && invoicesData.invoices.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Invoice</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Subscription</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Download</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoicesData.invoices.map((invoice, index) => (
                    <TableRow key={invoice.id} hover>
                      <TableCell>{String(index + 1).padStart(2, '0')}</TableCell>
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{invoice.plan}</TableCell>
                      <TableCell align="right">${invoice.amount}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={invoice.status}
                          color={invoice.status === "paid" ? "success" : "warning"}
                          size="small"
                          sx={{
                            textTransform: 'capitalize',
                            fontWeight: 'medium'
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={t('upgrade.downloadInvoice', 'Download PDF Invoice')}>
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            sx={{ padding: '6px 12px', minWidth: 'auto' }}
                            onClick={() => handleDownloadInvoicePdf(invoice)}
                          >
                            <Download size={18} />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No billing history available
                </Typography>
              </Box>
            )}
          </Card>
        </Box>
      </Container>

      <Card />
      <button type="button" title="Generate Card PDF" onClick={() => generatePDF("card")}>
        Generate Card PDF
      </button>


      {/* Hidden invoice component for PDF generation */}
      {showInvoiceForPdf && (
        <Box
          sx={{
            position: 'fixed',
            top: '-9999px',
            left: '-9999px',
            zIndex: -1,
            visibility: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <ExactInvoice ref={invoiceRef} data={showInvoiceForPdf} />
        </Box>
      )}
    </DashboardContent>
  );
}
