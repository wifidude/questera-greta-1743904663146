import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { FaFileExcel, FaDownload, FaSpinner, FaPrint } from 'react-icons/fa';
import { processExcelFile } from '../utils/excelProcessor';
import { generateTemplate } from '../utils/templateGenerator';
import { printBulkItems } from '../utils/pdfGenerator';
import ValidationResults from './ValidationResults';
import KanbanCard from './KanbanCard';
import BinLabel from './BinLabel';
import { useDepartmentColors } from '../contexts/DepartmentContext';
import { imageLogger } from '../utils/debugLogger';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationResults, setValidationResults] = useState(null);
  const { departmentColors } = useDepartmentColors();

  const handleFileChange = useCallback(async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);

    try {
      imageLogger.debug('Starting file processing', {
        fileName: selectedFile.name,
        fileSize: selectedFile.size
      });

      const results = await processExcelFile(selectedFile);
      
      imageLogger.debug('File processing results', {
        validRowCount: results.validRows.length,
        errorCount: results.errors.length
      });

      // Add department colors and log the data
      const enhancedResults = {
        ...results,
        validRows: results.validRows.map(row => {
          const enhanced = {
            ...row,
            departmentColor: departmentColors[row.department] || '#4F46E5'
          };
          
          imageLogger.debug('Enhanced row data', {
            partNumber: enhanced.part_number,
            imageUrl: enhanced.image_url,
            department: enhanced.department,
            departmentColor: enhanced.departmentColor
          });

          return enhanced;
        })
      };

      setValidationResults(enhancedResults);
    } catch (error) {
      imageLogger.error('File processing error', {
        error: error.message,
        stack: error.stack
      });
      
      setValidationResults({
        errors: [{
          row: 0,
          errors: ['Failed to process file: ' + error.message]
        }],
        validRows: []
      });
    } finally {
      setLoading(false);
    }
  }, [departmentColors]);

  const handlePrint = useCallback(() => {
    if (!validationResults?.validRows.length) return;

    try {
      setLoading(true);
      imageLogger.debug('Starting print preparation', {
        rowCount: validationResults.validRows.length
      });

      const items = validationResults.validRows.map(data => {
        const kanbanElement = document.getElementById(`kanban-${data.part_number}`);
        const binElement = document.getElementById(`label-${data.part_number}`);

        imageLogger.debug('Preparing print elements', {
          partNumber: data.part_number,
          hasKanban: !!kanbanElement,
          hasBin: !!binElement,
          imageUrl: data.image_url
        });

        if (!kanbanElement || !binElement) {
          imageLogger.error('Missing print elements', {
            partNumber: data.part_number,
            kanbanFound: !!kanbanElement,
            binFound: !!binElement
          });
          throw new Error(`Print elements not found for part ${data.part_number}`);
        }

        return {
          kanbanCard: kanbanElement.outerHTML,
          binLabel: binElement.outerHTML
        };
      });

      imageLogger.debug('Print items prepared', {
        itemCount: items.length,
        firstItemSample: items[0]
      });

      printBulkItems(items);
    } catch (error) {
      imageLogger.error('Print preparation failed', {
        error: error.message,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  }, [validationResults]);

  return (
    <div className="space-y-6">
      {/* File Upload UI */}
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <FaFileExcel className="w-12 h-12 text-[#4F46E5] mb-4" />
          <span className="text-gray-600">
            {file ? file.name : 'Choose Excel file or drag & drop'}
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePrint}
          className="px-4 py-2 bg-[#EF8741] text-white rounded-lg hover:bg-opacity-90 flex items-center"
          disabled={loading || !validationResults?.validRows.length}
        >
          {loading ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : (
            <FaPrint className="mr-2" />
          )}
          Print Cards & Labels
        </motion.button>
      </div>

      {/* Preview Area */}
      {validationResults?.validRows.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {validationResults.validRows.map((data, index) => {
              imageLogger.debug('Rendering preview item', {
                index,
                partNumber: data.part_number,
                imageUrl: data.image_url
              });

              return (
                <div key={index} className="space-y-4">
                  <div id={`kanban-${data.part_number}`}>
                    <KanbanCard data={data} />
                  </div>
                  <div id={`label-${data.part_number}`}>
                    <BinLabel data={data} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Validation Results */}
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