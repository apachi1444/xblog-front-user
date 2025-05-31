import React, { forwardRef } from 'react';
import { Box, Typography } from '@mui/material';

export interface ExactInvoiceData {
  // Company details
  companyName: string;
  companyAddress: string;
  companyCity: string;

  // Customer details
  customerName: string;
  customerAddress: string;
  customerCity: string;

  // Invoice details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;

  // Invoice items
  items: Array<{
    quantity: number;
    description: string;
    unitPrice: number;
    amount: number;
  }>;

  // Totals
  subtotal: number;
  salesTax: number;
  total: number;
}

interface ExactInvoiceProps {
  data: ExactInvoiceData;
}

const ExactInvoice = forwardRef<HTMLDivElement, ExactInvoiceProps>(({ data }, ref) => (
  <Box
    ref={ref}
    sx={{
      width: '210mm', // A4 width
      minHeight: '297mm', // A4 height
      backgroundColor: 'white',
      padding: '20mm',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      lineHeight: 1.4,
      color: '#000',
      margin: '0 auto',
      boxSizing: 'border-box',
      // Ensure exact sizing for PDF
      '@media print': {
        margin: 0,
        padding: '20mm',
        width: '210mm',
        minHeight: '297mm',
      }
    }}
  >
    {/* Header Section */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
      {/* Company Info */}
      <Box>
        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, color: '#000' }}>
          {data.companyName}
        </Typography>
        <Typography sx={{ fontSize: '14px', mb: 0.5, color: '#000' }}>
          {data.companyAddress}
        </Typography>
        <Typography sx={{ fontSize: '14px', color: '#000' }}>
          {data.companyCity}
        </Typography>
      </Box>
      
      {/* Upload Logo Box */}
      <Box
        sx={{
          border: '2px solid #ddd',
          borderRadius: '8px',
          padding: '16px 24px',
          textAlign: 'center',
          minWidth: '200px',
          backgroundColor: '#fafafa',
        }}
      >
        <Box sx={{ mb: 1 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13L12 17L8 13" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 17V9" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Box>
        <Typography sx={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
          Upload Logo
        </Typography>
      </Box>
    </Box>

    {/* INVOICE Title */}
    <Box sx={{ textAlign: 'right', mb: 6 }}>
      <Typography 
        sx={{ 
          fontSize: '48px',
          fontWeight: 'bold',
          letterSpacing: '0.2em',
          color: '#000',
          lineHeight: 1,
        }}
      >
        INVOICE
      </Typography>
    </Box>

    {/* Bill To and Invoice Details */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 6 }}>
      {/* Bill To */}
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 2, color: '#000' }}>
          Bill To
        </Typography>
        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 1, color: '#000' }}>
          {data.customerName}
        </Typography>
        <Typography sx={{ fontSize: '14px', mb: 0.5, color: '#000' }}>
          {data.customerAddress}
        </Typography>
        <Typography sx={{ fontSize: '14px', color: '#000' }}>
          {data.customerCity}
        </Typography>
      </Box>
      
      {/* Invoice Details */}
      <Box sx={{ textAlign: 'right', minWidth: '200px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: '#000', mr: 4 }}>
            Invoice #
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#000' }}>
            {data.invoiceNumber}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: '#000', mr: 4 }}>
            Invoice date
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#000' }}>
            {data.invoiceDate}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: '#000', mr: 4 }}>
            Due date
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#000' }}>
            {data.dueDate}
          </Typography>
        </Box>
      </Box>
    </Box>

    {/* Services Table */}
    <Box sx={{ mb: 6 }}>
      {/* Table Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          borderBottom: '1px solid #ddd',
          pb: 1,
          mb: 2,
        }}
      >
        <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: '#000', width: '60px' }}>
          QTY
        </Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: '#000', flex: 1, ml: 2 }}>
          Description
        </Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: '#000', width: '100px', textAlign: 'right' }}>
          Unit Price
        </Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: '#000', width: '100px', textAlign: 'right', ml: 2 }}>
          Amount
        </Typography>
      </Box>

      {/* Table Rows */}
      {data.items.map((item, index) => (
        <Box 
          key={index}
          sx={{ 
            display: 'flex', 
            py: 1,
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: '14px', color: '#000', width: '60px' }}>
            {item.quantity.toFixed(2)}
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#000', flex: 1, ml: 2 }}>
            {item.description}
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#000', width: '100px', textAlign: 'right' }}>
            {item.unitPrice.toFixed(2)}
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#000', width: '100px', textAlign: 'right', ml: 2 }}>
            ${item.amount.toFixed(2)}
          </Typography>
        </Box>
      ))}
    </Box>

    {/* Totals Section */}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 8 }}>
      <Box sx={{ minWidth: '250px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontSize: '14px', color: '#000' }}>
            Subtotal
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#000' }}>
            ${data.subtotal.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontSize: '14px', color: '#000' }}>
            Sales Tax (5%)
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#000' }}>
            ${data.salesTax.toFixed(2)}
          </Typography>
        </Box>
        <Box 
          sx={{ 
            borderTop: '2px solid #000',
            pt: 1,
            display: 'flex', 
            justifyContent: 'space-between' 
          }}
        >
          <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>
            Total (USD)
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>
            ${data.total.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Box>

    {/* Terms and Conditions */}
    <Box>
      <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mb: 2, color: '#000' }}>
        Terms and Conditions
      </Typography>
      <Typography sx={{ fontSize: '14px', mb: 1, color: '#000' }}>
        Payment is due in 14 days
      </Typography>
      <Typography sx={{ fontSize: '14px', color: '#000' }}>
        Please make checks payable to: {data.companyName}
      </Typography>
    </Box>
  </Box>
));

ExactInvoice.displayName = 'ExactInvoice';

export default ExactInvoice;
