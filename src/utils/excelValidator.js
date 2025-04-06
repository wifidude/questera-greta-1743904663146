const REQUIRED_COLUMNS = [
  'product_name',
  'part_number',
  'description',
  'qr_code_url',
  'reorder_point',
  'reorder_quantity',
  'location',
  'department'
];

const NUMERIC_FIELDS = ['reorder_point', 'reorder_quantity'];
const URL_FIELDS = ['qr_code_url', 'image_url'];

export const validateExcelData = (data) => {
  const errors = [];
  const validRows = [];

  data.forEach((row, index) => {
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

    // Validate URLs
    URL_FIELDS.forEach(field => {
      if (row[field] && !isValidUrl(row[field])) {
        rowErrors.push(`${field} must be a valid URL`);
      }
    });

    if (rowErrors.length > 0) {
      errors.push({ row: rowNumber, errors: rowErrors });
    } else {
      validRows.push(row);
    }
  });

  return { errors, validRows };
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};