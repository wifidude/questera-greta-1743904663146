import { pdfLogger } from './debugLogger';

const createPrintWindow = (content, options = {}) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to print');
    return null;
  }

  const { kanbanSize = { width: '3in', height: '5in' }, 
          binLabelSize = { width: '3in', height: '1in' } } = options;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Kanban Cards & Labels</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          @page {
            size: letter;
            margin: 0.5in;
          }
          
          body {
            margin: 0;
            padding: 0;
          }

          .kanban-card {
            width: ${kanbanSize.width};
            height: ${kanbanSize.height};
            page-break-after: always;
            background-color: white;
            position: relative;
            margin: 0 auto;
          }

          .bin-label {
            width: ${binLabelSize.width};
            height: ${binLabelSize.height};
            page-break-after: always;
            background-color: white;
            position: relative;
            margin: 0.5in auto;
          }

          /* Preserve colors and backgrounds */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          /* Force background colors */
          .bg-gray-50 { background-color: #F9FAFB !important; }
          .bg-red-50 { background-color: #FEF2F2 !important; }
          .bg-blue-50 { background-color: #EFF6FF !important; }

          /* Force text colors */
          .text-gray-800 { color: #1F2937 !important; }
          .text-gray-600 { color: #4B5563 !important; }
          .text-red-600 { color: #DC2626 !important; }
          .text-blue-600 { color: #2563EB !important; }

          /* Fix layouts */
          .flex { display: flex !important; }
          .flex-1 { flex: 1 !important; }
          .justify-between { justify-content: space-between !important; }
          .items-center { align-items: center !important; }
          .grid { display: grid !important; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          
          /* Fix spacing */
          .p-4 { padding: 1rem !important; }
          .mb-4 { margin-bottom: 1rem !important; }
          .space-y-2 > * + * { margin-top: 0.5rem !important; }

          /* Print settings */
          @media print {
            .page-break { page-break-after: always; }
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.onload = () => {
            setTimeout(() => {
              window.print();
              setTimeout(() => window.close(), 500);
            }, 500);
          };
        </script>
      </body>
    </html>
  `);

  return printWindow;
};

export const printBulkItems = (items, options = {}) => {
  if (!items?.length) {
    console.error('No items to print');
    return;
  }

  const printContent = items.map(item => `
    <div class="page-break">
      <div class="kanban-card">
        ${item.kanbanCard}
      </div>
      <div class="bin-label">
        ${item.binLabel}
      </div>
    </div>
  `).join('');

  const printWindow = createPrintWindow(printContent, options);
  if (printWindow) {
    printWindow.document.close();
  }
};

export const printElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Print element not found');
    return;
  }

  const printWindow = createPrintWindow(element.outerHTML);
  if (printWindow) {
    printWindow.document.close();
  }
};

export const generatePDF = async (data, type = 'both') => {
  if (Array.isArray(data)) {
    printBulkItems(data);
  } else {
    printElement('printable-card');
  }
};

export const generateAndDownloadPDF = async (data, type = 'both') => {
  await generatePDF(data, type);
};