import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { FaFileExcel, FaDownload, FaSpinner } from 'react-icons/fa';
import { processExcelFile } from '../utils/excelProcessor';
import { generateTemplate } from '../utils/templateGenerator';
import { generateAndDownloadPDF } from '../utils/pdfGenerator.jsx';
import ValidationResults from './ValidationResults';

const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [validationResults, setValidationResults] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave' || e.type === 'drop') {
      setIsDragging(false);
    }
  }, []);

  const processFile = useCallback(async (file) => {
    if (!file) return;

    try {
      setProcessing(true);
      setError(null);
      const results = await processExcelFile(file);
      setValidationResults(results);

      if (results.validRows.length > 0) {
        await generateAndDownloadPDF(results.validRows);
      }
    } catch (err) {
      setError(err.message);
      console.error('File processing error:', err);
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer?.files[0];
    if (file?.type.includes('spreadsheet') || file?.name.endsWith('.xlsx')) {
      processFile(file);
    } else {
      setError('Please upload an Excel file (.xlsx)');
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const downloadTemplate = useCallback(async () => {
    try {
      const blob = generateTemplate();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'kanban-card-template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download template');
      console.error('Template download error:', err);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-[#EF8741] bg-[#EF8741]/10'
            : 'border-gray-300 hover:border-[#EF8741]'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept=".xlsx"
          onChange={handleFileSelect}
        />
        <FaFileExcel className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg text-gray-600 mb-2">
          Drag and drop your Excel file here
        </p>
        <p className="text-sm text-gray-500 mb-4">or</p>
        <motion.label
          htmlFor="fileInput"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block px-6 py-2 bg-[#EF8741] text-white rounded-lg cursor-pointer hover:bg-opacity-90"
        >
          Select File
        </motion.label>
      </div>

      <div className="flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={downloadTemplate}
          className="flex items-center px-4 py-2 text-[#EF8741] hover:bg-[#EF8741]/10 rounded-lg transition-colors"
        >
          <FaDownload className="mr-2" />
          Download Template
        </motion.button>

        {processing && (
          <div className="flex items-center text-gray-600">
            <FaSpinner className="animate-spin mr-2" />
            Processing...
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          {error}
        </div>
      )}

      {validationResults && (
        <ValidationResults
          validationResults={validationResults}
          onClose={() => setValidationResults(null)}
        />
      )}
    </div>
  );
};

export default FileUpload;