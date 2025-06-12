import jsPDF  from 'jspdf';
import toast from 'react-hot-toast';
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
  type Invoice,
  useGetUserInvoicesQuery,
  useLazyGetUserInvoicesQuery,
  useGetSubscriptionPlansQuery
} from 'src/services/apis/subscriptionApi';

import { ResponsivePricingPlans } from 'src/components/pricing';


export function UpgradeLicenseView() {
  const { t } = useTranslation();
  const [isRefreshingAfterReturn, setIsRefreshingAfterReturn] = useState(false);

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

  // Helper function to transform API invoice data for UI compatibility
  const transformInvoiceData = (invoice: Invoice) => ({
    ...invoice,
    id: invoice.payment_id?.toString() || '',
    invoiceNumber: `INV-${invoice.payment_id?.toString().padStart(6, '0')}`,
    createdAt: invoice.created_at,
    plan: `Plan ID: ${invoice.plan_id}`,
    amount: parseFloat(invoice.amount || '0'),
  });

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
  const handleDownloadInvoicePdf = async (invoice: Invoice) => {
    // Transform the invoice data to ensure we have the right fields
    const transformedInvoice = transformInvoiceData(invoice);
    try {
      toast.success('Generating PDF...');

      // Create PDF directly with jsPDF without html2canvas
      // eslint-disable-next-line new-cap
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Set font
      pdf.setFont('helvetica');

      // Add XBlog header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('XBlog', 20, 30);

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Content Creation Platform', 20, 38);
      pdf.text('71-75 Shelton St, London WC2H 9JQ', 20, 46);
      pdf.text('Royaume-Uni', 20, 54);
      pdf.text('Téléphone: +44 7383 596325', 20, 62);

      // Add INVOICE title
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INVOICE', 150, 30);

      // Add invoice details
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      const invoiceDetails = [
        `Invoice #: ${transformedInvoice.invoiceNumber}`,
        `Date: ${new Date(transformedInvoice.created_at).toLocaleDateString('en-US')}`,
        `Status: ${transformedInvoice.status}`,
        `Currency: ${transformedInvoice.currency.toUpperCase()}`
      ];

      invoiceDetails.forEach((detail, index) => {
        pdf.text(detail, 150, 45 + (index * 8));
      });

      // Add Bill To section
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Bill To:', 20, 90);

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(transformedInvoice.email || 'Customer', 20, 100);
      pdf.text(`Customer ID: ${transformedInvoice.customer_id}`, 20, 108);
      pdf.text(`Payment ID: ${transformedInvoice.payment_id}`, 20, 116);

      // Add table header
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      const tableY = 140;
      pdf.text('QTY', 20, tableY);
      pdf.text('Description', 40, tableY);
      pdf.text('Unit Price', 130, tableY);
      pdf.text('Amount', 170, tableY);

      // Add line under header
      pdf.line(20, tableY + 2, 190, tableY + 2);

      // Add table row
      pdf.setFont('helvetica', 'normal');
      const rowY = tableY + 10;
      pdf.text('1.00', 20, rowY);
      pdf.text(transformedInvoice.plan, 40, rowY);
      pdf.text(`$${transformedInvoice.amount.toFixed(2)}`, 130, rowY);
      pdf.text(`$${transformedInvoice.amount.toFixed(2)}`, 170, rowY);

      // Add totals
      const totalY = rowY + 20;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Subtotal:', 130, totalY);
      pdf.text(`$${transformedInvoice.amount.toFixed(2)}`, 170, totalY);

      pdf.text('Tax:', 130, totalY + 8);
      pdf.text('$0.00', 170, totalY + 8);

      pdf.line(130, totalY + 12, 190, totalY + 12);
      pdf.text('Total:', 130, totalY + 20);
      pdf.text(`$${transformedInvoice.amount.toFixed(2)}`, 170, totalY + 20);

      // Add terms
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Terms and Conditions:', 20, totalY + 40);

      pdf.setFont('helvetica', 'normal');
      pdf.text('Payment processed successfully via secure payment gateway', 20, totalY + 50);
      pdf.text('For support, contact us at: +44 7383 596325', 20, totalY + 58);
      pdf.text('Thank you for choosing XBlog for your content creation needs.', 20, totalY + 66);

      // Download the PDF
      pdf.save(`invoice-${transformedInvoice.invoiceNumber}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  // Handle opening plan in new tab
  const handleChoosePlan = useCallback((planId: string) => {
    console.log(`Opening plan ${planId} in new tab`);
    // Open the Hostinger VPS pricing page in a new tab
    const planUrl = `https://www.hostinger.com/fr/vps#pricing`;
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
                  {invoicesData.invoices.map((invoice, index) => {
                    const transformedInvoice = transformInvoiceData(invoice);
                    return (
                      <TableRow key={transformedInvoice.id} hover>
                        <TableCell>{String(index + 1).padStart(2, '0')}</TableCell>
                        <TableCell>{transformedInvoice.invoiceNumber}</TableCell>
                        <TableCell>
                          {new Date(transformedInvoice.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>{transformedInvoice.plan}</TableCell>
                        <TableCell align="right">${transformedInvoice.amount.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={transformedInvoice.status}
                            color={transformedInvoice.status === "paid" ? "success" : "warning"}
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
                    );
                  })}
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


    </DashboardContent>
  );
}
