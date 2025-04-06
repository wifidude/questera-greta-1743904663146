import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaPrint, FaEye } from 'react-icons/fa';
import CardPreview from '../components/CardPreview';
import PDFPreview from '../components/PDFPreview';
import { generateAndDownloadPDF } from '../utils/pdfGenerator';

const Preview = () => {
  const [validRows, setValidRows] = useState([]);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [previewType, setPreviewType] = useState('cards');
  const [loading, setLoading] = useState(false);
  const [binLabelFields, setBinLabelFields] = useState({
    productName: true,
    partNumber: true,
    location: true,
    description: false,
    showImage: true
  });

  useEffect(() => {
    // Sample data - replace with actual data from your state management
    const sampleData = {
      product_name: "Sample Product",
      part_number: "ABC123",
      description: "Sample product description",
      qr_code_url: "https://example.com/abc123",
      reorder_point: 10,
      reorder_quantity: 50,
      location: "Shelf A-1",
      department: "Hardware",
      image_url: "https://example.com/image.jpg"
    };
    setValidRows([sampleData]);
  }, []);

  const handleDownload = async (type) => {
    try {
      setLoading(true);
      await generateAndDownloadPDF(validRows, type);
    } catch (error) {
      console.error('Download error:', error);
      // Show error notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Preview Generated Cards
          </h2>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowPDFPreview(true);
                setPreviewType('cards');
              }}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <FaEye className="mr-2" /> Preview Cards
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDownload('cards')}
              className="flex items-center px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-opacity-90"
              disabled={loading}
            >
              <FaDownload className="mr-2" /> Download Cards
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDownload('labels')}
              className="flex items-center px-4 py-2 bg-[#EF8741] text-white rounded-lg hover:bg-opacity-90"
              disabled={loading}
            >
              <FaPrint className="mr-2" /> Download Labels
            </motion.button>
          </div>
        </div>

        {showPDFPreview ? (
          <PDFPreview data={validRows} type={previewType} />
        ) : (
          validRows.map((row, index) => (
            <CardPreview key={index} data={row} binLabelFields={binLabelFields} />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Preview;