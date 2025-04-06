import React from 'react';
import { motion } from 'framer-motion';
import { useDepartmentColors } from '../contexts/DepartmentContext';
import ImageWithFallback from './ImageWithFallback';
import { imageLogger } from '../utils/debugLogger';

const BinLabel = ({ data, showDimensions = true }) => {
  const { departmentColors } = useDepartmentColors();
  const departmentColor = data.departmentColor || departmentColors[data.department] || '#4F46E5';

  // Enhanced debugging for data mapping
  imageLogger.debug('BinLabel component render', {
    componentName: 'BinLabel',
    partNumber: data.part_number,
    imageUrl: data.image_url,
    hasImageUrl: !!data.image_url,
    dataKeys: Object.keys(data),
    imageUrlType: typeof data.image_url,
    fullData: data,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-md relative"
        style={{
          width: '288px',
          height: '96px',
          borderLeft: '4px solid',
          borderLeftColor: departmentColor,
        }}
      >
        <div className="flex h-full p-4">
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {data.product_name || 'Product Name'}
            </h3>
            <p className="text-sm text-gray-600 uppercase truncate">
              {data.part_number || 'PART-123'}
            </p>
          </div>
          <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden">
            <div
              className="relative w-full h-full"
              data-testid="bin-label-image-container"
            >
              <ImageWithFallback
                src={data.image_url}
                alt={data.product_name}
                className="w-full h-full object-contain"
                containerClassName="w-full h-full"
                type="product"
                componentName="BinLabel"
                onLoad={(success) => {
                  imageLogger.debug('BinLabel image load result', {
                    success,
                    src: data.image_url,
                    partNumber: data.part_number,
                    timestamp: new Date().toISOString()
                  });
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
      {showDimensions && (
        <div className="mt-2 text-sm text-gray-500 flex flex-col items-center">
          <span>Physical Label Size: 3" × 1"</span>
          <span className="text-xs text-gray-400">
            Actual print dimensions when exported
          </span>
        </div>
      )}
    </div>
  );
};

export default BinLabel;