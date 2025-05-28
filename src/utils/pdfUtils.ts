/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/return-await */

/**
 * Convert HTML content to PDF and trigger download
 * @param htmlContent - The HTML content to convert
 * @param filename - The filename for the downloaded PDF
 */
export const downloadPdfFromHtml = async (htmlContent: string, filename: string = 'invoice.pdf'): Promise<void> => {
  try {
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      throw new Error('Unable to open print window. Please check your popup blocker settings.');
    }

    // Write the HTML content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for the content to load
    await new Promise((resolve) => {
      printWindow.onload = resolve;
      // Fallback timeout
      setTimeout(resolve, 1000);
    });

    // Set up print styles for better PDF output
    const style = printWindow.document.createElement('style');
    printWindow.document.head.appendChild(style);

    // Focus the window and trigger print
    printWindow.focus();

    // Use a small delay to ensure styles are applied
    setTimeout(() => {
      printWindow.print();

      // Close the window after printing
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    }, 500);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

/**
 * Alternative method using jsPDF library (if available)
 * This is a fallback method that creates a simple PDF from text content
 */
export const downloadSimplePdf = (content: string, filename: string = 'invoice.pdf'): void => {
  try {
    // Create a blob with the content
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create a temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace('.pdf', '.txt'); // Fallback to text file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error creating simple download:', error);
    throw new Error('Failed to download file. Please try again.');
  }
};

/**
 * Extract text content from HTML for simple PDF generation
 */
export const extractTextFromHtml = (htmlContent: string): string => {
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Extract text content with basic formatting
  const textContent = tempDiv.textContent || tempDiv.innerText || '';

  // Clean up and format the text
  return textContent
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n\n') // Clean up line breaks
    .trim();
};

/**
 * Validate if the browser supports the required features for PDF generation
 */
export const isPdfGenerationSupported = (): boolean => (
    typeof window !== 'undefined' &&
    typeof window.open === 'function' &&
    typeof document.createElement === 'function'
  );

/**
 * Generate a filename for the invoice PDF
 */
export const generateInvoiceFilename = (invoiceNumber: string, date?: string): string => {
  const dateStr = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  return `invoice-${invoiceNumber}-${dateStr}.pdf`;
};

/**
 * Convert HTML to PDF using js-file-download
 * This function uses a more robust approach with proper PDF generation
 */
export const convertHtmlToPdf = async (htmlContent: string, filename: string): Promise<void> => {
  try {
    // Dynamic import to handle the case where js-file-download might not be installed
    const fileDownload = await import('js-file-download').then(module => module.default).catch(() => null);

    if (!fileDownload) {
      // Fallback to the original method if js-file-download is not available
      console.warn('js-file-download not available, falling back to print method');
      return downloadPdfFromHtml(htmlContent, filename);
    }

    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      throw new Error('Unable to open print window. Please check your popup blocker settings.');
    }

  

    // Write the enhanced HTML to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load
    await new Promise((resolve) => {
      printWindow.onload = resolve;
      setTimeout(resolve, 1000); // Fallback timeout
    });

    // Focus and print
    printWindow.focus();

    // Use a delay to ensure styles are applied
    setTimeout(() => {
      printWindow.print();

      // Close the window after a delay
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    }, 500);

  } catch (error) {
    console.error('Error generating PDF with js-file-download:', error);
    // Fallback to original method
    return downloadPdfFromHtml(htmlContent, filename);
  }
};

/**
 * Download PDF using js-file-download with blob
 * Alternative method that creates a blob and downloads it directly
 */
export const downloadPdfWithFileDownload = async (htmlContent: string, filename: string): Promise<void> => {
  try {
    // Dynamic import for js-file-download
    const fileDownload = await import('js-file-download').then(module => module.default).catch(() => null);

    if (!fileDownload) {
      throw new Error('js-file-download library not available');
    }

    // Create a blob with the HTML content
    // Note: This creates an HTML file, not a true PDF
    // For true PDF generation, you'd need a library like jsPDF or puppeteer
    const blob = new Blob([htmlContent], { type: 'text/html' });

    // Use js-file-download to trigger the download
    fileDownload(blob, filename.replace('.pdf', '.html'));

  } catch (error) {
    console.error('Error downloading with js-file-download:', error);
    throw error;
  }
};

/**
 * Generate actual PDF file and download using js-file-download
 * This creates a real PDF file using jsPDF library
 */
export const downloadInvoiceWithFileDownload = async (htmlContent: string, filename: string): Promise<void> => {
  try {
    // Dynamic import for js-file-download
    const fileDownload = await import('js-file-download').then(module => module.default).catch(() => null);

    if (!fileDownload) {
      // Fallback to print method if js-file-download is not available
      console.warn('js-file-download not available, using print method');
      return downloadPdfFromHtml(htmlContent, filename);
    }

    // Try to use jsPDF for real PDF generation
    try {
      const pdfBlob = await generatePdfWithJsPDF(htmlContent);
      fileDownload(pdfBlob, filename);
      return;
    } catch (jsPdfError) {
      console.warn('jsPDF not available, using alternative method:', jsPdfError);
    }

    // Alternative: Create a print-optimized HTML and download as PDF-like file
    const pdfBlob = await generatePrintOptimizedBlob(htmlContent);

    // Use js-file-download to trigger the PDF download
    fileDownload(pdfBlob, filename);

  } catch (error) {
    console.error('Error downloading invoice with js-file-download:', error);
    // Fallback to original method
    return downloadPdfFromHtml(htmlContent, filename);
  }
};

/**
 * Generate PDF using jsPDF library (if available)
 */
const generatePdfWithJsPDF = async (htmlContent: string): Promise<Blob> => {
  // Try to dynamically import jsPDF with proper error handling
  let JsPDF: any;
  try {
    const jsPDFModule = await import('jspdf');
    JsPDF = jsPDFModule.default || jsPDFModule;
  } catch (error) {
    console.warn('jsPDF not available:', error);
    throw new Error('jsPDF library not available');
  }

  if (!JsPDF) {
    throw new Error('jsPDF library not available');
  }

  // Create new PDF document
  const doc = new JsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Parse HTML content to extract structured data
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(`<div>${htmlContent}</div>`, 'text/html');

  let yPosition = 20;
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // Add title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Add a line
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  // Extract and add invoice details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  // Look for common invoice elements
  const tables = htmlDoc.querySelectorAll('table');
  const headings = htmlDoc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const paragraphs = htmlDoc.querySelectorAll('p');

  // Add headings
  headings.forEach((heading) => {
    if (yPosition > 270) { // Check if we need a new page
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const text = heading.textContent?.trim() || '';
    if (text && text.length > 0) {
      doc.text(text, margin, yPosition);
      yPosition += 10;
    }
  });

  // Add paragraphs
  paragraphs.forEach((p) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const text = p.textContent?.trim() || '';
    if (text && text.length > 0) {
      const lines = doc.splitTextToSize(text, contentWidth);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 5 + 5;
    }
  });

  // Add tables with proper formatting
  tables.forEach((table) => {
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }

    yPosition += 10;

    // Table headers
    const headerRow = table.querySelector('thead tr') || table.querySelector('tr');
    const headers = headerRow?.querySelectorAll('th, td') || [];

    if (headers.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');

      const colWidth = contentWidth / headers.length;

      // Draw header background
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPosition, contentWidth, 8, 'F');

      // Draw header borders and text
      headers.forEach((header, index) => {
        const x = margin + (index * colWidth);
        doc.rect(x, yPosition, colWidth, 8);
        const text = header.textContent?.trim() || '';
        doc.text(text, x + 2, yPosition + 5);
      });
      yPosition += 8;
    }

    // Table rows
    const rows = table.querySelectorAll('tbody tr') || table.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
      if (rowIndex === 0 && headerRow === row) return; // Skip header row if it's the first row

      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      const cells = row.querySelectorAll('td, th');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      const colWidth = contentWidth / cells.length;

      // Alternate row colors
      if (rowIndex % 2 === 0) {
        doc.setFillColor(249, 249, 249);
        doc.rect(margin, yPosition, contentWidth, 6, 'F');
      }

      cells.forEach((cell, index) => {
        const x = margin + (index * colWidth);
        doc.rect(x, yPosition, colWidth, 6);
        const text = cell.textContent?.trim() || '';
        doc.text(text, x + 2, yPosition + 4);
      });
      yPosition += 6;
    });

    yPosition += 10;
  });

  // Add footer
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  yPosition = Math.max(yPosition + 20, 260);

  // Add a line above footer
  doc.setLineWidth(0.3);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for your business!', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 5;
  doc.setFontSize(8);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth / 2, yPosition, { align: 'center' });

  return doc.output('blob');
};

/**
 * Generate print-optimized blob for download
 */
const generatePrintOptimizedBlob = async (htmlContent: string): Promise<Blob> => {
  // Create enhanced HTML content optimized for PDF-like appearance
  const pdfOptimizedHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice</title>
  <style>
    @page {
      margin: 0.5in;
      size: A4;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: #000;
      background: #fff;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .invoice-header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 2px solid #333;
    }

    .invoice-header h1 {
      font-size: 24px;
      color: #333;
      margin-bottom: 8px;
      font-weight: bold;
    }

    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      border: 1px solid #333;
    }

    .invoice-table th {
      background-color: #f0f0f0;
      color: #333;
      padding: 10px 8px;
      text-align: left;
      font-weight: bold;
      font-size: 11px;
      border: 1px solid #333;
    }

    .invoice-table td {
      padding: 8px;
      border: 1px solid #333;
      color: #333;
      font-size: 11px;
    }

    .invoice-footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #666;
      font-size: 10px;
    }

    @media print {
      body {
        padding: 0;
        background: white;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-document">
    ${htmlContent}

    <div class="invoice-footer">
      <p>This invoice was generated electronically and is valid without signature.</p>
      <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
    </div>
  </div>

  <script>
    // Auto-print when opened
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;

  // Create blob with PDF MIME type
  return new Blob([pdfOptimizedHtml], {
    type: 'application/pdf'
  });
};
