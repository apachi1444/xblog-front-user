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
  const statusColor = data.status === 'paid' ? 'green' : data.status === 'overdue' ? 'red' : 'blue';
  const statusText = data.status === 'paid' ? 'Paid' : data.status === 'overdue' ? 'Overdue' : 'Due';

  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Professional Invoice</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lucide/0.263.1/lucide.min.css">
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
</head>

<body class="min-h-screen bg-gray-50 py-8">

    <div class="max-w-4xl mx-auto">
      <div class="bg-white shadow-lg border-0 overflow-hidden rounded-lg">
        <div class="p-8 space-y-8">
          <!-- Invoice Header -->
          <div class="flex justify-between items-start">
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <i data-lucide="building-2" class="w-6 h-6 text-white"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">${data.companyName}</h2>
                  <p class="text-gray-600">Professional Services</p>
                </div>
              </div>

              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex items-center space-x-2">
                  <i data-lucide="building-2" class="w-4 h-4"></i>
                  <span>${data.companyAddress}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="ml-6">${data.companyCity}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <i data-lucide="phone" class="w-4 h-4"></i>
                  <span>${data.companyPhone}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <i data-lucide="mail" class="w-4 h-4"></i>
                  <span>${data.companyEmail}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <i data-lucide="globe" class="w-4 h-4"></i>
                  <span>${data.companyWebsite}</span>
                </div>
              </div>
            </div>

            <div class="text-right">
              <h1 class="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
              <div class="bg-${statusColor === 'blue' ? 'blue' : statusColor === 'green' ? 'green' : 'red'}-50 px-4 py-2 rounded-lg">
                <p class="text-${statusColor === 'blue' ? 'blue' : statusColor === 'green' ? 'green' : 'red'}-800 font-medium">Status: ${statusText}</p>
              </div>
            </div>
          </div>

          <!-- Invoice Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i data-lucide="user" class="w-5 h-5 mr-2"></i>
                Bill To
              </h3>
              <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                <p class="font-medium text-gray-900">${data.customerName}</p>
                <p class="text-gray-600">${data.customerAddress}</p>
                <p class="text-gray-600">${data.customerCity}</p>
                <p class="text-gray-600">${data.customerEmail}</p>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i data-lucide="calendar" class="w-5 h-5 mr-2"></i>
                Invoice Details
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Invoice Number:</span>
                  <span class="font-medium text-gray-900">${data.invoiceNumber}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Invoice Date:</span>
                  <span class="font-medium text-gray-900">${data.invoiceDate}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Due Date:</span>
                  <span class="font-medium text-red-600">${data.dueDate}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Separator -->
          <div class="border-t border-gray-200"></div>

          <!-- Invoice Items -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Services Provided</h3>
            <div class="border rounded-lg overflow-hidden">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="px-4 py-3 text-left font-semibold text-gray-900">Description</th>
                    <th class="px-4 py-3 text-center font-semibold text-gray-900">Qty</th>
                    <th class="px-4 py-3 text-right font-semibold text-gray-900">Tax</th>
                    <th class="px-4 py-3 text-right font-semibold text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.items.map(item => `
                  <tr class="border-t hover:bg-gray-50">
                    <td class="px-4 py-4 font-medium">${item.description}</td>
                    <td class="px-4 py-4 text-center">${item.quantity}</td>
                    <td class="px-4 py-4 text-right">${item.tax}%</td>
                    <td class="px-4 py-4 text-right font-medium">$${item.amount.toFixed(2)}</td>
                  </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Separator -->
          <div class="border-t border-gray-200"></div>

          <!-- Invoice Summary -->
          <div class="flex justify-end">
            <div class="w-full max-w-sm space-y-4">
              <div class="space-y-2">
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>$${data.subtotal.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Tax (${data.items[0]?.tax || 0}%):</span>
                  <span>$${data.totalTax.toFixed(2)}</span>
                </div>
              </div>

              <div class="border-t pt-4">
                <div class="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span class="text-blue-600">$${data.total.toFixed(2)}</span>
                </div>
              </div>

              ${data.paymentTerms ? `
              <div class="bg-blue-50 p-4 rounded-lg mt-4">
                <p class="text-sm text-blue-800 font-medium">Payment Terms</p>
                <p class="text-sm text-blue-700 mt-1">${data.paymentTerms}</p>
              </div>
              ` : ''}
            </div>
          </div>

        </div>
      </div>
    </div>
  <script>
    // Initialize Lucide icons
    lucide.createIcons();
  </script>
</body>

</html>`;
};
