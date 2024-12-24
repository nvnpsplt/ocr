import React from 'react';
import { motion } from 'framer-motion';

const SearchHighlighter = ({ text, searchTerm }) => {
  if (!searchTerm) return text;

  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <motion.span
            key={i}
            initial={{ backgroundColor: "rgba(59, 130, 246, 0.5)" }}
            animate={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="rounded px-0.5"
          >
            {part}
          </motion.span>
        ) : (
          part
        )
      )}
    </span>
  );
};
