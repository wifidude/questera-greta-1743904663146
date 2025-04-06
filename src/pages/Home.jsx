import React from 'react';
import { motion } from 'framer-motion';
import FileUpload from '../components/FileUpload';
import Settings from '../components/Settings';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-[#1A191C] mb-6 flex items-center">
          <span className="w-2 h-8 bg-[#EF8741] rounded-full mr-3" />
          Generate Kanban Cards
        </h2>
        <FileUpload />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-[#1A191C] mb-6 flex items-center">
          <span className="w-2 h-8 bg-[#EF8741] rounded-full mr-3" />
          Settings
        </h2>
        <Settings />
      </div>
    </motion.div>
  );
};

export default Home;