import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import ImageWithFallback from '../components/ImageWithFallback';

const ExampleCard = ({ title, partNumber, description, reorderPoint, reorderQty, location, department, color, imageUrl }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="w-[288px] bg-white rounded-lg shadow-lg overflow-hidden"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between">
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{partNumber}</p>
          </div>
          <div className="w-24 h-24 bg-white rounded shadow-sm p-2">
            <ImageWithFallback
              src="/qr-example.png"
              alt="QR Code"
              className="w-full h-full object-contain"
              containerClassName="w-full h-full"
            />
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-red-50 p-2 rounded">
            <p className="text-xs text-gray-600">Reorder Point</p>
            <p className="text-lg font-semibold text-red-600">{reorderPoint}</p>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <p className="text-xs text-gray-600">Reorder QTY</p>
            <p className="text-lg font-semibold text-blue-600">{reorderQty}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-sm">
              <span className="font-medium">Location: </span>
              {location}
            </p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-sm">
              <span className="font-medium">Department: </span>
              {department}
            </p>
          </div>
        </div>
        <div className="mt-4 h-24 bg-gray-50 rounded border border-gray-200">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="w-full h-full object-contain p-2"
            containerClassName="h-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

const Welcome = () => {
  const navigate = useNavigate();

  const exampleCards = [
    {
      title: "CNC Mill Tap - M8 x 1.25",
      partNumber: "CNC-TAP-M8-125",
      description: "M8 x 1.25 thread pitch CNC mill tap with gold-titanium coating.",
      reorderPoint: "5",
      reorderQty: "15",
      location: "Tool Crib, Drawer 7",
      department: "Machining",
      color: "#4F46E5",
      imageUrl: "/examples/cnc-tap-m8-125.jpg"
    },
    {
      title: "Gray PLA Filament Roll",
      partNumber: "PLA-GRAY-1KG",
      description: "1KG spool of high-quality gray PLA filament for 3D printing.",
      reorderPoint: "4",
      reorderQty: "8",
      location: "3D Printing Room, Shelf B",
      department: "Prototyping",
      color: "#10B981",
      imageUrl: "/examples/pla-gray-1kg.jpg"
    },
    {
      title: "Safety Gloves",
      partNumber: "SG-LRG",
      description: "Size Large: Heavy-duty gloves with reinforced palms for industrial use.",
      reorderPoint: "25",
      reorderQty: "100",
      location: "PPE Storage, Shelf 4",
      department: "Safety",
      color: "#F59E0B",
      imageUrl: "/examples/sg-lrg.jpg"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-[#1A191C] mb-4">
          Welcome to Kanban Card Generator
        </h1>
        <p className="text-lg text-gray-600">
          Streamline your manufacturing process with professional Kanban cards
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1A191C] mb-8">
          Example Kanban Cards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {exampleCards.map((card, index) => (
            <ExampleCard key={index} {...card} />
          ))}
        </div>
      </div>

      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/create')}
          className="inline-flex items-center px-8 py-3 bg-[#EF8741] text-white rounded-full hover:bg-opacity-90 transition-colors"
        >
          Get Started
          <FaArrowRight className="ml-2" />
        </motion.button>
      </div>
    </div>
  );
};

export default Welcome;