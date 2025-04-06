import * as XLSX from 'xlsx';

export const generateTemplate = () => {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Template headers
  const headers = [
    'Product Name',
    'Part Number',
    'Description',
    'QR Code URL',
    'Reorder Point',
    'Reorder Quantity',
    'Location',
    'Department',
    'Image URL (Optional)'
  ];

  // Sample data row
  const sampleData = [
    'Example Product',
    'PART-001',
    'Product description here',
    'https://example.com/qr/PART-001',
    '10',
    '50',
    'Shelf A-1',
    'Hardware',
    'https://example.com/images/PART-001.jpg'
  ];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet([headers, sampleData]);

  // Add column widths
  const colWidths = headers.map(() => ({ wch: 20 }));
  ws['!cols'] = colWidths;

  // Add the worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Template');

  // Generate buffer
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
  return new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
};