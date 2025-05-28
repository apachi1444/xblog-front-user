/**
 * Professional invoice template generator
 * Creates a beautiful HTML invoice template with proper variable injection
 */

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

/**
 * Generate professional invoice HTML template using the exact template provided
 */
export const generateInvoiceTemplate = (data: InvoiceData): string => {
  const statusText = data.status === 'paid' ? 'Paid' : data.status === 'overdue' ? 'Overdue' : 'Due';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Professional Invoice</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      background-color: white;
      padding: 20px;
      color: #333;
      line-height: 1.4;
    }

    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 30px;
    }

    /* Header Table */
    .header-table {
      width: 100%;
      margin-bottom: 30px;
      border-collapse: collapse;
    }

    .header-table td {
      vertical-align: top;
      padding: 10px;
    }

    .company-info {
      width: 60%;
    }

    .invoice-title-cell {
      width: 40%;
      text-align: right;
    }

    .company-name {
      font-size: 24px;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 5px;
    }

    .company-tagline {
      color: #666;
      font-size: 14px;
      margin-bottom: 15px;
    }

    .company-details {
      font-size: 13px;
      color: #666;
      line-height: 1.6;
    }

    .invoice-title {
      font-size: 36px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }

    .status-badge {
      background-color: #dbeafe;
      color: #1e40af;
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 14px;
      display: inline-block;
    }

    /* Details Table */
    .details-table {
      width: 100%;
      margin-bottom: 30px;
      border-collapse: collapse;
    }

    .details-table td {
      vertical-align: top;
      padding: 15px;
      width: 50%;
    }

    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 5px;
    }

    .detail-box {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      border-left: 4px solid #2563eb;
    }

    .customer-name {
      font-weight: bold;
      color: #333;
      font-size: 15px;
      margin-bottom: 5px;
    }

    .detail-box p {
      margin-bottom: 3px;
      font-size: 13px;
      color: #666;
    }

    .meta-table {
      width: 100%;
      border-collapse: collapse;
    }

    .meta-table td {
      padding: 5px 0;
      font-size: 13px;
    }

    .meta-label {
      color: #666;
      width: 60%;
    }

    .meta-value {
      font-weight: bold;
      color: #333;
      text-align: right;
    }

    .due-date {
      color: #dc2626;
    }

    /* Separator */
    .separator {
      border-top: 2px solid #e5e7eb;
      margin: 25px 0;
    }

    /* Services Table */
    .services-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 15px;
      text-align: center;
    }

    .services-table {
      width: 100%;
      border-collapse: collapse;
      border: 2px solid #333;
      margin-bottom: 20px;
    }

    .services-table th {
      background-color: #f8f9fa;
      padding: 12px 8px;
      text-align: left;
      font-weight: bold;
      color: #333;
      font-size: 14px;
      border: 1px solid #333;
    }

    .services-table th:nth-child(2),
    .services-table th:nth-child(3) {
      text-align: center;
    }

    .services-table th:nth-child(4) {
      text-align: right;
    }

    .services-table td {
      padding: 12px 8px;
      font-size: 13px;
      color: #333;
      border: 1px solid #333;
    }

    .services-table td:nth-child(2),
    .services-table td:nth-child(3) {
      text-align: center;
    }

    .services-table td:nth-child(4) {
      text-align: right;
      font-weight: bold;
    }

    .item-description {
      font-weight: bold;
      color: #333;
    }

    /* Summary Table */
    .summary-table {
      width: 300px;
      margin-left: auto;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .summary-table td {
      padding: 8px 0;
      font-size: 14px;
    }

    .summary-label {
      color: #666;
      text-align: left;
      width: 60%;
    }

    .summary-value {
      text-align: right;
      font-weight: bold;
      color: #333;
    }

    .total-row {
      border-top: 2px solid #333;
      padding-top: 10px;
    }

    .total-row td {
      font-size: 18px;
      font-weight: bold;
      padding-top: 15px;
    }

    .total-amount {
      color: #2563eb;
    }

    .payment-terms {
      background-color: #f0f8ff;
      padding: 15px;
      border-radius: 4px;
      margin-top: 20px;
      border-left: 4px solid #2563eb;
    }

    .payment-terms-title {
      font-size: 14px;
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 5px;
    }

    .payment-terms-text {
      font-size: 12px;
      color: #1e3a8a;
      line-height: 1.5;
    }
  </style>
</head>

<body>
  <div class="invoice-container">
    <!-- Header -->
    <table class="header-table">
      <tr>
        <td class="company-info">
          <div class="company-name">🏢 ${data.companyName}</div>
          <div class="company-tagline">Professional Services</div>
          <div class="company-details">
            📍 ${data.companyAddress}<br>
            &nbsp;&nbsp;&nbsp;&nbsp;${data.companyCity}<br>
            📞 ${data.companyPhone}<br>
            ✉️ ${data.companyEmail}<br>
            🌐 ${data.companyWebsite}
          </div>
        </td>
        <td class="invoice-title-cell">
          <div class="invoice-title">INVOICE</div>
          <div class="status-badge">Status: ${statusText}</div>
        </td>
      </tr>
    </table>

    <!-- Details -->
    <table class="details-table">
      <tr>
        <td>
          <div class="section-title">👤 Bill To</div>
          <div class="detail-box">
            <div class="customer-name">${data.customerName}</div>
            <p>${data.customerAddress}</p>
            <p>${data.customerCity}</p>
            <p>${data.customerEmail}</p>
          </div>
        </td>
        <td>
          <div class="section-title">📅 Invoice Details</div>
          <table class="meta-table">
            <tr>
              <td class="meta-label">Invoice Number:</td>
              <td class="meta-value">${data.invoiceNumber}</td>
            </tr>
            <tr>
              <td class="meta-label">Invoice Date:</td>
              <td class="meta-value">${data.invoiceDate}</td>
            </tr>
            <tr>
              <td class="meta-label">Due Date:</td>
              <td class="meta-value due-date">${data.dueDate}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Separator -->
    <div class="separator"></div>

    <!-- Services -->
    <div class="services-title">Services Provided</div>
    <table class="services-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Qty</th>
          <th>Tax</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map(item => `
        <tr>
          <td class="item-description">${item.description}</td>
          <td>${item.quantity}</td>
          <td>${item.tax}%</td>
          <td>$${item.amount.toFixed(2)}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Summary -->
    <table class="summary-table">
      <tr>
        <td class="summary-label">Subtotal:</td>
        <td class="summary-value">$${data.subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td class="summary-label">Tax (${data.items[0]?.tax || 0}%):</td>
        <td class="summary-value">$${data.totalTax.toFixed(2)}</td>
      </tr>
      <tr class="total-row">
        <td class="summary-label">Total:</td>
        <td class="summary-value total-amount">$${data.total.toFixed(2)}</td>
      </tr>
    </table>

    ${data.paymentTerms ? `
    <div class="payment-terms">
      <div class="payment-terms-title">Payment Terms</div>
      <div class="payment-terms-text">${data.paymentTerms}</div>
    </div>
    ` : ''}

  </div>
</body>
</html>`;
};
