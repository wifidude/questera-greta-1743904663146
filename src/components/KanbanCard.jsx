import React from 'react';
import { motion } from 'framer-motion';
import { useDepartmentColors } from '../contexts/DepartmentContext';
import ImageWithFallback from './ImageWithFallback';
import QRCodeImage from './QRCodeImage';

const KanbanCard = ({ data, showDimensions = true, forPrint = false }) => {
  const { departmentColors } = useDepartmentColors();
  const departmentColor = data.departmentColor || departmentColors[data.department] || '#4F46E5';

  const cardContent = (
    <div 
      className="bg-white relative print:shadow-none"
      style={{
        width: '3in',
        height: '5in',
        borderLeft: `4px solid ${departmentColor}`,
      }}
    >
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between">
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {data.product_name || 'Product Name'}
            </h3>
            <p className="text-sm text-gray-600">
              {data.part_number || 'PART-123'}
            </p>
          </div>
          <div className="w-24 h-24 bg-white rounded shadow-sm p-2">
            <QRCodeImage 
              data={data.qr_code_url || data.part_number} 
              size={88}
              containerClassName="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">
          {data.description || 'Enter product description here...'}
        </p>

        {/* Reorder Information */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-red-50 p-2 rounded">
            <p className="text-xs text-gray-600">Reorder Point</p>
            <p className="text-lg font-semibold text-red-600">
              {data.reorder_point || '10'}
            </p>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <p className="text-xs text-gray-600">Reorder QTY</p>
            <p className="text-lg font-semibold text-blue-600">
              {data.reorder_quantity || '50'}
            </p>
          </div>
        </div>

        {/* Location and Department */}
        <div className="space-y-2">
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-sm">
              <span className="font-medium">Location: </span>
              {data.location || 'Warehouse A-1'}
            </p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-sm">
              <span className="font-medium">Department: </span>
              {data.department || 'Hardware'}
            </p>
          </div>
        </div>

        {/* Product Image */}
        <div className="mt-4 h-24 bg-gray-50 rounded border border-gray-200">
          <ImageWithFallback
            src={data.image_url}
            alt={data.product_name}
            className="w-full h-full object-contain p-2"
            containerClassName="h-full"
          />
        </div>
      </div>
    </div>
  );

  if (forPrint) {
    return cardContent;
  }

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {cardContent}
      </motion.div>
      
      {showDimensions && (
        <div className="mt-2 text-sm text-gray-500 flex flex-col items-center">
          <span>Physical Card Size: 3" × 5"</span>
          <span className="text-xs text-gray-400">
            Actual print dimensions when exported
          </span>
        </div>
      )}
    </div>
  );
};

export default KanbanCard;