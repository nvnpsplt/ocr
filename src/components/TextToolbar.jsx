import React from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  ClipboardDocumentIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const TextToolbar = ({ 
  onSearch, 
  searchTerm, 
  onCopy, 
  onDownload, 
  onShare,
  onCompare,
  copySuccess 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* Search */}
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search in text..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCopy}
          className="tool-button"
          title="Copy to clipboard"
        >
          <ClipboardDocumentIcon className="w-5 h-5" />
          <span className="hidden sm:inline">{copySuccess || 'Copy'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDownload}
          className="tool-button"
          title="Download as markdown"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Download</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShare}
          className="tool-button"
          title="Share result"
        >
          <ShareIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Share</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCompare}
          className="tool-button"
          title="Compare with previous"
        >
          <DocumentDuplicateIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Compare</span>
        </motion.button>
      </div>
    </div>
  );
};

export default TextToolbar;
