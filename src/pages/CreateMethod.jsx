import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFileUpload, FaPencilAlt, FaArrowLeft } from 'react-icons/fa';

const MethodCard = ({ icon: Icon, title, description, features, onClick, accent }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow"
  >
    <div className={`w-16 h-16 rounded-full ${accent} flex items-center justify-center mb-6`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
    
    <h3 className="text-2xl font-semibold text-[#1A191C] mb-4">
      {title}
    </h3>
    
    <p className="text-gray-600 mb-6">
      {description}
    </p>
    
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${accent}`} />
          <span className="text-gray-600">{feature}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

const CreateMethod = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-[#1A191C] hover:text-[#EF8741] transition-colors mb-8"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#1A191C] mb-4">
          Choose Your Creation Method
        </h1>
        <p className="text-lg text-gray-600">
          Select the approach that best suits your needs for generating Kanban cards
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <MethodCard
          icon={FaFileUpload}
          title="Bulk Generation →"
          description="Upload your data in bulk using Excel or CSV files. Perfect for creating multiple cards at once."
          features={[
            "Upload spreadsheet data",
            "Generate multiple cards instantly",
            "Use pre-built templates"
          ]}
          onClick={() => navigate('/bulk')}
          accent="bg-[#4F46E5]"
        />

        <MethodCard
          icon={FaPencilAlt}
          title="Individual Creation"
          description="Create and customize cards one at a time with a live preview. Ideal for detailed customization."
          features={[
            "Live preview while editing",
            "Fine-tune individual cards",
            "Instant printing options"
          ]}
          onClick={() => navigate('/individual')}
          accent="bg-[#EF8741]"
        />
      </div>

      <div className="text-center text-gray-600">
        Both methods support customizable department colors and QR code generation
      </div>
    </div>
  );
};

export default CreateMethod;