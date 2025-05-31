import jsPDF  from 'jspdf';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
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
      toast.success('Generating PDF...');

      // Create a temporary container for the invoice
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '210mm';
      tempContainer.style.height = '297mm';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '14px';
      tempContainer.style.lineHeight = '1.4';
      tempContainer.style.color = '#000';
      tempContainer.style.padding = '20mm';
      tempContainer.style.boxSizing = 'border-box';

      // Create the invoice HTML content
      tempContainer.innerHTML = `
        <div style="width: 100%; height: 100%; background: white; font-family: Arial, sans-serif;">
          <!-- Header Section -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
            <!-- Company Info -->
            <div>
              <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: #000;">
                Your Company Inc.
              </div>
              <div style="font-size: 14px; margin-bottom: 4px; color: #000;">
                1234 Company St.
              </div>
              <div style="font-size: 14px; color: #000;">
                Company Town, ST 12345
              </div>
            </div>

            <!-- Upload Logo Box -->
            <div style="border: 2px solid #ddd; border-radius: 8px; padding: 16px 24px; text-align: center; min-width: 200px; background-color: #fafafa;">
              <div style="margin-bottom: 8px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 2V8H20" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 13L12 17L8 13" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 17V9" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div style="font-size: 14px; color: #666; font-weight: 500;">
                Upload Logo
              </div>
            </div>
          </div>

          <!-- INVOICE Title -->
          <div style="text-align: right; margin-bottom: 40px;">
            <div style="font-size: 48px; font-weight: bold; letter-spacing: 0.2em; color: #000; line-height: 1;">
              INVOICE
            </div>
          </div>

          <!-- Bill To and Invoice Details -->
          <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
            <!-- Bill To -->
            <div style="flex: 1;">
              <div style="font-size: 16px; font-weight: bold; margin-bottom: 16px; color: #000;">
                Bill To
              </div>
              <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: #000;">
                Customer Name
              </div>
              <div style="font-size: 14px; margin-bottom: 4px; color: #000;">
                1234 Customer St.
              </div>
              <div style="font-size: 14px; color: #000;">
                Customer Town, ST 12345
              </div>
            </div>

            <!-- Invoice Details -->
            <div style="text-align: right; min-width: 200px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 14px; font-weight: bold; color: #000; margin-right: 32px;">Invoice #</span>
                <span style="font-size: 14px; color: #000;">${invoice.invoiceNumber || '0000007'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 14px; font-weight: bold; color: #000; margin-right: 32px;">Invoice date</span>
                <span style="font-size: 14px; color: #000;">${new Date(invoice.createdAt || Date.now()).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 14px; font-weight: bold; color: #000; margin-right: 32px;">Due date</span>
                <span style="font-size: 14px; color: #000;">${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <!-- Services Table -->
          <div style="margin-bottom: 40px;">
            <!-- Table Header -->
            <div style="display: flex; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 16px;">
              <div style="font-size: 14px; font-weight: bold; color: #000; width: 60px;">QTY</div>
              <div style="font-size: 14px; font-weight: bold; color: #000; flex: 1; margin-left: 16px;">Description</div>
              <div style="font-size: 14px; font-weight: bold; color: #000; width: 100px; text-align: right;">Unit Price</div>
              <div style="font-size: 14px; font-weight: bold; color: #000; width: 100px; text-align: right; margin-left: 16px;">Amount</div>
            </div>

            <!-- Table Rows -->
            <div style="display: flex; padding: 8px 0; align-items: center;">
              <div style="font-size: 14px; color: #000; width: 60px;">1.00</div>
              <div style="font-size: 14px; color: #000; flex: 1; margin-left: 16px;">${invoice.plan || 'Professional Plan Subscription'}</div>
              <div style="font-size: 14px; color: #000; width: 100px; text-align: right;">${(invoice.amount || 40).toFixed(2)}</div>
              <div style="font-size: 14px; color: #000; width: 100px; text-align: right; margin-left: 16px;">$${(invoice.amount || 40).toFixed(2)}</div>
            </div>
          </div>

          <!-- Totals Section -->
          <div style="display: flex; justify-content: flex-end; margin-bottom: 60px;">
            <div style="min-width: 250px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 14px; color: #000;">Subtotal</span>
                <span style="font-size: 14px; color: #000;">$${(invoice.amount || 40).toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                <span style="font-size: 14px; color: #000;">Sales Tax (5%)</span>
                <span style="font-size: 14px; color: #000;">$${((invoice.amount || 40) * 0.05).toFixed(2)}</span>
              </div>
              <div style="border-top: 2px solid #000; padding-top: 8px; display: flex; justify-content: space-between;">
                <span style="font-size: 16px; font-weight: bold; color: #000;">Total (USD)</span>
                <span style="font-size: 16px; font-weight: bold; color: #000;">$${((invoice.amount || 40) * 1.05).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div>
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 16px; color: #000;">
              Terms and Conditions
            </div>
            <div style="font-size: 14px; margin-bottom: 8px; color: #000;">
              Payment is due in 14 days
            </div>
            <div style="font-size: 14px; color: #000;">
              Please make checks payable to: Your Company Inc.
            </div>
          </div>
        </div>
      `;

      // Add to document
      document.body.appendChild(tempContainer);

      // Wait for fonts and rendering
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels
        height: 1123, // A4 height in pixels
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Create PDF
      // eslint-disable-next-line new-cap
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Add image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);

      // Download
      pdf.save(`invoice-${invoice.invoiceNumber || '0000007'}.pdf`);

      toast.success('Invoice PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
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


    </DashboardContent>
  );
}
