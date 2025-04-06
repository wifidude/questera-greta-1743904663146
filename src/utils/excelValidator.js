import { processImageUrl } from './imageUtils';
import { imageLogger } from './debugLogger';

const REQUIRED_COLUMNS = [
  'product_name',
  'part_number',
  'description',
  'reorder_point',
  'reorder_quantity',
  'location',
  'department'
];

const NUMERIC_FIELDS = ['reorder_point', 'reorder_quantity'];
const URL_FIELDS = ['qr_code_url', 'image_url'];

export const validateExcelData = async (data) => {
  const errors = [];
  const validRows = [];

  for (let index = 0; index < data.length; index++) {
    const row = data[index];
    const rowNumber = index + 2; // Adding 2 because Excel starts at 1 and we skip header
    const rowErrors = [];

    // Check required fields
    REQUIRED_COLUMNS.forEach(column => {
      if (!row[column] || String(row[column]).trim() === '') {
        rowErrors.push(`Missing required field: ${column}`);
      }
    });

    // Validate numeric fields
    NUMERIC_FIELDS.forEach(field => {
      if (row[field] && isNaN(Number(row[field]))) {
        rowErrors.push(`${field} must be a number`);
      }
    });

    // Validate and process URLs
    for (const field of URL_FIELDS) {
      if (row[field]) {
        try {
          const processedUrl = await processImageUrl(row[field], field === 'qr_code_url' ? 'qr' : 'product');
          row[field] = processedUrl;
          imageLogger.debug(`Processed ${field}`, { original: row[field], processed: processedUrl });
        } catch (error) {
          rowErrors.push(`Invalid ${field}: ${error.message}`);
          imageLogger.error(`${field} validation failed`, { url: row[field], error: error.message });
        }
      }
    }

    if (rowErrors.length > 0) {
      errors.push({
        row: rowNumber,
        errors: rowErrors
      });
    } else {
      validRows.push(row);
    }
  }

  return {
    errors,
    validRows
  };
};