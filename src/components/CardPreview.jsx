import React from 'react';
import { motion } from 'framer-motion';
import KanbanCard from './KanbanCard';
import BinLabel from './BinLabel';

const CardPreview = ({ data, binLabelFields }) => {
  if (!data) return null;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-gray-100 rounded-lg"
      >
        <h3 className="text-lg font-medium text-gray-800 mb-4">Kanban Card Preview</h3>
        <div className="flex flex-col items-center gap-8">
          <KanbanCard data={data} />
          <BinLabel data={data} fields={binLabelFields} />
        </div>
      </motion.div>
    </div>
  );
};

export default CardPreview;