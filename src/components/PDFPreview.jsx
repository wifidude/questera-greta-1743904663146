import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { pdfLogger } from '../utils/debugLogger';

const PDFPreview = ({ data, type = 'cards' }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const generatePreview = async () => {
      try {
        setLoading(true);
        setError(null);

        const element = document.getElementById('printable-card');
        if (!element) {
          throw new Error('Preview element not found');
        }

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        if (!mounted) return;

        const previewImage = canvas.toDataURL('image/png');
        setPreviewUrl(previewImage);
        pdfLogger.info('Preview generated successfully');
      } catch (err) {
        if (!mounted) return;
        setError('Failed to generate preview');
        pdfLogger.error('Preview generation failed', { error: err.message });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    generatePreview();

    return () => {
      mounted = false;
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
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
      className="w-full bg-gray-100 rounded-lg p-4"
    >
      {previewUrl && (
        <div className="shadow-lg">
          <img
            src={previewUrl}
            alt="PDF Preview"
            className="w-full h-auto rounded"
          />
        </div>
      )}
    </motion.div>
  );
};

export default PDFPreview;