import React from 'react';
import { motion } from 'framer-motion';
import { useDepartmentColors } from '../contexts/DepartmentContext';

const CustomizationPanel = () => {
  const { departmentColors, updateDepartmentColor } = useDepartmentColors();
  
  const [settings, setSettings] = React.useState({
    showDimensions: true,
    showPlaceholders: true,
    fields: {
      productName: true,
      partNumber: true,
      description: true,
      reorderPoint: true,
      reorderQuantity: true,
      location: true,
      department: true,
      imageUrl: true,
      revisionDate: true,
      revisionNumber: true
    },
    cardSize: {
      width: 3, // inches
      height: 5  // inches
    },
    labelSize: {
      width: 3, // inches
      height: 1  // inches
    }
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: typeof value === 'object' 
        ? { ...prev[category], ...value }
        : value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-[#1A191C] mb-6 flex items-center">
        <span className="w-2 h-8 bg-[#EF8741] rounded-full mr-3" />
        Customization Settings
      </h2>

      <div className="space-y-6">
        {/* Display Settings */}
        <section>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Display Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.showDimensions}
                onChange={e => handleSettingChange('showDimensions', null, e.target.checked)}
                className="rounded text-[#EF8741]"
              />
              <span>Show physical dimensions</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.showPlaceholders}
                onChange={e => handleSettingChange('showPlaceholders', null, e.target.checked)}
                className="rounded text-[#EF8741]"
              />
              <span>Show placeholder text</span>
            </label>
          </div>
        </section>

        {/* Field Visibility */}
        <section>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Field Visibility</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(settings.fields).map(([field, visible]) => (
              <label key={field} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={e => handleSettingChange('fields', field, e.target.checked)}
                  className="rounded text-[#EF8741]"
                />
                <span>{field.replace(/([A-Z])/g, ' $1').trim()}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Card Dimensions */}
        <section>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Card Dimensions</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Width (inches)</label>
              <input
                type="number"
                value={settings.cardSize.width}
                onChange={e => handleSettingChange('cardSize', 'width', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#EF8741] focus:ring-[#EF8741]"
                min="2"
                max="8"
                step="0.25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Height (inches)</label>
              <input
                type="number"
                value={settings.cardSize.height}
                onChange={e => handleSettingChange('cardSize', 'height', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#EF8741] focus:ring-[#EF8741]"
                min="3"
                max="11"
                step="0.25"
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Label Dimensions</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Width (inches)</label>
              <input
                type="number"
                value={settings.labelSize.width}
                onChange={e => handleSettingChange('labelSize', 'width', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#EF8741] focus:ring-[#EF8741]"
                min="2"
                max="8"
                step="0.25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Height (inches)</label>
              <input
                type="number"
                value={settings.labelSize.height}
                onChange={e => handleSettingChange('labelSize', 'height', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#EF8741] focus:ring-[#EF8741]"
                min="0.5"
                max="4"
                step="0.25"
              />
            </div>
          </div>
        </section>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-2 bg-[#EF8741] text-white rounded-lg hover:bg-opacity-90"
        >
          Save Settings
        </motion.button>
      </div>
    </div>
  );
};

export default CustomizationPanel;