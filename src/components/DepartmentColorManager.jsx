import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaUndo, FaTimes } from 'react-icons/fa';
import { useDepartmentColors } from '../contexts/DepartmentContext';
import { DEFAULT_COLORS, generateColorPalette } from '../utils/colorUtils';

const DepartmentColorManager = () => {
  const {
    departmentColors,
    departments,
    updateDepartmentColor,
    addDepartment,
    removeDepartment,
    resetToDefaults
  } = useDepartmentColors();

  const [newDepartment, setNewDepartment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (addDepartment(newDepartment.trim())) {
      setNewDepartment('');
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-6 bg-[#1A191C] p-6 rounded-lg">
      <div className="flex justify-between items-center border-b border-[#C1E0D7] pb-4">
        <h3 className="text-lg font-medium text-white">
          Department Color Configuration
        </h3>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-[#C1E0D7] hover:text-[#EF8741] transition-colors"
            onClick={() => setShowForm(true)}
          >
            <FaPlus />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-[#C1E0D7] hover:text-[#EF8741] transition-colors"
            onClick={resetToDefaults}
          >
            <FaUndo />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex space-x-2 mb-4"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              placeholder="Enter department name"
              className="flex-1 px-4 py-2 bg-[#262528] text-white border border-[#C1E0D7] rounded-full focus:outline-none focus:border-[#EF8741]"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-2 bg-[#EF8741] text-white rounded-full hover:bg-opacity-80"
            >
              Add Department
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((department) => {
          const palette = generateColorPalette(departmentColors[department]);
          const isDefault = department in DEFAULT_COLORS;

          return (
            <motion.div
              key={department}
              layout
              className="flex items-center space-x-4 p-4 bg-[#262528] rounded-lg"
              style={{
                borderLeft: `4px solid ${palette.base}`
              }}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-white">{department}</span>
                  {!isDefault && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeDepartment(department)}
                      className="text-[#C1E0D7] hover:text-[#EF8741]"
                    >
                      <FaTimes />
                    </motion.button>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={departmentColors[department]}
                    onChange={(e) => updateDepartmentColor(department, e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent"
                  />
                  <div className="flex-1 h-2 rounded-full bg-[#1A191C]">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: '100%',
                        background: `linear-gradient(to right, ${palette.light}, ${palette.base}, ${palette.dark})`
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentColorManager;