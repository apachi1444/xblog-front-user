import toast from 'react-hot-toast';
import { Eye, Download, RefreshCw } from "lucide-react";
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
  Chip,
  Table,
  Button,
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
import { usePlanIcons } from 'src/hooks/usePlanIcons';

export function UpgradeLicenseView() {
  const [isRefreshingAfterReturn, setIsRefreshingAfterReturn] = useState(false);
  const { t } = useTranslation();
  const { getPlanIcon, getLocalizedPlanName } = usePlanIcons();

  // Fetch subscription plans
  const {
    data: plansData,
    isLoading: isLoadingPlans,
    refetch: refetchPlans
  } = useGetSubscriptionPlansQuery();

  // Fetch user invoices
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
      toast.success('Invoices refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh invoices');
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

  const plans = plansData?.plans || [];

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
            plans={plans.map(plan => ({
              id: plan.id || plan.name,
              name: getLocalizedPlanName(plan.name),
              price: plan.price,
              period: t('pricing.perMonth', '/month'),
              features: plan.features,
              current: plan.current || false,
              highlight: plan.highlight || false,
              icon: getPlanIcon(plan.name),
              buttonText: plan.current ? t('pricing.currentPlan', 'Current Plan') : t('pricing.choosePlan', 'Choose Plan'),
              buttonVariant: plan.current ? 'outlined' : 'contained',
              disabled: plan.current || false,
            }))}
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
                    <TableCell>No</TableCell>
                    <TableCell>Invoice Number</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Plan</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell>Action</TableCell>
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
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ padding: '4px 8px' }}
                          >
                            <Download size={18} />
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ padding: '4px 8px' }}
                          >
                            <Eye size={18} />
                          </Button>
                        </Box>
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
