import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import type { Invoice } from './apis/subscriptionApi';

// Interface for transformed invoice data
interface TransformedInvoice {
  payment_id: number;
  plan_id: string;
  customer_id: string;
  email: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  invoiceNumber: string;
  plan: string;
}

// Interface for plan data
interface Plan {
  id: string;
  name: string;
  [key: string]: any;
}

/**
 * Transform invoice data for PDF generation
 */
export const transformInvoiceForPdf = (invoice: Invoice, plansData?: Plan[]): TransformedInvoice => {
  // Find the plan name from the plans data
  const planDetails = plansData?.find(plan => plan.id === invoice.plan_id);
  const planName = planDetails?.name || `Plan ID: ${invoice.plan_id}`;
  
  return {
    ...invoice,
    invoiceNumber: `INV-${invoice.payment_id?.toString().padStart(6, '0')}`,
    plan: planName,
    amount: parseFloat(invoice.amount || '0'),
  };
};

/**
 * Generate and download PDF invoice
 */
export const generateInvoicePdf = async (
  invoice: Invoice, 
  plansData?: Plan[],
  options?: {
    showSuccessToast?: boolean;
    customFilename?: string;
  }
): Promise<void> => {
  try {
    const { showSuccessToast = true, customFilename } = options || {};
    
    // Transform the invoice data
    const transformedInvoice = transformInvoiceForPdf(invoice, plansData);

    if (showSuccessToast) {
      toast.success('Generating PDF...');
    }

    // Create PDF directly with jsPDF
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
    const filename = customFilename || `invoice-${transformedInvoice.invoiceNumber}.pdf`;
    pdf.save(filename);
    
    if (showSuccessToast) {
      toast.success('Invoice PDF downloaded successfully!');
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF. Please try again.');
    throw error;
  }
};

/**
 * Check if a plan is a free plan
 */
export const isFreeplan = (plan: Plan): boolean => {
  if (!plan) return false;
  
  // Check various indicators for free plans
  const planName = plan.name?.toLowerCase() || '';
  const planId = plan.id?.toLowerCase() || '';
  const planPrice = plan.price || 0;
  
  return (
    planName.includes('free') ||
    planName.includes('trial') ||
    planId.includes('free') ||
    planId.includes('trial') ||
    planPrice === 0 ||
    planPrice === '0'
  );
};

/**
 * Filter out free plans from plans array
 */
export const filterNonFreePlans = (plans: Plan[]): Plan[] => {
  if (!plans || !Array.isArray(plans)) return [];
  return plans.filter(plan => !isFreeplan(plan));
};
