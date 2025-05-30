import React, { forwardRef } from 'react';
import {
  Box,
  Grid,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
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

interface CleanInvoiceProps {
  data: InvoiceData;
}

const CleanInvoice = forwardRef<HTMLDivElement, CleanInvoiceProps>(({ data }, ref) => (
  <Box
    ref={ref}
    sx={{
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      lineHeight: 1.4,
      color: '#000',
      // Ensure full space utilization for PDF
      '& *': {
        boxSizing: 'border-box',
      },
      // PDF-specific styles
      '@media print': {
        width: '100%',
        height: '100%',
        margin: 0,
        padding: '20px',
      }
    }}
  >
    {/* Header Section */}
    <Grid container justifyContent="space-between" sx={{ mb: 3 }}>
      <Grid item xs={6}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          {data.companyName}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          {data.companyAddress}
        </Typography>
        <Typography variant="body2">
          {data.companyCity}
        </Typography>
      </Grid>
      
      <Grid item xs={6} sx={{ textAlign: 'right' }}>
        <Box
          sx={{
            border: '2px solid #ddd',
            borderRadius: '8px',
            padding: '12px',
            display: 'inline-block',
            minWidth: '200px'
          }}
        >
          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
            📤 Upload Logo
          </Typography>
        </Box>
      </Grid>
    </Grid>

    {/* Invoice Title */}
    <Box sx={{ textAlign: 'right', mb: 4 }}>
      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 'bold', 
          letterSpacing: '0.2em',
          fontSize: '2.5rem'
        }}
      >
        INVOICE
      </Typography>
    </Box>

    {/* Bill To and Invoice Details */}
    <Grid container spacing={4} sx={{ mb: 4 }}>
      <Grid item xs={6}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Bill To
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {data.customerName}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          {data.customerAddress}
        </Typography>
        <Typography variant="body2">
          {data.customerCity}
        </Typography>
      </Grid>
      
      <Grid item xs={6}>
        <Box sx={{ textAlign: 'right' }}>
          <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Invoice #</Typography>
            <Typography variant="body1">{data.invoiceNumber}</Typography>
          </Grid>
          <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Invoice date</Typography>
            <Typography variant="body1">{data.invoiceDate}</Typography>
          </Grid>
          <Grid container justifyContent="space-between">
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Due date</Typography>
            <Typography variant="body1">{data.dueDate}</Typography>
          </Grid>
        </Box>
      </Grid>
    </Grid>

    {/* Services Table */}
    <TableContainer sx={{ mb: 4 }}>
      <Table sx={{ border: 'none' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', border: 'none', borderBottom: '1px solid #ddd', py: 1 }}>
              QTY
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', border: 'none', borderBottom: '1px solid #ddd', py: 1 }}>
              Description
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', border: 'none', borderBottom: '1px solid #ddd', py: 1, textAlign: 'right' }}>
              Unit Price
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', border: 'none', borderBottom: '1px solid #ddd', py: 1, textAlign: 'right' }}>
              Amount
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell sx={{ border: 'none', py: 1 }}>
                {item.quantity.toFixed(2)}
              </TableCell>
              <TableCell sx={{ border: 'none', py: 1 }}>
                {item.description}
              </TableCell>
              <TableCell sx={{ border: 'none', py: 1, textAlign: 'right' }}>
                ${item.amount.toFixed(2)}
              </TableCell>
              <TableCell sx={{ border: 'none', py: 1, textAlign: 'right' }}>
                ${(item.quantity * item.amount).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    {/* Totals Section */}
    <Box sx={{ textAlign: 'right', mb: 4 }}>
      <Grid container justifyContent="flex-end" spacing={2}>
        <Grid item xs={4}>
          <Box sx={{ borderTop: '1px solid #ddd', pt: 2 }}>
            <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1">${data.subtotal.toFixed(2)}</Typography>
            </Grid>
            <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="body1">Sales Tax (5%)</Typography>
              <Typography variant="body1">${data.totalTax.toFixed(2)}</Typography>
            </Grid>
            <Divider sx={{ mb: 2 }} />
            <Grid container justifyContent="space-between">
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total (USD)
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ${data.total.toFixed(2)}
              </Typography>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>

    {/* Terms and Conditions */}
    {data.paymentTerms && (
      <Box sx={{ mt: 6 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Terms and Conditions
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Payment is due in 14 days
        </Typography>
        <Typography variant="body2">
          Please make checks payable to: {data.companyName}
        </Typography>
      </Box>
    )}
  </Box>
));

CleanInvoice.displayName = 'CleanInvoice';

export default CleanInvoice;
