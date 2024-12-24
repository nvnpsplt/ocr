import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

// Export as PDF
export const exportToPDF = async (content, filename = 'extracted-text.pdf') => {
  const doc = new jsPDF();
  
  // Configure PDF
  doc.setFont('helvetica');
  doc.setFontSize(12);
  
  // Split content into lines that fit the page width
  const lines = doc.splitTextToSize(content, 180);
  
  // Add lines to document
  let y = 20;
  lines.forEach(line => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 15, y);
    y += 7;
  });
  
  // Save PDF
  doc.save(filename);
};

// Export as markdown
export const exportToMarkdown = (content, filename = 'extracted-text.md') => {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, filename);
};

// Export as CSV (for structured data)
export const exportToCSV = (fields, filename = 'extracted-data.csv') => {
  const headers = Object.keys(fields);
  const values = Object.values(fields);
  
  const csvContent = [
    headers.join(','),
    values.join(',')
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, filename);
};

// Generate shareable link
export const generateShareableLink = async (content) => {
  // In a real app, this would save to a backend and return a short URL
  // For now, we'll use base64 encoding (not recommended for production)
  const encoded = btoa(encodeURIComponent(content));
  return `${window.location.origin}/share/${encoded}`;
};

// Export as HTML
export const exportToHTML = (content, filename = 'extracted-text.html') => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Extracted Text</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    pre {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  saveAs(blob, filename);
};
