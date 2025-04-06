import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBug,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaCopy,
  FaTrash,
  FaFilter,
  FaSync,
  FaMousePointer,
  FaNetworkWired,
  FaExclamationTriangle,
  FaInfo,
  FaImage,
  FaQrcode,
  FaClock,
  FaMemory
} from 'react-icons/fa';
import { debugLogger } from '../utils/debugLogger';

const DebugBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('qr');
  const [filter, setFilter] = useState({
    level: '',
    category: '',
    search: ''
  });
  const [data, setData] = useState({
    logs: [],
    interactions: [],
    performance: [],
    networkCalls: [],
    errors: [],
    qrCodes: [],
    images: [],
    memory: [],
    stats: {
      interactions: 0,
      network: 0,
      errors: 0,
      warnings: 0,
      info: 0,
      qrLoading: 0,
      qrFailed: 0,
      imageLoading: 0,
      imageFailed: 0
    }
  });

  const updateData = useCallback(() => {
    const allData = debugLogger.getAllData();
    setData({
      ...allData,
      stats: {
        interactions: allData.interactions.length,
        network: allData.networkCalls.length,
        errors: allData.errors.length,
        warnings: allData.logs.filter(log => log.level === 'warn').length,
        info: allData.logs.filter(log => log.level === 'info').length,
        qrLoading: allData.qrCodes.filter(qr => qr.status === 'loading').length,
        qrFailed: allData.qrCodes.filter(qr => qr.status === 'error').length,
        imageLoading: allData.images.filter(img => img.status === 'loading').length,
        imageFailed: allData.images.filter(img => img.status === 'error').length
      }
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(updateData, 1000);
    return () => clearInterval(interval);
  }, [updateData]);

  const handleCopy = (data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    const notification = document.createElement('div');
    notification.textContent = 'Copied to clipboard!';
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #4F46E5;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 9999;
      animation: fadeOut 3s forwards;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'qr':
        return (
          <div className="space-y-2">
            {data.qrCodes.map((qr, index) => (
              <div key={index} className={`p-2 rounded text-sm ${
                qr.status === 'success' ? 'bg-green-50' :
                qr.status === 'error' ? 'bg-red-50' : 'bg-yellow-50'
              }`}>
                <div className="flex justify-between">
                  <span className="font-medium">{qr.data}</span>
                  <span className="text-gray-500">{qr.duration}ms</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  <div>Status: {qr.status}</div>
                  <div>URL: {qr.url}</div>
                  {qr.error && <div className="text-red-500">Error: {qr.error}</div>}
                  <div>Time: {new Date(qr.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'images':
        return (
          <div className="space-y-2">
            {data.images.map((img, index) => (
              <div key={index} className={`p-2 rounded text-sm ${
                img.status === 'success' ? 'bg-green-50' :
                img.status === 'error' ? 'bg-red-50' : 'bg-yellow-50'
              }`}>
                <div className="flex justify-between">
                  <span className="font-medium">{img.type}</span>
                  <span className="text-gray-500">{img.duration}ms</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  <div>Status: {img.status}</div>
                  <div>URL: {img.url}</div>
                  {img.error && <div className="text-red-500">Error: {img.error}</div>}
                  <div>Time: {new Date(img.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'memory':
        return (
          <div className="space-y-2">
            {data.memory.map((mem, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Memory Usage</span>
                  <span className="text-gray-500">
                    {Math.round(mem.usage / 1024 / 1024)}MB
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  <div>Heap Limit: {Math.round(mem.limit / 1024 / 1024)}MB</div>
                  <div>Time: {new Date(mem.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg border border-gray-200"
        style={{ width: isOpen ? '500px' : 'auto' }}
      >
        <div
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center space-x-2">
            <FaBug className="text-gray-600" />
            <span className="font-medium">Debug Console</span>
            {!isOpen && (
              <div className="flex space-x-2">
                {data.stats.errors > 0 && (
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                    {data.stats.errors} errors
                  </span>
                )}
                {data.stats.qrFailed > 0 && (
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-full">
                    {data.stats.qrFailed} QR failed
                  </span>
                )}
              </div>
            )}
          </div>
          {isOpen ? <FaChevronDown /> : <FaChevronUp />}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-200 p-4">
                {/* Actions */}
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={() => handleCopy(data)}
                    className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <FaCopy className="mr-2" /> Copy All
                  </button>
                  <button
                    onClick={() => debugLogger.clear()}
                    className="flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <FaTrash className="mr-2" /> Clear
                  </button>
                  <button
                    onClick={updateData}
                    className="flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    <FaSync className="mr-2" /> Refresh
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-xs text-blue-700">QR Codes</div>
                    <div className="text-lg font-bold text-blue-700">
                      {data.stats.qrLoading}/{data.qrCodes.length}
                    </div>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <div className="text-xs text-green-700">Images</div>
                    <div className="text-lg font-bold text-green-700">
                      {data.stats.imageLoading}/{data.images.length}
                    </div>
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <div className="text-xs text-red-700">Errors</div>
                    <div className="text-lg font-bold text-red-700">
                      {data.stats.errors}
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded">
                    <div className="text-xs text-yellow-700">Warnings</div>
                    <div className="text-lg font-bold text-yellow-700">
                      {data.stats.warnings}
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 mb-4 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('qr')}
                    className={`flex items-center px-3 py-1 rounded whitespace-nowrap ${
                      activeTab === 'qr' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                    }`}
                  >
                    <FaQrcode className="mr-2" /> QR Codes
                  </button>
                  <button
                    onClick={() => setActiveTab('images')}
                    className={`flex items-center px-3 py-1 rounded whitespace-nowrap ${
                      activeTab === 'images' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                    }`}
                  >
                    <FaImage className="mr-2" /> Images
                  </button>
                  <button
                    onClick={() => setActiveTab('memory')}
                    className={`flex items-center px-3 py-1 rounded whitespace-nowrap ${
                      activeTab === 'memory' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                    }`}
                  >
                    <FaMemory className="mr-2" /> Memory
                  </button>
                </div>

                {/* Content */}
                <div className="max-h-96 overflow-y-auto">
                  {renderContent()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default DebugBox;