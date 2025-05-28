# Installing PDF Download Dependencies

To enable the enhanced PDF download functionality, you need to install the required packages:

## Required Installation

```bash
# Install js-file-download for file downloads
npm install js-file-download

# Install TypeScript types (optional but recommended)
npm install --save-dev @types/js-file-download
```

## Optional: Real PDF Generation

For actual PDF file generation (recommended):

```bash
# Install jsPDF for real PDF generation
npm install jspdf

# Install TypeScript types
npm install --save-dev @types/jspdf
```

## Optional: Enhanced Visual PDF Generation

For pixel-perfect PDF generation with visual accuracy (highly recommended):

```bash
# Install html2canvas for visual PDF generation
npm install html2canvas

# Install TypeScript types
npm install --save-dev @types/html2canvas
```

## Alternative Installation (Yarn)

If you prefer yarn:

```bash
# Required packages
yarn add js-file-download
yarn add --dev @types/js-file-download

# Optional PDF generation
yarn add jspdf
yarn add --dev @types/jspdf

# Optional enhanced visual PDF generation
yarn add html2canvas
yarn add --dev @types/html2canvas
```

## Complete Installation (All Features)

For the best PDF download experience with all features:

```bash
# NPM
npm install js-file-download jspdf html2canvas
npm install --save-dev @types/js-file-download @types/jspdf @types/html2canvas

# Yarn
yarn add js-file-download jspdf html2canvas
yarn add --dev @types/js-file-download @types/jspdf @types/html2canvas
```

## What it does

The implementation provides multiple levels of PDF download functionality:

### Level 1: js-file-download (Required)
- **File Download Trigger**: Provides reliable file download functionality
- **Cross-browser Support**: Works consistently across all modern browsers
- **Fallback Ready**: Graceful fallback if other libraries are unavailable

### Level 2: jsPDF (Optional - Recommended)
- **Real PDF Generation**: Creates actual PDF files, not HTML
- **Professional Output**: Generates proper PDF documents
- **Better User Experience**: Users get real PDF files they can save and share

### Level 3: Fallback Method
- **Print-optimized HTML**: Creates HTML that prints well as PDF
- **Auto-print Functionality**: Opens print dialog automatically
- **Universal Compatibility**: Works even without additional libraries

## Download Flow

1. **User clicks download** → Loading state shown
2. **API call** → Fetches invoice HTML from server
3. **PDF Generation**:
   - **If jsPDF available**: Creates real PDF file
   - **If only js-file-download**: Creates print-optimized HTML with PDF MIME type
   - **If neither**: Falls back to print window method
4. **File Download** → Triggers download using js-file-download
5. **Success feedback** → Shows success toast notification

## Features

### ✅ With js-file-download only:
- **Reliable Downloads**: Consistent file download experience
- **Print-optimized HTML**: Professional-looking invoice format
- **Auto-print**: Opens print dialog for PDF saving
- **Fallback Support**: Works even if jsPDF unavailable

### ✅ With js-file-download + jsPDF:
- **Real PDF Files**: Generates actual PDF documents
- **Professional Output**: True PDF format with proper structure
- **Better UX**: Users get real PDF files they expect
- **Smaller File Size**: Optimized PDF output

### ✅ Universal Features:
- **Cross-browser compatibility**: Works on all modern browsers
- **Error handling**: Graceful error handling with user feedback
- **Loading states**: Visual feedback during download process
- **Responsive design**: Works on desktop and mobile devices

## Usage

Once the packages are installed, the invoice download functionality will automatically:

1. **Detect available libraries** and use the best method available
2. **Generate PDF files** using jsPDF if available, or optimized HTML otherwise
3. **Download files** using js-file-download for reliable delivery
4. **Provide feedback** with toast notifications for success/error states

The implementation is already integrated into the `useInvoiceDownload` hook and will work seamlessly once the packages are installed.
