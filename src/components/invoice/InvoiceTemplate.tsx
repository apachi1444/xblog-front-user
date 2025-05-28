import React from 'react';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Chip,
  Grid,
  Table,
  Paper,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
} from '@mui/material';

export interface InvoiceData {
  // Invoice details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: 'paid' | 'due' | 'overdue';

  // Company details
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;

  // Customer details
  customerName: string;
  customerAddress: string;
  customerCity: string;
  customerEmail: string;

  // Invoice items
  items: Array<{
    description: string;
    quantity: number;
    tax: number;
    amount: number;
  }>;

  // Totals
  subtotal: number;
  totalTax: number;
  total: number;

  // Payment terms
  paymentTerms?: string;
}

interface InvoiceTemplateProps {
  data: InvoiceData;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ data }) => {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'overdue':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Due';
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 800,
        margin: '0 auto',
        p: 4,
        backgroundColor: 'background.paper',
        boxShadow: theme.shadows[8],
        '@media print': {
          boxShadow: 'none',
          margin: 0,
          maxWidth: 'none',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: 'primary.main',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <Typography variant="h4" sx={{ color: 'white' }}>
                  🏢
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    mb: 0.5,
                  }}
                >
                  {data.companyName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Professional Services
                </Typography>
              </Box>
            </Box>

            <Box sx={{ color: 'text.secondary', fontSize: '0.875rem', lineHeight: 1.6 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                📍 {data.companyAddress}
              </Typography>
              <Typography variant="body2" sx={{ ml: 3, mb: 0.5 }}>
                {data.companyCity}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                📞 {data.companyPhone}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                ✉️ {data.companyEmail}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                🌐 {data.companyWebsite}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                mb: 1,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              INVOICE
            </Typography>
            <Chip
              label={`Status: ${getStatusText(data.status)}`}
              color={getStatusColor(data.status)}
              sx={{
                fontWeight: 600,
                fontSize: '0.875rem',
                px: 2,
                py: 1,
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Invoice Details */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              borderBottom: `2px solid ${theme.palette.primary.main}`,
              pb: 1,
            }}
          >
            👤 Bill To
          </Typography>
          <Paper
            sx={{
              p: 2,
              backgroundColor: 'grey.50',
              borderLeft: `4px solid ${theme.palette.primary.main}`,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              {data.customerName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {data.customerAddress}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {data.customerCity}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.customerEmail}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              borderBottom: `2px solid ${theme.palette.primary.main}`,
              pb: 1,
            }}
          >
            📅 Invoice Details
          </Typography>
          <Box sx={{ '& > *': { mb: 1 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Invoice Number:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {data.invoiceNumber}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Invoice Date:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {data.invoiceDate}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Due Date:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                {data.dueDate}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Services Table */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 2,
            textAlign: 'center',
          }}
        >
          Services Provided
        </Typography>
        <Table
          sx={{
            border: `2px solid ${theme.palette.divider}`,
            '& .MuiTableCell-root': {
              border: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Qty
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Tax
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontWeight: 600 }}>{item.description}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="center">{item.tax}%</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  ${item.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Summary */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Box sx={{ minWidth: 300 }}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Subtotal:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                ${data.subtotal.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Tax ({data.items[0]?.tax || 0}%):
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                ${data.totalTax.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Total:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              ${data.total.toFixed(2)}
            </Typography>
          </Box>

          {data.paymentTerms && (
            <Paper
              sx={{
                p: 2,
                backgroundColor: 'primary.50',
                borderLeft: `4px solid ${theme.palette.primary.main}`,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                Payment Terms
              </Typography>
              <Typography variant="body2" color="primary.dark" sx={{ fontSize: '0.75rem' }}>
                {data.paymentTerms}
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default InvoiceTemplate;
