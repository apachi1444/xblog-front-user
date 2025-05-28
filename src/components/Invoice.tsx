import React, { forwardRef } from 'react';

import {
  Box,
  Grid,
  Paper,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';

type InvoiceProps = {
  planName: string;
  price: number;
  tax: number;
  total: number;
};

const Invoice = forwardRef<HTMLDivElement, InvoiceProps>(({ planName, price, tax, total }, ref) => (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        minHeight: '100%',
        // Ensure full space utilization for PDF
        '& *': {
          boxSizing: 'border-box',
        },
        // PDF-specific styles
        '@media print': {
          width: '100%',
          minHeight: '100%',
          margin: 0,
          padding: 0,
        }
      }}
    >
      <Box sx={{ width: '100%', height: '100%' }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            width: '100%',
            // Removed height: '100%'
            boxShadow: 'none',
            '& > *': {
              width: '100%',
            }
          }}
        >

          {/* Header */}
          <Grid container justifyContent="space-between">
            <Grid item>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  🏢
                </Box>
                <Box>
                  <Typography variant="h6">YourCompany</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Professional Services
                  </Typography>
                </Box>
              </Box>

              <Box mt={2} color="text.secondary">
                <Typography variant="body2">456 Business Park, Suite 100</Typography>
                <Typography variant="body2">San Francisco, CA 94102</Typography>
                <Typography variant="body2">+44 7383 596325</Typography>
                <Typography variant="body2">contact@xblog.ai</Typography>
                <Typography variant="body2">xblog.ai</Typography>
              </Box>
            </Grid>

            <Grid item textAlign="right">
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                INVOICE
              </Typography>
              <Box
                sx={{
                  bgcolor: 'primary.light',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                }}
              >
                <Typography color="primary.dark">Status: Due</Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Billing Info */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Bill To
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography fontWeight={500}>Acme Corporation</Typography>
                <Typography color="text.secondary">123 Business Ave</Typography>
                <Typography color="text.secondary">New York, NY 10001</Typography>
                <Typography color="text.secondary">billing@acme.com</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Invoice Details
              </Typography>
              <Box>
                <Grid container justifyContent="space-between">
                  <Typography color="text.secondary">Invoice Number:</Typography>
                  <Typography fontWeight={500}>INV-2024-001</Typography>
                </Grid>
                <Grid container justifyContent="space-between">
                  <Typography color="text.secondary">Invoice Date:</Typography>
                  <Typography fontWeight={500}>5/28/2024</Typography>
                </Grid>
                <Grid container justifyContent="space-between">
                  <Typography color="text.secondary">Due Date:</Typography>
                  <Typography fontWeight={500} color="error.main">
                    6/28/2024
                  </Typography>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Services Table */}
          <Typography variant="subtitle1" fontWeight={600}>
            Services Provided
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
            <Table size="small"> {/* Optionally use "small" to tighten spacing */}
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">Qty</TableCell>
                  <TableCell align="right">Tax</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell>{planName}</TableCell>
                  <TableCell align="center">1</TableCell>
                  <TableCell align="right">10%</TableCell>
                  <TableCell align="right">${price.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>


          <Divider sx={{ my: 4 }} />

          {/* Totals */}
          <Box maxWidth="sm" ml="auto">
            <Grid container justifyContent="space-between" sx={{ mb: 1 }} color="text.secondary">
              <Typography>Subtotal:</Typography>
              <Typography>${price.toFixed(2)}</Typography>
            </Grid>
            <Grid container justifyContent="space-between" sx={{ mb: 1 }} color="text.secondary">
              <Typography>Tax (10%):</Typography>
              <Typography>${tax.toFixed(2)}</Typography>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container justifyContent="space-between">
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary.main">
                ${total.toFixed(2)}
              </Typography>
            </Grid>

            <Paper sx={{ bgcolor: 'primary.light', mt: 3, p: 2 }} variant="outlined">
              <Typography variant="body2" color="primary.dark" fontWeight={600}>
                Payment Terms
              </Typography>
              <Typography variant="body2" color="primary.dark">
                Net 30 days. Late payments subject to 1.5% monthly service charge.
              </Typography>
            </Paper>
          </Box>
        </Paper>
      </Box>
    </Box>
  ));

export default Invoice;
