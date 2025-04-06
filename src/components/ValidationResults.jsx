import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

const ValidationResults = ({ validationResults, onClose }) => {
  if (!validationResults || !validationResults.errors.length) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-lg shadow-lg p-6 mt-6 border-l-4 border-[#EF8741]"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#1A191C]">
            Validation Errors
          </h3>
          <button
            onClick={onClose}
            className="text-[#1A191C] hover:text-[#EF8741] transition-colors"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-[#EF8741]">
            <FaExclamationTriangle />
            <span>{validationResults.errors.length} rows with errors found</span>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {validationResults.errors.map((error, index) => (
              <div
                key={index}
                className="bg-[#1A191C]/5 border-l-4 border-[#EF8741] p-4 mb-2"
              >
                <p className="font-medium text-[#1A191C]">Row {error.row}:</p>
                <ul className="list-disc list-inside ml-4">
                  {error.errors.map((err, i) => (
                    <li key={i} className="text-sm text-[#1A191C]/80">
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ValidationResults;