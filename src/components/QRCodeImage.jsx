import React from 'react';
import { motion } from 'framer-motion';
import { FaQrcode } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeImage = ({ data, size = 150, className = '', containerClassName = '' }) => {
  if (!data) {
    return (
      <div className={`relative ${containerClassName}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
          <FaQrcode className="w-8 h-8 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${containerClassName}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${className}`}
      >
        <QRCodeSVG
          value={data}
          size={size}
          level="H"
          includeMargin={true}
          className="w-full h-full"
        />
      </motion.div>
    </div>
  );
};

export default QRCodeImage;