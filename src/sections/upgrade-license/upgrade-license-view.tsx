import toast from 'react-hot-toast';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, RefreshCw } from "lucide-react";

import LoadingButton from '@mui/lab/LoadingButton';
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
import { generateInvoicePdf, transformInvoiceForPdf } from 'src/services/invoicePdfService';
import {
  type Invoice,
  useGetUserInvoicesQuery,
  useLazyGetUserInvoicesQuery,
  useGetSubscriptionPlansQuery,
  useCreateCheckoutSessionMutation
} from 'src/services/apis/subscriptionApi';

import { ModernPricingPlans } from 'src/components/pricing/ModernPricingPlans';


export function UpgradeLicenseView() {
  const { t } = useTranslation();

  // State for selected plan and checkout process
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);


  // Fetch subscription plans
  const {
    data: plansData,
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

  // Stripe checkout session mutation
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  // Helper function to transform API invoice data for UI compatibility
  const transformInvoiceData = (invoice: Invoice) => transformInvoiceForPdf(invoice, plansData);

  // Handle refreshing all data
  const refreshAllData = useCallback(async () => {
    try {
      await Promise.all([
        refetchPlans(),
        refetchInvoices()
      ]);

      toast.success('Data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
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
    try {
      await generateInvoicePdf(invoice, plansData);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Handle plan selection (just select, don't redirect immediately)
  const handleChoosePlan = useCallback((planId: string) => {
    setSelectedPlan(planId);
  }, []);

  // Handle continue with selected plan - create checkout session and redirect
  const handleContinueWithPlan = useCallback(async () => {
    if (!selectedPlan) {
      toast.error('Please select a plan first.');
      return;
    }

    setIsCreatingCheckout(true);

    try {
      // Create checkout session with Stripe
      const response = await createCheckoutSession({ plan_id: selectedPlan }).unwrap();

      if (response.url) {
        // Open the checkout URL in a new tab
        window.open(response.url, '_blank');
        toast.success('Redirecting to checkout...');
      } else {
        toast.error('Failed to create checkout session. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to create checkout session. Please try again later.');
    } finally {
      setIsCreatingCheckout(false);
    }
  }, [selectedPlan, createCheckoutSession]);




  return (
    <DashboardContent>


      <Container maxWidth={false}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
          <Typography variant="h4" gutterBottom>
            Upgrade License
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              size="small"
              onClick={refreshAllData}
              disabled={isLoadingPlans || isLoadingInvoices || isRefreshingInvoices}
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
          {/* Use the ModernPricingPlans component */}
          <ModernPricingPlans
            onSelectPlan={handleChoosePlan}
            selectedPlan={selectedPlan}
            showFreePlan={false}
            maxPlans={3}
            title={t('upgrade.choosePlan', 'Choose Your Plan')}
            subtitle={t('upgrade.upgradeDescription', 'Upgrade to unlock premium features and boost your content creation')}
          />

          {/* Continue Button - Only show when a plan is selected */}
          {selectedPlan && (() => {
            const selectedPlanData = plansData?.find(plan => plan.id === selectedPlan);
            const planName = selectedPlanData?.name || 'Selected Plan';

            return (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mt: 4,
                  mb: 2
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                    color: 'text.secondary',
                    textAlign: 'center'
                  }}
                >
                  Selected: <strong>{planName}</strong>
                </Typography>
                <LoadingButton
                  variant="contained"
                  size="large"
                  loading={isCreatingCheckout}
                  onClick={handleContinueWithPlan}
                  sx={{
                    px: 6,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 8px 32px rgba(79, 70, 229, 0.3)',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(79, 70, 229, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  {isCreatingCheckout ? 'Creating checkout...' : 'Continue to Checkout'}
                </LoadingButton>
              </Box>
            );
          })()}
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
                      <TableRow hover>
                        <TableCell>{String(index + 1).padStart(2, '0')}</TableCell>
                        <TableCell>{transformedInvoice.invoiceNumber}</TableCell>
                        <TableCell>
                          {(() => {
                            try {
                              // Handle incomplete ISO date strings from API
                              const dateStr = transformedInvoice.created_at;
                              const normalizedDate = dateStr.includes('T') &&
                                                    !dateStr.includes('Z') &&
                                                    !dateStr.includes('+') &&
                                                    !dateStr.includes('-', 10)
                                ? `${dateStr}Z`
                                : dateStr;
                              return new Date(normalizedDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                              });
                            } catch (error) {
                              console.error('Date parsing error:', error, 'Original date:', transformedInvoice.created_at);
                              return 'Invalid Date';
                            }
                          })()}
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
