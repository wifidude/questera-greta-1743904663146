import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaPrint, FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDepartmentColors } from '../contexts/DepartmentContext';
import KanbanCard from '../components/KanbanCard';
import CustomizationPanel from '../components/CustomizationPanel';
import { componentLogger } from '../utils/debugLogger';
import { printElement } from '../utils/pdfGenerator';

const IndividualCreate = () => {
  const navigate = useNavigate();
  const { departmentColors } = useDepartmentColors();
  const [formData, setFormData] = useState({
    product_name: '',
    part_number: '',
    description: '',
    reorder_point: '10',
    reorder_quantity: '50',
    location: '',
    department: Object.keys(departmentColors)[0],
    image_url: '',
    qr_code_url: ''
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    componentLogger.trackState('IndividualCreate', name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handlePrint = useCallback(() => {
    printElement('printable-card');
  }, []);

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
        {/* Form section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-[#1A191C] mb-6 flex items-center">
            <span className="w-2 h-8 bg-[#EF8741] rounded-full mr-3" />
            Create Kanban Card
          </h2>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF8741]"
                placeholder="Enter product name"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF8741]"
                placeholder="Enter part number"
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF8741]"
                placeholder="Enter product description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reorder Point
                </label>
                <input
                  type="number"
                  name="reorder_point"
                  value={formData.reorder_point}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF8741]"
                  min="0"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF8741]"
                  min="0"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF8741]"
                placeholder="Enter location"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF8741]"
              >
                {Object.keys(departmentColors).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF8741]"
                placeholder="Enter image URL"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center"
              >
                <FaPrint className="mr-2" />
                Print Card
              </button>
            </div>
          </form>
        </div>

        {/* Preview section */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-[#1A191C] mb-6">
              Preview
            </h2>
            <div className="space-y-8">
              {/* Regular preview */}
              <KanbanCard data={formData} />
              
              {/* Hidden printable version */}
              <div className="hidden">
                <div id="printable-card">
                  <KanbanCard data={formData} showDimensions={false} forPrint={true} />
                </div>
              </div>
            </div>
          </div>
          <CustomizationPanel />
        </div>
      </div>
    </div>
  );
};

export default IndividualCreate;