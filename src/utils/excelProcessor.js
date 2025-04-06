import * as XLSX from 'xlsx';
import { validateExcelData } from './excelValidator';

export const processExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 'A' });

        // Get headers from first row
        const headers = jsonData[0];
        const headerMapping = {};
        Object.keys(headers).forEach(key => {
          headerMapping[key] = headers[key].toLowerCase().replace(/\s+/g, '_');
        });

        // Process data rows
        const rows = jsonData.slice(1).map(row => {
          const processedRow = {};
          Object.keys(row).forEach(key => {
            const headerKey = headerMapping[key];
            if (headerKey) {
              processedRow[headerKey] = row[key];
            }
          });
          return processedRow;
        });

        // Validate the processed data
        const validationResult = validateExcelData(rows);
        resolve(validationResult);
      } catch (error) {
        reject(new Error('Error processing Excel file: ' + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsArrayBuffer(file);
  });
};