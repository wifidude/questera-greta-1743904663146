import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generatePDF } from '../utils/pdfGenerator.jsx';

const PDFPreview = ({ data, type }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadPDF = async () => {
      try {
        setLoading(true);
        const result = await generatePDF(data, type);
        const blob = type === 'both' ? result.cardBlob : result[type + 'Blob'];

        if (mounted) {
          if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
          }
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to generate PDF preview');
          console.error('PDF preview error:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPDF();

    return () => {
      mounted = false;
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [data, type]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-96 border border-gray-200 rounded-lg overflow-hidden"
    >
      <iframe src={pdfUrl} className="w-full h-full" title="PDF Preview" />
    </motion.div>
  );
};

export default PDFPreview;