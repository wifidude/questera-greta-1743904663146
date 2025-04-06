import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDepartmentColors } from '../contexts/DepartmentContext';
import { generateAndDownloadPDF } from '../utils/pdfGenerator.jsx';
import KanbanCard from '../components/KanbanCard';
import BinLabel from '../components/BinLabel';

const IndividualCreate = () => {
  const navigate = useNavigate();
  const { departmentColors } = useDepartmentColors();
  const [formData, setFormData] = useState({
    product_name: '',
    part_number: '',
    description: '',
    reorder_point: '',
    reorder_quantity: '',
    location: '',
    department: Object.keys(departmentColors)[0],
    image_url: '',
    qr_code_url: ''
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      departmentColor: departmentColors[value] || prev.departmentColor
    }));
  }, [departmentColors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      await generateAndDownloadPDF(formData);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  }, [formData]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <button
        onClick={() => navigate('/create')}
        className="flex items-center text-[#1A191C] hover:text-[#EF8741] transition-colors mb-8"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-[#1A191C] mb-6 flex items-center">
            <span className="w-2 h-8 bg-[#EF8741] rounded-full mr-3" />
            Create Kanban Card
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EF8741]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part Number
                </label>
                <input
                  type="text"
                  name="part_number"
                  value={formData.part_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EF8741]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EF8741]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reorder Point
                </label>
                <input
                  type="number"
                  name="reorder_point"
                  value={formData.reorder_point}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EF8741]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reorder Quantity
                </label>
                <input
                  type="number"
                  name="reorder_quantity"
                  value={formData.reorder_quantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EF8741]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EF8741]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EF8741]"
                required
              >
                {Object.keys(departmentColors).map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (Optional)
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EF8741]"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 bg-[#EF8741] text-white rounded-lg hover:bg-opacity-90"
            >
              <FaDownload className="mr-2" />
              Generate PDF
            </motion.button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-[#1A191C] mb-6">
              Preview
            </h2>
            <div className="space-y-8">
              <KanbanCard data={formData} />
              <BinLabel data={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualCreate;