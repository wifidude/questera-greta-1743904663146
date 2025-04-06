import * as XLSX from 'xlsx';
import { validateExcelData } from './excelValidator';
import { processImageUrl } from './imageUtils';
import { imageLogger } from './debugLogger';

export const processExcelFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        imageLogger.debug('Starting Excel file processing');
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        // Get headers from first row and normalize them
        const headers = jsonData[0].map(header => 
          header.toLowerCase()
            .replace(/[\s_]+/g, '_')
            .replace(/[\(\)]/g, '')
            .replace('image_url_optional', 'image_url')
        );
        
        imageLogger.debug('Excel headers found', { headers });

        // Process data rows
        const rows = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row.length) continue; // Skip empty rows
          
          const processedRow = {};

          for (let j = 0; j < headers.length; j++) {
            const header = headers[j];
            const value = row[j];

            if (header === 'image_url' && value) {
              imageLogger.debug(`Processing image URL in row ${i}`, {
                rowNumber: i,
                originalUrl: value,
                timestamp: new Date().toISOString()
              });

              try {
                const processedUrl = await processImageUrl(value, 'product');
                imageLogger.info(`Successfully processed image URL in row ${i}`, {
                  originalUrl: value,
                  processedUrl,
                  rowNumber: i
                });
                processedRow[header] = processedUrl;
              } catch (error) {
                imageLogger.error(`Failed to process image URL in row ${i}`, {
                  url: value,
                  error: error.message,
                  rowNumber: i,
                  timestamp: new Date().toISOString()
                });
                processedRow[header] = '/examples/pla-gray-1kg.jpg';
              }
            } else {
              processedRow[header] = value;
            }
          }

          imageLogger.debug(`Processed row ${i}`, {
            rowNumber: i,
            rowData: processedRow,
            hasImageUrl: !!processedRow.image_url,
            imageUrl: processedRow.image_url
          });

          rows.push(processedRow);
        }

        // Validate the processed data
        const validationResult = await validateExcelData(rows);
        
        imageLogger.info('Excel processing complete', {
          totalRows: rows.length,
          validRows: validationResult.validRows.length,
          errorRows: validationResult.errors.length,
          rowsWithImages: rows.filter(r => r.image_url).length
        });

        resolve(validationResult);
      } catch (error) {
        imageLogger.error('Excel processing failed', {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });
        reject(new Error('Error processing Excel file: ' + error.message));
      }
    };

    reader.onerror = () => {
      imageLogger.error('File reading failed');
      reject(new Error('Error reading file'));
    };

    reader.readAsArrayBuffer(file);
  });
};