import React from 'react';
import { motion } from 'framer-motion';
import DepartmentColorManager from './DepartmentColorManager';

const Settings = () => {
  const [binLabelFields, setBinLabelFields] = React.useState({
    productName: true,
    partNumber: true,
    location: true,
    description: false,
  });

  const handleFieldToggle = (field) => {
    setBinLabelFields(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="space-y-8">
      <DepartmentColorManager />

      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Bin Label Fields
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(binLabelFields).map(([field, checked]) => (
            <label
              key={field}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleFieldToggle(field)}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-gray-600">
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        Save Settings
      </motion.button>
    </div>
  );
};

export default Settings;