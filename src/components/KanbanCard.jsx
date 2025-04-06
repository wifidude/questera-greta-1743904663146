import React from 'react';
import { motion } from 'framer-motion';
import { useDepartmentColors } from '../contexts/DepartmentContext';
import { generateColorPalette } from '../utils/colorUtils';
import { DIMENSIONS } from '../utils/constants';
import ImageWithFallback from './ImageWithFallback';

const DataBox = ({ label, value, style }) => (
  <div className="bg-gray-50 p-2 rounded">
    <p className="text-sm">
      <span className="font-medium">{label}: </span>
      {value}
    </p>
  </div>
);

const KanbanCard = ({ data, showDimensions = true }) => {
  const { departmentColors } = useDepartmentColors();
  const departmentColor = data.departmentColor || departmentColors[data.department] || '#4F46E5';
  const palette = generateColorPalette(departmentColor);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-md relative"
        style={{
          width: DIMENSIONS.CARD.WIDTH,
          height: DIMENSIONS.CARD.HEIGHT,
          borderLeft: `${DIMENSIONS.CARD.BORDER_WIDTH} solid ${departmentColor}`,
        }}
      >
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="flex justify-between">
            <div className="flex-1 pr-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {data.product_name}
              </h3>
              <p className="text-sm text-gray-600 uppercase">
                {data.part_number}
              </p>
            </div>
            <div className="w-12 h-12 bg-white rounded shadow-sm p-2">
              <ImageWithFallback
                src={data.qr_code_url}
                alt="QR Code"
                className="w-full h-full object-contain"
                containerClassName="w-full h-full"
                retryCount={2}
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">{data.description}</p>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-red-50 p-2 rounded">
              <p className="text-xs text-gray-600">Reorder Point</p>
              <p className="text-lg font-semibold text-red-600">
                {data.reorder_point}
              </p>
            </div>
            <div className="bg-blue-50 p-2 rounded">
              <p className="text-xs text-gray-600">Reorder QTY</p>
              <p className="text-lg font-semibold text-blue-600">
                {data.reorder_quantity}
              </p>
            </div>
          </div>

          <DataBox label="Location" value={data.location} />
          
          <div 
            className="mt-2 p-2 rounded"
            style={{ backgroundColor: `${palette.light}30` }}
          >
            <p className="text-sm">
              <span className="font-medium">Department: </span>
              {data.department}
            </p>
          </div>

          <div className="mt-2 h-24 bg-gray-50 rounded border border-gray-200">
            <ImageWithFallback
              src={data.image_url}
              alt={data.product_name}
              className="w-full h-full object-contain p-2"
              containerClassName="h-full"
              retryCount={2}
            />
          </div>
        </div>
      </motion.div>

      {showDimensions && (
        <div className="mt-2 text-sm text-gray-500">
          Kanban Card: 3" × 3.25"
        </div>
      )}
    </div>
  );
};

export default KanbanCard;