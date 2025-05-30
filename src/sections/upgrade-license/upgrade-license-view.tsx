import toast from 'react-hot-toast';
import { usePDF } from 'react-to-pdf';
import { useTranslation } from 'react-i18next';
import { Download, RefreshCw } from "lucide-react";
import { useState, useEffect, useCallback } from 'react';

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

import Invoice from 'src/components/Invoice';
import CleanInvoice from 'src/components/CleanInvoice';
import { type InvoiceData } from 'src/components/CleanInvoice';
import { ResponsivePricingPlans } from 'src/components/pricing';

export function UpgradeLicenseView() {
  const { t } = useTranslation();
  const [isRefreshingAfterReturn, setIsRefreshingAfterReturn] = useState(false);
  const [showInvoicePdf, setShowInvoicePdf] = useState<InvoiceData | null>(null);

  const { toPDF, targetRef } = usePDF({
    filename: 'invoice.pdf',
    page: {
      format: 'A4',
      orientation: 'portrait',
      margin: 0 // Reduced margin for better space utilization
    },
    canvas: {
      mimeType: 'image/png',
      qualityRatio: 1,
      logging: true,
      useCORS: true,
    },
    overrides: {
      // Better PDF quality and sizing
      pdf: {
        compress: true,
        unit: 'mm',
        format: 'a4',
      },
      // Ensure proper styling
      canvas: {
        useCORS: true,
        scale: 2, // Higher scale for better quality
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
      },
    },
  });
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
      // Convert invoice data for PDF generation
      const cleanInvoiceData = convertToInvoiceData(invoice);
      setShowInvoicePdf(cleanInvoiceData);

      // Small delay to ensure content is rendered
      await new Promise(resolve => setTimeout(resolve, 200));

      // Ensure fonts are loaded
      if (document.fonts) {
        await document.fonts.ready;
      }

      // Generate PDF
      toPDF();

      // Clear the invoice data after generation
      setTimeout(() => setShowInvoicePdf(null), 1000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // toast.error('Failed to generate PDF. Please try again.');
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

  const invoiceData = {
    planName: 'Professional Plan',
    price: 299.99,
    tax : 12,
    total: 12
  };

  // Convert invoice data for CleanInvoice component
  const convertToInvoiceData = (invoice: any): InvoiceData => ({
      // Invoice details
      invoiceNumber: invoice.invoiceNumber || 'INV-2024-001',
      invoiceDate: invoice.createdAt || '10-02-2023',
      dueDate: invoice.dueDate || '10-16-2023',
      status: invoice.status || 'paid',

      // Company details
      companyName: 'Your Company Inc.',
      companyAddress: '1234 Company St.',
      companyCity: 'Company Town, ST 12345',
      companyPhone: '+1 (555) 123-4567',
      companyEmail: 'contact@yourcompany.com',
      companyWebsite: 'www.yourcompany.com',

      // Customer details
      customerName: 'Customer Name',
      customerAddress: '1234 Customer St.',
      customerCity: 'Customer Town, ST 12345',
      customerEmail: 'customer@email.com',

      // Invoice items
      items: [
        {
          description: invoice.planName || 'Professional Plan',
          quantity: 1.00,
          tax: 10,
          amount: invoice.amount || 299.99,
        }
      ],

      // Totals
      subtotal: invoice.amount || 299.99,
      totalTax: (invoice.amount || 299.99) * 0.05, // 5% tax
      total: (invoice.amount || 299.99) * 1.05,

      // Payment terms
      paymentTerms: 'Payment is due in 14 days',
    });


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

      <Box
        ref={targetRef}
        sx={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '210mm', // A4 width
          height: '297mm', // A4 height
          backgroundColor: 'white',
          padding: '0', // Remove all padding
          margin: '0', // Remove all margin
          boxSizing: 'border-box',
          overflow: 'hidden', // Prevent content overflow
          // Ensure the content fills the available space
          '& > *': {
            width: '100%',
            height: '100%',
            maxWidth: 'none',
            maxHeight: 'none',
            margin: '0 !important',
            padding: '0 !important',
          },
          // Override any responsive styles that might interfere
          '@media print': {
            position: 'static',
            top: 'auto',
            left: 'auto',
            width: '100%',
            height: '100%',
            padding: '0',
            margin: '0',
          }
        }}
      >
        {showInvoicePdf ? (
          <CleanInvoice data={showInvoicePdf} />
        ) : (
          <Invoice {...invoiceData} />
        )}
      </Box>
      </Container>
    </DashboardContent>
  );
}
