import { pdfLogger } from './debugLogger';

const createPrintWindow = (content, size = { width: '3in', height: '5in' }) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to print');
    return null;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Kanban Card</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          @page {
            size: ${size.width} ${size.height};
            margin: 0;
          }
          
          body {
            margin: 0;
            padding: 0;
            width: ${size.width};
            height: ${size.height};
          }

          .print-content {
            width: ${size.width};
            height: ${size.height};
            overflow: hidden;
            page-break-after: always;
            background-color: white;
            position: relative;
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

          /* Ensure images are visible */
          img {
            display: block !important;
            visibility: visible !important;
            print-color-adjust: exact;
          }

          /* Fix QR code display */
          .qr-code {
            width: 96px !important;
            height: 96px !important;
            display: block !important;
          }

          /* Fix flex layouts */
          .flex { display: flex !important; }
          .flex-1 { flex: 1 !important; }
          .justify-between { justify-content: space-between !important; }
          .items-center { align-items: center !important; }
          
          /* Fix grid layouts */
          .grid { display: grid !important; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .gap-2 { gap: 0.5rem !important; }
          
          /* Fix spacing */
          .p-4 { padding: 1rem !important; }
          .mb-4 { margin-bottom: 1rem !important; }
          .space-y-2 > * + * { margin-top: 0.5rem !important; }
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

export const printMultipleCards = (cards) => {
  if (!cards || !cards.length) {
    console.error('No cards to print');
    return;
  }

  const printContent = cards.map(card => `
    <div class="print-content">
      <div id="printable-card-${card.part_number}">
        ${card.element.outerHTML}
      </div>
    </div>
  `).join('');

  const printWindow = createPrintWindow(printContent);
  if (printWindow) {
    printWindow.document.close();
  }
};

export const generatePDF = async (data, type = 'card') => {
  if (Array.isArray(data)) {
    printMultipleCards(data);
  } else {
    printElement('printable-card');
  }
};

export const generateAndDownloadPDF = async (data, type = 'card') => {
  await generatePDF(data, type);
};