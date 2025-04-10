import { Eye, Check, Download } from "lucide-react"

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
  CardContent,
} from "@mui/material"

import { DashboardContent } from "src/layouts/dashboard"

const plans = [
  {
    name: "Basic Plan",
    subtitle: "Suitable plan for starter business",
    price: "99.99",
    period: "/year",
    features: [
      "Customers Segmentations",
      "Google Integrations",
      "Activity Reminder"
    ],
    current: false,
  },
  {
    name: "Enterprise Plan",
    subtitle: "Best plan for mid-sized businesses",
    price: "119.99",
    period: "/year",
    features: [
      "Get a Basic Plans",
      "Access All Feature",
      "Get 1TB Cloud Storage"
    ],
    current: false,
  },
  {
    name: "Professional Plan",
    subtitle: "Suitable plan for starter",
    price: "149.99",
    period: "/year",
    features: [
      "Get Enterprise Plan",
      "Access All Feature",
      "Get 2TB Cloud Storage"
    ],
    current: true,
    highlight: true,
  }
]

const billingHistory = [
  {
    invoiceId: "Invoice #129810",
    amount: "149.99",
    purchaseDate: "25 Dec 2023",
    plan: "Professional Plan",
    status: "Success",
  },
  {
    invoiceId: "Invoice #129810",
    amount: "149.99",
    purchaseDate: "05 Jul 2023",
    plan: "Professional Plan",
    status: "Success",
  }
]

export function UpgradeLicenseView() {
  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Billings
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Pick a billing plan that suits you
          </Typography>

          <Box 
            display="grid" 
            gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }} 
            gap={3} 
            mb={4}
            mt={4}
          >
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                variant="outlined"
                sx={{
                  bgcolor: plan.highlight ? 'primary.main' : 'background.paper',
                  color: plan.highlight ? 'primary.contrastText' : 'text.primary',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {plan.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, opacity: 0.7 }}>
                    {plan.subtitle}
                  </Typography>
                  
                  <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'baseline' }}>
                    ${plan.price}
                    <Typography 
                      component="span" 
                      variant="body1" 
                      sx={{ ml: 1, opacity: 0.7 }}
                    >
                      {plan.period}
                    </Typography>
                  </Typography>

                  <Box sx={{ my: 3 }}>
                    {plan.features.map((feature) => (
                      <Box 
                        key={feature} 
                        sx={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 1,
                          mb: 1 
                        }}
                      >
                        <Check 
                          size={18} 
                          color={plan.highlight ? "white" : "green"} 
                        />
                        <Typography variant="body2">
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button 
                    fullWidth 
                    variant={plan.highlight ? "contained" : "outlined"}
                    color={plan.highlight ? "inherit" : "primary"}
                    sx={{ 
                      mt: 2,
                      bgcolor: plan.highlight ? 'background.paper' : undefined,
                      color: plan.highlight ? 'primary.main' : undefined,
                      '&:hover': {
                        bgcolor: plan.highlight ? 'background.paper' : undefined,
                      }
                    }}
                  >
                    {plan.current ? "Active plan" : "Choose Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" gutterBottom>
              Billing History
            </Typography>
            
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Invoices</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billingHistory.map((item, index) => (
                  <TableRow key={item.invoiceId}>
                    <TableCell>{String(index + 1).padStart(2, '0')}</TableCell>
                    <TableCell>{item.invoiceId}</TableCell>
                    <TableCell>{item.purchaseDate}</TableCell>
                    <TableCell>${item.amount}</TableCell>
                    <TableCell>{item.plan}</TableCell>
                    <TableCell>
                      <Chip 
                        label={item.status} 
                        color={item.status === "Success" ? "success" : "warning"} 
                        size="small" 
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
          </Box>
        </Container>
      </Box>
    </DashboardContent>
  )
}
