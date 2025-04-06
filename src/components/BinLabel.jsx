import React from 'react';
import { motion } from 'framer-motion';
import { useDepartmentColors } from '../contexts/DepartmentContext';

const BinLabel = ({ data, showDimensions = true }) => {
  const { departmentColors } = useDepartmentColors();
  const departmentColor = data.departmentColor || departmentColors[data.department] || '#4F46E5';
  
  const defaultImage = 'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <rect width="64" height="64" fill="#f3f4f6"/>
      <path d="M32 24a8 8 0 1 1 0 16 8 8 0 0 1 0-16" fill="#d1d5db"/>
    </svg>
  `);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-[288px] h-[96px] bg-white shadow-md flex items-center"
        style={{ borderLeft: `16px solid ${departmentColor}` }}
      >
        <div className="flex-1 p-4 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {data.product_name || 'Product Name'}
            </h3>
            <p className="text-gray-500">
              {(data.part_number || 'PART NUMBER').toUpperCase()}
            </p>
          </div>
          <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden">
            <img
              src={data.image_url || defaultImage}
              alt={data.product_name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
          </div>
        </div>
      </motion.div>
      
      {showDimensions && (
        <div className="mt-2 text-sm text-gray-500">
          Bin Label: 3" × 1"
        </div>
      )}
    </div>
  );
};

export default BinLabel;