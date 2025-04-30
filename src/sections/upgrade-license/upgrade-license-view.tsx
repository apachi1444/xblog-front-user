import toast from 'react-hot-toast';
import { Eye, Check, Download, RefreshCw } from "lucide-react";

import {
  Box,
  Card,
  Chip,
  Table,
  Button,
  Divider,
  TableRow,
  useTheme,
  Container,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CardContent,
  CircularProgress,
} from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";
import {
  useGetUserInvoicesQuery,
  useLazyGetUserInvoicesQuery,
  useGetSubscriptionPlansQuery
} from 'src/services/apis/subscriptionApi';

export function UpgradeLicenseView() {
  const theme = useTheme();

  // Fetch subscription plans
  const {
    data: plansData,
    isLoading: isLoadingPlans,
  } = useGetSubscriptionPlansQuery();

  // Fetch user invoices
  const {
    data: invoicesData,
    isLoading: isLoadingInvoices,
  } = useGetUserInvoicesQuery();

  const [
    triggerRefreshInvoices,
    { isLoading: isRefreshingInvoices }
  ] = useLazyGetUserInvoicesQuery();

  // Handle refreshing invoices
  const handleRefreshInvoices = async () => {
    try {
      await triggerRefreshInvoices().unwrap();
      toast.success('Invoices refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh invoices');
    }
  };

  const plans = plansData?.plans || [];

  return (
    <DashboardContent>
      <Container maxWidth={false}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
          <Typography variant="h4" gutterBottom>
            Upgrade License
          </Typography>
          {isLoadingPlans && (
            <CircularProgress size={24} />
          )}
        </Box>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}
          gap={3}
          mb={4}
          mt={4}
        >
          {plans.map((plan) => (
            <Card
              key={plan.id || plan.name}
              variant="outlined"
              sx={{
                p: 0,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderColor: plan.current ? 'primary.main' : 'divider',
                bgcolor: plan.highlight ? 'primary.lighter' : 'background.paper',
                position: 'relative',
                ...(plan.current && {
                  boxShadow: theme.customShadows?.z8,
                }),
              }}
            >
              {plan.current && (
                <Chip
                  label="Current Plan"
                  color="primary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                  }}
                />
              )}
              <CardContent sx={{ p: 3, flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {plan.name}
                </Typography>

                <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'baseline' }}>
                  ${plan.price}
                  <Typography
                    component="span"
                    variant="body1"
                    sx={{ ml: 1, opacity: 0.7 }}
                  >
                    /month
                  </Typography>
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ my: 3, flexGrow: 1 }}>
                  {plan.features.map((feature, index) => (
                    <Box
                      key={`${plan.id}-feature-${index}`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1
                      }}
                    >
                      <Check
                        size={18}
                        color={theme.palette.success.main}
                      />
                      <Typography variant="body2">
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  fullWidth
                  variant={plan.current ? "outlined" : "contained"}
                  color="primary"
                  disabled={plan.current}
                  sx={{ mt: 2 }}
                >
                  {plan.current ? "Current Plan" : "Choose Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
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
