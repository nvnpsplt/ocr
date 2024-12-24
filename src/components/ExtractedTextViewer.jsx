import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';

const ExtractedTextViewer = ({ text, className = '' }) => {
  // Parse and organize the content sections
  const { documentType, content } = useMemo(() => {
    const sections = text.split('\n\n');
    let type = '';
    let mainContent = text;

    // Try to identify document type from the first section
    if (sections[0]?.includes('##')) {
      const firstSection = sections[0].toLowerCase();
      if (firstSection.includes('invoice')) type = 'invoice';
      else if (firstSection.includes('document')) type = 'document';
      else if (firstSection.includes('handwritten')) type = 'handwritten';
      else if (firstSection.includes('technical')) type = 'technical';
      else type = 'general';
    }

    return { documentType: type, content: mainContent };
  }, [text]);

  const components = {
    // Custom code block rendering with syntax highlighting
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="relative group">
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            className="rounded-lg !bg-gray-800"
            showLineNumbers={true}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
          <button
            onClick={() => navigator.clipboard.writeText(String(children))}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 
                     transition-opacity duration-200 px-2 py-1 rounded-md 
                     bg-gray-700 text-gray-300 text-sm hover:bg-gray-600"
          >
            Copy
          </button>
        </div>
      ) : (
        <code className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
    // Enhanced table rendering
    table({ children }) {
      return (
        <div className="overflow-x-auto my-4 rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            {children}
          </table>
        </div>
      );
    },
    thead({ children }) {
      return <thead className="bg-gray-50">{children}</thead>;
    },
    th({ children }) {
      return (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          {children}
        </th>
      );
    },
    td({ children }) {
      return (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-t border-gray-200">
          {children}
        </td>
      );
    },
    tr({ children }) {
      return <tr className="hover:bg-gray-50 transition-colors duration-150">{children}</tr>;
    },
    // Enhanced list rendering
    ul({ children }) {
      return <ul className="list-disc pl-6 space-y-2 my-4 text-gray-600">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="list-decimal pl-6 space-y-2 my-4 text-gray-600">{children}</ol>;
    },
    // Enhanced heading rendering with animations
    h1({ children }) {
      return (
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2"
        >
          {children}
        </motion.h1>
      );
    },
    h2({ children }) {
      return (
        <motion.h2
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-2xl font-semibold mb-4 text-gray-700"
        >
          {children}
        </motion.h2>
      );
    },
    h3({ children }) {
      return (
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-xl font-medium mb-3 text-gray-600"
        >
          {children}
        </motion.h3>
      );
    },
    // Enhanced paragraph and list item rendering
    p({ children }) {
      return <p className="mb-4 leading-relaxed text-gray-600">{children}</p>;
    },
    li({ children }) {
      return <li className="text-gray-600">{children}</li>;
    },
    // Enhanced blockquote
    blockquote({ children }) {
      return (
        <blockquote className="border-l-4 border-gray-200 pl-4 my-4 italic text-gray-600">
          {children}
        </blockquote>
      );
    },
    // Enhanced strong and emphasis
    strong({ children }) {
      return <strong className="font-semibold text-gray-800">{children}</strong>;
    },
    em({ children }) {
      return <em className="italic text-gray-700">{children}</em>;
    }
  };

  return (
    <div className={`extracted-text-viewer ${className}`}>
      {documentType && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 text-sm inline-block"
        >
          {documentType.charAt(0).toUpperCase() + documentType.slice(1)} Content
        </motion.div>
      )}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="prose max-w-none bg-white rounded-lg shadow-lg p-8"
      >
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          components={components}
        >
          {content}
        </ReactMarkdown>
      </motion.div>
    </div>
  );
};

export default ExtractedTextViewer;
