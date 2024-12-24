import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExtractedTextViewer from './ExtractedTextViewer';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ComparisonView = ({ currentResult, previousResult, onClose }) => {
  if (!previousResult) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-gray-900 rounded-xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Compare Results</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-800 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Result */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h4 className="font-medium">Current Result</h4>
                  <span className="text-sm text-gray-400">
                    ({new Date(currentResult.id).toLocaleString()})
                  </span>
                </div>
                <div className="gradient-border">
                  <div className="glass-panel p-4 rounded-xl">
                    <ExtractedTextViewer text={currentResult.text} />
                  </div>
                </div>
              </div>

              {/* Previous Result */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <h4 className="font-medium">Previous Result</h4>
                  <span className="text-sm text-gray-400">
                    ({new Date(previousResult.id).toLocaleString()})
                  </span>
                </div>
                <div className="gradient-border">
                  <div className="glass-panel p-4 rounded-xl">
                    <ExtractedTextViewer text={previousResult.text} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComparisonView;
